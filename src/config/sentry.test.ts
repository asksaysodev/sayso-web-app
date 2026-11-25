import { describe, expect, test } from 'vitest'
import type { ErrorEvent, EventHint } from '@sentry/react'
import { sentryConfig } from './sentry'
import { markSessionExpired } from '@/utils/sessionExpired'
import { markSuspendedTabTimeout } from '@/utils/suspendedTabTimeout'

const event = { message: 'test' } as ErrorEvent
const send = (originalException: unknown) => sentryConfig.beforeSend(event, { originalException } as EventHint)

describe('sentryConfig.beforeSend', () => {
  test('keeps an ordinary error', () => {
    expect(send(new Error('real bug'))).toBe(event)
  })

  test('drops an expected logout', () => {
    const error = new Error('401')
    markSessionExpired(error)
    expect(send(error)).toBeNull()
  })

  test('drops a timeout from a suspended tab', () => {
    const error = new Error('timeout of 10000ms exceeded')
    markSuspendedTabTimeout(error)
    expect(send(error)).toBeNull()
  })

  test('drops an auth-js lock timeout', () => {
    expect(send(Object.assign(new Error('lock'), { isAcquireTimeout: true }))).toBeNull()
  })
})

describe('auth tokens in URLs', () => {
  test('are masked in the event URL', () => {
    const withUrl = { request: { url: 'https://x.com/subscription#token_hash=secret' } } as ErrorEvent
    expect(sentryConfig.beforeSend(withUrl, {} as EventHint)?.request?.url).toBe('https://x.com/subscription#token_hash=[redacted]')
  })

  test('are masked in navigation breadcrumbs', () => {
    const breadcrumb = { category: 'navigation', data: { from: '/subscription#token_hash=secret', to: '/login' } }
    expect(sentryConfig.beforeBreadcrumb(breadcrumb).data).toEqual({ from: '/subscription#token_hash=[redacted]', to: '/login' })
  })
})
