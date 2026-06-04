import { afterAll, afterEach, beforeAll } from 'vitest'

import { http, HttpResponse } from 'msw'
import { setupServer } from "msw/node";

export const testShedulingAPIURL = 'http://localhost:3000/api/scheduling'

export const testAPIResponse = {
}

export const server = setupServer(
  http.post(testShedulingAPIURL, async () => HttpResponse.json(testAPIResponse)),
)

beforeAll(() => server.listen({
  onUnhandledRequest: (req) => console.error(`No handler for ${req.url}`),
}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
