// QA (story Q1): the built server, run the way users run it. Every criterion of story B2,
// over stdio and over HTTP (`--http`), against mcp/dist/cli.js. Skipped before the build;
// `pnpm test:built` runs it after `pnpm build`, as the CI does.
import { type ChildProcessWithoutNullStreams, execFileSync, spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { request as httpRequest } from 'node:http'
import { createServer, type AddressInfo } from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const bin = path.join(root, 'mcp/dist/cli.js')
const built = existsSync(bin)

const TOOLS = ['get_component', 'list_components', 'list_tokens', 'search_usage', 'validate_screen']
const READY = /^Atlas MCP ready · \d+\.\d+\.\d+ · 5 tools · 16 components · \d+ tokens · (stdio|http)/

// One file with the four mistakes validate_screen knows, one per rule (docs/API.md).
const FOUR_MISTAKES = `import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table } from "atlas/src/internal"

export function OrdersPage({ orders }) {
  return (
    <div style={{ background: "#7c3aed" }}>
      <DataGrid rows={orders} />
      <Badge variant="green">Paid</Badge>
    </div>
  )
}
`

/** The same call on each transport. */
const CALLS: [string, Record<string, unknown>][] = [
  ['list_components', {}],
  ['get_component', { name: 'badge' }],
  ['get_component', { name: 'Toast' }],
  ['list_tokens', { type: 'color', query: 'primary' }],
  ['search_usage', { query: 'status color', limit: 3 }],
  ['validate_screen', { code: FOUR_MISTAKES, filename: 'OrdersPage.tsx' }],
]

type Rpc = { id?: number; result?: Record<string, unknown>; error?: { code: number; message: string } }
type ToolResult = {
  isError?: boolean
  structuredContent?: Record<string, unknown>
  content: { type: string; text: string }[]
}
interface Client {
  rpc(method: string, params?: Record<string, unknown>): Promise<Rpc>
  tool(name: string, args?: Record<string, unknown>): Promise<ToolResult>
}

const INIT = {
  protocolVersion: '2025-06-18',
  capabilities: {},
  clientInfo: { name: 'atlas-qa', version: '1.0.0' },
}

function stdioClient(child: ChildProcessWithoutNullStreams): Client {
  const pending = new Map<number, (m: Rpc) => void>()
  let buffer = ''
  child.stdout.setEncoding('utf8')
  child.stdout.on('data', (chunk: string) => {
    buffer += chunk
    let nl: number
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nl).trim()
      buffer = buffer.slice(nl + 1)
      if (!line) continue
      const message = JSON.parse(line) as Rpc
      if (message.id !== undefined) pending.get(message.id)?.(message)
    }
  })
  let id = 0
  const rpc = (method: string, params: Record<string, unknown> = {}) =>
    new Promise<Rpc>((resolve, reject) => {
      const n = ++id
      const timer = setTimeout(() => reject(new Error(`${method} timed out on stdio`)), 10_000)
      pending.set(n, (m) => (clearTimeout(timer), resolve(m)))
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: n, method, params }) + '\n')
    })
  return {
    rpc,
    tool: async (name, args = {}) =>
      (await rpc('tools/call', { name, arguments: args })).result as unknown as ToolResult,
  }
}

function httpClient(url: string): Client & { init(): Promise<Rpc> } {
  let id = 0
  let session: string | null = null
  const rpc = async (method: string, params: Record<string, unknown> = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json, text/event-stream',
        ...(session ? { 'mcp-session-id': session } : {}),
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
    })
    session ??= response.headers.get('mcp-session-id')
    const text = await response.text()
    const json = text.startsWith('{') ? text : text.replace(/^[\s\S]*?data: /, '').trim()
    return JSON.parse(json) as Rpc
  }
  return {
    rpc,
    init: () => rpc('initialize', INIT),
    tool: async (name, args = {}) =>
      (await rpc('tools/call', { name, arguments: args })).result as unknown as ToolResult,
  }
}

async function freePort(): Promise<number> {
  return new Promise((resolve) => {
    const s = createServer().listen(0, '127.0.0.1', () => {
      const { port } = s.address() as AddressInfo
      s.close(() => resolve(port))
    })
  })
}

