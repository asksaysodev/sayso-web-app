import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'
import { getAAL } from '@/services/mfaServices'
import { AuthProvider } from '@/context/AuthContext'
import GuestGuard from '@/components/guards/GuestGuard'
import useLoginForm from './useLoginForm'

const { getAccount, showToast, homeRendered } = vi.hoisted(() => ({ getAccount: vi.fn(), showToast: vi.fn(), homeRendered: vi.fn() }))

vi.mock('@sentry/react', () => ({ captureException: vi.fn(), setUser: vi.fn() }))
vi.mock('@/config/supabase', () => ({
  supabase: { auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn(), signInWithPassword: vi.fn() } },
}))
vi.mock('@/hooks/useAccounts', () => ({ useAccounts: () => ({ signup: vi.fn(), getAccount }) }))
vi.mock('@/hooks/useSessionRevalidation', () => ({ useSessionRevalidation: () => {} }))
vi.mock('@/services/mfaServices', () => ({ getAAL: vi.fn() }))
vi.mock('@/services/referralRocket', () => ({ enrollReferralParticipant: async () => {} }))
vi.mock('@/services/setReferralAttribution', () => ({}))
vi.mock('@/context/ToastContext', () => ({ useToast: () => ({ showToast }) }))
vi.mock('../helpers/formValidation', () => ({ validateLoginFields: () => ({}) }))
vi.mock('@/components/SaysoLoader', () => ({ default: () => null }))

const session = { user: { id: '1', email: 'a@b.c' }, access_token: 't' }
const missingAccount = Object.assign(new Error('404'), { response: { status: 404, data: { error: 'Account not found' } } })
let emit: (event: string, session: unknown) => void

const Form = () => {
  const { handleSubmit, isBtnLoading } = useLoginForm()
  return <button disabled={isBtnLoading} onClick={() => handleSubmit()}>Sign in</button>
}

const Home = () => {
  homeRendered()
  return <p>home</p>
}

const mockAAL = (nextLevel: 'aal1' | 'aal2') =>
  vi.mocked(getAAL).mockResolvedValue({ data: { currentLevel: 'aal1', nextLevel }, error: null })
const button = () => screen.getByText('Sign in') as HTMLButtonElement
const submit = () => act(async () => button().click())
const settle = () => act(async () => vi.advanceTimersByTimeAsync(400))

beforeEach(async () => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: null }, error: null })
  vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(((callback: typeof emit) => {
    emit = callback
    return { data: { subscription: { unsubscribe: () => {} } } }
  }) as never)
  // Like the SDK: SIGNED_IN is emitted, and rendered, before the call resolves.
  vi.mocked(supabase.auth.signInWithPassword).mockImplementation((async () => {
    emit('SIGNED_IN', session)
    await new Promise((resolve) => setTimeout(resolve, 10))
    return { error: null }
  }) as never)
  vi.mocked(supabase.auth.signOut).mockImplementation(async () => {
    emit('SIGNED_OUT', null)
    return { error: null }
  })
  mockAAL('aal1')
  getAccount.mockResolvedValue({ id: '1', email: 'a@b.c' })
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<GuestGuard holdOnAccountNotFound><Form /></GuestGuard>} />
              <Route path="/mfa-verify" element={<p>mfa</p>} />
              <Route path="/" element={<Home />} />
            </Routes>
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    )
  })
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

test('with MFA: straight to the code, the dashboard never renders', async () => {
  mockAAL('aal2')
  await submit()
  await settle()
  screen.getByText('mfa')
  expect(homeRendered).not.toHaveBeenCalled()
})

test('without MFA: the form stays, loading, until the account is in', async () => {
  await submit()
  await act(async () => vi.advanceTimersByTimeAsync(100))
  expect(button().disabled).toBe(true)
  expect(homeRendered).not.toHaveBeenCalled()
  await settle()
  screen.getByText('home')
  expect(showToast).not.toHaveBeenCalled()
})

test('deleted account: stays on the form with an error, every time', async () => {
  getAccount.mockRejectedValue(missingAccount)
  for (const attempt of [1, 2]) {
    await submit()
    await settle()
    expect(button().disabled).toBe(false)
    expect(showToast).toHaveBeenCalledTimes(attempt)
    expect(showToast).toHaveBeenLastCalledWith('error', "We couldn't find an account for this email.")
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(attempt)
  }
  expect(homeRendered).not.toHaveBeenCalled()
})

test('deleted account and Supabase cannot sign out: the session still ends, stays on the form', async () => {
  getAccount.mockRejectedValue(missingAccount)
  vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: new Error('offline') } as never)
  await submit()
  await settle()
  expect(showToast).toHaveBeenLastCalledWith('error', "We couldn't find an account for this email.")
  expect(homeRendered).not.toHaveBeenCalled()
})

test('deleted account and the session cannot be cleared: leaves the form instead of hanging on it', async () => {
  getAccount.mockRejectedValue(missingAccount)
  vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: new Error('offline') } as never)
  const removeItem = Storage.prototype.removeItem
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(function (this: Storage, key: string) {
    if (key === 'sayso-auth') throw new Error('storage unavailable')
    removeItem.call(this, key)
  })
  await submit()
  await settle()
  vi.restoreAllMocks()
  screen.getByText('home')
})

test('session lost while signing in: says so', async () => {
  getAccount.mockReturnValue(new Promise(() => {}))
  await submit()
  await act(async () => emit('SIGNED_OUT', null))
  await settle()
  expect(showToast).toHaveBeenCalledWith('error', "We couldn't sign you in. Please try again.")
  expect(button().disabled).toBe(false)
})

test('wrong password: error and the form is usable again', async () => {
  vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({ error: new Error('Invalid login credentials') } as never)
  await submit()
  expect(showToast).toHaveBeenCalledWith('error', 'Email or password is incorrect. Please try again.')
  expect(button().disabled).toBe(false)
})
