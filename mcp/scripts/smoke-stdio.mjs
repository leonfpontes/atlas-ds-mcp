// Runs the built server the way Claude Code does (stdio) and checks the quickstart path:
// --check prints the ready line, the handshake works, five tools answer, validate_screen
// finds the four issues of the canonical file. Run after `pnpm build`.
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const bin = fileURLToPath(new URL('../dist/cli.js', import.meta.url))
const fail = (message) => {
  console.error(`✗ stdio smoke test: ${message}`)
  process.exit(1)
}

const ready = execFileSync(process.execPath, [bin, '--check'], { encoding: 'utf8' }).trim()
if (!/^Atlas MCP ready · .+ · 5 tools · 16 components · \d+ tokens · stdio$/.test(ready))
  fail(`unexpected ready line: ${ready}`)

const canonical = `import { Badge } from "@/components/ui/badge"
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

const child = spawn(process.execPath, [bin], { stdio: ['pipe', 'pipe', 'pipe'] })
let stderr = ''
child.stderr.on('data', (d) => (stderr += d))
const pending = new Map()
let buffer = ''
child.stdout.on('data', (chunk) => {
  buffer += chunk
  let newline
  while ((newline = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, newline).trim()
    buffer = buffer.slice(newline + 1)
    if (!line) continue
    const message = JSON.parse(line)
    pending.get(message.id)?.(message)
  }
})
let nextId = 0
const request = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++nextId
    const timer = setTimeout(() => reject(new Error(`${method} timed out`)), 5000)
    pending.set(id, (m) => (clearTimeout(timer), resolve(m)))
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
  })

try {
  const init = await request('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'smoke', version: '1.0.0' },
  })
  if (init.result?.serverInfo?.name !== 'atlas-design-system')
    fail('handshake did not return the Atlas server')
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n')
  const list = await request('tools/list')
  const names = list.result?.tools?.map((t) => t.name) ?? []
  if (names.length !== 5) fail(`expected 5 tools, got ${names.join(', ')}`)
  const result = await request('tools/call', { name: 'validate_screen', arguments: { code: canonical } })
  const rules = result.result?.structuredContent?.issues?.map((i) => `${i.line}:${i.rule}`).join(' ')
  if (rules !== '3:internal-import 7:hard-coded-color 8:unknown-component 9:invalid-prop')
    fail(`validate_screen returned ${rules}`)
  if (!stderr.includes('Atlas MCP ready')) fail('the ready line is missing on stderr')
  console.log(`✓ stdio: ${ready}`)
} catch (error) {
  fail(error.message)
} finally {
  child.kill()
}
