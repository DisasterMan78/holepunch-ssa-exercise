import { describe, expect, it } from 'vitest'

import { NextRequest } from 'next/server'

import { GET, POST } from '../../../app/api/scheduling/route'
import { testShedulingAPIURL } from '../../../mocks/msw.mock'

describe('POST - scheduling-api', () => {

  it('should respond to a request', async () => {
    const request = new NextRequest(new Request(testShedulingAPIURL, {
      method: 'POST',
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(200)
    expect(contentType).toEqual('application/json')
    expect(json.unbuiltAPI).toEqual(true)
  })

  it('should read a single reservation in hydrated form - GET /?reservation={id}', async () => {
    const reservationId = 1
    const request = new NextRequest(new Request(`${testShedulingAPIURL}?reservation=${reservationId}`, {
      method: 'GET',
    }))
    const response = await GET(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(200)
    expect(contentType).toEqual('application/json')
    expect(json.resourceId).toEqual(1)
  })

})