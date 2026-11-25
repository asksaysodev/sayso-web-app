import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabase } from '@/config/supabase'
import { AuthProvider, useAuth } from './AuthContext'

vi.mock('@sentry/react', () => ({ captureException: vi.fn(), setUser: vi.fn() }))
vi.mock('@/config/supabase', () => ({
  supabase: { auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() } },
}))
vi.mock('@/hooks/useAccounts', () => ({ useAccounts: () => ({ signup: vi.fn(), getAccount: () => new Promise(() => {}) }) }))
vi.mock('@/hooks/useSessionRevalidation', () => ({ useSessionRevalidation: () => {} }))
vi.mock('@/services/mfaServices', () => ({}))
vi.mock('@/services/referralRocket', () => ({}))
vi.mock('@/services/setReferralAttribution', () => ({}))

const session = (id: string) => ({ user: { id, email: 'a@b.c' }, access_token: 't' })
type AuthCallback = (event: string, session: unknown) => void
let emit: AuthCallback

const Probe = () => {
  const { user, signedOutByUser, handleSignOut } = useAuth()
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
afterEach(cleanup)

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
