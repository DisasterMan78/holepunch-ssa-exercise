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

export const localiseDatetime = (localTimezone, datetime) => {
  intlDateTimeOptions.timeZone = localTimezone;

  const formatter = new Intl.DateTimeFormat('en-GB', intlDateTimeOptions)
  const originalDate = new Date(datetime)

  return new Date(formatter.format(originalDate))
}

export const dateDiffInMins = (startDate, endDate) => Math.abs(new Date(startDate).getTime() - new Date(endDate).getTime()) / 1000 / 60;