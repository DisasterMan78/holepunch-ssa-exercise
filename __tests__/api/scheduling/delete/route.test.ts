import { describe, expect, it } from 'vitest'

import { NextRequest } from 'next/server'

import { POST } from '../../../../app/api/scheduling/patch/route'
import { testSchedulingDeleteAPIURL, testSchedulingAPIURL, testSchedulingAddAPIURL } from '../../../../mocks/msw.mock'


describe('POST - scheduling-api - delete', () => {

  it('should return 400 if the JSON is not present', async () => {
    const request = new NextRequest(new Request(testSchedulingDeleteAPIURL, {
      method: 'POST',
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(400)
    expect(contentType).toEqual('application/json')
    expect(json.errorMessage).toEqual('Invalid request body - request body not present or empty')
  })


  it('should return 400 if the payload is not present', async () => {
    const request = new NextRequest(new Request(testSchedulingDeleteAPIURL, {
      method: 'POST',
      body: JSON.stringify({})
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(400)
    expect(contentType).toEqual('application/json')
    expect(json.errorMessage).toEqual('Invalid request body - payload contains no data')
  })


  it('should delete a reservation POST /scheduling/delete/', async () => {
    const request = new NextRequest(new Request(testSchedulingDeleteAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: 1,
      })
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(204)
  })


  it('should fail to read a deleted reservation - POST /scheduling/:id', async () => {

    const readRequest = new NextRequest(new Request(testSchedulingAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: 1,
        timezone: 'Antarctica/Davis'
      })
    }))
    const readResponse = await POST(readRequest)

    expect(readResponse.status).toEqual(404)
  })

  it('should reset deleted record 1 so other tests don\'t break', async () => {
    const request = new NextRequest(new Request(testSchedulingAddAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        resourceId: 1,
        holder: 'alice@example.com',
        startsAt: '2026-06-01T09:00:00Z',
        endsAt: '2026-06-01T10:00:00Z',
        timezone: "Europe/London",
      })
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(200)
    expect(contentType).toEqual('application/json')
    expect(json).toEqual({
      endsAt: "2026-06-30T14:03:00Z",
      holder: "alice@example.com",
      id: 1,
      resourceId: 1,
      startsAt: "2026-06-30T11:05:00Z",
    })
  })
})
