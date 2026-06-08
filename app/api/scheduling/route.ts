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

  const payload:ReservationRequest = await request.json();

  let reservationData: ReservationData;
  let hydratedReservationData: HydratedReservationData;

  if (!payload) {
    return new Response(JSON.stringify({ error: 'Invalid request body'}), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!payload.reservationId) {
  }
  const reservationIdURL = `${reservationsAPIURL}${payload.reservationId}`;

  const response = await FetchApiOnClient(reservationIdURL, 'GET');

  reservationData = {
    id: response.id,
    resourceId: response.resourceId,
    holder: response.holder,
    startsAt: response.startsAt,
    endsAt: response.endsAt
  }

  if (reservationData.resourceId) {
    const resourceIdURL = `${catalogAPIURL}${reservationData.resourceId}`;
    const response = await FetchApiOnClient(resourceIdURL, 'GET');
    const resourceData:ResourceData = {
      id: response.id,
      name: response.name,
      kind: response.kind,
      capacity: response.capacity,
      timezone: response.timezone,
    }

    intlDateTimeOptions.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
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
    console.log("🚀 ~ POST ~ hydratedReservationData:", hydratedReservationData)
  }

  return new Response(JSON.stringify({
    ...hydratedReservationData,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
