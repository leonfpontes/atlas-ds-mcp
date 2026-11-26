// @vitest-environment node
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { format, resolveConfig } from 'prettier'
import { describe, expect, it } from 'vitest'

import { END, scoreboardBlock, START, withScoreboard } from './readme'
import { readScoreboard } from './scoreboard'
import { latestRaw as raw } from './scoreboard-data'

// process.cwd() is the repository root when the whole suite runs, and site/ for this project alone.
const README = [path.resolve('README.md'), path.resolve('../README.md')].find((p) => {
  try {
    return readFileSync(p, 'utf8').includes(START)
  } catch {
    return false
  }
})

describe('README scoreboard', () => {
  it.skipIf(raw === undefined)(
    'is the block generated from evals/results/latest.json (run `pnpm readme` after an evaluation)',
    async () => {
      expect(README, 'README.md with the scoreboard markers').toBeDefined()
      const current = readFileSync(README!, 'utf8')
      // Formatted the way `pnpm format` leaves it, so format:check and this test agree.
      const options = { ...(await resolveConfig(README!)), filepath: README! }
      const next = await format(withScoreboard(current, readScoreboard(raw)), options)
      if (process.env.UPDATE_README) writeFileSync(README!, next)
      else expect(current).toBe(next)
    },
  )

  it('says so when there is no run, and shows no numbers', () => {
    expect(scoreboardBlock({ kind: 'empty' })).toMatch(/No evaluation run yet/)
  })

  it.skipIf(raw === undefined)('keeps the stand-ins note only while it applies', () => {
    const board = raw as { renderMode: string }
    expect(scoreboardBlock(readScoreboard({ ...board, renderMode: 'components' }))).not.toMatch(/stand-ins/)
    expect(scoreboardBlock(readScoreboard({ ...board, renderMode: 'stand-ins' }))).toMatch(/stand-ins/)
  })

  it('refuses a README without the markers', () => {
    expect(() => withScoreboard('# Atlas', readScoreboard(raw))).toThrow(/markers/)
    expect(END).toBe('<!-- scoreboard:end -->')
  })
})
