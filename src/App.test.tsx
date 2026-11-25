import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { BrowserRouter, useLocation } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import { supabase } from './config/supabase'
import { useRequestedPath } from './context/RequestedPathContext'
import App from './App'

vi.mock('@sentry/react', () => ({ addBreadcrumb: vi.fn(), captureException: vi.fn() }))
vi.mock('./config/supabase', () => ({ supabase: { auth: { verifyOtp: vi.fn() } } }))
vi.mock('./Providers', () => ({ default: ({ children }: { children: React.ReactNode }) => children }))
vi.mock('./components/guards/StagingGuard', () => ({ default: ({ children }: { children: React.ReactNode }) => children }))
vi.mock('./components/StagingBanner', () => ({ default: () => null }))
vi.mock('./components/SaysoLoader', () => ({ default: () => null }))
vi.mock('./AppRoutes', () => ({
  default: function Shown() {
    const { pathname, search, state } = useLocation()
    const requestedPath = useRequestedPath()
    return <p data-testid="location">{JSON.stringify({ path: pathname + search, state, requestedPath })}</p>
  },
}))

const verifyOtp = vi.mocked(supabase.auth.verifyOtp)
type VerifyResult = Awaited<ReturnType<typeof supabase.auth.verifyOtp>>

const openHandoff = async () => {
  window.history.replaceState(null, '', '/subscription?ref=desktop#token_hash=secret')
  render(<BrowserRouter><App /></BrowserRouter>)
  return JSON.parse((await screen.findByTestId('location')).textContent!)
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(cleanup)

const expectNoToken = () => {
  expect(window.location.href).not.toContain('secret')
  expect(JSON.stringify(window.history.state)).not.toContain('secret')
  expect(JSON.stringify(vi.mocked(Sentry.addBreadcrumb).mock.calls)).not.toContain('secret')
}

test.each([
  ['returns an error', () => verifyOtp.mockResolvedValue({ data: {}, error: new Error('expired') } as unknown as VerifyResult)],
  ['rejects', () => verifyOtp.mockRejectedValue(new Error('network'))],
])('handoff that %s: login remembers the page, not the token', async (_name, setup) => {
  setup()
  let urlWhenReported = ''
  vi.mocked(Sentry.captureException).mockImplementation(() => {
    urlWhenReported = window.location.href
    return ''
  })
  expect(await openHandoff()).toEqual({ path: '/login', state: { from: '/subscription?ref=desktop' }, requestedPath: '/login' })
  expect(Sentry.captureException).toHaveBeenCalledOnce()
  expect(urlWhenReported).not.toContain('secret')
  expectNoToken()
})

test('successful handoff stays on the page', async () => {
  verifyOtp.mockResolvedValue({ data: {}, error: null } as unknown as VerifyResult)
  expect(await openHandoff()).toEqual({ path: '/subscription?ref=desktop', state: null, requestedPath: '/subscription?ref=desktop' })
  expectNoToken()
})
