import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, renderHook } from '@testing-library/react'
import useSignOut, { SIGN_OUT_FAILED_MESSAGE } from './useSignOut'

const { handleSignOut, showToast } = vi.hoisted(() => ({ handleSignOut: vi.fn(), showToast: vi.fn() }))

vi.mock('@/context/AuthContext', () => ({ useAuth: () => ({ handleSignOut }) }))
vi.mock('@/context/ToastContext', () => ({ useToast: () => ({ showToast }) }))

beforeEach(() => vi.clearAllMocks())
afterEach(cleanup)

const run = async (options?: Parameters<typeof useSignOut>[0]) => {
  const { result } = renderHook(() => useSignOut(options))
  let signedOut: boolean | undefined
  await act(async () => { signedOut = await result.current.signOut() })
  return { signedOut, isSigningOut: result.current.isSigningOut }
}

test('signed out: resolves true, no toast', async () => {
  handleSignOut.mockResolvedValue(undefined)
  expect(await run()).toEqual({ signedOut: true, isSigningOut: false })
  expect(showToast).not.toHaveBeenCalled()
})

test('sign-out fails: resolves false and tells the user', async () => {
  handleSignOut.mockRejectedValue(new Error('storage unavailable'))
  expect(await run()).toEqual({ signedOut: false, isSigningOut: false })
  expect(showToast).toHaveBeenCalledWith('error', SIGN_OUT_FAILED_MESSAGE)
})

test('sign-out fails with the toast off: resolves false, no toast', async () => {
  handleSignOut.mockRejectedValue(new Error('storage unavailable'))
  expect((await run({ toastOnError: false })).signedOut).toBe(false)
  expect(showToast).not.toHaveBeenCalled()
})
