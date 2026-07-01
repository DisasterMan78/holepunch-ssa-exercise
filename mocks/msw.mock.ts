import { afterAll, afterEach, beforeAll } from 'vitest'

import { http, HttpResponse, passthrough } from 'msw'
import { setupServer } from "msw/node";

export const testSchedulingAPIURL = 'http://localhost:3000/api/scheduling/'
export const testSchedulingListAPIURL = `${testSchedulingAPIURL}list/`
export const testSchedulingAddAPIURL = `${testSchedulingAPIURL}add/`
export const testSchedulingReplaceAPIURL = `${testSchedulingAPIURL}replace/`
export const testSchedulingPatchAPIURL = `${testSchedulingAPIURL}patch/`
export const testSchedulingDeleteAPIURL = `${testSchedulingAPIURL}delete/`

export const testCatalogAPIURL = 'http://localhost:4040/'
export const testCatalogAPIgetURL = `${testCatalogAPIURL}:id`

export const testReservationAPIURL = 'http://localhost:5050/'
export const testReservationAPIgetURL = `${testReservationAPIURL}:id`
export const testReservationAPIputURL = testReservationAPIgetURL
export const testReservationAPIpatchURL = testReservationAPIgetURL
export const testReservationAPIdeleteURL = testReservationAPIgetURL

export const testAPIResponse = {
  unbuiltAPI: true,
}

export const server = setupServer(
  http.post(testSchedulingAPIURL, async () => HttpResponse.json(testAPIResponse)),
  http.post(testSchedulingAddAPIURL, ({ request }) => passthrough()),
  http.post(testSchedulingReplaceAPIURL, ({ request }) => passthrough()),
  http.post(testSchedulingPatchAPIURL, ({ request }) => passthrough()),
  http.post(testSchedulingDeleteAPIURL, ({ request }) => passthrough()),

  http.post(testReservationAPIURL, ({ request }) => passthrough()),
  http.get(testReservationAPIURL, ({ request }) => passthrough()),
  http.get(testReservationAPIgetURL, ({ request }) => passthrough()),
  http.put(testReservationAPIputURL, ({ request }) => passthrough()),
  http.patch(testReservationAPIpatchURL, ({ request }) => passthrough()),
  http.delete(testReservationAPIdeleteURL, ({ request }) => passthrough()),

  http.get(testCatalogAPIgetURL, ({ request }) => passthrough()),
)

beforeAll(() => server.listen({
  onUnhandledRequest: (req) => console.error(`No handler for ${req.method}: ${req.url}`),
}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
