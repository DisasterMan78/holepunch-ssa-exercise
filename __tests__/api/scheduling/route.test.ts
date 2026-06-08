import { describe, expect, it } from 'vitest'

import { NextRequest } from 'next/server'

import { POST } from '../../../app/api/scheduling/route'
import { testShedulingAPIURL } from '../../../mocks/msw.mock'

describe('POST - scheduling-api', () => {

  it('should respond to a properly formed request', async () => {
    const request = new NextRequest(new Request(testShedulingAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: 1,
        timezone: 'Europe/Istanbul'
      })
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(200)
    expect(contentType).toEqual('application/json')
    expect(json).toBeTruthy()
  })

  it('should read a single reservation in hydrated form - POST {reservationId=}', async () => {
    const reservationId = 1
    const request = new NextRequest(new Request(`${testShedulingAPIURL}`, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: 1,
        timezone: 'Europe/Istanbul'
      })
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(200)
    expect(contentType).toEqual('application/json')
    expect(json).toEqual({
      id: 1,
      resourceId: 1,
      holder: 'alice@example.com',
      startsAt: '2026-06-01T09:00:00Z',
      endsAt: '2026-06-01T10:00:00Z',
      resource: {
        id: 1,
        name: 'Conference Room A',
        kind: 'room',
        capacity: 8,
        timezone: 'Europe/Lisbon'
      },
      "localEndsAt": "2026-01-06T11:00:00.000Z",
      "localStartsAt": "2026-01-06T10:00:00.000Z",
      durationMinutes: 60
    })
  })
})