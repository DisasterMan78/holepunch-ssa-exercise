import { ApiError } from "../../error";
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

type ReservationsResponse = ReservationData[] | ApiError;

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
  const resourceResponse = await FetchApiOnClient(resourceIdURL, 'GET', undefined);

  if (Object.keys(resourceResponse).length === 0) {
    errorResponseResourceId(reservationResponse.resourceId)
  }

  const { localStartsAt, localEndsAt, durationMinutes } = calculateReservationTimes(reservationResponse.startsAt, reservationResponse.endsAt, payload.timezone, resourceResponse.timezone);

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

  let reservationListURL = reservationsAPIURL;

  if (payload.resourceId) {
    reservationListURL += `?resourceId=${payload.resourceId}`
  }

  const reservationsResponse:ReservationsResponse = await FetchApiOnClient(reservationListURL, 'GET');
  console.log("🚀 ~ getReservationsList ~ reservationsResponse:", reservationsResponse)

  if ((reservationsResponse as ApiError).error) { return upstreamErrorResponse(reservationsResponse) }

  const reservationsArray = reservationsResponse as ReservationData[]

  for (const reservationItem of reservationsArray) {

    // Just assuming reservation items are correctly formed - should do a check to ensure resourceId is present and is a number
    const resourceIdURL = `${catalogAPIURL}${reservationItem.resourceId}`;
    const resourceResponse = await FetchApiOnClient(resourceIdURL, 'GET', undefined);

    if (Object.keys(resourceResponse).length === 0) {
      errorResponseResourceId(reservationItem.resourceId)
    }

    const { localStartsAt, localEndsAt, durationMinutes } = calculateReservationTimes(reservationItem.startsAt, reservationItem.endsAt, payload.timezone, resourceResponse.timezone);

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

  if (payload.paginationSize) {
    if (!payload.page) {
      payload.page = 0;
    }
    const startIndex = parseInt(payload.page) * parseInt(payload.paginationSize);
    const endIndex = startIndex + parseInt(payload.paginationSize);

    hydratedReservationsData = hydratedReservationsData.slice(startIndex, endIndex)
  }

  return new Response(JSON.stringify({
    ...hydratedReservationsData,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}


export const addReservation = async (payload) => {
  let addReservationURL = `${reservationsAPIURL}/add/`;

  const addReservationResponse = await FetchApiOnClient(addReservationURL, 'POST', payload);

  if (addReservationResponse.error) { return upstreamErrorResponse(addReservationResponse) }

  return new Response(JSON.stringify({
    ...addReservationResponse,
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}


const calculateReservationTimes = (start, end, localTimezone, resourceTimezone) => {
  return {
  localStartsAt: localiseDatetime(start, localTimezone, resourceTimezone),
  localEndsAt: localiseDatetime(end, localTimezone, resourceTimezone),
  durationMinutes: dateDiffInMins(start, end)
  }
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


const upstreamErrorResponse = (errorResponse) => new Response(JSON.stringify({
    error: errorResponse.error,
    errorMessage: `Upstream error: ${errorResponse.errorMessage}`
  }), {
    status: errorResponse.error,
    headers: { 'Content-Type': 'application/json' }
  });


export const noBodyErrorResponse = () => new Response(JSON.stringify({
    error: 400,
    errorMessage: 'Invalid request body - request body not present or empty'
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });


export const noPayloadErrorResponse = () => new Response(JSON.stringify({
    error: 400,
    errorMessage: 'Invalid request body - payload contains no data'
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
});

export const noTimezoneErrorResponse = () => new Response(JSON.stringify({
    error: 400,
    errorMessage: 'Invalid request body - no timezone identifier received'
  }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });