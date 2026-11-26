// A real MCP conversation (JSON-RPC over HTTP), the same path the public endpoint takes.
import * as v from 'valibot'
import { describe, expect, it } from 'vitest'

import { allowedOriginsFromEnv, createHttpHandler, MAX_BODY_BYTES } from './http.js'
import { readyLine, SERVER_NAME, SERVER_VERSION } from './server.js'
import { CANONICAL_BEFORE, data } from './test/fixtures.js'
import {
  GetComponentOutput,
  ListComponentsOutput,
  ListTokensOutput,
  SearchUsageOutput,
  TOOL_NAMES,
  ValidateScreenOutput,
} from './tools.js'

type Result = { result?: Record<string, unknown>; error?: { code: number; message: string } }

async function connect() {
  const handler = createHttpHandler(data)
  let id = 0
  let session: string | null = null
  const call = async (method: string, params: Record<string, unknown> = {}) => {
    const response = await handler(
      new Request('https://example.test/mcp', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
          ...(session ? { 'mcp-session-id': session } : {}),
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
      }),
    )
    session ??= response.headers.get('mcp-session-id')
    const text = await response.text()
    // The transport may answer as plain JSON or as one server-sent event.
    const json = text.startsWith('{') ? text : text.replace(/^[\s\S]*?data: /, '').trim()
    return { status: response.status, body: JSON.parse(json) as Result }
  }
  const init = await call('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '1.0.0' },
  })
  const tool = async (name: string, args: Record<string, unknown> = {}) => {
    const { body } = await call('tools/call', { name, arguments: args })
    return body.result as {
      isError?: boolean
      structuredContent?: unknown
      content: { type: string; text: string }[]
    }
  }
  return { call, tool, init }
}

describe('MCP server over HTTP', () => {
  it('introduces itself as Atlas, with instructions and the tools capability', async () => {
    const { init } = await connect()
    expect(init.status).toBe(200)
    expect(init.body.result).toMatchObject({
      serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
      capabilities: { tools: { listChanged: true } },
    })
    expect(init.body.result?.instructions).toContain('validate_screen')
  })

  it('lists the five tools, each read-only with input and output schemas', async () => {
    const { call } = await connect()
    const { body } = await call('tools/list')
    const tools = body.result?.tools as {
      name: string
      annotations: Record<string, boolean>
      inputSchema: object
      outputSchema: object
    }[]
    expect(tools.map((t) => t.name)).toEqual([...TOOL_NAMES])
    for (const t of tools) {
      expect(t.annotations, t.name).toMatchObject({ readOnlyHint: true, destructiveHint: false })
      expect(t.inputSchema, t.name).toMatchObject({ type: 'object' })
      expect(t.outputSchema, t.name).toMatchObject({ type: 'object' })
    }
  })

  it('answers each tool with structured content that matches its output schema', async () => {
    const { tool } = await connect()
    const cases = [
      ['list_components', {}, ListComponentsOutput],
      ['get_component', { name: 'Table' }, GetComponentOutput],
      ['list_tokens', { type: 'color' }, ListTokensOutput],
      ['search_usage', { query: 'primary button' }, SearchUsageOutput],
      ['validate_screen', { code: CANONICAL_BEFORE }, ValidateScreenOutput],
    ] as const
    for (const [name, args, schema] of cases) {
      const result = await tool(name, args)
      expect(result.isError, name).toBeFalsy()
      const parsed = v.parse(schema, result.structuredContent)
      expect(JSON.parse(result.content[0]?.text ?? ''), name).toEqual(parsed)
    }
  })

  it('reports the four issues of the canonical file through MCP', async () => {
    const { tool } = await connect()
    const result = await tool('validate_screen', { code: CANONICAL_BEFORE, filename: 'OrdersPage.tsx' })
    const out = v.parse(ValidateScreenOutput, result.structuredContent)
    expect(out.issues.map((i) => [i.line, i.rule])).toEqual([
      [3, 'internal-import'],
      [7, 'hard-coded-color'],
      [8, 'unknown-component'],
      [9, 'invalid-prop'],
    ])
  })

  it('returns tool errors the agent can act on', async () => {
    const { tool } = await connect()
    const missing = await tool('get_component', { name: 'DataGrid' })
    expect(missing.isError).toBe(true)
    expect(missing.content[0]?.text).toContain('Atlas has no component "DataGrid"')
    const broken = await tool('validate_screen', { code: 'export const S = () => <div>' })
    expect(broken.isError).toBe(true)
    expect(broken.content[0]?.text).toMatch(/^validate_screen couldn't parse the file at line \d+/)
  })

  it('rejects a file over the limit with one short sentence, without echoing the file', async () => {
    const { tool, call } = await connect()
    const result = await tool('validate_screen', { code: 'x'.repeat(100_001) })
    expect(result.isError).toBe(true)
    const text = result.content[0]?.text ?? ''
    expect(text).toContain(
      'The file has 100,001 characters; the limit is 100,000. Send one screen at a time.',
    )
    expect(text.length).toBeLessThan(400)
    // The limit is still in the JSON Schema clients see.
    const { body } = await call('tools/list')
    const validate = (
      body.result?.tools as { name: string; inputSchema: { properties: Record<string, object> } }[]
    ).find((t) => t.name === 'validate_screen')
    expect(validate?.inputSchema.properties.code).toMatchObject({ maxLength: 100_000 })
  })

  it('keeps every schema error short, with the path and no input', async () => {
    const { tool } = await connect()
    const result = await tool('list_tokens', { type: 'x'.repeat(5_000) })
    expect(result.isError).toBe(true)
    expect(result.content[0]?.text).toContain('"path":["type"]')
    expect(result.content[0]?.text.length).toBeLessThan(600)
  })

  it('rejects invalid input through the schema', async () => {
    const { call } = await connect()
    const { body } = await call('tools/call', { name: 'validate_screen', arguments: { code: '' } })
    const failed = body.error !== undefined || (body.result as { isError?: boolean })?.isError === true
    expect(failed).toBe(true)
  })

  it('refuses a streamed body with no length once it passes the limit', async () => {
    const handler = createHttpHandler(data)
    const chunk = new TextEncoder().encode('x'.repeat(64 * 1024))
    let sent = 0
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        if (sent++ < 5) controller.enqueue(chunk)
        else controller.close()
      },
    })
    const response = await handler(
      new Request('https://example.test/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
        body,
        duplex: 'half',
      } as RequestInit),
    )
    expect(response.status).toBe(413)
  })

  it('still answers a streamed body under the limit', async () => {
    const handler = createHttpHandler(data)
    const json = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '1' } },
    })
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(json))
        controller.close()
      },
    })
    const response = await handler(
      new Request('https://example.test/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
        body,
        duplex: 'half',
      } as RequestInit),
    )
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('atlas-design-system')
  })

  it('refuses a request body over the limit before reading it', async () => {
    const handler = createHttpHandler(data)
    const response = await handler(
      new Request('https://example.test/mcp', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'content-length': String(MAX_BODY_BYTES + 1) },
        body: '{}',
      }),
    )
    expect(response.status).toBe(413)
  })
})

