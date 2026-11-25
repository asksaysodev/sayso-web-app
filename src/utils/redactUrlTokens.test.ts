import { expect, test } from 'vitest'
import { redactUrlTokens } from './redactUrlTokens'

test('masks every auth token and keeps the rest', () => {
  expect(redactUrlTokens('https://x.com/subscription?plan=1#token_hash=secret')).toBe('https://x.com/subscription?plan=1#token_hash=[redacted]')
  expect(redactUrlTokens('/#access_token=a&type=recovery&refresh_token=b')).toBe('/#access_token=[redacted]&type=recovery&refresh_token=[redacted]')
  expect(redactUrlTokens('/settings?tab=subscription')).toBe('/settings?tab=subscription')
})
