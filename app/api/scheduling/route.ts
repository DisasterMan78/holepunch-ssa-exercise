import { NextRequest } from "next/server";

import { FetchApiOnClient } from "../../utils/fetch-api";

type ReservationRequest = {
  reservationId: number,
  timezone: string,
}

type ResourceData = null | {
  id: number,
  name: string
  kind: string,
  capacity: number,
  timezone: string, // Ideally a union type of all valid timezone strings - suggest only allowing canonical timezone names for simplicity
}

type ReservationData = {
  id: number,
  resourceId: number,
  holder: string, // Ideally a valid email type, but hard to do accurately. Arguably email validation should happen as part of data sanitation, so a type is unnecessary. I'd probably use Regex for both, cos I'm sick like that
  startsAt: Date,
  endsAt:   Date,
}

type ComputedReservationData = {
  localStartsAt: Date,
  localEndsAt:   Date,
  durationMinutes: Number,
}

type HydratedReservationData = null | ReservationData & ComputedReservationData & { resource: ResourceData}

const catalogAPIURL = 'http://localhost:4040/';
const reservationsAPIURL = 'http://localhost:5050/';

const intlDateTimeOptions:Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  fractionalSecondDigits: 2,
  timeZone: "UTC"
};

export const POST = async (request: NextRequest) => {


  if(!request.body || (request.body.constructor === Object && Object.keys(request.body).length === 0)) {
    return new Response(JSON.stringify({ error: 'Invalid request body - request body not present or empty'}), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const payload: ReservationRequest = await request.json();

  if (!payload || Object.keys(payload).length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid request body - payload contains no data'}), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!payload.reservationId) {
    return new Response(JSON.stringify({ error: 'Invalid request body - no reservationId received'}), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!payload.timezone) {
    return new Response(JSON.stringify({ error: 'Invalid request body - no timezone identifier received'}), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let reservationData: ReservationData;
  let hydratedReservationData: HydratedReservationData;

  const reservationIdURL = `${reservationsAPIURL}${payload.reservationId}`;

  const response = await FetchApiOnClient(reservationIdURL, 'GET');

  if (response.error) {
    return new Response(JSON.stringify({ error: `Upstream error: ${response.errorMessage}`}), {
      status: response.error,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  reservationData = {
    id: response.id,
    resourceId: response.resourceId,
    holder: response.holder,
    startsAt: response.startsAt,
    endsAt: response.endsAt
  }

  if (reservationData.resourceId) {
    const resourceIdURL = `${catalogAPIURL}${reservationData.resourceId}`;
    const resourceResponse = await FetchApiOnClient(resourceIdURL, 'GET', null);

    if (Object.keys(resourceResponse).length === 0) {
      return new Response(JSON.stringify({ error: `Server error - no resource with id ${reservationData.resourceId}`}), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const resourceData:ResourceData = {
      id: resourceResponse.id,
      name: resourceResponse.name,
      kind: resourceResponse.kind,
      capacity: resourceResponse.capacity,
      timezone: resourceResponse.timezone,
    }

    intlDateTimeOptions.timeZone = payload.timezone;
    const formatter = new Intl.DateTimeFormat('en-GB', intlDateTimeOptions)

    const startDate = new Date(reservationData.startsAt)
    const endDate = new Date(reservationData.endsAt)

    const localStartsAt = new Date(formatter.format(startDate))

    const localEndsAt = new Date(formatter.format(endDate))

    const durationMinutes = Math.abs(startDate.getTime() - endDate.getTime()) / 1000 / 60;

    hydratedReservationData = {
      ...reservationData,
      resource: {
        ...resourceData,
      },
      localStartsAt,
      localEndsAt,
      durationMinutes,
    }
  }

  return new Response(JSON.stringify({
    ...hydratedReservationData,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