describe('Origin (MCP spec: DNS rebinding)', () => {
  const initialize = (handler: (r: Request) => Promise<Response>, origin?: string) =>
    handler(
      new Request('https://example.test/mcp', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
          ...(origin ? { origin } : {}),
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2025-06-18',
            capabilities: {},
            clientInfo: { name: 't', version: '1' },
          },
        }),
      }),
    )

  it('refuses a page of another site with 403', async () => {
    const response = await initialize(createHttpHandler(data, { allowedOrigins: [] }), 'http://evil.example')
    expect(response.status).toBe(403)
    expect(await response.text()).toBe('Origin not allowed: http://evil.example.')
  })

  it.each([undefined, 'http://localhost:5173', 'http://127.0.0.1:8000', 'http://[::1]:3000'])(
    'serves a client with no Origin or a local page (%s)',
    async (origin) => {
      expect((await initialize(createHttpHandler(data, { allowedOrigins: [] }), origin)).status).toBe(200)
    },
  )

  it('serves the allowed production origin, exactly', async () => {
    const handler = createHttpHandler(data, { allowedOrigins: ['https://atlas.example.dev/'] })
    expect((await initialize(handler, 'https://atlas.example.dev')).status).toBe(200)
    expect((await initialize(handler, 'https://atlas.example.dev.evil.example')).status).toBe(403)
    expect((await initialize(handler, 'http://localhost.evil.example')).status).toBe(403)
  })

  it('reads the allowed origins from the environment', () => {
    expect(
      allowedOriginsFromEnv({
        ATLAS_ALLOWED_ORIGINS: 'https://a.example, https://b.example/',
        SITE_URL: 'https://atlas.example.dev/',
        VERCEL_PROJECT_PRODUCTION_URL: 'atlas.vercel.app',
      }),
    ).toEqual([
      'https://a.example',
      'https://b.example',
      'https://atlas.example.dev',
      'https://atlas.vercel.app',
    ])
    expect(allowedOriginsFromEnv({})).toEqual([])
  })
})

describe('ready line', () => {
  it('says the server is ready, with what it serves', () => {
    expect(readyLine(data, 'stdio')).toMatch(
      /^Atlas MCP ready · 0\.2\.0 · 5 tools · 16 components · \d+ tokens · stdio$/,
    )
  })
})
