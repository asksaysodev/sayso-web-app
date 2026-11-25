import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { RequestedPathContext } from '@/context/RequestedPathContext'
import { useAuth } from '@/context/AuthContext'
import { getAAL } from '@/services/mfaServices'
import { useOptimisticSignupStore } from '@/store/optimisticSignupStore'
import AuthGuard from './AuthGuard'

vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('@sentry/react', () => ({ captureException: vi.fn() }))
vi.mock('@/services/mfaServices', () => ({ getAAL: vi.fn() }))
vi.mock('./SubscriptionGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => children }))
vi.mock('../AccountUnavailable', () => ({ default: () => null }))
vi.mock('../SaysoLoader', () => ({ default: () => null }))
vi.mock('@/views/Dashboard/DashboardLoadingFallback', () => ({ default: () => { skeleton(); return null } }))

const skeleton = vi.hoisted(() => vi.fn())

const mockAuth = (overrides = {}) => vi.mocked(useAuth).mockReturnValue({
  user: null,
  globalUser: null,
  loading: false,
  userLoading: false,
  accountUnavailable: false,
  signedOutByUser: false,
  checkIfNeedsMFA,
  ...overrides,
} as unknown as ReturnType<typeof useAuth>)

const checkIfNeedsMFA = (current: unknown, next: unknown) => current === 'aal1' && next === 'aal2'

const Shown = () => {
  const { pathname, state } = useLocation()
  return <p data-testid="location">{JSON.stringify({ pathname, state })}</p>
}

const renderGuard = (requestedPath: string, routesPath = requestedPath) => render(
  <MemoryRouter initialEntries={[routesPath]}>
    <RequestedPathContext value={requestedPath}>
      <Routes>
        <Route path="/login" element={<Shown />} />
        <Route path="/mfa-verify" element={<Shown />} />
        <Route path="*" element={<AuthGuard><p>page</p></AuthGuard>} />
      </Routes>
    </RequestedPathContext>
  </MemoryRouter>,
)

const shown = async () => JSON.parse((await screen.findByTestId('location')).textContent!)

beforeEach(() => mockAuth())
afterEach(cleanup)

test('signed out: login remembers the page', async () => {
  renderGuard('/subscription')
  expect(await shown()).toEqual({ pathname: '/login', state: { from: '/subscription' } })
})

test('signed out under the settings modal: login remembers the settings tab', async () => {
  renderGuard('/settings?tab=subscription', '/')
  expect(await shown()).toEqual({ pathname: '/login', state: { from: '/settings?tab=subscription' } })
})

test('signed out on purpose: login remembers nothing', async () => {
  mockAuth({ signedOutByUser: true })
  renderGuard('/conversations')
  expect(await shown()).toEqual({ pathname: '/login', state: null })
})

test.each([
  ['MFA pending', { data: { currentLevel: 'aal1', nextLevel: 'aal2' }, error: null }],
  ['AAL check failed', { data: null, error: { message: 'boom' } }],
])('%s: MFA remembers the page', async (_name, aal) => {
  vi.mocked(getAAL).mockResolvedValue(aal as Awaited<ReturnType<typeof getAAL>>)
  mockAuth({ user: { id: '1' }, globalUser: { id: '1' } })
  renderGuard('/subscription')
  expect(await shown()).toEqual({ pathname: '/mfa-verify', state: { from: '/subscription' } })
})

test('a query change does not re-run the MFA check', async () => {
  vi.mocked(getAAL).mockClear().mockResolvedValue({ data: { currentLevel: 'aal1', nextLevel: 'aal1' }, error: null })
  mockAuth({ user: { id: '1' }, globalUser: { id: '1' } })
  const tree = (path: string) => (
    <MemoryRouter initialEntries={['/settings']}>
      <RequestedPathContext value={path}><AuthGuard><p>page</p></AuthGuard></RequestedPathContext>
    </MemoryRouter>
  )
  const { rerender } = render(tree('/settings?tab=profile'))
  await screen.findByText('page')
  await act(async () => rerender(tree('/settings?tab=security')))
  expect(getAAL).toHaveBeenCalledOnce()
})

test('MFA pending while the account loads: MFA right away, never the dashboard skeleton', async () => {
  skeleton.mockClear()
  vi.mocked(getAAL).mockResolvedValue({ data: { currentLevel: 'aal1', nextLevel: 'aal2' }, error: null })
  mockAuth({ user: { id: '1' }, userLoading: true })
  renderGuard('/')
  expect((await shown()).pathname).toBe('/mfa-verify')
  expect(skeleton).not.toHaveBeenCalled()
})

test('signed out while the account state settles: login, not a stuck loader', async () => {
  mockAuth({ userLoading: true })
  renderGuard('/conversations')
  expect((await shown()).pathname).toBe('/login')
})

test('optimistic sign-up: the plan page shows before there is a session', async () => {
  useOptimisticSignupStore.setState({ status: 'pending' })
  renderGuard('/signup/plan')
  expect(await screen.findByText('page')).toBeTruthy()
  useOptimisticSignupStore.getState().reset()
})
