import { describe, expect, test } from 'vitest'
import { getIntendedPath, sanitizeIntendedPath, toIntendedState } from './intendedPath'

describe('sanitizeIntendedPath', () => {
  test.each(['/', '/subscription', '/settings?tab=subscription', '/signup/plan?offer=abc'])('keeps %s', (path) => {
    expect(sanitizeIntendedPath(path)).toBe(path)
  })

  test.each([
    'https://evil.com',
    '//evil.com',
    '/\\evil.com',
    '/\t/evil.com',
    '/\t/[',
    '/a/..//evil.com',
    'javascript:alert(1)',
    'subscription',
    '',
    null,
    undefined,
    { pathname: '/subscription' },
  ])('rejects %j', (value) => {
    expect(sanitizeIntendedPath(value)).toBeNull()
  })

  test.each(['/login', '/login/', '/signup?invite=x', '/mfa-verify', '/forgot-password', '/reset-password'])('rejects auth route %s', (path) => {
    expect(sanitizeIntendedPath(path)).toBeNull()
  })

  test('drops the hash and token params', () => {
    expect(sanitizeIntendedPath('/subscription?plan=1&token_hash=secret#token_hash=secret')).toBe('/subscription?plan=1')
  })
})

describe('getIntendedPath', () => {
  test('reads the saved page', () => {
    expect(getIntendedPath({ from: '/subscription' })).toBe('/subscription')
  })

  test.each([null, undefined, {}, { from: 'https://evil.com' }])('falls back to / for %j', (state) => {
    expect(getIntendedPath(state)).toBe('/')
  })
})

describe('toIntendedState', () => {
  test('saves an internal page only', () => {
    expect(toIntendedState('/subscription')).toEqual({ from: '/subscription' })
    expect(toIntendedState('/')).toBeNull()
    expect(toIntendedState('//evil.com')).toBeNull()
  })
})
