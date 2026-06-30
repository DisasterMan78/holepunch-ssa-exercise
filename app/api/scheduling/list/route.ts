import type { ReservationRequest } from "../route";

import { NextRequest } from "next/server";
import { getReservationsList, noBodyErrorResponse, noPayloadErrorResponse, noTimezoneErrorResponse } from "../handlers";

export const POST = async (request: NextRequest) => {

  if(!request.body || (request.body.constructor === Object && Object.keys(request.body).length === 0)) {
    return noBodyErrorResponse();
  }

  const payload: ReservationRequest = await request.json();

  if (!payload || Object.keys(payload).length === 0) {
    return noPayloadErrorResponse();
  }

  if (!payload.timezone) {
    return noTimezoneErrorResponse();
  }

  return getReservationsList(payload);
}