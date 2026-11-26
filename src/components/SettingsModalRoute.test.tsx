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

test('hides the modal while the current account is unavailable', async () => {
  mockAuth(false)
  const { rerender } = renderRoute()
  await screen.findByTestId('settings-modal')
  mockAuth(true)
  rerender(<MemoryRouter><SettingsModalRoute /></MemoryRouter>)
  expect(screen.queryByTestId('settings-modal')).toBeNull()
})
