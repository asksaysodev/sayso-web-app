import { describe, expect, test } from 'vitest'
import { isSessionExpiredError, markSessionExpired } from './sessionExpired'
import { isSuspendedTabTimeoutError, markSuspendedTabTimeout } from './suspendedTabTimeout'
import { isLockAcquireTimeoutError } from './lockTimeout'

// Sentry's beforeSend drops errors these helpers flag, so a false positive hides a real bug.
describe.each([
  ['session expired', markSessionExpired, isSessionExpiredError],
  ['suspended tab timeout', markSuspendedTabTimeout, isSuspendedTabTimeoutError],
])('%s flag', (_name, mark, isFlagged) => {
  test('is true only after the error is marked', () => {
    const error = new Error('boom')
    expect(isFlagged(error)).toBe(false)
    mark(error)
    expect(isFlagged(error)).toBe(true)
  })

  test('ignores values that are not objects', () => {
    for (const value of [undefined, null, 'boom', 42]) {
      expect(() => mark(value)).not.toThrow()
      expect(isFlagged(value)).toBe(false)
    }
  })
})

describe('isLockAcquireTimeoutError', () => {
  test('is true for an auth-js lock timeout', () => {
    expect(isLockAcquireTimeoutError(Object.assign(new Error('Acquiring process lock'), { isAcquireTimeout: true }))).toBe(true)
  })

  test('is false without the isAcquireTimeout flag, whatever the message', () => {
    expect(isLockAcquireTimeoutError(new Error('Acquiring process lock with name "lock:sayso-auth" timed out'))).toBe(false)
    expect(isLockAcquireTimeoutError({ isAcquireTimeout: 'true' })).toBe(false)
    expect(isLockAcquireTimeoutError(null)).toBe(false)
  })
})
