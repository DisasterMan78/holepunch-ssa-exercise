import { describe, expect, it } from 'vitest'

import { NextRequest } from 'next/server'

import { POST } from '../../../app/api/scheduling/route'
import { testShedulingAPIURL, testShedulingListAPIURL } from '../../../mocks/msw.mock'

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


  it('should return 400 if the JSON is not present', async () => {
    const request = new NextRequest(new Request(testShedulingAPIURL, {
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
    const request = new NextRequest(new Request(testShedulingAPIURL, {
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
    const request = new NextRequest(new Request(testShedulingAPIURL, {
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

  it('should read a single reservation in hydrated form and provide correctly adjusted local start and end times - POST {reservationId=}', async () => {
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
      localStartsAt: "2026-01-06T12:00:00.000Z",
      localEndsAt: "2026-01-06T13:00:00.000Z",
      durationMinutes: 60
    })
  })

  it('should list all reservations in hydrated form - POST /list', async () => {
    const request = new NextRequest(new Request(`${testShedulingListAPIURL}`, {
      method: 'POST',
      body: JSON.stringify({
        timezone: 'Europe/Istanbul'
      })
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(200)
    expect(contentType).toEqual('application/json')
    expect(json).toEqual({
      0: {
        durationMinutes: 60,
        endsAt: "2026-06-01T10:00:00Z",
        holder: "alice@example.com",
        id: 1,
        localEndsAt: "2026-01-06T13:00:00.000Z",
        localStartsAt: "2026-01-06T12:00:00.000Z",
        resource: {
          capacity: 8,
          id: 1,
          kind: "room",
          name: "Conference Room A",
          timezone: "Europe/Lisbon",
        },
        resourceId: 1,
        startsAt: "2026-06-01T09:00:00Z",
      },
      1: {
        durationMinutes: 60,
        endsAt: "2026-06-01T12:00:00Z",
        holder: "bob@example.com",
        id: 2,
        localEndsAt: "2026-01-06T15:00:00.000Z",
        localStartsAt: "2026-01-06T14:00:00.000Z",
        resource: {
          capacity: 8,
          id: 1,
          kind: "room",
          name: "Conference Room A",
          timezone: "Europe/Lisbon",
        },
        resourceId: 1,
        startsAt: "2026-06-01T11:00:00Z",
      },
      2: {
        durationMinutes: 120,
        endsAt: "2026-06-02T16:00:00Z",
        holder: "carol@example.com",
        id: 3,
        localEndsAt: "2026-02-06T19:00:00.000Z",
        localStartsAt: "2026-02-06T17:00:00.000Z",
        resource: {
          capacity: 1,
          id: 2,
          kind: "gpu",
          name: "GPU Workstation 1",
          timezone: "UTC",
        },
        resourceId: 2,
        startsAt: "2026-06-02T14:00:00Z",
      },
      3: {
        durationMinutes: 540,
        endsAt: "2026-06-03T17:00:00Z",
        holder: "dave@example.com",
        id: 4,
        localEndsAt: "2026-03-06T20:00:00.000Z",
        localStartsAt: "2026-03-06T11:00:00.000Z",
        resource: {
          capacity: 9,
          id: 3,
          kind: "vehicle",
          name: "Van #4",
          timezone: "America/New_York",
        },
        resourceId: 3,
        startsAt: "2026-06-03T08:00:00Z",
      },
      4: {
        durationMinutes: 60,
        endsAt: "2026-06-04T14:00:00Z",
        holder: "erin@example.com",
        id: 5,
        localEndsAt: "2026-04-06T16:00:00.000Z",
        localStartsAt: "2026-04-06T15:00:00.000Z",
        resource: {
          capacity: 12,
          id: 5,
          kind: "room",
          name: "Conference Room B",
          timezone: "Europe/Lisbon",
        },
        resourceId: 5,
        startsAt: "2026-06-04T13:00:00Z",
      },
    })
  })
})