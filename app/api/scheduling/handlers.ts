import { FetchApiOnClient } from "../../utils/fetch-api";
import { dateDiffInMins, localiseDatetime } from "../../utils/temporal";

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
  holder: string, // Ideally a valid email type, but hard to do accurately. Arguably even basic email validation should happen as part of data sanitation, so a type is unnecessary. I'd probably use Regex for both, cos I'm sick like that
  startsAt: Date,
  endsAt:   Date,
}

type ComputedReservationData = {
  localStartsAt: Date,
  localEndsAt:   Date,
  durationMinutes: Number,
}

export type HydratedReservationData = null | ReservationData & ComputedReservationData & { resource: ResourceData }

const catalogAPIURL = 'http://localhost:4040/';
const reservationsAPIURL = 'http://localhost:5050/';

export const getSingleReservation = async (payload) => {

  if (!payload.reservationId) {
    return new Response(JSON.stringify({
      error: 400,
      errorMessage: 'Invalid request body - no reservationId received'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let hydratedReservationData: HydratedReservationData;

  const reservationIdURL = `${reservationsAPIURL}${payload.reservationId}`;

  const reservationResponse = await FetchApiOnClient(reservationIdURL, 'GET');

  if (reservationResponse.error) { return upstreamErrorResponse(reservationResponse) }

  // Just assuming reservation items are correctly formed - should do a check to ensure resourceId is present and is a number
  const resourceIdURL = `${catalogAPIURL}${reservationResponse.resourceId}`;
  const resourceResponse = await FetchApiOnClient(resourceIdURL, 'GET', null);

  if (Object.keys(resourceResponse).length === 0) {
    errorResponseResourceId(reservationResponse.resourceId)
  }

  const { localStartsAt, localEndsAt, durationMinutes } = calculateReservationTimes(reservationResponse.startsAt, reservationResponse.endsAt, payload.timezone);

  hydratedReservationData = {
    ...reservationResponse,
    resource: {
      ...resourceResponse,
    },
    localStartsAt,
    localEndsAt,
    durationMinutes,
  }

  return new Response(JSON.stringify({
    ...hydratedReservationData,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}



export const getReservationsList = async (payload) => {

  let hydratedReservationsData: HydratedReservationData[] = [];

    const reservationListURL = reservationsAPIURL;

  const reservationsResponse = await FetchApiOnClient(reservationListURL, 'GET');

  if (reservationsResponse.error) { return upstreamErrorResponse(reservationsResponse) }

  for (const reservationItem of reservationsResponse) {

    // Just assuming reservation items are correctly formed - should do a check to ensure resourceId is present and is a number
    const resourceIdURL = `${catalogAPIURL}${reservationItem.resourceId}`;
    const resourceResponse = await FetchApiOnClient(resourceIdURL, 'GET', null);

    if (Object.keys(resourceResponse).length === 0) {
      errorResponseResourceId(reservationItem.resourceId)
    }

    const { localStartsAt, localEndsAt, durationMinutes } = calculateReservationTimes(reservationItem.startsAt, reservationItem.endsAt, payload.timezone);

    const hydratedItem: HydratedReservationData = {
      ...reservationItem,
      resource: {
        ...resourceResponse,
      },
      localStartsAt,
      localEndsAt,
      durationMinutes,
    }

    hydratedReservationsData.push(hydratedItem);
  };

  return new Response(JSON.stringify({
    ...hydratedReservationsData,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

const errorResponseResourceId = (id) => {
  return new Response(JSON.stringify({
    name: 500,
    error: `Server error - no resource with id ${id}`
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}

const calculateReservationTimes = (start, end, timezone) => {
  return {
  localStartsAt: localiseDatetime(timezone, start),
  localEndsAt: localiseDatetime(timezone, end),
  durationMinutes: dateDiffInMins(start, end)
  }
}

const upstreamErrorResponse = (errorResponse) => new Response(JSON.stringify({
    error: errorResponse.error,
    errorMessage: `Upstream error: ${errorResponse.errorMessage}`
  }), {
    status: errorResponse.error,
    headers: { 'Content-Type': 'application/json' }
  });