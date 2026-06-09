import { FetchApiOnClient } from "../../utils/fetch-api";

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

export type HydratedReservationData = null | ReservationData & ComputedReservationData & { resource: ResourceData }

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

  if (reservationResponse.error) {
    return new Response(JSON.stringify({
      error: reservationResponse.error,
      errorMessage: `Upstream error: ${reservationResponse.errorMessage}`
    }), {
      status: reservationResponse.error,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (reservationResponse.resourceId) {
    const resourceIdURL = `${catalogAPIURL}${reservationResponse.resourceId}`;
    const resourceResponse = await FetchApiOnClient(resourceIdURL, 'GET', null);

    if (Object.keys(resourceResponse).length === 0) {
      errorResponseResourceId(reservationResponse.resourceId)
    }

    intlDateTimeOptions.timeZone = payload.timezone;
    const formatter = new Intl.DateTimeFormat('en-GB', intlDateTimeOptions)

    const startDate = new Date(reservationResponse.startsAt)
    const endDate = new Date(reservationResponse.endsAt)

    const localStartsAt = new Date(formatter.format(startDate))

    const localEndsAt = new Date(formatter.format(endDate))

    const durationMinutes = Math.abs(startDate.getTime() - endDate.getTime()) / 1000 / 60;

    hydratedReservationData = {
      ...reservationResponse,
      resource: {
        ...resourceResponse,
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



export const getReservationsList = async (payload) => {

  let hydratedReservationsData: HydratedReservationData[] = [];

    const reservationListURL = reservationsAPIURL;

  const reservationsResponse = await FetchApiOnClient(reservationListURL, 'GET');

  if (reservationsResponse.error) {
    return new Response(JSON.stringify({
      error: reservationsResponse.error,
      errorMessage: `Upstream error: ${reservationsResponse.errorMessage}`
    }), {
      status: reservationsResponse.error,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  for (const reservationItem: ReservationData of reservationsResponse) {

    if (reservationItem.id) {

      const resourceIdURL = `${catalogAPIURL}${reservationItem.resourceId}`;
      const resourceResponse = await FetchApiOnClient(resourceIdURL, 'GET', null);

      if (Object.keys(resourceResponse).length === 0) {
        errorResponseResourceId(reservationItem.resourceId)
      }

      intlDateTimeOptions.timeZone = payload.timezone;
      const formatter = new Intl.DateTimeFormat('en-GB', intlDateTimeOptions)

      const startDate = new Date(reservationItem.startsAt)
      const endDate = new Date(reservationItem.endsAt)

      const localStartsAt = new Date(formatter.format(startDate))
      const localEndsAt = new Date(formatter.format(endDate))

      const durationMinutes = Math.abs(startDate.getTime() - endDate.getTime()) / 1000 / 60;

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
    }
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