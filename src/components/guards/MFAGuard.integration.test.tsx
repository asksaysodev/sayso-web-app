import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Factor } from '@supabase/supabase-js'
import { supabase } from '@/config/supabase'
import { getAAL, listFactors, verifyTOTPCode } from '@/services/mfaServices'
import { AuthProvider } from '@/context/AuthContext'
import MFAVerify from '@/views/MFAVerify'
import MFAGuard from './MFAGuard'

vi.mock('@sentry/react', () => ({ captureException: vi.fn(), setUser: vi.fn() }))
vi.mock('@/config/supabase', () => ({ supabase: { auth: { getSession: vi.fn(), onAuthStateChange: vi.fn() } } }))
vi.mock('@/hooks/useAccounts', () => ({ useAccounts: () => ({ signup: vi.fn(), getAccount: async () => ({ id: '1', email: 'a@b.c' }) }) }))
vi.mock('@/hooks/useSessionRevalidation', () => ({ useSessionRevalidation: () => {} }))
vi.mock('@/services/mfaServices', () => ({ getAAL: vi.fn(), listFactors: vi.fn(), verifyTOTPCode: vi.fn() }))
vi.mock('@/services/referralRocket', () => ({ enrollReferralParticipant: async () => {} }))
vi.mock('@/services/setReferralAttribution', () => ({}))
vi.mock('@/context/ToastContext', () => ({ useToast: () => ({ showToast: vi.fn() }) }))
vi.mock('@/components/layouts/AuthLayout', () => ({ default: ({ children }: { children: React.ReactNode }) => children }))
vi.mock('@/components/ds/CodeInput', () => ({
  CodeInput: ({ onChange }: { onChange: (code: string) => void }) => <button type="button" onClick={() => onChange('123456')}>Fill</button>,
}))
vi.mock('../SaysoLoader', () => ({ default: () => null }))

const factors = () => ({ data: [{ id: 'factor' }] as Factor[], error: null })
const failure = { data: null, error: { message: 'boom' } }

const open = async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/mfa-verify']}>
        <QueryClientProvider client={new QueryClient()}>
          <AuthProvider>
            <Routes>
              <Route path="/mfa-verify" element={<MFAGuard><MFAVerify /></MFAGuard>} />
              <Route path="/" element={<p>home</p>} />
            </Routes>
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    )
  })
  await advance(1000)
}

/** In small steps, so a render can trigger the next check. */
const advance = async (ms: number) => {
  for (let elapsed = 0; elapsed < ms; elapsed += 20) await act(async () => { await vi.advanceTimersByTimeAsync(20) })
}

const verify = async () => {
  await act(async () => screen.getByText('Fill').click())
  await act(async () => screen.getByText('Verify').click())
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.useFakeTimers()
  vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session: { user: { id: '1', email: 'a@b.c' }, access_token: 't' } }, error: null } as never)
  vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({ data: { subscription: { unsubscribe: () => {} } } } as never)
  vi.mocked(getAAL).mockResolvedValue({ data: { currentLevel: 'aal1', nextLevel: 'aal2' }, error: null })
  vi.mocked(listFactors).mockImplementation(async () => factors())
  vi.mocked(verifyTOTPCode).mockImplementation(async () => {
    vi.mocked(getAAL).mockResolvedValue({ data: { currentLevel: 'aal2', nextLevel: 'aal2' }, error: null })
    return { success: true, error: null }
  })
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

test.each([
  ['succeeds', () => {}],
  ['fails', () => { vi.mocked(getAAL).mockResolvedValue(failure) }],
])('the check runs once when it %s', async (_name, arrange) => {
  arrange()
  await open()
  screen.getByText('Fill')
  expect(listFactors).toHaveBeenCalledOnce()
})

test('the success message shows before the redirect', async () => {
  await open()
  await verify()
  await advance(600)
  screen.getByText('Verification complete')
  await advance(400)
  screen.getByText('home')
})

test('factors that failed to load are read again on verify', async () => {
  vi.mocked(listFactors).mockResolvedValueOnce({ data: [], error: { message: 'rate limit' } })
  await open()
  await verify()
  expect(verifyTOTPCode).toHaveBeenCalledWith('factor', '123456')
})
