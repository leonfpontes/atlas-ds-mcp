// A small client for POST /v1/messages with retries. The harness needs one endpoint, so it
// calls it with fetch instead of adding the SDK to the workspace lockfile.
// Retried: 408, 409, 429, 5xx (529 = overloaded) and network errors, with the server's
// retry-after when it sends one. Not retried: 400, 401, 403, 404, 413 (the request is wrong).

import type { Usage } from './pricing.js'

export const API_URL = 'https://api.anthropic.com/v1/messages'
export const API_VERSION = '2023-06-01'

export type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: unknown }
  | { type: 'thinking'; thinking: string; signature: string }
  | { type: string; [key: string]: unknown }

export interface ToolResultBlock {
  type: 'tool_result'
  tool_use_id: string
  content: string
  is_error?: boolean
}

export interface MessageParam {
  role: 'user' | 'assistant'
  content: string | (ContentBlock | ToolResultBlock)[]
}

export interface Tool {
  name: string
  description?: string
  input_schema: Record<string, unknown>
}

export interface MessageRequest {
  model: string
  max_tokens: number
  system?: string
  messages: MessageParam[]
  tools?: Tool[]
  tool_choice?: { type: 'auto' | 'none' }
  output_config?: { effort: 'low' | 'medium' | 'high' }
  cache_control?: { type: 'ephemeral' }
}

export interface MessageResponse {
  id: string
  content: ContentBlock[]
  stop_reason: 'end_turn' | 'max_tokens' | 'tool_use' | 'stop_sequence' | 'refusal' | 'pause_turn' | string
  usage: Usage
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | undefined,
    readonly retryable: boolean,
    readonly retryAfter: string | null = null,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ClientOptions {
  apiKey: string
  fetch?: typeof fetch
  maxRetries?: number
  /** Waits between attempts; tests pass a no-op. */
  sleep?: (ms: number) => Promise<void>
  timeoutMs?: number
}

const RETRYABLE = new Set([408, 409, 429, 500, 502, 503, 504, 529])
const MAX_DELAY_MS = 30_000

export function retryDelay(attempt: number, retryAfter: string | null): number {
  const seconds = retryAfter === null ? NaN : Number(retryAfter)
  if (Number.isFinite(seconds) && seconds >= 0) return Math.min(seconds * 1000, MAX_DELAY_MS)
  const base = Math.min(1000 * 2 ** attempt, MAX_DELAY_MS)
  return base / 2 + Math.random() * (base / 2)
}

export type CreateMessage = (request: MessageRequest) => Promise<MessageResponse>

export function createClient(options: ClientOptions): CreateMessage {
  const doFetch = options.fetch ?? fetch
  const maxRetries = options.maxRetries ?? 4
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)))
  const timeoutMs = options.timeoutMs ?? 300_000

  return async function createMessage(request) {
    let last: ApiError | undefined
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) await sleep(retryDelay(attempt - 1, last?.retryAfter ?? null))
      let response: Response
      try {
        response = await doFetch(API_URL, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': options.apiKey,
            'anthropic-version': API_VERSION,
          },
          body: JSON.stringify(request),
          signal: AbortSignal.timeout(timeoutMs),
        })
      } catch (error) {
        last = new ApiError(`network error: ${(error as Error).message}`, undefined, true)
        continue
      }
      if (response.ok) return (await response.json()) as MessageResponse

      const body = await response.text()
      const detail = readError(body)
      const retryable = RETRYABLE.has(response.status) && response.headers.get('x-should-retry') !== 'false'
      last = new ApiError(
        `${response.status} ${detail}`,
        response.status,
        retryable,
        response.headers.get('retry-after'),
      )
      if (!retryable) throw last
    }
    throw last ?? new ApiError('no attempt was made', undefined, false)
  }
}

function readError(body: string): string {
  try {
    const parsed = JSON.parse(body) as { error?: { type?: string; message?: string } }
    if (parsed.error) return `${parsed.error.type ?? 'error'}: ${parsed.error.message ?? ''}`.trim()
  } catch {
    // not JSON: fall through
  }
  return body.slice(0, 200)
}
