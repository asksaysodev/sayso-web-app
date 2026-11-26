import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import MFAVerify from '.'

const { handleSignOut, showToast } = vi.hoisted(() => ({ handleSignOut: vi.fn(), showToast: vi.fn() }))

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ verifyMFA: async () => ({ success: true, error: null }), handleSignOut }),
}))
vi.mock('@/context/ToastContext', () => ({ useToast: () => ({ showToast }) }))
vi.mock('@/components/layouts/AuthLayout', () => ({ default: ({ children }: { children: React.ReactNode }) => children }))
vi.mock('@/components/ds/CodeInput', () => ({
  CodeInput: ({ onChange }: { onChange: (code: string) => void }) => <button type="button" onClick={() => onChange('123456')}>Fill</button>,
}))

const Shown = () => {
  const { pathname, state } = useLocation()
  return <p data-testid="location">{JSON.stringify({ pathname, state })}</p>
}

const renderView = (state: unknown) => render(
  <MemoryRouter initialEntries={[{ pathname: '/mfa-verify', state }]}>
    <Routes>
      <Route path="/mfa-verify" element={<MFAVerify />} />
      <Route path="*" element={<Shown />} />
    </Routes>
  </MemoryRouter>,
)

const shown = async () => JSON.parse((await screen.findByTestId('location', {}, { timeout: 2000 })).textContent!)

beforeEach(() => {
  vi.clearAllMocks()
  handleSignOut.mockResolvedValue(undefined)
})
afterEach(cleanup)

test.each([
  [{ from: '/subscription' }, '/subscription'],
  [null, '/'],
])('verified with state %j goes to %s', async (state, pathname) => {
  renderView(state)
  fireEvent.click(screen.getByText('Fill'))
  await act(async () => screen.getByText('Verify').click())
  expect((await shown()).pathname).toBe(pathname)
})

test('back to sign in keeps the saved page', async () => {
  renderView({ from: '/subscription' })
  await act(async () => screen.getByText('Back to sign in').click())
  expect(await shown()).toEqual({ pathname: '/login', state: { from: '/subscription' } })
})

test('back to sign in that fails stays put and says so', async () => {
  handleSignOut.mockRejectedValue(new Error('storage unavailable'))
  renderView({ from: '/subscription' })
  await act(async () => screen.getByText('Back to sign in').click())
  expect(showToast).toHaveBeenCalledWith('error', "We couldn't sign you out. Check your connection and try again.")
  expect(screen.queryByTestId('location')).toBeNull()
})
