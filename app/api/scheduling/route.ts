import { NextRequest } from "next/server";

import { getSingleReservation } from "./handlers";

type ReservationRequest = {
  reservationId: number,
  timezone: string,
}

export const POST = async (request: NextRequest) => {

  if(!request.body || (request.body.constructor === Object && Object.keys(request.body).length === 0)) {
    return new Response(JSON.stringify({
      error: 400,
      errorMessage: 'Invalid request body - request body not present or empty'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const payload: ReservationRequest = await request.json();

  if (!payload || Object.keys(payload).length === 0) {
    return new Response(JSON.stringify({
      error: 400,
      errorMessage: 'Invalid request body - payload contains no data'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!payload.timezone) {
    return new Response(JSON.stringify({
      error: 400,
      errorMessage: 'Invalid request body - no timezone identifier received'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const requestURL = new URL(request.url)

  if (requestURL.pathname === '/api/scheduling') {
    return getSingleReservation(payload);
  }
}