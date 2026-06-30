import { describe, expect, it } from 'vitest'

import { NextRequest } from 'next/server'

import { POST } from '../../../../app/api/scheduling/patch/route'
import { testSchedulingPatchAPIURL, testSchedulingAPIURL } from '../../../../mocks/msw.mock'


describe('POST - scheduling-api - patch', () => {

  it('should return 400 if the JSON is not present', async () => {
    const request = new NextRequest(new Request(testSchedulingPatchAPIURL, {
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
    const request = new NextRequest(new Request(testSchedulingPatchAPIURL, {
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


  it('should patch a reservation POST /scheduling/patch/', async () => {
    const request = new NextRequest(new Request(testSchedulingPatchAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: 1,
        timezone: "Europe/London",
        holder: "dmbenson1978@gmail.com",
        resourceId: 5,
        startsAt: "2026-06-30T11:05:00Z",
        endsAt: "2026-06-30T14:03:00Z"
      })
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(200)
    expect(contentType).toEqual('application/json')

    expect(json).toEqual({
      endsAt: "2026-06-30T14:03:00Z",
      holder: "dmbenson1978@gmail.com",
      id: 1,
      resourceId: 5,
      startsAt: "2026-06-30T11:05:00Z",
    })
  })


  it('should read a patched reservation - POST /scheduling/:id', async () => {

    const readRequest = new NextRequest(new Request(testSchedulingAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: 1,
        timezone: 'Antarctica/Davis'
      })
    }))
    const readResponse = await POST(readRequest)
    const readJson = await readResponse.json();

    expect(readJson).toEqual({
      id: 1,
      resourceId: 5,
      holder: 'dmbenson1978@gmail.com',
      startsAt: '2026-06-30T11:05:00Z',
      endsAt: '2026-06-30T14:03:00Z',
      resource: {
        id: 5,
        name: 'Conference Room B',
        kind: 'room',
        capacity: 12,
        timezone: 'Europe/Lisbon'
      },
      localStartsAt: '2026-06-30T11:05:00Z',
      localEndsAt: '2026-06-30T14:03:00Z',
      durationMinutes: 178
    })
  })

  it('should reset record 1 so other tests don\'t break', async () => {
    const request = new NextRequest(new Request(testSchedulingPatchAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: 1,
        timezone: "Europe/London",
        holder: "alice@example.com",
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
      resourceId: 5,
      startsAt: "2026-06-30T11:05:00Z",
    })
  })
})
