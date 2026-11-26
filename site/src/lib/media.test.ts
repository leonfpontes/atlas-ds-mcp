// The demo video is a recording: it can't follow latest.json by itself. record-demo saves the
// numbers its last scene showed; this test fails when they no longer match the evaluation.
import { describe, expect, it } from 'vitest'

import { numberScene } from './scoreboard'
import { scoreboard } from './scoreboard-data'

const saved = import.meta.glob<unknown>('../../../docs/media/atlas-demo.numbers.json', {
  eager: true,
  import: 'default',
})

describe('demo video', () => {
  it('shows the numbers of the current latest.json (run `pnpm --filter atlas-site record-demo`)', () => {
    expect(Object.values(saved)[0], 'docs/media/atlas-demo.numbers.json').toEqual(numberScene(scoreboard))
  })
})
