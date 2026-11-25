import { afterEach, expect, test, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { getAAL } from '@/services/mfaServices'
import useLoginForm from './useLoginForm'

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    signIn: async () => ({ error: null }),
    checkIfNeedsMFA: (current: string, next: string) => current === 'aal1' && next === 'aal2',
  }),
}))
vi.mock('@/context/ToastContext', () => ({ useToast: () => ({ showToast: vi.fn() }) }))
vi.mock('@/services/mfaServices', () => ({ getAAL: vi.fn() }))
vi.mock('../helpers/formValidation', () => ({ validateLoginFields: () => ({}) }))

const Form = () => {
  const { handleSubmit } = useLoginForm()
  return <button onClick={() => handleSubmit()}>Sign in</button>
}

const Shown = () => {
  const { pathname, state } = useLocation()
  return <p data-testid="location">{JSON.stringify({ pathname, state })}</p>
}

const login = async (state: unknown, nextLevel: 'aal1' | 'aal2') => {
  vi.mocked(getAAL).mockResolvedValue({ data: { currentLevel: 'aal1', nextLevel }, error: null })
  render(
    <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
      <Routes>
        <Route path="/login" element={<Form />} />
        <Route path="*" element={<Shown />} />
      </Routes>
    </MemoryRouter>,
  )
  await act(async () => screen.getByText('Sign in').click())
  return JSON.parse((await screen.findByTestId('location')).textContent!)
}

afterEach(cleanup)

test.each([
  [{ from: '/subscription' }, '/subscription'],
  [null, '/'],
  [{ from: 'https://evil.com' }, '/'],
])('without MFA, state %j goes to %s', async (state, pathname) => {
  expect((await login(state, 'aal1')).pathname).toBe(pathname)
})

test('with MFA, the saved page is passed on', async () => {
  expect(await login({ from: '/subscription' }, 'aal2')).toEqual({ pathname: '/mfa-verify', state: { from: '/subscription' } })
})
