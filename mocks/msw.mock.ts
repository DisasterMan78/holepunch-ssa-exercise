import { afterAll, afterEach, beforeAll } from 'vitest'

import { http, HttpResponse, passthrough } from 'msw'
import { setupServer } from "msw/node";

export const testSchedulingAPIURL = 'http://localhost:3000/api/scheduling/'
export const testSchedulingListAPIURL = `${testSchedulingAPIURL}list/`
export const testCatalogAPIURL = 'http://localhost:4040/'
export const testCatalogAPIgetURL = `${testCatalogAPIURL}:id`
export const testReservationAPIURL = 'http://localhost:5050/'
export const testReservationAPIgetURL = `${testReservationAPIURL}:id`

export const testAPIResponse = {
  unbuiltAPI: true,
}

export const server = setupServer(
  http.post(testSchedulingAPIURL, async () => HttpResponse.json(testAPIResponse)),
  http.get(testReservationAPIURL, ({ request }) => passthrough()),
  http.get(testReservationAPIgetURL, ({ request }) => passthrough()),
  http.get(testCatalogAPIgetURL, ({ request }) => passthrough()),
)

beforeAll(() => server.listen({
  onUnhandledRequest: (req) => console.error(`No handler for ${req.url}`),
}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
