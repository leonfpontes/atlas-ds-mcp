import { describe, expect, it } from 'vitest'

import { readScoreboard } from './scoreboard'
import { latestRaw } from './scoreboard-data'

// The real file may not exist yet (a clone before the first `pnpm eval`): those cases skip.
const latest = latestRaw
const withLatest = it.skipIf(latest === undefined)

describe('readScoreboard', () => {
  it('shows the empty state when latest.json does not exist', () => {
    expect(readScoreboard(undefined)).toEqual({ kind: 'empty' })
  })

  it('shows an error, with what is missing, for a broken file', () => {
    expect(readScoreboard({ model: 'x' })).toMatchObject({
      kind: 'error',
      message: expect.stringMatching(/latest\.json/),
    })
    expect(readScoreboard('not json')).toMatchObject({ kind: 'error' })
  })

  withLatest('takes every number from latest.json', () => {
    const state = readScoreboard(latest)
    if (state.kind !== 'ready') throw new Error(state.kind)
    const { board, view } = state
    const valid = view.rows.find((r) => r.id === 'valid')!
    const w = board.variants['without-mcp']
    expect(valid.bars[0]?.text).toBe(`${Math.round(w.validPercent * 10) / 10}% ± ${w.stdDev.validPercent}`)
    expect(valid.bars.map((b) => b.setup)).toEqual(['without', 'lookups', 'draft', 'final'])
    expect(view.hero.prompts).toBe(board.cases)
    expect(view.meta.totalCost).toBe(`$${board.totalCostUsd.toFixed(2)}`)
  })

  withLatest('counts the issues by rule from the results', () => {
    const state = readScoreboard(latest)
    if (state.kind !== 'ready') throw new Error(state.kind)
    const expected = new Map<string, number>()
    for (const r of state.board.results)
      if (r.variant === 'without-mcp')
        for (const i of r.issues) expected.set(i.kind, (expected.get(i.kind) ?? 0) + 1)
    expect(Object.fromEntries(state.view.issuesWithout.map((i) => [i.kind, i.count]))).toEqual(
      Object.fromEntries(expected),
    )
  })

  withLatest('marks the first draft as not measured for tokens and cost', () => {
    const state = readScoreboard(latest)
    if (state.kind !== 'ready') throw new Error(state.kind)
    for (const id of ['tokens', 'cost', 'calls']) {
      const draft = state.view.rows.find((r) => r.id === id)!.bars.find((b) => b.setup === 'draft')!
      expect(draft).toEqual({ setup: 'draft', share: null, text: '—' })
    }
  })

  withLatest('shows the stand-ins marker only while the render test uses stand-ins', () => {
    const board = latest as { renderMode: string }
    expect(readScoreboard({ ...board, renderMode: 'stand-ins' })).toMatchObject({ view: { standIns: true } })
    expect(readScoreboard({ ...board, renderMode: 'components' })).toMatchObject({
      view: { standIns: false },
    })
  })

  withLatest('keeps every bar inside its scale', () => {
    const state = readScoreboard(latest)
    if (state.kind !== 'ready') throw new Error(state.kind)
    for (const r of state.view.rows)
      for (const b of r.bars) {
        if (b.share === null) continue
        expect(b.share).toBeGreaterThanOrEqual(0)
        expect(b.share).toBeLessThanOrEqual(1)
      }
  })
})
