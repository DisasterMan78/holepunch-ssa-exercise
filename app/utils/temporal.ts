import { CalendarDate } from '@internationalized/date';

export type CalculatedReservationTimes = {
  localStartsAt: string,
  localEndsAt: string,
  durationMinutes: number,
}

const intlDateTimeOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  second: "2-digit",
  fractionalSecondDigits: undefined,
  timeZone: "UTC",
  timeZoneName: "longOffset",
};

export const calculateReservationTimes = (start: Date, end: Date, localTimezone: string): CalculatedReservationTimes => ({
  localStartsAt: localiseUTCDatetime(start, localTimezone).toISOString().replace('.000Z', 'Z'),
  localEndsAt: localiseUTCDatetime(end, localTimezone).toISOString().replace('.000Z', 'Z'),
  durationMinutes: dateDiffInMins(start, end)
});

export const localiseUTCDatetime = (datetime: Date, localTimezone: string) => {
  intlDateTimeOptions.timeZone = localTimezone;

  const formatter = new Intl.DateTimeFormat('UTC', intlDateTimeOptions);

  return new Date(formatter.format(datetime));
}

export const dateDiffInMins = (startDate, endDate) => Math.abs(new Date(startDate).getTime() - new Date(endDate).getTime()) / 1000 / 60;