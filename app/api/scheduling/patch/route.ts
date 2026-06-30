import type { ReservationRequest } from "../route";

import { NextRequest } from "next/server";
import { replaceReservation, getSingleReservation, noBodyErrorResponse, noPayloadErrorResponse, noTimezoneErrorResponse, patchReservation } from "../handlers";

export const POST = async (request: NextRequest) => {

  if(!request.body || (request.body.constructor === Object && Object.keys(request.body).length === 0)) {
    return noBodyErrorResponse()
  }

  const payload: ReservationRequest = await request.json();

  if (!payload || Object.keys(payload).length === 0) {
    return noPayloadErrorResponse();
  }

  if (!payload.timezone) {
    return noTimezoneErrorResponse();
  }

  // Seems to be a bug with Next API paths
  // this should be caught by `app/api/scheduling/route.ts`
  // not `app/api/scheduling/add/route.ts`
  // Tho realistically I've probably done something stupid somewhere...
  if (request.url === 'http://localhost:3000/api/scheduling/') {
    return getSingleReservation(payload)
  }

  return patchReservation(payload);
}