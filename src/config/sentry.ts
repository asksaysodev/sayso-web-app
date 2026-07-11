export const sentryConfig = {
  dsn: "https://2c444147dfb523db2091f3240ca27396@o4510697565585408.ingest.us.sentry.io/4510697705046016",
  // Backstop for Supabase Auth's cross-tab Web Locks timeout. Safari can leave the
  // "lock:sayso-auth" Navigator lock held by a frozen tab, surfacing as an unhandled
  // rejection. supabase.ts switches to processLock to prevent this; this filter keeps
  // any residual noise out of the issue stream. Benign and self-recovering.
  ignoreErrors: [/Acquiring an exclusive Navigator LockManager lock/],
}
