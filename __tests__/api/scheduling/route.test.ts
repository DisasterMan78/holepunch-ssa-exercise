import { describe, expect, it } from 'vitest'

import { NextRequest } from 'next/server'

import { POST } from '../../../app/api/scheduling/route'
import { testSchedulingAPIURL } from '../../../mocks/msw.mock'

describe('POST - scheduling-api', () => {

  it('should respond to a properly formed request', async () => {
    const request = new NextRequest(new Request(testSchedulingAPIURL, {
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


  it('should return 400 if the JSON is not present', async () => {
    const request = new NextRequest(new Request(testSchedulingAPIURL, {
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
    const request = new NextRequest(new Request(testSchedulingAPIURL, {
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

  it('returns 500 if the reservation API has an internal error', async () => {
    const request = new NextRequest(new Request(testSchedulingAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: 7,
        timezone: 'Europe/Istanbul'})
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(500)
    expect(contentType).toEqual('application/json')
    expect(json.errorMessage).toEqual('Upstream error: Internal Server Error')
  })

  it('returns 500 if the reservation API returns a malformed response', async () => {
    const request = new NextRequest(new Request(testSchedulingAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: 6,
        timezone: 'Europe/Istanbul'})
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(500)
    expect(contentType).toEqual('application/json')
    expect(json.errorMessage).toEqual('Upstream error: The server responded with malformed JSON')
  })

  it('should read a single reservation in hydrated form and provide correctly adjusted local start and end times - POST /scheduling/', async () => {
    const request = new NextRequest(new Request(testSchedulingAPIURL, {
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
      localStartsAt: "2026-06-01T09:00:00Z",
      localEndsAt: "2026-06-01T10:00:00Z",
      durationMinutes: 60
    })
  })
})