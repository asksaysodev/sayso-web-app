import { useEffect } from 'react'
import { supabase } from '../config/supabase'

// Triggers a session check (and refresh if expiry is near) when the tab
// becomes visible or the browser comes back online. This compensates for
// browsers throttling setTimeout in backgrounded tabs, which can delay the
// SDK's proactive refresh past token expiry.
export function useSessionRevalidation(): void {
  useEffect(() => {
    let lastCheck = 0
    const DEBOUNCE_MS = 5_000

    const revalidate = async () => {
      const now = Date.now()
      if (now - lastCheck < DEBOUNCE_MS) return
      lastCheck = now

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.expires_at !== undefined && session.expires_at * 1000 - Date.now() < 60_000) {
          await supabase.auth.refreshSession()
        }
      } catch (e: unknown) {
        // Safari suspends tabs mid-lock, leaving lock:sayso-auth held by a frozen context.
        // The lock times out after 10s and throws NavigatorLockAcquireTimeoutError.
        // Safe to ignore — the existing token is still valid and the SDK's own refresh timer recovers.
        if (e instanceof Error && e.name === 'NavigatorLockAcquireTimeoutError') return
        throw e
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') revalidate()
    }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('online', revalidate)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('online', revalidate)
    }
  }, [])
}
