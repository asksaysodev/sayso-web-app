import { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../config/supabase'
import { useAccounts } from '../hooks/useAccounts'
import { toSignupError, ACCOUNT_CREATED_SIGN_IN_FAILED } from '@/utils/signupErrors'
import { useLocation } from 'react-router-dom'
import { useSessionRevalidation } from '../hooks/useSessionRevalidation'
import * as Sentry from "@sentry/react"
import { Account, AuthResult, SignInData, SignUpData, User } from '@/types/user'
import { AALLevel, MFAServiceError } from '@/types/supabaseMFA'
import { getAAL, listFactors, verifyTOTPCode } from '@/services/mfaServices'
import { enrollReferralParticipant, getParticipantReferrer, hasReferralCookie } from '@/services/referralRocket'
import { setReferralAttribution } from '@/services/setReferralAttribution'
import reportAALError from '@/utils/reportAALError'
import { clearSettledOptimisticSignup } from '@/store/optimisticSignupStore'
import { clearStoredSession } from '@/config/authStorage'
import { clearOfferToken } from '@/utils/offerToken'
import type { Factor } from '@supabase/supabase-js'
import type { AxiosError } from 'axios'

interface AuthContextValue {
  signUp: (data: SignUpData) => Promise<AuthResult>;
  signIn: (data: SignInData) => Promise<AuthResult>;
  /**
   * Resolves once the session has ended on this device, falling back to clearing it from storage
   * when Supabase can't be reached. Rejects, with the session still alive, only if storage fails.
   */
  handleSignOut: () => Promise<void>;
  /** Ends this device's session only. Resolves to false, with the session still alive, if storage fails. */
  signOutLocally: () => Promise<boolean>;
  /**
   * Signed out on purpose (not an expired session): AuthGuard doesn't remember the page.
   * MFA's "Back to sign in" still does, since the user is on the way to it.
   */
  signedOutByUser: boolean;
  user: User | null;
  globalUser: Account | null;
  authToken: string | null;
  userLoading: boolean;
  loading: boolean;
  /** globalUser is being served from cache because the last fetch failed. */
  globalUserIsStale: boolean;
  /** Session is valid, but the account could not be loaded and no cache covered it. */
  accountUnavailable: boolean;
  /** Subset of accountUnavailable: the server answered that the account doesn't exist. */
  accountNotFound: boolean;
  retryAccountFetch: () => void;
  updateGlobalUser: (accountEmail: string) => Promise<void>;
  mfaRequired: boolean;
  currentAAL: AALLevel | null;
  mfaFactors: Factor[];
  checkMFAStatus: () => Promise<boolean>;
  verifyMFA: (code: string) => Promise<{ success: boolean; error: MFAServiceError | null }>;
  clearMFARequired: () => void;
  checkIfNeedsMFA: (currentLevel: AALLevel | null | undefined, nextLevel: AALLevel | null | undefined) => boolean;
  isSuperAdmin: boolean;
  attributionPending: boolean;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue)

const GLOBAL_USER_CACHE_KEY = 'sayso-global-user'
const ACCOUNT_NOT_FOUND_MESSAGE = 'Account not found'
const ACCOUNT_FETCH_ATTEMPTS = 3
const ACCOUNT_RETRY_BASE_DELAY_MS = 500

/**
 * Ends the session on this device even when Supabase can't: every signOut scope calls the
 * server first and keeps the session if that fails (offline, 5xx, timeout, expired token that
 * can't refresh), which made a failed sign-out look successful until the next reload (SAYSO-644).
 * Throws only if clearing storage does.
 */
const endSessionOnDevice = async (scope: 'global' | 'local'): Promise<void> => {
  const { error } = await supabase.auth.signOut({ scope }).catch((thrown: unknown) => ({ error: thrown }))
  if (!error) return

  clearStoredSession()
  Sentry.captureException(error, { level: 'warning', tags: { flow: 'signout', scope, fallback: 'storage' } })

  // With no stored session this makes no request: it emits SIGNED_OUT and tells other tabs.
  const reportBroadcastError = (broadcastError: unknown) =>
    Sentry.captureException(broadcastError, { level: 'warning', tags: { flow: 'signout', step: 'broadcast' } })
  supabase.auth.signOut({ scope: 'local' }).then(
    ({ error: localError }) => { if (localError) reportBroadcastError(localError) },
    reportBroadcastError,
  )
}

const isRetriableAccountError = (error: unknown): boolean => {
  const status = (error as AxiosError | undefined)?.response?.status
  return status !== undefined && status >= 500
}

const isAccountNotFoundError = (error: unknown): boolean => {
  const response = (error as AxiosError<{ error?: string }> | undefined)?.response
  return response?.status === 404 && response.data?.error === ACCOUNT_NOT_FOUND_MESSAGE
}

/**
 * Checks if MFA verification is required for the current session.
 */
const checkIfNeedsMFA = (currentLevel: AALLevel | null | undefined, nextLevel: AALLevel | null | undefined): boolean => {
  if (!currentLevel || !nextLevel) return false;
  return currentLevel === 'aal1' && nextLevel === 'aal2';
}

/**
 * Reads the cached account written by updateGlobalUserState.
 *
 * This cache existed but was never read — it was written on every account
 * update and ignored on boot, so a single failed getAccount left globalUser
 * null and AuthGuard treated a valid session as logged out (SAYSO-342).
 *
 * Read only on failure, and only for the signed-in address: hydrating eagerly
 * would flash one user's data into another's session on account switch, and
 * would show stale data on the happy path where a fresh fetch is moments away.
 */
const readCachedAccount = (email: string): Account | null => {
  try {
    const raw = localStorage.getItem(GLOBAL_USER_CACHE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null

    // Minimum shape the app depends on. A cache written by an older release
    // with a different Account shape is discarded rather than trusted.
    const candidate = parsed as Partial<Account>
    if (typeof candidate.id !== 'string' || typeof candidate.email !== 'string') return null

    // Never serve one account's cache to another session.
    if (candidate.email.toLowerCase() !== email.toLowerCase()) return null

    return candidate as Account
  } catch (error) {
    Sentry.captureException(error)
    localStorage.removeItem(GLOBAL_USER_CACHE_KEY)
    return null
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [globalUser, setGlobalUser] = useState<Account | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  // globalUser is being served from cache because the fetch failed.
  const [globalUserIsStale, setGlobalUserIsStale] = useState(false)
  // Session is valid but the account could not be loaded and no cache covered it.
  const [accountUnavailable, setAccountUnavailable] = useState(false)
  const [accountNotFound, setAccountNotFound] = useState(false)
  const [accountRetryNonce, setAccountRetryNonce] = useState(0)
  const prevUserRef = useRef<User | null>(null)
  const enrolledEmailRef = useRef<string | null>(null)
  const location = useLocation()
  const [mfaRequired, setMfaRequired] = useState(false)
  const [currentAAL, setCurrentAAL] = useState<AALLevel | null>(null)
  const [mfaFactors, setMfaFactors] = useState<Factor[]>([])
  const [signedOutByUser, setSignedOutByUser] = useState(false)
  const signOutInFlight = useRef<Promise<void> | null>(null)
  const [attributionPending, setAttributionPending] = useState(false)

  const { signup, getAccount } = useAccounts()
  const queryClient = useQueryClient()

  useSessionRevalidation()

  // Wrapper function to handle localStorage updates
  const updateGlobalUserState = (newGlobalUser: Account | null) => {
    if (newGlobalUser === null) {
      localStorage.removeItem(GLOBAL_USER_CACHE_KEY)
    } else {
      localStorage.setItem(GLOBAL_USER_CACHE_KEY, JSON.stringify(newGlobalUser))
    }
    setGlobalUser(newGlobalUser)
    setGlobalUserIsStale(false)
    setAccountUnavailable(false)
    setAccountNotFound(false)
  }

  const updateGlobalUser = async (accountEmail: string): Promise<void> => {
    try {
      const account = await getAccount(accountEmail);
      // A response requested by the previous session must not become the next one's account.
      if (account.email.toLowerCase() !== prevUserRef.current?.email?.toLowerCase()) return;
      updateGlobalUserState(account);
    } catch (error) {
      console.error('Error updating global user:', error);
      Sentry.captureException(error);
    }
  }

  /**
   * Fetches the account, retrying only failures that a retry can actually fix.
   *
   * Transport-level failures (ERR_NETWORK, ECONNABORTED) are already retried in
   * config/axios.ts, so this layer exists for 5xx — a restarting dyno should not
   * cost the user their session. A 4xx is a decision the server has made and
   * will make again, so it fails fast.
   */
  const fetchAccountWithRetry = async (email: string, isCancelled: () => boolean): Promise<Account> => {
    let lastError: unknown

    for (let attempt = 1; attempt <= ACCOUNT_FETCH_ATTEMPTS; attempt++) {
      try {
        return await getAccount(email)
      } catch (error) {
        lastError = error
        const isLastAttempt = attempt === ACCOUNT_FETCH_ATTEMPTS
        if (isLastAttempt || isCancelled() || !isRetriableAccountError(error)) break
        await new Promise(resolve => setTimeout(resolve, ACCOUNT_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1)))
      }
    }

    throw lastError
  }

  /**
   * Re-runs the account fetch for the current session. Exposed so a user staring
   * at the account-unavailable screen has a way out that is not a page reload.
   */
  const retryAccountFetch = () => {
    setAccountUnavailable(false)
    setAccountNotFound(false)
    setAccountRetryNonce(nonce => nonce + 1)
  }

  /**
   * Clears what belongs to the session that is ending, so the next user in this tab is not
   * served another account's (or company's) cached queries while they are still fresh.
   * Leaves the shared `sayso-global-user` key alone: other tabs write it too, and
   * readCachedAccount only serves it to the address it belongs to.
   */
  const clearUserScopedState = () => {
    queryClient.clear();
    clearSettledOptimisticSignup();
    setMfaFactors([]);
    setMfaRequired(false);
    setCurrentAAL(null);
  }

  const resetUser = () => {
    setUser(null);
    prevUserRef.current = null;
    updateGlobalUserState(null);
    setAuthToken(null);
    Sentry.setUser(null);
    clearUserScopedState();
  }

  /**
   * Fails closed, like useMFAStatus: if the two disagreed on an error, MFAGuard and AuthGuard
   * would redirect to each other forever. Stable: MFAGuard's effect depends on it, and it sets
   * state here, so a new identity per render would re-run the check in a loop.
   */
  const checkMFAStatus = useCallback(async (): Promise<boolean> => {
    try {
      const [aalResult, factorsResult] = await Promise.all([
        getAAL(),
        listFactors()
      ])
      if (!factorsResult.error) setMfaFactors(factorsResult.data)

      if (aalResult.error || !aalResult.data) {
        reportAALError(aalResult.error)
        setMfaRequired(true)
        return true
      }

      const { currentLevel, nextLevel } = aalResult.data
      setCurrentAAL(currentLevel)

      const needsMFA = checkIfNeedsMFA(currentLevel, nextLevel)
      setMfaRequired(needsMFA)

      return needsMFA
    } catch (error) {
      reportAALError(error)
      setMfaRequired(true)
      return true
    }
  }, [])

  const verifyMFA = async (code: string): Promise<{ success: boolean; error: MFAServiceError | null }> => {
    let [factor] = mfaFactors

    if (!factor) {
      const { data, error } = await listFactors()
      if (error) return { success: false, error }
      if (data.length === 0) return { success: false, error: { message: 'No MFA factors enrolled' } }
      setMfaFactors(data)
      factor = data[0]
    }

    const result = await verifyTOTPCode(factor.id, code)

    if (result.success) {
      setMfaRequired(false)
      setCurrentAAL('aal2')
    }

    return result
  }

  const clearMFARequired = () => {
    setMfaRequired(false)
  }

  const runSignOut = async () => {
    // Set before the await: SIGNED_OUT clears the user, and AuthGuard redirects, before it resolves.
    setSignedOutByUser(true);

    try {
      await endSessionOnDevice('global');
    } catch (error) {
      setSignedOutByUser(false);
      Sentry.captureException(error);
      throw error;
    } finally {
      signOutInFlight.current = null;
    }

    // Don't leave a pending offer for whoever signs in next on this browser.
    clearOfferToken();
    resetUser();
  }

  /** A second click joins the sign-out in flight instead of racing it. */
  const handleSignOut = () => {
    signOutInFlight.current ??= runSignOut();
    return signOutInFlight.current;
  }

  const signOutLocally = async (): Promise<boolean> => {
    try {
      await endSessionOnDevice('local');
    } catch (error) {
      Sentry.captureException(error);
      return false;
    }

    resetUser();
    return true;
  }

  // Handle session expiration
  useEffect(() => {
    const handleSessionExpired = () => {
      resetUser();
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  useEffect(() => {
    // Skip auth check for /zoom-success
    if (location.pathname === '/zoom-success') {
      setLoading(false)
      return
    }

    // Belt-and-suspenders bootstrap — also handled by INITIAL_SESSION below,
    // but this ensures loading=false even if the event fires before the
    // subscription is set up.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user as User | null)
      prevUserRef.current = session?.user as User | null
      setLoading(false)
    })

    // Subscribed once on mount and never re-subscribed. Re-subscribing on every
    // navigation created a gap where SDK events (TOKEN_REFRESHED, SIGNED_OUT)
    // could fire between unsubscribe and resubscribe and be silently dropped.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // INITIAL_SESSION always sets loading=false regardless of user change,
      // since it is the SDK's boot event and loading must unblock.
      if (event === 'INITIAL_SESSION') {
        const newUser = session?.user as User | null
        setUser(newUser)
        prevUserRef.current = newUser
        setAuthToken(session?.access_token ?? null)
        setLoading(false)
        return
      }

      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        const newUser = session?.user as User | null

        setAuthToken(session?.access_token ?? null)
        setLoading(false)

        // Only a sign-in: TOKEN_REFRESHED can land while a sign-out is in flight.
        if (event === 'SIGNED_IN') setSignedOutByUser(false)

        // Covers a sign-out from another tab, which never reaches resetUser.
        if (event === 'SIGNED_OUT') clearUserScopedState()

        if (JSON.stringify(newUser) !== JSON.stringify(prevUserRef.current)) {
          // Another tab signed in as someone else without signing out first (SAYSO-645).
          if (prevUserRef.current && newUser && prevUserRef.current.id !== newUser.id) {
            clearUserScopedState()
            setGlobalUser(null)
            setGlobalUserIsStale(false)
            setAccountUnavailable(false)
            setAccountNotFound(false)
            Sentry.setUser({ id: newUser.id, email: newUser.email })
          }
          setUser(newUser)
          prevUserRef.current = newUser
          // Same batch as the user: no render may see a new user whose account isn't loading yet.
          if (newUser) setUserLoading(true)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    // Retries lengthen the window in which `user` can change under us, so the
    // async work below must not write state belonging to a superseded session.
    let cancelled = false;

    // Always set userLoading to true when user changes (even if user is null)
    setUserLoading(true);
    setAccountNotFound(false);

    if (user) {
      // Debounce, not coordination. SIGNED_IN and TOKEN_REFRESHED can land within a few
      // ms of each other and each changes `user`; the cleanup below clears a pending
      // timer, so only the last change fetches. This is NOT the SAYSO-341 signup gate —
      // that was a separate `await accountCreationRef.current` here, removed in SAYSO-387
      // Phase 4 because the accounts row is now created before the session exists and
      // there is nothing left to race.
      timeoutId = setTimeout(async () => {
        try {
          const account = await fetchAccountWithRetry(user.email, () => cancelled)
          if (cancelled) return
          updateGlobalUserState(account)
          if (account.email !== enrolledEmailRef.current) {
            enrolledEmailRef.current = account.email;
            enrollReferralParticipant({ email: account.email, fName: account.name ?? undefined, lName: account.lastname ?? undefined }).catch(err => Sentry.captureException(err));
          }
          Sentry.setUser({
            id: account?.id,
            email: account?.email,
            name: account?.name,
            lastname: account?.lastname,
            company_id: account?.company_id,
            subscription_monthly_minutes: account?.subscription_monthly_minutes,
            subscription_plan_id: account?.subscription_plan_id,
            subscription_status: account?.subscription_status
          });
          setUserLoading(false)
        } catch (error) {
          if (cancelled) return
          console.error('Error fetching account:', error)
          Sentry.captureException(error)

          // The session is valid — the account request failed. Fall back to the
          // cached account so the app stays usable, and only declare the account
          // unavailable when there is nothing to fall back to. Either way this
          // must not leave globalUser null, which AuthGuard would read as a
          // logged-out user (SAYSO-342).
          // A deleted account is the exception: its cache must not bring it back.
          const isNotFound = isAccountNotFoundError(error)
          if (isNotFound) updateGlobalUserState(null)
          const cached = isNotFound ? null : readCachedAccount(user.email)
          if (cached) {
            setGlobalUser(cached)
            setGlobalUserIsStale(true)
            setAccountUnavailable(false)
          } else {
            setAccountUnavailable(true)
            setAccountNotFound(isNotFound)
          }
          setUserLoading(false)
        }
      }, 300) // 300ms delay
    } else {
      updateGlobalUserState(null)
      setUserLoading(false)
    }

    return () => {
      cancelled = true
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [user, accountRetryNonce])

  /**
   * Signup now happens server-side (SAYSO-387).
   *
   * Was: supabase.auth.signUp() — which minted a session before any domain row existed —
   * then an authenticated POST /accounts/create. That ordering is what made the company_id
   * claim impossible on the first token, what made signup non-atomic (a failure left an
   * orphaned auth user; migration 029 deleted 10), and what forced the SAYSO-341
   * coordination below.
   *
   * Now: one POST /accounts/signup creates the auth user and the domain rows together,
   * with company_id already in app_metadata, then we sign in normally. The accounts row
   * exists before the session does, so there is nothing for the account fetch to race —
   * which is why Phase 4 could delete the coordination this used to need.
   */
  const signUp = async (data: SignUpData): Promise<AuthResult> => {
    const { email, password, options } = data
    const { name, lastname, company, phone, invite_token } = options?.data || {}

    try {
      await signup({
        email,
        password,
        name: name ?? '',
        lastname: lastname ?? '',
        company,
        phone,
        invite_token,
      })
    } catch (err) {
      throw toSignupError(err)
    }

    // The account exists; this is a normal sign-in against it. Its token already carries
    // the company_id claim.
    const result = await supabase.auth.signInWithPassword({ email, password }) as AuthResult

    if (result.error) {
      // The new failure mode: the account was created but sign-in did not complete.
      // Retrying signup would collide on the email and read as "already registered", so
      // say what actually happened instead of letting the user loop.
      console.error('Account created but sign-in failed:', result.error)
      Sentry.captureException(result.error, { tags: { flow: 'signup', step: 'post_signup_sign_in' } })
      throw new Error(ACCOUNT_CREATED_SIGN_IN_FAILED)
    }

    if (!result.error) {
      // Fire-and-forget: enroll in RR then persist referral attribution if user was referred.
      // Must not block signup or throw — failures are captured in Sentry.
      // attributionPending gates the subscription page so it shows skeletons until we know
      // whether a discount applies, preventing a jarring card-to-discount-card flash.
      // Only referred sign-ups can get one (RR attributes from its rr_referral_code cookie),
      // so everyone else goes straight to the prefetched plans with no skeleton.
      if (hasReferralCookie()) setAttributionPending(true);
      (async () => {
        try {
          const enrolled = await enrollReferralParticipant({ email, fName: name, lName: lastname });
          if (!enrolled) return;
          const { referredByCode, referrerEmail } = await getParticipantReferrer(email);
          if (referredByCode && referrerEmail) {
            await setReferralAttribution({ referralCodeUsed: referredByCode, referrerEmail });
            // Attribution saved — refresh account so has_referral_discount is true,
            // then bust the plans cache so discountInCents re-fetches immediately.
            await updateGlobalUser(email);
            queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
          }
        } catch (err) {
          Sentry.captureException(err);
        } finally {
          setAttributionPending(false);
        }
      })();
    }
    return result
  }

  const signIn = async (data: SignInData): Promise<AuthResult> => {
    return await supabase.auth.signInWithPassword(data) as AuthResult
  }
  
  const isSuperAdmin = useMemo(() => globalUser ? globalUser?.role === 'superadmin' : false ,[globalUser]);
  
  const values = {
    signUp,
    signIn,
    handleSignOut,
    signOutLocally,
    signedOutByUser,
    user,
    globalUser,
    authToken,
    userLoading,
    loading,
    globalUserIsStale,
    accountUnavailable,
    accountNotFound,
    retryAccountFetch,
    updateGlobalUser,
    mfaRequired,
    currentAAL,
    mfaFactors,
    checkMFAStatus,
    verifyMFA,
    clearMFARequired,
    checkIfNeedsMFA,
    isSuperAdmin,
    attributionPending
  } as AuthContextValue;

  return (
    <AuthContext.Provider value={values}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
} 