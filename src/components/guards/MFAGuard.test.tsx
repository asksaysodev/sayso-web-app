import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import MFAGuard from './MFAGuard'

vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('../SaysoLoader', () => ({ default: () => null }))

const Shown = () => {
  const { pathname, state } = useLocation()
  return <p data-testid="location">{JSON.stringify({ pathname, state })}</p>
}

const renderGuard = (user: object | null, state: unknown) => {
  const checkMFAStatus = async () => false
  vi.mocked(useAuth).mockReturnValue({ user, loading: false, checkMFAStatus } as unknown as ReturnType<typeof useAuth>)
  render(
    <MemoryRouter initialEntries={[{ pathname: '/mfa-verify', state }]}>
      <Routes>
        <Route path="/mfa-verify" element={<MFAGuard><p>code</p></MFAGuard>} />
        <Route path="*" element={<Shown />} />
      </Routes>
    </MemoryRouter>,
  )
}

const shown = async () => JSON.parse((await screen.findByTestId('location')).textContent!)

afterEach(cleanup)

test.each([
  [{ from: '/subscription' }, '/subscription'],
  [null, '/'],
  [{ from: 'https://evil.com' }, '/'],
])('MFA not required with state %j goes to %s', async (state, pathname) => {
  renderGuard({ id: '1' }, state)
  expect((await shown()).pathname).toBe(pathname)
})

test('signed out: login keeps the saved page', async () => {
  renderGuard(null, { from: '/subscription' })
  expect(await shown()).toEqual({ pathname: '/login', state: { from: '/subscription' } })
})
