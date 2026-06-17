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
  timeZone: "UTC"
};

export const calculateReservationTimes = (start: Date, end: Date, localTimezone: string, resourceTimezone: string): CalculatedReservationTimes => ({
  localStartsAt: localiseDatetime(start, localTimezone, resourceTimezone),
  localEndsAt: localiseDatetime(end, localTimezone, resourceTimezone),
  durationMinutes: dateDiffInMins(start, end)
})

export const localiseDatetime = (datetime: Date, localTimezone: string, resourceTimezone: string) => {
  // console.log("🚀 ~ localiseDatetime ~ datetime, localTimezone, resourceTimezone:", datetime, localTimezone, resourceTimezone)
  intlDateTimeOptions.timeZone = localTimezone;

  const formatter = new Intl.DateTimeFormat('en-GB', intlDateTimeOptions)
  const originalDate = new Date(datetime.toLocaleString('en-GB', {timeZone: resourceTimezone}))

  return new Date(formatter.format(originalDate))
}

export const dateDiffInMins = (startDate, endDate) => Math.abs(new Date(startDate).getTime() - new Date(endDate).getTime()) / 1000 / 60;
