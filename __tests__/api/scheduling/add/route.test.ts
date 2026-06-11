import { describe, expect, it } from 'vitest'

import { NextRequest } from 'next/server'

import { POST } from '../../../../app/api/scheduling/add/route'
import { testSchedulingAddAPIURL, testSchedulingAPIURL } from '../../../../mocks/msw.mock'

describe('POST - scheduling-api', () => {

  it('should return 400 if the JSON is not present', async () => {
    const request = new NextRequest(new Request(testSchedulingAddAPIURL, {
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
    const request = new NextRequest(new Request(testSchedulingAddAPIURL, {
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


  it('should add a reservation - POST /scheduling/add/', async () => {
    const request = new NextRequest(new Request(testSchedulingAddAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        timezone: 'Europe/London',
        holder: 'dmbenson1978@gmail.com',
        resourceId: 5,
        startsAt: '2026-06-30T11:05:00.000Z',
        endsAt: '2026-06-30T14:03:00.000Z'
      })
    }))
    const response = await POST(request)
    const contentType = response.headers.get('Content-Type')
    const json = await response.json();

    expect(response.status).toEqual(201)
    expect(contentType).toEqual('application/json')
    expect(json.id).toBeTruthy()
    expect(json.resourceId).toEqual(5)
    expect(json.holder).toEqual('dmbenson1978@gmail.com')
    expect(json.startsAt).toEqual('2026-06-30T11:05:00.000Z')
    expect(json.endsAt).toEqual('2026-06-30T14:03:00.000Z')
  })


  it('should read a created reservation - POST /scheduling/:id', async () => {
    const addRequest = new NextRequest(new Request(testSchedulingAddAPIURL, {
      method: 'POST',
      body: JSON.stringify({
        timezone: 'Antarctica/Davis',
        holder: 'dmbenson1978@gmail.com',
        resourceId: 3,
        startsAt: '2026-06-30T11:05:00.000Z',
        endsAt: '2026-06-30T14:03:00.000Z'
      })
    }))
    const addResponse = await POST(addRequest)
    const addJson = await addResponse.json();

    const readRequest = new NextRequest(new Request(`${testSchedulingAPIURL}`, {
      method: 'POST',
      body: JSON.stringify({
        reservationId: addJson.id,
        timezone: 'Antarctica/Davis'
      })
    }))
    const response = await POST(readRequest)
    const json = await response.json();

    // TO BE CORRECTED (timezone diff is probably off!)
    expect(json).toEqual({
      id: 1,
      resourceId:   1,
      holder: 'dmbenson1978@gmail.com',
        startsAt: '2026-06-30T11:05:00.000Z',
        endsAt: '2026-06-30T14:03:00.000Z',
      resource: {
        id: 3,
        name: 'Van #4',
        kind: 'vehicle',
        capacity: 9,
        timezone: 'America/New_York'
      },
      localStartsAt: '2026-01-30T00:00:00.000Z',
      localEndsAt: '2026-01-30T03:00:00.000Z',
      durationMinutes: 178
    })
  })
})