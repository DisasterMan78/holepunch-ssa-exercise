import { NextRequest } from "next/server";
import { addReservation, getReservationsList, noBodyErrorResponse, noPayloadErrorResponse, noTimezoneErrorResponse } from "../handlers";

type ReservationRequest = {
  reservationId: number,
  timezone: string,
}

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

  return addReservation(payload);
}