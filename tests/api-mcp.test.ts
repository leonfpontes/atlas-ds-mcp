// The Vercel function (api/mcp.ts) as Vercel calls it: Fetch Request in, Response out, with the
// manifest and the tokens read from disk. Needs the build (mcp/dist and mcp/data); skipped before
// it, run by `pnpm test:built`.
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const built =
  existsSync(path.join(root, 'mcp/dist/index.js')) && existsSync(path.join(root, 'mcp/data/manifest.json'))

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://atlas.example.dev/api/mcp', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      ...headers,
    },
    body: JSON.stringify(body),
  })

const INIT = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1' } },
}

describe.runIf(built)('api/mcp (Vercel function)', () => {
  it('answers the handshake and lists the five tools without a session from another instance', async () => {
    const { POST } = await import('../api/mcp.js')
    const init = await POST(post(INIT))
    expect(init.status).toBe(200)
    expect(await init.text()).toContain('atlas-design-system')
    // A serverless instance may get the next call without having seen the handshake.
    const list = await POST(post({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }))
    const text = await list.text()
    for (const tool of [
      'list_components',
      'get_component',
      'list_tokens',
      'search_usage',
      'validate_screen',
    ]) {
      expect(text).toContain(tool)
    }
  })

  it('refuses another site with 403', async () => {
    const { POST } = await import('../api/mcp.js')
    expect((await POST(post(INIT, { origin: 'http://evil.example' }))).status).toBe(403)
  })
})
