#!/usr/bin/env node
// pnpm eval: every case with Claude Haiku 5.5 in three variants (no server, the four lookup
// tools, all five tools), --runs times each, graded by validate_screen and the render test.
// Writes evals/results/latest.json and latest.md, and each generated screen under
// evals/results/screens/<variant>/<case>.run<n>.tsx (with-mcp also keeps <case>.run<n>.draft.tsx,
// the file before its first validate_screen call).
//
//   ANTHROPIC_API_KEY=… pnpm eval [--runs 3] [--budget 3] [--limit 5] [--cases a,b] [--concurrency 6]
//                                 [--render components|stand-ins]
//
// --budget is the limit for the whole command, every run included.
//
// Exit code 0 when every screen ran, 2 when the run stopped early (budget, key), 1 on setup errors.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'

import { ApiError, createClient } from './anthropic.js'
import {
  parseCases,
  VARIANTS,
  type EvalCase,
  type RenderMode,
  type ScreenResult,
  type Variant,
} from './contracts.js'
import { Budget, BudgetExceeded, generateScreen, type Generation } from './generate.js'
import { gradeScreen } from './grade.js'
import { connectStdio } from './mcp-client.js'
import { MODEL } from './pricing.js'
import { loadPrompts } from './prompts.js'
import { REPO_ROOT, renderScreen, UI_DIST } from './render.js'
import { summarize, toMarkdown } from './scoreboard.js'

const EVALS = path.join(REPO_ROOT, 'evals')
const { values: args } = parseArgs({
  options: {
    budget: { type: 'string', default: '3' },
    limit: { type: 'string' },
    cases: { type: 'string' },
    runs: { type: 'string', default: '3' },
    render: { type: 'string', default: 'components' },
    concurrency: { type: 'string', default: '6' },
    out: { type: 'string', default: path.join(EVALS, 'results') },
  },
})

const apiKey = process.env.ANTHROPIC_API_KEY
if (!apiKey) {
  console.error(
    'ANTHROPIC_API_KEY is not set. The evaluation calls Claude Haiku 5.5 and costs up to the --budget.',
  )
  process.exit(1)
}

const renderMode = args.render as RenderMode
if (renderMode !== 'components' && renderMode !== 'stand-ins') {
  console.error(`--render must be components or stand-ins, not ${args.render}`)
  process.exit(1)
}
if (renderMode === 'components' && !existsSync(UI_DIST)) {
  console.error('The render test needs the built Atlas components: pnpm --filter @leonfpontes/atlas-ui build')
  process.exit(1)
}
const render = (code: string) => renderScreen(code, { mode: renderMode })

let cases: EvalCase[] = parseCases(JSON.parse(readFileSync(path.join(EVALS, 'cases.json'), 'utf8')))
if (args.cases) {
  const wanted = new Set(args.cases.split(','))
  cases = cases.filter((c) => wanted.has(c.id))
}
if (args.limit) cases = cases.slice(0, Number(args.limit))
const budget = new Budget(Number(args.budget))
const concurrency = Math.max(1, Number(args.concurrency))
const runs = Math.max(1, Number(args.runs))
const prompts = loadPrompts(path.join(EVALS, 'prompts'))
const mcp = await connectStdio(process.execPath, [path.join(REPO_ROOT, 'mcp/dist/cli.js')])
const createMessage = createClient({ apiKey })

console.log(
  `Atlas eval · ${MODEL} · ${cases.length} cases × ${VARIANTS.length} variants × ${runs} runs · Atlas v${mcp.serverVersion} · prompts ${prompts.version} · render ${renderMode} · limit $${budget.limitUsd}`,
)

// One run at a time, and the variants of a case back to back, so a stop still compares like with like.
type Job = { c: EvalCase; variant: Variant; run: number }
const jobs: Job[] = Array.from({ length: runs }, (_, i) => i + 1).flatMap((run) =>
  cases.flatMap((c) => VARIANTS.map((variant) => ({ c, variant, run }))),
)
const screensDir = path.join(args.out, 'screens')
rmSync(screensDir, { recursive: true, force: true })
const results: ScreenResult[] = []
let stoppedEarly: string | undefined