/** Raw POST with node:http, so the test controls Content-Length and chunking. */
function rawPost(port: number, body: Buffer, { chunked }: { chunked: boolean }): Promise<number> {
  return new Promise((resolve, reject) => {
    const req = httpRequest(
      {
        host: '127.0.0.1',
        port,
        path: '/mcp',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
          ...(chunked ? { 'transfer-encoding': 'chunked' } : { 'content-length': body.length }),
        },
      },
      (res) => {
        res.resume()
        resolve(res.statusCode ?? 0)
      },
    )
    req.on('error', (error) => (error.message.includes('EPIPE') ? undefined : reject(error)))
    if (chunked) {
      for (let i = 0; i < body.length; i += 16 * 1024) req.write(body.subarray(i, i + 16 * 1024))
      req.end()
    } else req.end(body)
  })
}

const waitForLine = (child: ChildProcessWithoutNullStreams, pattern: RegExp) =>
  new Promise<string>((resolve, reject) => {
    let err = ''
    const timer = setTimeout(() => reject(new Error(`no ready line: ${err}`)), 10_000)
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (d: string) => {
      err += d
      const line = err.split('\n').find((l) => pattern.test(l))
      if (line) {
        clearTimeout(timer)
        resolve(line)
      }
    })
  })

describe.runIf(built)('built MCP server (mcp/dist/cli.js)', () => {
  let stdioChild: ChildProcessWithoutNullStreams
  let httpChild: ChildProcessWithoutNullStreams
  let stdio: Client
  let http: ReturnType<typeof httpClient>
  let port: number
  let stdioReady: string
  let httpReady: string

  beforeAll(async () => {
    stdioChild = spawn(process.execPath, [bin], { stdio: 'pipe' })
    const ready = waitForLine(stdioChild, READY)
    stdio = stdioClient(stdioChild)
    await stdio.rpc('initialize', INIT)
    stdioChild.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n')
    stdioReady = await ready

    port = await freePort()
    httpChild = spawn(process.execPath, [bin, '--http'], {
      stdio: 'pipe',
      env: { ...process.env, PORT: String(port) },
    })
    httpReady = await waitForLine(httpChild, READY)
    http = httpClient(`http://127.0.0.1:${port}/mcp`)
    await http.init()
  })

  afterAll(() => {
    stdioChild?.kill()
    httpChild?.kill()
  })

  describe('quickstart diagnostics', () => {
    it('--check prints the ready line on stdout and exits 0', () => {
      const out = execFileSync(process.execPath, [bin, '--check'], { encoding: 'utf8' }).trim()
      expect(out).toMatch(READY)
      expect(out.endsWith('· stdio')).toBe(true)
    })

    it('prints the ready line on stderr, never on stdout, when it serves stdio', () => {
      expect(stdioReady).toMatch(READY)
    })

    it('prints the ready line with the URL when it serves HTTP', () => {
      expect(httpReady).toContain(`· http · http://127.0.0.1:${port}/mcp`)
    })

    // Fixed: https://trello.com/c/yZFTwS3V
    it('--version prints the version the package publishes', () => {
      const version = execFileSync(process.execPath, [bin, '--version'], { encoding: 'utf8' }).trim()
      const pkg = JSON.parse(readFileSync(path.join(root, 'mcp/package.json'), 'utf8')) as { version: string }
      expect(version).toBe(pkg.version)
    })

    it('says why and exits 1 when the port is taken', async () => {
      const taken = spawn(process.execPath, [bin, '--http'], {
        stdio: 'pipe',
        env: { ...process.env, PORT: String(port) },
      })
      let err = ''
      taken.stderr.on('data', (d) => (err += d))
      const code = await new Promise<number | null>((resolve) => taken.on('exit', resolve))
      expect(code).toBe(1)
      expect(err).toContain("Atlas didn't start")
      expect(err).toContain('PORT=')
    })
  })

  describe('the same five tools on stdio and HTTP', () => {
    it('lists the same five tools, each read-only, with the same schemas', async () => {
      const a = (await stdio.rpc('tools/list')).result?.tools as Record<string, unknown>[]
      const b = (await http.rpc('tools/list')).result?.tools as Record<string, unknown>[]
      expect(a.map((t) => t.name).sort()).toEqual(TOOLS)
      expect(b).toEqual(a)
      for (const tool of a) {
        expect(tool.annotations).toMatchObject({ readOnlyHint: true, destructiveHint: false })
        expect(tool.inputSchema).toBeTruthy()
        expect(tool.outputSchema).toBeTruthy()
      }
    })

    it.each(CALLS)(
      '%s answers the same on both, with structured content and the same JSON as text',
      async (name, args) => {
        const a = await stdio.tool(name, args)
        const b = await http.tool(name, args)
        expect(a.isError).toBeFalsy()
        expect(a.structuredContent).toBeTruthy()
        expect(JSON.parse(a.content[0]?.text ?? '')).toEqual(a.structuredContent)
        expect(b).toEqual(a)
      },
    )

    it.each([
      ['stdio', () => stdio],
      ['HTTP', () => http],
    ] as const)('validate_screen finds the 4 mistakes with line and rule id over %s', async (_, client) => {
      const r = await client().tool('validate_screen', { code: FOUR_MISTAKES })
      const s = r.structuredContent as {
        valid: boolean
        issueCount: number
        issues: { line: number; rule: string; fix: string }[]
      }
      expect(s.valid).toBe(false)
      expect(s.issueCount).toBe(4)
      expect(s.issues.map((i) => `${i.line}:${i.rule}`)).toEqual([
        '3:internal-import',
        '7:hard-coded-color',
        '8:unknown-component',
        '9:invalid-prop',
      ])
      for (const issue of s.issues) expect(issue.fix.length).toBeGreaterThan(0)
    })

    it('returns errors the agent can act on: unknown component, unparsable file, unknown tool', async () => {
      const unknown = await http.tool('get_component', { name: 'DataGrid' })
      expect(unknown.isError).toBe(true)
      expect(unknown.content[0]?.text).toContain('Table')
      const broken = await stdio.tool('validate_screen', { code: '<div' })
      expect(broken.isError).toBe(true)
      expect(broken.content[0]?.text).toMatch(/couldn't parse the file at line 1/)
      const write = await http.tool('write_component', {})
      expect(write.isError).toBe(true)
    })
  })

  describe('HTTP is read-only and bounded', () => {
    it('offers only tools: no resources and no prompts', async () => {
      const init = await httpClient(`http://127.0.0.1:${port}/mcp`).init()
      expect(Object.keys(init.result?.capabilities as object)).toEqual(['tools'])
      for (const method of ['resources/list', 'resources/templates/list', 'prompts/list']) {
        expect((await http.rpc(method)).error?.code).toBe(-32601)
      }
    })

    it('listens on 127.0.0.1 only and answers 404 outside /mcp', async () => {
      expect(httpReady).toContain('127.0.0.1')
      const res = await fetch(`http://127.0.0.1:${port}/`)
      expect(res.status).toBe(404)
    })

    // Fixed: https://trello.com/c/tzhqlhgM
    it('refuses a request from a web page of another origin (MCP spec: DNS rebinding)', async () => {
      const res = await fetch(`http://127.0.0.1:${port}/mcp`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
          origin: 'http://evil.example',
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: INIT }),
      })
      expect(res.status).toBe(403)
    })

    it('refuses a body over 256 KB with 413, with Content-Length and in chunks', async () => {
      const big = Buffer.from(
        JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping', pad: 'x'.repeat(260 * 1024) }),
      )
      expect(await rawPost(port, big, { chunked: false })).toBe(413)
      expect(await rawPost(port, big, { chunked: true })).toBe(413)
    })

    it('still answers a chunked body just under 256 KB', async () => {
      const code = 'x'.repeat(90_000)
      const body = Buffer.from(
        JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: INIT,
          pad: 'y'.repeat(150 * 1024),
          code,
        }),
      )
      expect(body.length).toBeLessThan(256 * 1024)
      expect(await rawPost(port, body, { chunked: true })).toBe(200)
    })

    // Fixed: https://trello.com/c/miIyyXnp
    it('rejects a file over 100,000 characters with a short message, without echoing the file', async () => {
      const r = await http.tool('validate_screen', { code: 'x'.repeat(100_001) })
      expect(r.isError).toBe(true)
      expect(r.content[0]?.text).toMatch(/100,?000/)
      expect(r.content[0]?.text.length).toBeLessThan(2_000)
    })
  })
})
