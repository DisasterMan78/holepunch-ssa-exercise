export type CalculatedReservationTimes = {
  localStartsAt: Date,
  localEndsAt: Date,
  durationMinutes: number,
}

const intlDateTimeOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  fractionalSecondDigits: 2,
  timeZone: "UTC",
  timeZoneName: "longOffset",
};

export const calculateReservationTimes = (start: Date, end: Date, localTimezone: string,): CalculatedReservationTimes => ({
  localStartsAt: localiseUTCDatetime(start, localTimezone),
  localEndsAt: localiseUTCDatetime(end, localTimezone),
  durationMinutes: dateDiffInMins(start, end)
})

export const localiseUTCDatetime = (datetime: Date, localTimezone: string) => {
  intlDateTimeOptions.timeZone = localTimezone;

  const formatter = new Intl.DateTimeFormat('UTC', intlDateTimeOptions)

  return new Date(formatter.format(datetime))
}

export const dateDiffInMins = (startDate, endDate) => Math.abs(new Date(startDate).getTime() - new Date(endDate).getTime()) / 1000 / 60;
