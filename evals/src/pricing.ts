// What a request costs. Prices in USD per million tokens, from
// https://platform.claude.com/docs/en/about-claude/pricing (checked 2026-11-25).
// Claude Haiku 5.5 charges more when one request's prompt passes 100,000 tokens.

export const MODEL = 'claude-haiku-5-5'

interface Rates {
  input: number
  cacheWrite: number
  cacheRead: number
  output: number
}

const HAIKU_5_5: Rates = { input: 0.1, cacheWrite: 0.125, cacheRead: 0.01, output: 0.5 }
const HAIKU_5_5_LONG: Rates = { input: 0.5, cacheWrite: 0.625, cacheRead: 0.05, output: 2.5 }
const LONG_PROMPT = 100_000

export interface Usage {
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens?: number | null
  cache_read_input_tokens?: number | null
}

/** Every input token of the request: uncached, written to the cache and read from it. */
export function promptTokens(usage: Usage): number {
  return usage.input_tokens + (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0)
}

/** Cost in USD of one request to Claude Haiku 5.5. */
export function requestCost(usage: Usage): number {
  const r = promptTokens(usage) > LONG_PROMPT ? HAIKU_5_5_LONG : HAIKU_5_5
  return (
    (usage.input_tokens * r.input +
      (usage.cache_creation_input_tokens ?? 0) * r.cacheWrite +
      (usage.cache_read_input_tokens ?? 0) * r.cacheRead +
      usage.output_tokens * r.output) /
    1_000_000
  )
}

/** The most the next request can cost: its prompt plus the whole output allowance. */
export function worstCaseCost(nextPromptTokens: number, maxOutputTokens: number): number {
  return requestCost({ input_tokens: nextPromptTokens, output_tokens: maxOutputTokens })
}
