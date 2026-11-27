import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useAuth } from '@/context/AuthContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { CreatedNotification } from '@/views/Admin/types'
import NotificationWidget from './index'

// SAYSO-648 (Sentry SAYSO-APP-D7): dismissing the last notification while on index > 0 rendered
// once with an undefined notification and crashed on `notification.title`.

vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('@/hooks/useMediaQuery', () => ({ useMediaQuery: vi.fn() }))
vi.mock('./hooks/useNotificationWidget', () => ({
  default: () => ({ userNotifications: notifications, isLoading: false, mutateDismissNotification: vi.fn() }),
}))
vi.mock('./components/NotificationContent', () => ({ default: () => null }))
vi.mock('./components/NotificationsHistoryBtnMenubar', () => ({ default: () => null }))
// The real sheet is a vaul drawer; this stand-in reads `notification.title` the same way.
vi.mock('./NotificationBottomSheet', () => ({
  NotificationBottomSheet: (p: { notification: CreatedNotification; onDismiss: () => void; onRemindLater: () => void; onNext: () => void }) => (
    <div>
      <span>{p.notification.title}</span>
      <button onClick={p.onNext}>next</button>
      <button onClick={p.onDismiss}>dismiss</button>
      <button onClick={p.onRemindLater}>remind</button>
    </div>
  ),
}))

const make = (id: string): CreatedNotification => ({
  id, created_at: '2026-11-01T00:00:00Z', title: `Title ${id}`, description: null, type: 'article',
  media_url: null, body: null, remindable: true, is_welcome: false, active: true, expires_at: null,
})

let notifications: CreatedNotification[] = []

beforeEach(() => {
  notifications = [make('1'), make('2')]
  localStorage.clear()
  sessionStorage.clear() // remind-later IDs live here
  vi.mocked(useAuth).mockReturnValue({ globalUser: { created_at: '2020-01-01T00:00:00Z' } } as unknown as ReturnType<typeof useAuth>)
})
afterEach(cleanup)

test.each(['dismiss', 'remind'])('mobile: %s on the last notification shows the previous one', (action) => {
  vi.mocked(useMediaQuery).mockReturnValue(true)
  render(<NotificationWidget />)
  fireEvent.click(screen.getByText('next'))
  expect(screen.getByText('Title 2')).toBeTruthy()
  fireEvent.click(screen.getByText(action))
  expect(screen.getByText('Title 1')).toBeTruthy()
})

test('desktop: dismissing the last notification shows the previous one', () => {
  vi.mocked(useMediaQuery).mockReturnValue(false)
  const { container } = render(<NotificationWidget />)
  fireEvent.click(container.querySelectorAll('.nw-pagination-btn')[1])
  expect(screen.getByText('Title 2')).toBeTruthy()
  // Header buttons: [expand/collapse, dismiss]
  fireEvent.click(container.querySelectorAll('.nw-header-btn')[1])
  expect(screen.getByText('Title 1')).toBeTruthy()
  expect(container.querySelector('.nw-pagination')).toBeNull()
})
