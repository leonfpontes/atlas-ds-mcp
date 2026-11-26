// The evaluation scoreboard as the site shows it. The numbers come from
// evals/results/latest.json (written by pnpm eval); nothing here is typed in by hand.
import type { IssueKind, Scoreboard, Variant, VariantSummary } from '../../../evals/src/contracts'

export type Setup = 'without' | 'lookups' | 'draft' | 'final'

export const SETUPS: { id: Setup; label: string; legend: string }[] = [
  { id: 'without', label: 'Without Atlas', legend: 'Without Atlas' },
  { id: 'lookups', label: 'Lookups only', legend: 'Lookups only (4 tools)' },
  { id: 'draft', label: 'Full · first draft', legend: 'Full server, first draft' },
  { id: 'final', label: 'Full · final', legend: 'Full server, final' },
]

export type Tone = 'good' | 'cost' | 'neutral'

export interface Bar {
  setup: Setup
  /** 0–1 of the row's scale; null when the setup isn't measured for this metric. */
  share: number | null
  text: string
}

export interface MetricRow {
  id: string
  label: string
  bars: Bar[]
  scale: string
  meaning: { tone: Tone; text: string }
}

export interface ScoreView {
  rows: MetricRow[]
  /** Issues by rule without Atlas, most frequent first. */
  issuesWithout: { kind: IssueKind; count: number }[]
  issuesWithAtlas: number
  hero: { lookups: string; without: string; prompts: number; runs: number }
  lead: string
  meta: { model: string; n: string; runDate: string; atlasVersion: string; totalCost: string }
  standIns: boolean
  stoppedEarly?: string
}

export type ScoreState =
  | { kind: 'empty' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; board: Scoreboard; view: ScoreView }

const VARIANTS: Variant[] = ['without-mcp', 'docs-mcp', 'with-mcp']

const num = (n: number, digits = 0) =>
  n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
/** 28.3, 100 (no trailing .0). */
const short = (n: number) => String(Math.round(n * 10) / 10)
const pct = (n: number) => `${short(n)}%`
const pm = (text: string, sd: number | undefined) =>
  sd === undefined ? text : `${text} ± ${sd === 0 ? '0' : sd < 10 ? String(sd) : num(sd)}`
const money = (n: number) => `$${n.toFixed(3)}`
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const word = (n: number) => WORDS[n] ?? String(n)
const percentMore = (a: number, b: number) => Math.round((a / b - 1) * 100)

function check(board: unknown): asserts board is Scoreboard {
  const b = board as Partial<Scoreboard> | null
  if (!b || typeof b !== 'object') throw new Error('latest.json is not an object.')
  if (typeof b.model !== 'string' || typeof b.runAt !== 'string')
    throw new Error('latest.json has no model or run date.')
  if (typeof b.cases !== 'number' || typeof b.runsPerCase !== 'number')
    throw new Error('latest.json has no case count.')
  if (!Array.isArray(b.results)) throw new Error('latest.json has no results.')
  for (const v of VARIANTS) {
    const s = b.variants?.[v]
    if (!s || typeof s.validPercent !== 'number' || !s.stdDev)
      throw new Error(`latest.json is missing the ${v} variant.`)
  }
}

