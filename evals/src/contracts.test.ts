import { describe, expect, it } from 'vitest'

import { parseCases } from './index.js'

// Example data, not the real cases (those come with story O1).
const example = {
  id: 'orders-table',
  prompt: 'Build an orders page with a table of the last ten orders and a status badge per row.',
  expectedComponents: ['Table', 'Badge'],
}

describe('parseCases', () => {
  it('accepts well-formed cases', () => {
    expect(parseCases([example])).toEqual([example])
  })

  it('names the field that is wrong', () => {
    expect(() => parseCases([{ ...example, id: 'Orders Table' }])).toThrow(/at 0\.id/)
    expect(() => parseCases([{ ...example, expectedComponents: [] }])).toThrow(/at 0\.expectedComponents/)
  })

  it('rejects duplicate ids', () => {
    expect(() => parseCases([example, example])).toThrow('Case ids must be unique.')
  })
})
