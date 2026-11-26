// Turns the per-screen results into the scoreboard the site reads (evals/results/latest.json)
// and a Markdown table for people (latest.md). Main numbers are means over every graded
// screen of every run; stdDev says how much each number moves from one run to the next.

import {
  VARIANTS,
  type DraftSummary,
  type Grade,
  type Scoreboard,
  type ScreenResult,
  type Spread,
  type Variant,
  type VariantSummary,
} from './contracts.js'

export type ScoreboardMeta = Omit<Scoreboard, 'variants' | 'results' | 'totalCostUsd'>

const round = (n: number, digits: number) => Math.round(n * 10 ** digits) / 10 ** digits
const share = (part: number, whole: number) => (whole ? (100 * part) / whole : 0)
const mean = (values: number[]) => (values.length ? values.reduce((t, v) => t + v, 0) / values.length : 0)

/** Sample standard deviation; 0 with fewer than two values. */
export function stdDev(values: number[]): number {
  if (values.length < 2) return 0
  const m = mean(values)
  return Math.sqrt(values.reduce((t, v) => t + (v - m) ** 2, 0) / (values.length - 1))
}

interface Metrics {
  validPercent: number
  renderedPercent: number
  issuesPerScreen: number
}

function gradeMetrics(grades: Grade[]): Metrics {
  return {
    validPercent: share(grades.filter((g) => g.valid).length, grades.length),
    renderedPercent: share(grades.filter((g) => g.rendered).length, grades.length),
    issuesPerScreen: mean(grades.map((g) => g.issues.length)),
  }
}

function byRun(results: ScreenResult[]): ScreenResult[][] {
  const runs = new Map<number, ScreenResult[]>()
  for (const r of results) runs.set(r.run, [...(runs.get(r.run) ?? []), r])
  return [...runs.keys()].sort((a, b) => a - b).map((k) => runs.get(k) ?? [])
}

function summarizeVariant(all: ScreenResult[], variant: Variant): VariantSummary {
  const graded = all.filter((r) => !r.error)
  const runs = byRun(all)
  const gradedRuns = runs.map((run) => run.filter((r) => !r.error)).filter((run) => run.length)
  const perRun = gradedRuns.map((run) => ({
    ...gradeMetrics(run),
    tokensPerScreen: mean(run.map((r) => r.inputTokens + r.outputTokens)),
  }))
  const runCosts = runs.map((run) => run.reduce((t, r) => t + r.costUsd, 0))
  const totals = gradeMetrics(graded)
  const spread: Spread = {
    validPercent: round(stdDev(perRun.map((m) => m.validPercent)), 1),
    renderedPercent: round(stdDev(perRun.map((m) => m.renderedPercent)), 1),
    issuesPerScreen: round(stdDev(perRun.map((m) => m.issuesPerScreen)), 2),
    tokensPerScreen: round(stdDev(perRun.map((m) => m.tokensPerScreen)), 0),
    costUsd: round(stdDev(runCosts), 4),
  }

  const summary: VariantSummary = {
    screens: graded.length,
    failed: all.length - graded.length,
    runs: gradedRuns.length,
    validPercent: round(totals.validPercent, 1),
    renderedPercent: round(totals.renderedPercent, 1),
    issuesPerScreen: round(totals.issuesPerScreen, 2),
    tokensPerScreen: round(mean(graded.map((r) => r.inputTokens + r.outputTokens)), 0),
    toolCallsPerScreen: round(mean(graded.map((r) => r.toolCalls)), 1),
    selfChecksPerScreen: round(mean(graded.map((r) => r.selfChecks)), 1),
    costUsd: round(mean(runCosts), 4),
    totalCostUsd: round(
      runCosts.reduce((t, c) => t + c, 0),
      4,
    ),
    stdDev: spread,
  }

  if (variant === 'with-mcp') {
    const drafts = (run: ScreenResult[]) => run.flatMap((r) => (r.firstDraft ? [r.firstDraft] : []))
    const draftRuns = gradedRuns.map((run) => gradeMetrics(drafts(run)))
    const draftTotals = gradeMetrics(drafts(graded))
    const firstDraft: DraftSummary = {
      validPercent: round(draftTotals.validPercent, 1),
      renderedPercent: round(draftTotals.renderedPercent, 1),
      issuesPerScreen: round(draftTotals.issuesPerScreen, 2),
      stdDev: {
        validPercent: round(stdDev(draftRuns.map((m) => m.validPercent)), 1),
        renderedPercent: round(stdDev(draftRuns.map((m) => m.renderedPercent)), 1),
        issuesPerScreen: round(stdDev(draftRuns.map((m) => m.issuesPerScreen)), 2),
      },
    }
    summary.firstDraft = firstDraft
  }
  return summary
}

export function summarize(results: ScreenResult[], meta: ScoreboardMeta, caseOrder: string[]): Scoreboard {
  const position = new Map(caseOrder.map((id, i) => [id, i]))
  const sorted = [...results].sort(
    (a, b) =>
      a.run - b.run ||
      (position.get(a.caseId) ?? 0) - (position.get(b.caseId) ?? 0) ||
      VARIANTS.indexOf(a.variant) - VARIANTS.indexOf(b.variant),
  )
  const variants = Object.fromEntries(
    VARIANTS.map((v) => [
      v,
      summarizeVariant(
        sorted.filter((r) => r.variant === v),
        v,
      ),
    ]),
  ) as Record<Variant, VariantSummary>
  return {
    ...meta,
    totalCostUsd: round(
      results.reduce((t, r) => t + r.costUsd, 0),
      4,
    ),
    variants,
    results: sorted,
  }
}

