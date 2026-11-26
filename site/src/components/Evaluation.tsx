import { Alert, AlertDescription, AlertTitle, cn } from '@leonfpontes/atlas-ui'
import { CircleCheck, Info, Layers, OctagonX, TriangleAlert } from 'lucide-react'

import { LINKS } from '../lib/links'
import { SETUPS, type Bar, type ScoreState, type Setup, type Tone } from '../lib/scoreboard'
import { Section, SectionHead } from './Section'

const FILL: Record<Setup, string> = {
  without: 'bar-without',
  lookups: 'bg-primary',
  draft: 'bar-draft',
  final: 'bg-foreground',
}

const TONE: Record<Tone, { cls: string; Icon: typeof CircleCheck }> = {
  good: { cls: 'text-success', Icon: CircleCheck },
  cost: { cls: 'text-warning', Icon: TriangleAlert },
  neutral: { cls: 'text-muted-foreground', Icon: Info },
}

function Bars({ bars }: { bars: Bar[] }) {
  return (
    <div className="grid min-w-[280px] grid-cols-[132px_minmax(0,1fr)_118px] items-center gap-x-2.5 gap-y-1 py-1.5 max-[600px]:min-w-0 max-[600px]:grid-cols-[minmax(0,1fr)_44px_auto]">
      {bars.map((b) => {
        const label = SETUPS.find((s) => s.id === b.setup)?.label
        return (
          <div key={b.setup} className="contents">
            <span className="text-sm text-muted-foreground">{label}</span>
            {b.share === null ? (
              <span className="bar-na h-0.5 self-center" aria-hidden />
            ) : (
              <span className="block h-3 overflow-hidden rounded-[3px] bg-secondary" aria-hidden>
                <i
                  className={cn('block h-full rounded-[3px]', FILL[b.setup])}
                  style={{ width: `${b.share * 100}%` }}
                />
              </span>
            )}
            <b className="text-right font-mono text-sm font-semibold whitespace-nowrap">
              {b.text}
              {b.share === null && <span className="sr-only">not measured</span>}
            </b>
          </div>
        )
      })}
    </div>
  )
}

function Legend() {
  return (
    <div className="mt-3.5 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
      {SETUPS.map((s) => (
        <span key={s.id} className="inline-flex min-h-6 items-center max-[600px]:min-h-11">
          <i
            className={cn('mr-1.5 inline-block h-2 w-6 rounded-[2px] align-middle', FILL[s.id])}
            aria-hidden
          />
          {s.legend}
        </span>
      ))}
    </div>
  )
}

const chip = 'rounded-sm border bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground'

