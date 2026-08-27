import { useEffect } from 'react'
import * as Sentry from '@sentry/react'
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
        // Never rethrow — both callers are event handlers, so anything escaping
        // here is an unhandled rejection. Usually Safari suspending the tab
        // mid-operation and stalling lock:sayso-auth until the call times out;
        // benign, and Sentry drops those in beforeSend (SAYSO-380).
        Sentry.captureException(e)
      }
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void revalidate()
    }

    const handleOnline = () => { void revalidate() }

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('online', handleOnline)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('online', handleOnline)
    }
  }, [])
}