const usd = (n: number) => `$${n.toFixed(n < 0.1 ? 4 : 2)}`
const pm = (value: number, sd: number, unit = '') => `${value}${unit} ± ${sd}${unit}`

export function toMarkdown(s: Scoreboard): string {
  const w = s.variants['without-mcp']
  const d = s.variants['docs-mcp']
  const m = s.variants['with-mcp']
  const draft = m.firstDraft
  const row = (label: string, cells: string[]) => `| ${label} | ${cells.join(' | ')} |`
  const issueCounts = (variant: Variant) => {
    const counts = new Map<string, number>()
    for (const r of s.results)
      if (r.variant === variant) for (const i of r.issues) counts.set(i.kind, (counts.get(i.kind) ?? 0) + 1)
    return [...counts].map(([k, n]) => `${k} ${n}`).join(', ') || 'none'
  }
  const lines = [
    '# Atlas evaluation',
    '',
    `Same model, same ${s.cases} prompts, without the Atlas MCP server, with its four lookup tools only, and with all five (lookups plus \`validate_screen\`).`,
    '',
    `- Model: \`${s.model}\` · n = ${s.cases} prompts × ${s.runsPerCase} runs per variant · numbers are mean ± standard deviation across runs`,
    `- Run: ${s.runAt} · Atlas v${s.atlasVersion} · prompts ${s.promptVersion}`,
    `- Render test: ${
      s.renderMode === 'stand-ins'
        ? '⚠️ stand-ins built from the component manifest, not the real components yet'
        : 'the real Atlas components'
    }`,
    `- Total cost: ${usd(s.totalCostUsd)} (limit ${usd(s.budgetUsd)})`,
    ...(s.stoppedEarly ? [`- ⚠️ Stopped early: ${s.stoppedEarly}`] : []),
    ...(w.failed || d.failed || m.failed
      ? [`- API failures left out: ${w.failed} without, ${d.failed} lookups only, ${m.failed} full server`]
      : []),
    '',
    '| Metric | Without Atlas | Lookups only | Full server: first draft | Full server: final |',
    '| --- | --- | --- | --- | --- |',
    row('Valid screens', [
      pm(w.validPercent, w.stdDev.validPercent, '%'),
      pm(d.validPercent, d.stdDev.validPercent, '%'),
      draft ? pm(draft.validPercent, draft.stdDev.validPercent, '%') : '—',
      pm(m.validPercent, m.stdDev.validPercent, '%'),
    ]),
    row('Render test passed', [
      pm(w.renderedPercent, w.stdDev.renderedPercent, '%'),
      pm(d.renderedPercent, d.stdDev.renderedPercent, '%'),
      draft ? pm(draft.renderedPercent, draft.stdDev.renderedPercent, '%') : '—',
      pm(m.renderedPercent, m.stdDev.renderedPercent, '%'),
    ]),
    row('Issues per screen', [
      pm(w.issuesPerScreen, w.stdDev.issuesPerScreen),
      pm(d.issuesPerScreen, d.stdDev.issuesPerScreen),
      draft ? pm(draft.issuesPerScreen, draft.stdDev.issuesPerScreen) : '—',
      pm(m.issuesPerScreen, m.stdDev.issuesPerScreen),
    ]),
    row('Tokens per screen', [
      pm(w.tokensPerScreen, w.stdDev.tokensPerScreen),
      pm(d.tokensPerScreen, d.stdDev.tokensPerScreen),
      '—',
      pm(m.tokensPerScreen, m.stdDev.tokensPerScreen),
    ]),
    row('Tool calls per screen', [
      String(w.toolCallsPerScreen),
      String(d.toolCallsPerScreen),
      '—',
      `${m.toolCallsPerScreen} (${m.selfChecksPerScreen} validate_screen)`,
    ]),
    row(`Cost per run (${s.cases} screens)`, [usd(w.costUsd), usd(d.costUsd), '—', usd(m.costUsd)]),
    '',
    'The first draft is the file the model sent to its first `validate_screen` call (or its final file when it never called it).',
    '',
    `Issues by rule, all runs. Without: ${issueCounts('without-mcp')}. Lookups only: ${issueCounts('docs-mcp')}. Full server: ${issueCounts('with-mcp')}.`,
    '',
    '## Per screen',
    '',
    '| Run | Case | Variant | Valid | Rendered | Issues | First draft valid | Tool calls | Tokens | Cost |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...s.results.map(
      (r) =>
        `| ${r.run} | ${r.caseId} | ${r.variant} | ${r.error ? 'API error' : r.valid ? 'yes' : 'no'} | ${
          r.rendered ? 'yes' : 'no'
        } | ${r.issues.length} | ${r.firstDraft ? (r.firstDraft.valid ? 'yes' : 'no') : '—'} | ${r.toolCalls} | ${
          r.inputTokens + r.outputTokens
        } | ${usd(r.costUsd)} |`,
    ),
    '',
    'Reproduce: `pnpm eval` (needs `ANTHROPIC_API_KEY`). Source: `evals/results/latest.json`.',
    '',
  ]
  return lines.join('\n')
}
