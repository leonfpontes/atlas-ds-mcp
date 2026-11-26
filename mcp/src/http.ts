import { HttpTransport } from '@tmcp/transport-http'

import type { DesignSystemData } from './data.js'
import { createServer } from './server.js'

/** Requests larger than this are refused before parsing (validate_screen takes up to 100 000 characters). */
export const MAX_BODY_BYTES = 256 * 1024

// Pages on this machine (any port). The MCP spec asks servers to check Origin, so a web page on
// another site can't reach a local server through DNS rebinding (ADR 0005).
const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/

/**
 * Origins allowed besides the local ones: ATLAS_ALLOWED_ORIGINS (comma-separated), the site's
 * SITE_URL and, on Vercel, the production domain.
 */
export function allowedOriginsFromEnv(env: Record<string, string | undefined> = process.env): string[] {
  const list = [
    ...(env.ATLAS_ALLOWED_ORIGINS ?? '').split(','),
    env.SITE_URL ?? '',
    env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '',
  ]
  return [...new Set(list.map((o) => o.trim().replace(/\/$/, '')).filter(Boolean))]
}

export interface HttpOptions {
  /** Exact origins (scheme://host[:port]) allowed besides local pages. Default: from the environment. */
  allowedOrigins?: string[]
}

/**
 * Fetch handler for the public endpoint. Answers on any path (the caller routes) and is
 * read-only: the server has no tool that writes, and there are no resources or prompts.
 * A request with an Origin header is served only from a local page or an allowed origin;
 * clients that send no Origin (Claude Code, Cursor, the Inspector CLI) are not affected.
 */
export function createHttpHandler(
  data?: DesignSystemData,
  { allowedOrigins = allowedOriginsFromEnv() }: HttpOptions = {},
): (request: Request) => Promise<Response> {
  const transport = new HttpTransport(createServer(data), { path: null })
  const allowed = new Set(allowedOrigins.map((o) => o.replace(/\/$/, '')))
  const tooLarge = () =>
    new Response(`Request too large: the limit is ${MAX_BODY_BYTES} bytes.`, { status: 413 })
  return async (request) => {
    const origin = request.headers.get('origin')
    if (origin && !LOCAL_ORIGIN.test(origin) && !allowed.has(origin)) {
      return new Response(`Origin not allowed: ${origin.slice(0, 100)}.`, { status: 403 })
    }
    const declared = request.headers.get('content-length')
    if (Number(declared ?? 0) > MAX_BODY_BYTES) return tooLarge()
    if (declared === null && request.body) {
      // Chunked body with no length: read it with the limit before the transport parses it.
      const body = await readLimited(request.body)
      if (!body) return tooLarge()
      request = new Request(request, { body, duplex: 'half' } as RequestInit)
    }
    return (await transport.respond(request)) ?? new Response('Not found', { status: 404 })
  }
}

/** The whole body, or undefined as soon as it passes MAX_BODY_BYTES. */
async function readLimited(stream: ReadableStream<Uint8Array>): Promise<Uint8Array | undefined> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY_BYTES) {
      await reader.cancel()
      return undefined
    }
    chunks.push(value)
  }
  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  return body
}
