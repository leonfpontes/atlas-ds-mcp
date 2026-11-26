import { readScoreboard, type ScoreState } from './scoreboard'

// Bundled at build time. The glob is empty when the file doesn't exist yet.
const files = import.meta.glob<unknown>('../../../evals/results/latest.json', {
  eager: true,
  import: 'default',
})

/** The parsed latest.json, or undefined before the first evaluation run. */
export const latestRaw: unknown = Object.values(files)[0]

export const scoreboard: ScoreState = readScoreboard(latestRaw)
