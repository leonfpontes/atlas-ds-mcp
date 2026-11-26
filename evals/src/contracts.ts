// What the evaluation reads and writes. cases.json is written by story O1,
// the harness by T1, and the site (F2) reads the scoreboard. Shapes live here
// so the three agree, and a bad file fails with the field that is wrong.

import * as v from 'valibot'

export const ISSUE_KINDS = [
  'hard-coded-color',
  'unknown-component',
  'invalid-prop',
  'internal-import',
] as const

export const EvalCaseSchema = v.object({
  /** Stable, kebab-case, e.g. `orders-table`. */
  id: v.pipe(v.string(), v.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)),
  /** The request the model gets, in English. */
  prompt: v.pipe(v.string(), v.minLength(20)),
  /** Atlas components a correct screen uses. */
  expectedComponents: v.pipe(v.array(v.string()), v.minLength(1)),
  /** Optional notes for the reader of the scoreboard. */
  notes: v.optional(v.string()),
})

export const EvalCasesSchema = v.pipe(
  v.array(EvalCaseSchema),
  v.check((cases) => new Set(cases.map((c) => c.id)).size === cases.length, 'Case ids must be unique.'),
)

export type EvalCase = v.InferOutput<typeof EvalCaseSchema>
export type IssueKind = (typeof ISSUE_KINDS)[number]
/**
 * without-mcp: the model alone. docs-mcp: the four lookup tools, no validate_screen.
 * with-mcp: all five tools, so the model can check its own screen.
 */
export type Variant = 'without-mcp' | 'docs-mcp' | 'with-mcp'

export const VARIANTS = ['without-mcp', 'docs-mcp', 'with-mcp'] as const satisfies readonly Variant[]

/** How the render test resolves Atlas imports: stand-ins from the manifest or the real components. */
export type RenderMode = 'stand-ins' | 'components'

export interface Grade {
  /** No issues from validate_screen and the render test passed. */
  valid: boolean
  issues: { kind: IssueKind; line: number; message: string }[]
  /** The file compiled, every import resolved and the default export rendered. */
  rendered: boolean
  /** Why the render test failed, when it did. */
  renderError?: string
}

export interface ScreenResult extends Grade {
  caseId: string
  variant: Variant
  /** Which repetition of the case, from 1 to runsPerCase. */
  run: number
  /** The model returned a tsx code block. */
  hasCode: boolean
  /** MCP tool calls the model made (always 0 without the server). */
  toolCalls: number
  /** validate_screen calls the model made (with-mcp only). */
  selfChecks: number
  /**
   * with-mcp only: the grade of the file the model sent to its first validate_screen call,
   * before any self-check. Equal to the final grade when it never called the tool.
   */
  firstDraft?: Grade
  /** Model requests for this screen (1 + one per tool round). */
  requests: number
  /** Input tokens of every kind: uncached, cache writes and cache reads. */
  inputTokens: number
  outputTokens: number
  costUsd: number
  /** The API failed after retries: the screen is left out of the averages. */
  error?: string
}

/** Sample standard deviation across the runs (0 with one run). */
export interface Spread {
  validPercent: number
  renderedPercent: number
  issuesPerScreen: number
  tokensPerScreen: number
  costUsd: number
}

export interface DraftSummary {
  validPercent: number
  renderedPercent: number
  issuesPerScreen: number
  stdDev: Pick<Spread, 'validPercent' | 'renderedPercent' | 'issuesPerScreen'>
}

export interface VariantSummary {
  /** Screens graded, every run (API failures excluded). */
  screens: number
  /** Screens the API failed on after retries. */
  failed: number
  /** Runs with at least one graded screen. */
  runs: number
  /** Means over every graded screen of every run. */
  validPercent: number
  renderedPercent: number
  issuesPerScreen: number
  /** Input + output tokens per graded screen. */
  tokensPerScreen: number
  toolCallsPerScreen: number
  selfChecksPerScreen: number
  /** Mean cost of one run of every case (failures included). */
  costUsd: number
  /** What this variant cost over all runs. */
  totalCostUsd: number
  /** How much each number moves between runs. */
  stdDev: Spread
  /** with-mcp only: the screens before the first validate_screen call. */
  firstDraft?: DraftSummary
}

export interface Scoreboard {
  model: string
  runAt: string
  /** Atlas MCP server version the run used. */
  atlasVersion: string
  /** Short hash of the prompt files, so a prompt change shows up in the scoreboard. */
  promptVersion: string
  cases: number
  /** Each case runs this many times per variant. */
  runsPerCase: number
  /** stand-ins until the real components ship (story F1). */
  renderMode: RenderMode
  budgetUsd: number
  totalCostUsd: number
  /** Set when the run stopped before the end (budget, invalid key). */
  stoppedEarly?: string
  variants: Record<Variant, VariantSummary>
  results: ScreenResult[]
}

/** Parses cases.json content; throws with the path of the first bad field. */
export function parseCases(input: unknown): EvalCase[] {
  const result = v.safeParse(EvalCasesSchema, input)
  if (result.success) return result.output
  const issue = result.issues[0]
  const where = issue ? v.getDotPath(issue) : null
  throw new Error(`Invalid cases.json${where ? ` at ${where}` : ''}: ${issue?.message ?? 'unknown error'}`)
}
