import { describe, expect, test } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import shouldRetryQuery from './shouldRetryQuery'

const httpError = (status: number) =>
  new AxiosError('request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    status, statusText: '', data: null, headers: {}, config: { headers: new AxiosHeaders() },
  })

describe('shouldRetryQuery', () => {
  test('never retries a 4xx: the request itself is wrong', () => {
    for (const status of [400, 401, 403, 404, 422, 429]) {
      expect(shouldRetryQuery(0, httpError(status))).toBe(false)
    }
  })

  test('retries a 5xx or a network error up to 3 times', () => {
    for (const error of [httpError(500), httpError(503), new AxiosError('Network Error', 'ERR_NETWORK'), new Error('boom')]) {
      expect(shouldRetryQuery(0, error)).toBe(true)
      expect(shouldRetryQuery(2, error)).toBe(true)
      expect(shouldRetryQuery(3, error)).toBe(false)
    }
  })
})