function Ready({ score }: { score: Extract<ScoreState, { kind: 'ready' }> }) {
  const { view } = score
  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full border-collapse text-sm max-[600px]:block">
          <caption className="sr-only">
            Evaluation, {view.meta.model}, {view.meta.n}, mean ± standard deviation between runs
          </caption>
          <thead className="max-[600px]:hidden">
            <tr className="border-b">
              <th className="h-11 px-3 text-left font-medium text-muted-foreground">Metric</th>
              <th className="h-11 w-[58%] px-3 text-left font-medium text-muted-foreground">
                Four setups · same scale per row · mean ± SD
              </th>
              <th className="h-11 px-3 text-left font-medium text-muted-foreground">Scale</th>
              <th className="h-11 px-3 text-left font-medium text-muted-foreground">What it means</th>
            </tr>
          </thead>
          <tbody className="max-[600px]:block">
            {view.rows.map((r) => {
              const { cls, Icon } = TONE[r.meaning.tone]
              return (
                <tr
                  key={r.id}
                  className="border-b last:border-0 max-[600px]:grid max-[600px]:grid-cols-2 max-[600px]:gap-x-4 max-[600px]:gap-y-1.5 max-[600px]:px-3 max-[600px]:py-3.5"
                >
                  <th
                    scope="row"
                    className="px-3 text-left font-normal max-[600px]:col-span-2 max-[600px]:p-0 max-[600px]:font-semibold"
                  >
                    {r.label}
                  </th>
                  <td className="px-3 max-[600px]:col-span-2 max-[600px]:p-0">
                    <Bars bars={r.bars} />
                  </td>
                  <td className="px-3 whitespace-nowrap text-muted-foreground max-[600px]:p-0">
                    <span className="hidden max-[600px]:inline">Scale </span>
                    {r.scale}
                  </td>
                  <td className="px-3 max-[600px]:p-0">
                    <span className={cn('inline-flex items-start gap-1.5 font-medium', cls)}>
                      <Icon className="mt-[3px] size-3.5 flex-none" aria-hidden />
                      {r.meaning.text}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Issues found without Atlas, all runs:{' '}
        {view.issuesWithout.length === 0
          ? 'none'
          : view.issuesWithout.map((i, n) => (
              <span key={i.kind}>
                {n > 0 && ' · '}
                <code className="whitespace-nowrap">{i.kind}</code> {i.count}
              </span>
            ))}
        . With either Atlas setup: {view.issuesWithAtlas === 0 ? 'none' : view.issuesWithAtlas}. "—": the
        first draft isn't billed separately.
      </p>
      <Legend />
      <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex min-h-6 items-center gap-1.5 max-[600px]:min-h-11">
          Model <code className={chip}>{view.meta.model}</code>
        </span>
        <span>{view.meta.n}</span>
        <span>Run {view.meta.runDate}</span>
        <span>Atlas v{view.meta.atlasVersion}</span>
        <span>Total cost {view.meta.totalCost}</span>
        {view.standIns && (
          <span className="note-tag">
            <TriangleAlert className="size-3" aria-hidden />
            Render test with stand-ins, not the real components yet
          </span>
        )}
        {view.stoppedEarly && (
          <span className="note-tag">
            <TriangleAlert className="size-3" aria-hidden />
            Stopped early: {view.stoppedEarly}
          </span>
        )}
      </div>
      <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex min-h-6 items-center gap-1.5 max-[600px]:min-h-11">
          Reproduce: <code className={chip}>pnpm eval</code>
        </span>
        <span className="inline-flex min-h-6 items-center gap-1.5 max-[600px]:min-h-11">
          Source: <code className={chip}>evals/results/latest.json</code>
        </span>
        <a
          href={LINKS.methodology}
          className="inline-flex min-h-6 items-center text-primary underline underline-offset-[3px] max-[600px]:min-h-11"
        >
          Methodology and the {score.board.cases} prompts
        </a>
      </div>
    </>
  )
}

export function Evaluation({ score }: { score: ScoreState }) {
  return (
    <Section id="eval">
      <div className="wrap">
        <div className="mb-6">
          <SectionHead
            eyebrow="03 · Evaluation"
            title={<span id="eval-title">The lookups do the work. validate_screen is the safety net.</span>}
          >
            {score.kind === 'ready' ? (
              <p>
                {score.view.lead.split('validate_screen').map((part, i) => (
                  <span key={i}>
                    {i > 0 && <code>validate_screen</code>}
                    {part}
                  </span>
                ))}
              </p>
            ) : (
              <p>Same model, same prompts, with and without the Atlas MCP server.</p>
            )}
          </SectionHead>
        </div>
        {score.kind === 'ready' && <Ready score={score} />}
        {score.kind === 'empty' && (
          <div className="grid justify-items-center gap-1 rounded-lg border border-dashed px-6 py-10 text-center">
            <Layers className="size-6 text-muted-foreground" aria-hidden />
            <b className="font-medium">No evaluation run yet</b>
            <p className="text-sm text-muted-foreground">
              Run <code>pnpm eval</code> to fill this in.
            </p>
          </div>
        )}
        {score.kind === 'error' && (
          <Alert variant="destructive">
            <OctagonX aria-hidden />
            <AlertTitle>Couldn't read the results</AlertTitle>
            <AlertDescription>
              <p>
                {score.message}{' '}
                <a href={`${LINKS.repo}/blob/main/evals/results/latest.json`}>Open the raw file</a>
              </p>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Section>
  )
}
