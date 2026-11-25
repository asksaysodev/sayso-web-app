import { afterEach, expect, test, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import useMFAStatus from '@/hooks/useMFAStatus'
import GuestGuard from './GuestGuard'

vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('@/hooks/useMFAStatus', () => ({ default: vi.fn() }))
vi.mock('../SaysoLoader', () => ({ default: () => <p>loader</p> }))

const mock = (mfa: ReturnType<typeof useMFAStatus>, auth = {}) => {
  vi.mocked(useMFAStatus).mockReturnValue(mfa)
  vi.mocked(useAuth).mockReturnValue({ user: null, loading: false, userLoading: false, accountNotFound: false, ...auth } as unknown as ReturnType<typeof useAuth>)
}

const Shown = () => {
  const { pathname, state } = useLocation()
  return <p data-testid="location">{JSON.stringify({ pathname, state })}</p>
}

const tree = (hold: boolean) => (
  <MemoryRouter initialEntries={['/login']}>
    <Routes>
      <Route path="/login" element={<GuestGuard redirectTo="/conversations" holdOnAccountNotFound={hold}><input aria-label="email" /></GuestGuard>} />
      <Route path="*" element={<Shown />} />
    </Routes>
  </MemoryRouter>
)
const shown = () => JSON.parse(screen.getByTestId('location').textContent!)
const user = { id: '1' }

/** Renders the form signed out, then the session arrives. */
const signIn = (mfa: ReturnType<typeof useMFAStatus>, auth = {}, hold = true) => {
  mock('clear')
  const { rerender } = render(tree(hold))
  const form = screen.getByLabelText('email')
  mock(mfa, { user, ...auth })
  rerender(tree(hold))
  return form
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

test.each([
  ['MFA is being checked', 'checking', {}],
  ['the account loads', 'clear', { userLoading: true }],
  ['a missing account is rejected', 'clear', { accountUnavailable: true, accountNotFound: true }],
] as const)('the form stays mounted while %s', (_name, mfa, auth) => {
  const form = signIn(mfa, auth)
  expect(screen.getByLabelText('email')).toBe(form)
})

test('MFA required: MFA with the saved page, without waiting for the account', () => {
  signIn('required', { userLoading: true })
  expect(shown()).toEqual({ pathname: '/mfa-verify', state: { from: '/conversations' } })
})

test.each([
  ['account loaded', {}, true],
  ['account unavailable', { accountUnavailable: true }, true],
  ['missing account on a form that does not hold', { accountNotFound: true }, false],
])('%s: goes to the saved page', (_name, auth, hold) => {
  signIn('clear', auth, hold)
  expect(shown().pathname).toBe('/conversations')
})

test('a slow account stops holding the form after 8s', () => {
  vi.useFakeTimers()
  signIn('clear', { userLoading: true })
  act(() => { vi.advanceTimersByTime(7999) })
  screen.getByLabelText('email')
  act(() => { vi.advanceTimersByTime(1) })
  expect(shown().pathname).toBe('/conversations')
})

test('already signed in: never shows the form', () => {
  mock('checking', { user, userLoading: true })
  render(tree(true))
  screen.getByText('loader')
  expect(screen.queryByLabelText('email')).toBeNull()
})
