import { describe, expect, it } from 'vitest'
import { isValidJson } from '../../../app/utils/validation/json-validator'

describe('JSON validator tests', () => {
  it('should return true when passed a valid JSON string', () => {
    const validJsonString = JSON.stringify({
      this: 'is',
      valid: 'JSON',
      innit: {
        yeah: 'bruv',
        like: 100,
      }
    })

    expect(isValidJson(validJsonString)).toEqual(true)
  })


  it('should return false when passed an invalid JSON string', () => {
    const validJsonString = "this: 'aint', JSON:"

    expect(isValidJson(validJsonString)).toEqual(false)
  })
})