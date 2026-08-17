import { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '../config/supabase'
import { useAccounts } from '../hooks/useAccounts'
import { useLocation } from 'react-router-dom'
import { useSessionRevalidation } from '../hooks/useSessionRevalidation'
import * as Sentry from "@sentry/react"
import { Account, AuthResult, SignInData, SignUpData, User } from '@/types/user'
import { AALLevel, MFAServiceError } from '@/types/supabaseMFA'
import { getAAL, listFactors, verifyTOTPCode } from '@/services/mfaServices'
import { enrollReferralParticipant, getParticipantReferrer } from '@/services/referralRocket'
import { setReferralAttribution } from '@/services/setReferralAttribution'
import type { Factor } from '@supabase/supabase-js'
import type { AxiosError } from 'axios'

interface AuthContextValue {
  signUp: (data: SignUpData) => Promise<AuthResult>;
  signIn: (data: SignInData) => Promise<AuthResult>;
  handleSignOut: () => Promise<void>;
  user: User | null;
  globalUser: Account | null;
  authToken: string | null;
  userLoading: boolean;
  loading: boolean;
  /** globalUser is being served from cache because the last fetch failed. */
  globalUserIsStale: boolean;
  /** Session is valid, but the account could not be loaded and no cache covered it. */
  accountUnavailable: boolean;
  retryAccountFetch: () => void;
  updateGlobalUser: (accountEmail: string) => Promise<void>;
  registerAccountCreation: (creationPromise: Promise<unknown>) => void;
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
const ACCOUNT_FETCH_ATTEMPTS = 3
const ACCOUNT_RETRY_BASE_DELAY_MS = 500

/** 4xx is a settled answer; only server-side and unknown failures are worth retrying. */
const isRetriableAccountError = (error: unknown): boolean => {
  const status = (error as AxiosError | undefined)?.response?.status
  return status === undefined || status >= 500
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
  } catch {
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
  const [accountRetryNonce, setAccountRetryNonce] = useState(0)
  const prevUserRef = useRef<User | null>(null)
  const accountCreationRef = useRef<Promise<void> | null>(null)
  const enrolledEmailRef = useRef<string | null>(null)
  const location = useLocation()
  const [mfaRequired, setMfaRequired] = useState(false)
  const [currentAAL, setCurrentAAL] = useState<AALLevel | null>(null)
  const [mfaFactors, setMfaFactors] = useState<Factor[]>([])
  const [attributionPending, setAttributionPending] = useState(false)

  const { createAccount, getAccount } = useAccounts()
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
  }

  const updateGlobalUser = async (accountEmail: string): Promise<void> => {
    try {
      const account = await getAccount(accountEmail);
      updateGlobalUserState(account);
    } catch (error) {
      console.error('Error updating global user:', error);
      Sentry.captureException(error);
    }
  }

  /**
   * Lets a signup flow that bypasses this context's own `signUp` (currently
   * AcceptInvite, which calls supabase.auth.signUp directly) gate the account
   * fetch below on the request that actually creates the accounts row.
   *
   * Without this the SIGNED_IN event schedules getAccount 300ms later, which
   * beats the row into existence and 400s — see SAYSO-341.
   *
   * The stored promise deliberately never rejects: the ref only answers "has
   * account creation finished?". A creation failure surfaces through the caller
   * that owns the promise, and reporting it here too would double-count it.
   */
  const registerAccountCreation = (creationPromise: Promise<unknown>): void => {
    const settled: Promise<void> = creationPromise
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        if (accountCreationRef.current === settled) {
          accountCreationRef.current = null
        }
      })
    accountCreationRef.current = settled
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
    setAccountRetryNonce(nonce => nonce + 1)
  }

  const resetUser = () => {
    setUser(null);
    updateGlobalUserState(null);
    setAuthToken(null);
    Sentry.setUser(null);
    setMfaRequired(false);
    setCurrentAAL(null);
    setMfaFactors([]);
  }

  /**
   * Checks if MFA verification is required for the current session.
   */
  const checkIfNeedsMFA = (currentLevel: AALLevel | null | undefined, nextLevel: AALLevel | null | undefined): boolean => {
    if (!currentLevel || !nextLevel) return false;
    return currentLevel === 'aal1' && nextLevel === 'aal2';
  }

  const checkMFAStatus = async (): Promise<boolean> => {
    const [aalResult, factorsResult] = await Promise.all([
      getAAL(),
      listFactors()
    ])

    if (aalResult.error || !aalResult.data) {
      return false
    }

    const { currentLevel, nextLevel } = aalResult.data
    setCurrentAAL(currentLevel)
    setMfaFactors(factorsResult.data)

    const needsMFA = checkIfNeedsMFA(currentLevel, nextLevel)
    setMfaRequired(needsMFA)

    return needsMFA
  }

  const verifyMFA = async (code: string): Promise<{ success: boolean; error: MFAServiceError | null }> => {
    if (mfaFactors.length === 0) {
      return { success: false, error: { message: 'No MFA factors enrolled' } }
    }

    const factor = mfaFactors[0]
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();

    resetUser();
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

        if (JSON.stringify(newUser) !== JSON.stringify(prevUserRef.current)) {
          setUser(newUser)
          prevUserRef.current = newUser
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

    if (user) {
      // Add a small delay to prevent rapid re-fetching
      timeoutId = setTimeout(async () => {
        try {
          if (accountCreationRef.current) {
            await accountCreationRef.current
          }
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
          const cached = readCachedAccount(user.email)
          if (cached) {
            setGlobalUser(cached)
            setGlobalUserIsStale(true)
            setAccountUnavailable(false)
          } else {
            setAccountUnavailable(true)
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

  const signUp = async (data: SignUpData) => {
    const result = await supabase.auth.signUp(data)
    if (!result.error) {
      const { email, options } = data
      const { name, lastname, company, phone, invite_token } = options?.data || {}
      const creationPromise = createAccount({ email, name, lastname, company, phone, invite_token })
        .catch((err) => {
          console.error('Error creating account in DB:', err)
          Sentry.captureException(err)
          throw err
        })
      registerAccountCreation(creationPromise);
      await creationPromise;
      // Fire-and-forget: enroll in RR then persist referral attribution if user was referred.
      // Must not block signup or throw — failures are captured in Sentry.
      // attributionPending gates the subscription page so it shows skeletons until we know
      // whether a discount applies, preventing a jarring card-to-discount-card flash.
      setAttributionPending(true);
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
    user,
    globalUser,
    authToken,
    userLoading,
    loading,
    globalUserIsStale,
    accountUnavailable,
    retryAccountFetch,
    updateGlobalUser,
    registerAccountCreation,
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