function view(board: Scoreboard): ScoreView {
  const without = board.variants['without-mcp']
  const lookups = board.variants['docs-mcp']
  const full = board.variants['with-mcp']
  const draft = full.firstDraft

  const bars = (
    pick: (s: VariantSummary) => number,
    scale: number,
    format: (n: number, s: VariantSummary) => string,
    draftValue?: (d: NonNullable<VariantSummary['firstDraft']>) => [number, string],
  ): Bar[] => {
    const one = (setup: Setup, s: VariantSummary): Bar => ({
      setup,
      share: Math.min(1, pick(s) / scale),
      text: format(pick(s), s),
    })
    const d: Bar =
      draft && draftValue
        ? (() => {
            const [value, text] = draftValue(draft)
            return { setup: 'draft', share: Math.min(1, value / scale), text }
          })()
        : { setup: 'draft', share: null, text: '—' }
    return [one('without', without), one('lookups', lookups), d, one('final', full)]
  }

  const issuesMax = Math.max(
    1,
    Math.ceil(Math.max(...VARIANTS.map((v) => board.variants[v].issuesPerScreen))),
  )
  const tokensMax =
    Math.ceil(Math.max(...VARIANTS.map((v) => board.variants[v].tokensPerScreen)) / 10_000) * 10_000
  const costMax = Math.ceil(Math.max(...VARIANTS.map((v) => board.variants[v].costUsd)) / 0.05) * 0.05
  const callsMax = 12 // the harness allows up to 12 requests per screen

  const validGain = lookups.validPercent - without.validPercent
  const renderGain = lookups.renderedPercent - without.renderedPercent
  const tokensMore = percentMore(full.tokensPerScreen, lookups.tokensPerScreen)
  const costMore = percentMore(full.costUsd, lookups.costUsd)

  const rows: MetricRow[] = [
    {
      id: 'valid',
      label: 'Valid screens',
      bars: bars(
        (s) => s.validPercent,
        100,
        (n, s) => pm(pct(n), s.stdDev.validPercent),
        (d) => [d.validPercent, pm(pct(d.validPercent), d.stdDev.validPercent)],
      ),
      scale: '0–100%',
      meaning: {
        tone: validGain > 0 ? 'good' : 'neutral',
        text: `${validGain >= 0 ? '+' : ''}${short(validGain)} pts from the lookups`,
      },
    },
    {
      id: 'rendered',
      label: 'Render test passed',
      bars: bars(
        (s) => s.renderedPercent,
        100,
        (n, s) => pm(pct(n), s.stdDev.renderedPercent),
        (d) => [d.renderedPercent, pm(pct(d.renderedPercent), d.stdDev.renderedPercent)],
      ),
      scale: '0–100%',
      meaning: {
        tone: renderGain > 0 ? 'good' : 'neutral',
        text: `${renderGain >= 0 ? '+' : ''}${short(renderGain)} pts`,
      },
    },
    {
      id: 'issues',
      label: 'Issues per screen',
      bars: bars(
        (s) => s.issuesPerScreen,
        issuesMax,
        (n, s) => (n === 0 ? '0' : pm(short2(n), s.stdDev.issuesPerScreen)),
        (d) => [
          d.issuesPerScreen,
          d.issuesPerScreen === 0 ? '0' : pm(short2(d.issuesPerScreen), d.stdDev.issuesPerScreen),
        ],
      ),
      scale: `0–${issuesMax}`,
      meaning:
        lookups.issuesPerScreen === 0 && full.issuesPerScreen === 0
          ? { tone: 'good', text: '0 with any Atlas setup' }
          : {
              tone: 'good',
              text: `${short2(without.issuesPerScreen - lookups.issuesPerScreen)} fewer with the lookups`,
            },
    },
    {
      id: 'calls',
      label: 'Tool calls per screen',
      bars: bars(
        (s) => s.toolCallsPerScreen,
        callsMax,
        (n) => short(n),
      ),
      scale: `0–${callsMax}`,
      meaning: { tone: 'neutral', text: `${short(full.selfChecksPerScreen)} of them validate_screen` },
    },
    {
      id: 'tokens',
      label: 'Tokens per screen',
      bars: bars(
        (s) => s.tokensPerScreen,
        tokensMax,
        (n, s) => pm(num(n), s.stdDev.tokensPerScreen),
      ),
      scale: `0–${tokensMax / 1000}k`,
      meaning: { tone: 'cost', text: `+${tokensMore}% for the safety net` },
    },
    {
      id: 'cost',
      label: `Cost per run (${board.cases} screens)`,
      bars: bars(
        (s) => s.costUsd,
        costMax,
        (n) => money(n),
      ),
      scale: `$0–$${costMax.toFixed(2)}`,
      meaning: { tone: 'cost', text: `+${costMore}% for the safety net` },
    },
  ]

  const count = (variants: Variant[]) => {
    const by = new Map<IssueKind, number>()
    for (const r of board.results) {
      if (!variants.includes(r.variant)) continue
      for (const i of r.issues) by.set(i.kind, (by.get(i.kind) ?? 0) + 1)
    }
    return by
  }
  const issuesWithout = [...count(['without-mcp'])]
    .map(([kind, c]) => ({ kind, count: c }))
    .sort((a, b) => b.count - a.count)
  const issuesWithAtlas = [...count(['docs-mcp', 'with-mcp']).values()].reduce((a, b) => a + b, 0)

  const allDraftsValid = draft?.validPercent === 100
  const lead = [
    `Same model, same ${board.cases} prompts, three setups, ${word(board.runsPerCase)} ${board.runsPerCase === 1 ? 'run' : 'runs'} each.`,
    allDraftsValid
      ? 'Every first draft written with the full server was already valid, so the gain comes from the four lookup tools.'
      : `With the full server, ${pct(draft?.validPercent ?? 0)} of first drafts were valid before any self-check.`,
    `validate_screen costs about ${costMore}% more and covers what these ${board.cases} prompts don't.`,
  ].join(' ')

  return {
    rows,
    issuesWithout,
    issuesWithAtlas,
    hero: {
      lookups: pct(Math.round(lookups.validPercent)),
      without: pct(Math.round(without.validPercent)),
      prompts: board.cases,
      runs: board.runsPerCase,
    },
    lead,
    meta: {
      model: board.model,
      n: `n = ${board.cases} prompts × ${board.runsPerCase} runs`,
      runDate: board.runAt.slice(0, 10),
      atlasVersion: board.atlasVersion,
      totalCost: `$${board.totalCostUsd.toFixed(2)}`,
    },
    standIns: board.renderMode === 'stand-ins',
    stoppedEarly: board.stoppedEarly,
  }
}

/** 2.35, 0.5 (two decimals at most). */
function short2(n: number) {
  return String(Math.round(n * 100) / 100)
}

/** Reads the parsed latest.json, or undefined when the file doesn't exist. */
export function readScoreboard(raw: unknown): ScoreState {
  if (raw === undefined) return { kind: 'empty' }
  try {
    check(raw)
    return { kind: 'ready', board: raw, view: view(raw) }
  } catch (e) {
    return { kind: 'error', message: e instanceof Error ? e.message : 'latest.json is not valid.' }
  }
}

/** The numbers the demo video's last scene shows. record-demo saves them next to the MP4, and a
 * test compares them with latest.json, so a new run can't ship with an old video. */
export function numberScene(state: ScoreState) {
  if (state.kind !== 'ready') return null
  const v = state.view
  return {
    lookups: v.hero.lookups,
    without: v.hero.without,
    prompts: v.hero.prompts,
    runs: v.hero.runs,
    model: v.meta.model,
    runDate: v.meta.runDate,
    standIns: v.standIns,
  }
}

export type NumberScene = NonNullable<ReturnType<typeof numberScene>>
