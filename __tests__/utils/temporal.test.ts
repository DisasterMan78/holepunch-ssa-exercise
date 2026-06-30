import { describe, expect, it } from 'vitest'
import { calculateReservationTimes, dateDiffInMins, localiseUTCDatetime } from '../../app/utils/temporal'

describe('temporal manipulation utilities', () => {
  it('should take a datetime and adjust for local timezone', () => {
    const localTimezone = 'Europe/London'
    const resourceTimezone = 'Europe/Istanbul'
    const now = new Date('2026-06-01 15:38')

    const localisedDatime = localiseUTCDatetime(now, localTimezone)

    expect(localisedDatime.toISOString()).toEqual('2026-06-01T14:38:00.000Z')
  })

  it('should return the difference in minutes between to datetimes', () => {
    const now = '2026-06-01 15:38'
    const then = '2026-06-01 19:53'

    const diffInMins = dateDiffInMins(now, then)

    expect(diffInMins).toEqual(255)
  })

  it('should calculate the start and end time, and duration in minutes of the reservation', () => {
    const startDate = new Date('2026-06-01 15:38')
    const endDate = new Date('2026-06-01 21:52')
    const localTimezone = 'Europe/Istanbul'

    const calculatedValues = calculateReservationTimes(new Date(startDate), new Date(endDate), localTimezone);

    expect(calculatedValues).toEqual({
      localStartsAt: '2026-06-01T14:38:00Z',
      localEndsAt: '2026-06-01T20:52:00Z',
      durationMinutes: 374,
    })

  })
});