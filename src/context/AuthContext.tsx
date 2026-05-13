import { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react'
import { supabase } from '../config/supabase'
import { useAccounts } from '../hooks/useAccounts'
import { useLocation } from 'react-router-dom'
import { useSessionRevalidation } from '../hooks/useSessionRevalidation'
import * as Sentry from "@sentry/react"
import { Account, AuthResult, SignInData, SignUpData, User } from '@/types/user'
import { AALLevel, MFAServiceError } from '@/types/supabaseMFA'
import { getAAL, listFactors, verifyTOTPCode } from '@/services/mfaServices'
import { enrollReferralParticipant } from '@/services/referralRocket'
import type { Factor } from '@supabase/supabase-js'

interface AuthContextValue {
  signUp: (data: SignUpData) => Promise<AuthResult>;
  signIn: (data: SignInData) => Promise<AuthResult>;
  handleSignOut: () => Promise<void>;
  user: User | null;
  globalUser: Account | null;
  authToken: string | null;
  userLoading: boolean;
  loading: boolean;
  updateGlobalUser: (accountEmail: string) => Promise<void>;
  mfaRequired: boolean;
  currentAAL: AALLevel | null;
  mfaFactors: Factor[];
  checkMFAStatus: () => Promise<boolean>;
  verifyMFA: (code: string) => Promise<{ success: boolean; error: MFAServiceError | null }>;
  clearMFARequired: () => void;
  checkIfNeedsMFA: (currentLevel: AALLevel | null | undefined, nextLevel: AALLevel | null | undefined) => boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [globalUser, setGlobalUser] = useState<Account | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const prevUserRef = useRef<User | null>(null)
  const accountCreationRef = useRef<Promise<void> | null>(null)
  const enrolledEmailRef = useRef<string | null>(null)
  const location = useLocation()
  const [mfaRequired, setMfaRequired] = useState(false)
  const [currentAAL, setCurrentAAL] = useState<AALLevel | null>(null)
  const [mfaFactors, setMfaFactors] = useState<Factor[]>([])

  const { createAccount, getAccount } = useAccounts()

  useSessionRevalidation()

  // Wrapper function to handle localStorage updates
  const updateGlobalUserState = (newGlobalUser: any) => { // $FixTS
    if (newGlobalUser === null) {
      localStorage.removeItem('sayso-global-user')
    } else {
      localStorage.setItem('sayso-global-user', JSON.stringify(newGlobalUser))
    }
    setGlobalUser(newGlobalUser)
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
      console.log('🔐 AuthContext: Session expired event received');
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
        if (event === 'TOKEN_REFRESHED' || JSON.stringify(newUser) !== JSON.stringify(prevUserRef.current)) {
          setUser(newUser)
          prevUserRef.current = newUser
          setAuthToken(session?.access_token ?? null)
          setLoading(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    // Always set userLoading to true when user changes (even if user is null)
    setUserLoading(true);

    if (user) {
      // Add a small delay to prevent rapid re-fetching
      timeoutId = setTimeout(async () => {
        try {
          if (accountCreationRef.current) {
            await accountCreationRef.current
          }
          const account = await getAccount(user.email)
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
          console.error('Error fetching account:', error)
          Sentry.captureException(error)
          setUserLoading(false)
        }
      }, 300) // 300ms delay
    } else {
      updateGlobalUserState(null)
      setUserLoading(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [user])

  const signUp = async (data: SignUpData) => {
    const result = await supabase.auth.signUp(data)
    if (!result.error) {
      const { email, options } = data
      const { name, lastname, company } = options?.data || {}
      const creationPromise: any = createAccount({ email, name, lastname, company })
        .catch((err) => {
          console.error('Error creating account in DB:', err)
          Sentry.captureException(err)
          throw err
        })
        accountCreationRef.current = creationPromise;
      try {
          await creationPromise;
      } finally {
          accountCreationRef.current = null;
      }
      enrollReferralParticipant({ email, fName: name, lName: lastname }).catch(err => Sentry.captureException(err));
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
    updateGlobalUser,
    mfaRequired,
    currentAAL,
    mfaFactors,
    checkMFAStatus,
    verifyMFA,
    clearMFARequired,
    checkIfNeedsMFA,
    isSuperAdmin
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