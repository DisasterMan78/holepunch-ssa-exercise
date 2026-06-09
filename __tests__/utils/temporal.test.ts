import { describe, expect, it } from 'vitest'
import { dateDiffInMins, localiseDatetime } from '../../app/utils/temporal'

describe('temporal manipulation utilities', () => {
  it('should take a datetime and adjust for local timezone', () => {
    const localTimezone = 'Europe/Istanbul'
    const now = new Date('2026-06-01 15:38')

    const localisedDatime = localiseDatetime(localTimezone, now)

    expect(localisedDatime.toISOString()).toEqual('2026-01-06T17:38:00.000Z')
  })

  it('should return the difference in minutes between to datetimes', () => {
    const now = '2026-06-01 15:38'
    const then = '2026-06-01 19:53'

    const diffInMins = dateDiffInMins(now, then)

    expect(diffInMins).toEqual(255)
  })
});