import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import * as Sentry from '@sentry/react'
import { supabase } from '@/config/supabase'
import useConversationsSocket, { REPORT_AFTER_DOWN_MS, SLOW_RETRY_JITTER_MS, SLOW_RETRY_MS } from './useConversationsSocket'

// SAYSO-493 (Sentry SAYSO-APP-8N): after 3 fast retries the hook gave up for good and only a
// tab switch or network event revived it.

vi.mock('@sentry/react', () => ({ addBreadcrumb: vi.fn(), captureException: vi.fn() }))
vi.mock('@/config/supabase', () => ({
  supabase: { auth: { getSession: vi.fn(), onAuthStateChange: vi.fn() } },
}))

class FakeWebSocket {
  static instances: FakeWebSocket[] = []
  onopen: (() => void) | null = null
  onmessage: ((e: { data: string }) => void) | null = null
  onclose: ((e: CloseEvent) => void) | null = null
  onerror: (() => void) | null = null
  closed = false
  constructor(public url: string) { FakeWebSocket.instances.push(this) }
  close() { this.closed = true }
  open() { this.onopen?.() }
  // What a browser does when a connection fails: error, then close.
  fail(code = 1006, reason = '') {
    this.onerror?.()
    this.onclose?.({ code, reason, wasClean: false } as CloseEvent)
  }
}

const latest = () => FakeWebSocket.instances[FakeWebSocket.instances.length - 1]
const sockets = () => FakeWebSocket.instances.length
const flush = () => act(async () => { await Promise.resolve(); await Promise.resolve() })
const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms) })

let authCallback: (event: string) => void

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(Math, 'random').mockReturnValue(0)
  FakeWebSocket.instances = []
  vi.stubGlobal('WebSocket', FakeWebSocket)
  vi.stubEnv('VITE_BACKEND_BASE_URL', 'https://api.test')
  vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: { access_token: 't' } } } as never)
  vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(((cb: (event: string) => void) => {
    authCallback = cb
    return { data: { subscription: { unsubscribe: vi.fn() } } }
  }) as never)
  vi.mocked(Sentry.captureException).mockClear()
  vi.mocked(Sentry.addBreadcrumb).mockClear()
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
)

// Fails the first socket and the 3 fast retries (1s, 2s, 4s), leaving the hook past MAX_RETRIES.
async function exhaustFastRetries() {
  await flush()
  latest().fail()
  for (const delay of [1000, 2000, 4000]) {
    await advance(delay)
    latest().fail()
  }
  expect(sockets()).toBe(4)
}

test('keeps retrying on a slow timer after the fast retries run out, and reconnects', async () => {
  renderHook(() => useConversationsSocket(), { wrapper })
  await exhaustFastRetries()

  await advance(SLOW_RETRY_MS - 1)
  expect(sockets()).toBe(4)
  await advance(1)
  expect(sockets()).toBe(5)

  latest().open()
  expect(Sentry.captureException).not.toHaveBeenCalled()
})

test('a short outage that recovers sends no Sentry event', async () => {
  renderHook(() => useConversationsSocket(), { wrapper })
  await exhaustFastRetries()
  await advance(SLOW_RETRY_MS)
  latest().open()
  await advance(10_000)
  expect(Sentry.captureException).not.toHaveBeenCalled()
})

test('an outage past the threshold reports once, as a warning, with the disconnect breadcrumbs', async () => {
  renderHook(() => useConversationsSocket(), { wrapper })
  await exhaustFastRetries()
  // Keep failing every slow retry until well past the threshold.
  for (let elapsed = 0; elapsed < REPORT_AFTER_DOWN_MS * 2; elapsed += SLOW_RETRY_MS + SLOW_RETRY_JITTER_MS) {
    await advance(SLOW_RETRY_MS + SLOW_RETRY_JITTER_MS)
    latest().fail(1001, 'going away')
  }

  expect(Sentry.captureException).toHaveBeenCalledTimes(1)
  const [, context] = vi.mocked(Sentry.captureException).mock.calls[0] as [Error, { level: string; extra: { downForMs: number; disconnects: Array<Record<string, unknown>> } }]
  expect(context.level).toBe('warning')
  expect(context.extra.downForMs).toBeGreaterThanOrEqual(REPORT_AFTER_DOWN_MS)
  expect(context.extra.disconnects.length).toBe(5)
  expect(context.extra.disconnects[context.extra.disconnects.length - 1]).toMatchObject({ source: 'error+close', code: 1001, reason: 'going away', wasClean: false, openForMs: null })
})

test('every disconnect leaves a breadcrumb with the close code and how long the socket was open', async () => {
  renderHook(() => useConversationsSocket(), { wrapper })
  await flush()
  latest().open()
  await advance(60_000)
  latest().onclose?.({ code: 1006, reason: '', wasClean: false } as CloseEvent)

  expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
    category: 'conversations-socket',
    data: expect.objectContaining({ source: 'close', code: 1006, wasClean: false, openForMs: 60_000 }),
  }))
})

test('an error with no close event still reconnects', async () => {
  renderHook(() => useConversationsSocket(), { wrapper })
  await flush()
  latest().onerror?.()
  await advance(2000)
  expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(expect.objectContaining({
    data: expect.objectContaining({ source: 'error', code: null }),
  }))
  await advance(1000)
  expect(sockets()).toBe(2)
})

test('coming back to the tab skips the slow-retry wait', async () => {
  renderHook(() => useConversationsSocket(), { wrapper })
  await exhaustFastRetries()
  await advance(5000)
  document.dispatchEvent(new Event('visibilitychange'))
  await flush()
  expect(sockets()).toBe(5)
})

test('sign-out and unmount clear the slow-retry timer', async () => {
  const { unmount } = renderHook(() => useConversationsSocket(), { wrapper })
  await exhaustFastRetries()
  act(() => authCallback('SIGNED_OUT'))
  await advance(SLOW_RETRY_MS * 3)
  expect(sockets()).toBe(4)

  unmount()
  await advance(SLOW_RETRY_MS * 3)
  expect(sockets()).toBe(4)
})
