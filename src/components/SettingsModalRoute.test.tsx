import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import SettingsModalRoute from './SettingsModalRoute'

vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('@/hooks/useMFAStatus', () => ({ default: () => 'clear' }))
vi.mock('@/hooks/useHasSubscription', () => ({ default: () => true }))
vi.mock('@/views/Settings/SettingsModal', () => ({ default: () => <div data-testid="settings-modal" /> }))

const mockAuth = (accountUnavailable: boolean) => vi.mocked(useAuth).mockReturnValue({
  globalUser: { id: 'A', email: 'a@b.c' },
  userLoading: false,
  accountUnavailable,
} as unknown as ReturnType<typeof useAuth>)

const renderRoute = () => render(<MemoryRouter><SettingsModalRoute /></MemoryRouter>)

beforeEach(() => vi.mocked(useAuth).mockReset())
afterEach(cleanup)

test('opens once the account is loaded', async () => {
  mockAuth(false)
  renderRoute()
  expect(await screen.findByTestId('settings-modal')).toBeTruthy()
})

test('does not show a previous account while the current one is unavailable', async () => {
  mockAuth(true)
  renderRoute()
  await import('@/views/Settings/SettingsModal')
  await new Promise(resolve => setTimeout(resolve, 0))
  expect(screen.queryByTestId('settings-modal')).toBeNull()
})
