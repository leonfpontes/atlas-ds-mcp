// The real evals/cases.json: 20 fictitious screen requests for Fernhill Market, each with
// the Atlas components a correct screen uses and what a correct screen looks like.
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { parseCases } from './contracts.js'

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../cases.json')
const cases = parseCases(JSON.parse(readFileSync(file, 'utf8')))

// The components Atlas ships (docs/DESIGN.md, "Components").
const ATLAS_COMPONENTS = [
  'Button',
  'Input',
  'Select',
  'Card',
  'Badge',
  'Alert',
  'Table',
  'Dialog',
  'Tabs',
  'Command',
  'Sheet',
  'Tooltip',
  'Sonner',
]

describe('evals/cases.json', () => {
  it('has 20 valid cases', () => {
    expect(cases).toHaveLength(20)
  })

  it('every case is a Fernhill Market screen, in English, with the expected result', () => {
    for (const c of cases) {
      expect(c.prompt, c.id).toContain('Fernhill Market')
      expect(`${c.prompt} ${c.notes}`, c.id).toMatch(/^[\x20-\x7E…]+$/)
      expect(c.notes?.length ?? 0, `${c.id} has no expected result`).toBeGreaterThan(40)
    }
  })

  it('expects only Atlas components, without repeats', () => {
    for (const c of cases) {
      for (const name of c.expectedComponents) expect(ATLAS_COMPONENTS, c.id).toContain(name)
      expect(new Set(c.expectedComponents).size, c.id).toBe(c.expectedComponents.length)
    }
  })

  it('covers every Atlas component at least once', () => {
    const used = new Set(cases.flatMap((c) => c.expectedComponents))
    expect([...ATLAS_COMPONENTS].filter((name) => !used.has(name))).toEqual([])
  })

  it.each([
    ['table', /\bTable\b/],
    ['form', /\bInput\b/],
    ['dashboard', /dashboard|report/i],
    ['empty state', /empty|no orders yet/i],
    ['error state', /declined|offline|went wrong/i],
    ['loading state', /loading/i],
    ['success state', /success|confirmation/i],
    ['confirmation dialog', /confirm/i],
    ['mobile', /mobile|touch/i],
  ])('includes a %s', (_kind, pattern) => {
    expect(cases.some((c) => pattern.test(`${c.prompt} ${c.expectedComponents.join(' ')} ${c.notes}`))).toBe(
      true,
    )
  })
})
