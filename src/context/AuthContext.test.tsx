import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'
import { getAAL, listFactors } from '@/services/mfaServices'
import { AuthProvider, useAuth } from './AuthContext'

const getAccount = vi.hoisted(() => vi.fn())

vi.mock('@sentry/react', () => ({ captureException: vi.fn(), setUser: vi.fn() }))
vi.mock('@/config/supabase', () => ({
  supabase: { auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() } },
}))
vi.mock('@/hooks/useAccounts', () => ({ useAccounts: () => ({ signup: vi.fn(), getAccount }) }))
vi.mock('@/hooks/useSessionRevalidation', () => ({ useSessionRevalidation: () => {} }))
vi.mock('@/services/mfaServices', () => ({ getAAL: vi.fn(), listFactors: vi.fn() }))
vi.mock('@/services/referralRocket', () => ({ enrollReferralParticipant: async () => {} }))
vi.mock('@/services/setReferralAttribution', () => ({}))

const session = (id: string) => ({ user: { id, email: 'a@b.c' }, access_token: 't' })
type AuthCallback = (event: string, session: unknown) => void
let emit: AuthCallback

type Auth = ReturnType<typeof useAuth>
const onRender = vi.fn<(auth: Auth) => void>()
const lastAuth = () => onRender.mock.lastCall![0]

const Probe = () => {
  const auth = useAuth()
  const { user, signedOutByUser, handleSignOut } = auth
  onRender(auth)
  return (
    <>
      <p data-testid="state">{JSON.stringify({ signedIn: !!user, signedOutByUser })}</p>
      <button onClick={() => { handleSignOut().catch(() => {}) }}>Sign out</button>
    </>
  )
}

const state = () => JSON.parse(screen.getByTestId('state').textContent!)
const clickSignOut = () => act(async () => screen.getByText('Sign out').click())

beforeEach(async () => {
  localStorage.clear()
  onRender.mockClear()
  getAccount.mockReset().mockReturnValue(new Promise(() => {}))
  vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: session('1') }, error: null } as never)
  vi.mocked(supabase.auth.onAuthStateChange).mockImplementation(((callback: AuthCallback) => {
    emit = callback
    return { data: { subscription: { unsubscribe: () => {} } } }
  }) as never)
  await act(async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={new QueryClient()}><AuthProvider><Probe /></AuthProvider></QueryClientProvider>
      </MemoryRouter>,
    )
  })
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

const signInAgain = async () => {
  vi.useFakeTimers()
  await act(async () => emit('SIGNED_OUT', null))
  onRender.mockClear()
  await act(async () => emit('SIGNED_IN', session('2')))
}
const apiError = (status: number, error: string) => Object.assign(new Error(error), { response: { status, data: { error } } })

test('SIGNED_IN never renders a user whose account is not loading yet', async () => {
  await signInAgain()
  const settled = onRender.mock.calls.filter(([auth]) => auth.user && !auth.userLoading)
  expect(onRender).toHaveBeenCalled()
  expect(settled).toEqual([])
})

test('SIGNED_IN for the same user (tab focus) does not reload the account', async () => {
  vi.useFakeTimers()
  getAccount.mockResolvedValue({ id: '2', email: 'a@b.c' })
  await act(async () => emit('SIGNED_IN', session('2')))
  await act(async () => vi.advanceTimersByTimeAsync(400))
  expect(lastAuth().userLoading).toBe(false)
  onRender.mockClear()
  await act(async () => emit('SIGNED_IN', session('2')))
  expect(onRender.mock.calls.some(([auth]) => auth.userLoading)).toBe(false)
})

test.each([
  ['missing account', 404, 'Account not found', true],
  ['any other 404', 404, 'Not Found', false],
  ['server error', 500, 'boom', false],
])('%s: accountNotFound', async (_name, status, error, accountNotFound) => {
  getAccount.mockRejectedValue(apiError(status, error))
  await signInAgain()
  await act(async () => vi.advanceTimersByTimeAsync(5000))
  expect(lastAuth()).toMatchObject({ accountUnavailable: true, accountNotFound, userLoading: false })
})

test('a missing account is not brought back by its cache', async () => {
  getAccount.mockRejectedValue(apiError(404, 'Account not found'))
  await signInAgain()
  localStorage.setItem('sayso-global-user', JSON.stringify({ id: '2', email: 'a@b.c' }))
  await act(async () => vi.advanceTimersByTimeAsync(5000))
  expect(lastAuth()).toMatchObject({ globalUser: null, accountNotFound: true })
  expect(localStorage.getItem('sayso-global-user')).toBeNull()
})

test('no session at boot does not leave the account loading', async () => {
  await act(async () => emit('INITIAL_SESSION', null))
  expect(lastAuth().user).toBeFalsy()
  expect(lastAuth().userLoading).toBe(false)
})

test('a local sign-out that returns an error keeps the session', async () => {
  vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: new Error('boom') } as never)
  let signedOut: boolean | undefined
  await act(async () => { signedOut = await lastAuth().signOutLocally() })
  expect(signedOut).toBe(false)
  expect(lastAuth().user).not.toBeNull()
  expect(supabase.auth.signOut).toHaveBeenLastCalledWith({ scope: 'local' })
})

test.each([
  ['returns an error', () => Promise.resolve({ data: null, error: { message: 'boom' } })],
  ['throws', () => Promise.reject(new Error('lock'))],
])('MFA stays required when the AAL check %s', async (_name, aal) => {
  vi.mocked(getAAL).mockImplementation(aal)
  vi.mocked(listFactors).mockResolvedValue({ data: [], error: null })
  let needsMFA: boolean | undefined
  await act(async () => { needsMFA = await lastAuth().checkMFAStatus() })
  expect(needsMFA).toBe(true)
})

test('a deliberate sign-out is flagged when SIGNED_OUT clears the user, even after a token refresh', async () => {
  vi.mocked(supabase.auth.signOut).mockReturnValue(new Promise(() => {}))
  await clickSignOut()
  await act(async () => emit('TOKEN_REFRESHED', session('1-refreshed')))
  await act(async () => emit('SIGNED_OUT', null))
  expect(state()).toEqual({ signedIn: false, signedOutByUser: true })
})

test('an expired session is not flagged', async () => {
  await act(async () => { window.dispatchEvent(new CustomEvent('auth:session-expired')) })
  expect(state()).toEqual({ signedIn: false, signedOutByUser: false })
})

test('the next sign-in clears the flag', async () => {
  vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null })
  await clickSignOut()
  await act(async () => emit('SIGNED_IN', session('2')))
  expect(state()).toEqual({ signedIn: true, signedOutByUser: false })
})

test('a sign-out that throws clears the flag', async () => {
  vi.mocked(supabase.auth.signOut).mockRejectedValue(new Error('lock timeout'))
  await clickSignOut()
  expect(state()).toEqual({ signedIn: true, signedOutByUser: false })
})
