import type { ReservationRequest } from "../route";

import { NextRequest } from "next/server";
import {
  getSingleReservation,
  noBodyErrorResponse,
  noPayloadErrorResponse,
  deleteReservation
} from "../handlers";

export const POST = async (request: NextRequest) => {
  console.log("🚀 ~ DELETE - POST ~ request:", request)
  if(!request.body || (request.body.constructor === Object && Object.keys(request.body).length === 0)) {
    return noBodyErrorResponse()
  }

  const payload: ReservationRequest = await request.json();

  if (!payload || Object.keys(payload).length === 0) {
    return noPayloadErrorResponse();
  }

  // Seems to be a bug with Next API paths
  // this should be caught by `app/api/scheduling/route.ts`
  // not `app/api/scheduling/add/route.ts`
  // Tho realistically I've probably done something stupid somewhere...
  if (request.url === 'http://localhost:3000/api/scheduling/') {
    return getSingleReservation(payload)
  }

  return deleteReservation(payload);
}