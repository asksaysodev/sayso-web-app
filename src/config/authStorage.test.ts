import { afterEach, expect, test, vi } from 'vitest'
import { AUTH_REQUEST_TIMEOUT_MS, clearStoredSession, fetchWithTimeout } from './authStorage'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  localStorage.clear()
})

test('clears every key auth-js stores for the session, and nothing else', () => {
  for (const key of ['sayso-auth', 'sayso-auth-user', 'sayso-auth-code-verifier', 'sayso-global-user']) localStorage.setItem(key, '{}')
  clearStoredSession()
  expect(Object.keys(localStorage)).toEqual(['sayso-global-user'])
})

test('bounds every request with a timeout signal', () => {
  const fetchSpy = vi.fn().mockResolvedValue(new Response())
  vi.stubGlobal('fetch', fetchSpy)
  const timeoutSignal = new AbortController().signal
  const timeout = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(timeoutSignal)
  fetchWithTimeout('https://auth.test/logout', { method: 'POST' })
  expect(timeout).toHaveBeenCalledWith(AUTH_REQUEST_TIMEOUT_MS)
  expect(fetchSpy).toHaveBeenCalledWith('https://auth.test/logout', { method: 'POST', signal: timeoutSignal })
})

test("keeps the caller's own signal", () => {
  const fetchSpy = vi.fn().mockResolvedValue(new Response())
  vi.stubGlobal('fetch', fetchSpy)
  const signal = new AbortController().signal
  fetchWithTimeout('https://auth.test/user', { signal })
  expect(fetchSpy.mock.calls[0][1].signal).toBe(signal)
})
