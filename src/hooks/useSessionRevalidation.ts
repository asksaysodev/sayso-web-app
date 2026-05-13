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

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.expires_at !== undefined && session.expires_at * 1000 - Date.now() < 60_000) {
        await supabase.auth.refreshSession()
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
