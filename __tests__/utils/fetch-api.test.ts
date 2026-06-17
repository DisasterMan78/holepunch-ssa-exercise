import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'

import { FetchApiOnClient } from '../../app/utils/fetch-api'

import { server, testSchedulingAPIURL, testAPIResponse } from '../../mocks/msw.mock';

describe('api fetch tests', () => {
  it('receives data from API on success', async () => {
    const result = await FetchApiOnClient(testSchedulingAPIURL, 'POST', {})

    expect(result).toEqual(testAPIResponse)
  })

  it('handles server error', async () => {
    server.use(
      http.post(testSchedulingAPIURL, () => {
        return new HttpResponse(null, {status: 500})
      }),
    )

    await FetchApiOnClient(testSchedulingAPIURL, 'POST', {})
      .catch(error => {
        expect(error.message).toEqual('Failed to fetch data: 500 - Internal Server Error')
      })
  })

  it('handles malformed JSON in response body', async () => {
    server.use(
      http.post(testSchedulingAPIURL, () => {
        return new HttpResponse(`{
          this: 'aint',
          JSON:
        }`, {status: 200})
      }),
    )

    await FetchApiOnClient(testSchedulingAPIURL, 'POST', {})
      .catch(error => {
        expect(error.message).toEqual('The server responded with malformed JSON')
      })
  })
})
