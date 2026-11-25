import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { useAuth } from '@/context/AuthContext'
import { getAAL } from '@/services/mfaServices'
import useMFAStatus from './useMFAStatus'

vi.mock('@sentry/react', () => ({ captureException: vi.fn() }))
vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('@/services/mfaServices', () => ({ getAAL: vi.fn() }))

const checkIfNeedsMFA = (current: unknown, next: unknown) => current === 'aal1' && next === 'aal2'
const mockAuth = (user: object | null, authToken = 't') =>
  vi.mocked(useAuth).mockReturnValue({ user, authToken, checkIfNeedsMFA } as unknown as ReturnType<typeof useAuth>)
const aal = (nextLevel: 'aal1' | 'aal2') => ({ data: { currentLevel: 'aal1' as const, nextLevel }, error: null })
const failure = { data: null, error: { message: 'boom' } }

beforeEach(() => {
  vi.mocked(getAAL).mockReset()
})
afterEach(cleanup)

test('signed out is clear, with no check', () => {
  mockAuth(null)
  expect(renderHook(() => useMFAStatus()).result.current).toBe('clear')
  expect(getAAL).not.toHaveBeenCalled()
})

test.each([
  ['retries once', () => vi.mocked(getAAL).mockResolvedValueOnce(failure).mockResolvedValue(aal('aal1')), 'clear'],
  ['fails closed on errors', () => vi.mocked(getAAL).mockResolvedValue(failure), 'required'],
  ['fails closed on throws', () => vi.mocked(getAAL).mockRejectedValue(new Error('lock')), 'required'],
])('%s', async (_name, arrange, status) => {
  arrange()
  mockAuth({ id: '1' })
  const { result } = renderHook(() => useMFAStatus())
  expect(result.current).toBe('checking')
  await waitFor(() => expect(result.current).toBe(status))
  expect(getAAL).toHaveBeenCalledTimes(2)
})

test('a token refresh re-checks without going back to checking', async () => {
  const seen: string[] = []
  vi.mocked(getAAL).mockResolvedValue(aal('aal1'))
  mockAuth({ id: '1' })
  const { result, rerender } = renderHook(() => {
    const status = useMFAStatus()
    seen.push(status)
    return status
  })
  await waitFor(() => expect(result.current).toBe('clear'))
  seen.length = 0
  vi.mocked(getAAL).mockResolvedValue(aal('aal2'))
  mockAuth({ id: '1' }, 'refreshed')
  rerender()
  await waitFor(() => expect(result.current).toBe('required'))
  expect(seen).not.toContain('checking')
})

test('a check for the previous user is ignored', async () => {
  let resolveFirst!: (value: ReturnType<typeof aal>) => void
  vi.mocked(getAAL).mockReturnValueOnce(new Promise((resolve) => { resolveFirst = resolve })).mockResolvedValue(aal('aal2'))
  mockAuth({ id: '1' })
  const { result, rerender } = renderHook(() => useMFAStatus())
  mockAuth({ id: '2' })
  rerender()
  await waitFor(() => expect(result.current).toBe('required'))
  await act(async () => resolveFirst(aal('aal1')))
  expect(result.current).toBe('required')
})