async function runJob({ c, variant, run }: Job): Promise<void> {
  let generation: Generation | undefined
  try {
    generation = await generateScreen(c, variant, { createMessage, prompts, budget, mcp })
  } catch (error) {
    if (error instanceof BudgetExceeded) {
      stoppedEarly ??= error.message
      return
    }
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      stoppedEarly ??= `the API refused the key (${error.message})`
      return
    }
    results.push({
      caseId: c.id,
      variant,
      run,
      hasCode: false,
      valid: false,
      issues: [],
      rendered: false,
      toolCalls: 0,
      selfChecks: 0,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      costUsd: 0,
      error: (error as Error).message.slice(0, 300),
    })
    console.log(`✗ run ${run} · ${c.id} · ${variant} · ${(error as Error).message.slice(0, 120)}`)
    return
  }

  const grade = await gradeScreen(generation.code, mcp, render)
  // The first draft: what the model sent to validate_screen the first time, else its final file.
  const firstDraft =
    variant !== 'with-mcp'
      ? undefined
      : generation.firstDraftCode === undefined
        ? grade
        : await gradeScreen(generation.firstDraftCode, mcp, render)
  const dir = path.join(screensDir, variant)
  mkdirSync(dir, { recursive: true })
  if (generation.code) writeFileSync(path.join(dir, `${c.id}.run${run}.tsx`), generation.code)
  if (generation.firstDraftCode)
    writeFileSync(path.join(dir, `${c.id}.run${run}.draft.tsx`), generation.firstDraftCode)
  results.push({
    caseId: c.id,
    variant,
    run,
    hasCode: Boolean(generation.code),
    ...grade,
    ...(firstDraft ? { firstDraft } : {}),
    toolCalls: generation.toolCalls,
    selfChecks: generation.selfChecks,
    requests: generation.requests,
    inputTokens: generation.inputTokens,
    outputTokens: generation.outputTokens,
    costUsd: generation.costUsd,
  })
  console.log(
    `${grade.valid ? '✓' : '·'} run ${run} · ${c.id} · ${variant} · ${grade.issues.length} issues · ${
      grade.rendered ? 'rendered' : `not rendered (${grade.renderError})`
    }${firstDraft ? ` · first draft ${firstDraft.valid ? 'valid' : 'not valid'}` : ''} · ${generation.toolCalls} tool calls · $${generation.costUsd.toFixed(4)} · total $${budget.spent.toFixed(4)}`,
  )
}

let next = 0
await Promise.all(
  Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    while (next < jobs.length && !stoppedEarly) await runJob(jobs[next++]!)
  }),
)
mcp.close()

const scoreboard = summarize(
  results,
  {
    model: MODEL,
    runAt: new Date().toISOString(),
    atlasVersion: mcp.serverVersion,
    promptVersion: prompts.version,
    cases: cases.length,
    runsPerCase: runs,
    renderMode,
    budgetUsd: budget.limitUsd,
    ...(stoppedEarly ? { stoppedEarly } : {}),
  },
  cases.map((c) => c.id),
)
mkdirSync(args.out, { recursive: true })
const jsonFile = path.join(args.out, 'latest.json')
const mdFile = path.join(args.out, 'latest.md')
writeFileSync(jsonFile, JSON.stringify(scoreboard, null, 2) + '\n')
writeFileSync(mdFile, toMarkdown(scoreboard))
try {
  execFileSync('pnpm', ['exec', 'prettier', '--write', jsonFile, mdFile], { cwd: REPO_ROOT, stdio: 'ignore' })
} catch {
  console.error('prettier did not run; run pnpm format before you commit the results.')
}

for (const variant of VARIANTS) {
  const v = scoreboard.variants[variant]
  console.log(
    `${variant}: valid ${v.validPercent}% ± ${v.stdDev.validPercent} · rendered ${v.renderedPercent}% · issues/screen ${v.issuesPerScreen} · $${v.costUsd.toFixed(4)} per run${
      v.firstDraft
        ? ` · first draft valid ${v.firstDraft.validPercent}% ± ${v.firstDraft.stdDev.validPercent}`
        : ''
    }`,
  )
}
console.log(`Total cost $${scoreboard.totalCostUsd.toFixed(4)}`)
console.log(`Wrote ${path.relative(REPO_ROOT, jsonFile)} and ${path.relative(REPO_ROOT, mdFile)}`)
if (stoppedEarly) {
  console.error(`⚠️ Stopped early: ${stoppedEarly}`)
  process.exitCode = 2
}
