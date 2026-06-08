import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'

import { FetchApiOnClient } from '../../app/utils/fetch-api'

import { server, testShedulingAPIURL, testAPIResponse } from '../../mocks/msw.mock';

describe('api fetch tests', () => {
  it('receives data from API on success', async () => {
    const result = await FetchApiOnClient(testShedulingAPIURL, 'POST', {})

    expect(result).toEqual(testAPIResponse)
  })

  it('handles server error', async () => {
    server.use(
      http.post(testShedulingAPIURL, () => {
        return new HttpResponse(null, {status: 500})
      }),
    )

    await FetchApiOnClient(testShedulingAPIURL, 'POST', {})
      .catch(error => {
        expect(error.message).toEqual('Failed to fetch data: 500 - Internal Server Error')
      })
  })
})
