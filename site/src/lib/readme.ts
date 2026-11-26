// The scoreboard block of the README, made from the same view as the site, so both show the
// same numbers. readme.test.ts fails when README.md is out of date; `pnpm readme` rewrites it.
import { SETUPS, type ScoreState } from './scoreboard'

export const START = '<!-- scoreboard:start (generated from evals/results/latest.json by `pnpm readme`) -->'
export const END = '<!-- scoreboard:end -->'

export function scoreboardBlock(score: ScoreState): string {
  if (score.kind === 'empty') return 'No evaluation run yet. Run `pnpm eval` to fill this in.'
  if (score.kind === 'error') return `The scoreboard couldn't be read: ${score.message}`
  const { view } = score
  const head = `| Metric | ${SETUPS.map((s) => s.label).join(' | ')} | What it means |`
  const rule = `| --- | ${SETUPS.map(() => '---:').join(' | ')} | --- |`
  const rows = view.rows.map(
    (r) => `| ${r.label} | ${r.bars.map((b) => b.text).join(' | ')} | ${r.meaning.text} |`,
  )
  const issues = view.issuesWithout.map((i) => `\`${i.kind}\` ${i.count}`).join(' · ') || 'none'
  return [
    view.lead.replace('validate_screen', '`validate_screen`'),
    '',
    head,
    rule,
    ...rows,
    '',
    `Issues without Atlas, all runs: ${issues}. With either Atlas setup: ${view.issuesWithAtlas === 0 ? 'none' : view.issuesWithAtlas}. Mean ± standard deviation between runs; "—": the first draft isn't measured on its own.`,
    '',
    `${view.meta.model} · ${view.meta.n} · run ${view.meta.runDate} · Atlas v${view.meta.atlasVersion} · total cost ${view.meta.totalCost}`,
    ...(view.standIns
      ? [
          '',
          '> **Render test with stand-ins.** This run renders each screen with stand-ins built from the manifest, not the real components yet.',
        ]
      : []),
    ...(view.stoppedEarly ? ['', `> **Stopped early:** ${view.stoppedEarly}`] : []),
  ].join('\n')
}

/** README with the block between the markers replaced. */
export function withScoreboard(readme: string, score: ScoreState): string {
  const a = readme.indexOf(START)
  const b = readme.indexOf(END)
  if (a < 0 || b < a) throw new Error('README.md has no scoreboard markers.')
  return `${readme.slice(0, a + START.length)}\n\n${scoreboardBlock(score)}\n\n${readme.slice(b)}`
}
