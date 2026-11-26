// The stdio MCP client against a tiny fake server, so the test needs no build.
import { describe, expect, it } from 'vitest'

import { connectStdio, resultText } from './mcp-client.js'

const server = (behavior: string) => `
const rl = require('node:readline').createInterface({ input: process.stdin })
const send = (m) => process.stdout.write(JSON.stringify(m) + '\\n')
rl.on('line', (line) => {
  const m = JSON.parse(line)
  if (m.id === undefined) return
  ${behavior}
})
`
const normal = server(`
  if (m.method === 'initialize') send({ jsonrpc: '2.0', id: m.id, result: { serverInfo: { version: '9.9.9' }, instructions: 'Ask me.' } })
  else if (m.method === 'tools/list') send({ jsonrpc: '2.0', id: m.id, result: { tools: [{ name: 'echo', inputSchema: { type: 'object' } }] } })
  else if (m.params.name === 'echo') setTimeout(() => send({ jsonrpc: '2.0', id: m.id, result: { content: [{ type: 'text', text: JSON.stringify(m.params.arguments) }] } }), m.params.arguments.wait ?? 0)
  else if (m.params.name === 'die') process.exit(3)
  else send({ jsonrpc: '2.0', id: m.id, error: { code: -32602, message: 'unknown tool' } })
`)

describe('connectStdio', () => {
  it('does the handshake and lists the tools', async () => {
    const mcp = await connectStdio(process.execPath, ['-e', normal])
    expect(mcp.serverVersion).toBe('9.9.9')
    expect(mcp.instructions).toBe('Ask me.')
    expect(mcp.tools.map((t) => t.name)).toEqual(['echo'])
    mcp.close()
  })

  it('keeps concurrent calls apart by id', async () => {
    const mcp = await connectStdio(process.execPath, ['-e', normal])
    const [slow, fast] = await Promise.all([
      mcp.callTool('echo', { n: 1, wait: 50 }),
      mcp.callTool('echo', { n: 2 }),
    ])
    expect(resultText(slow)).toBe('{"n":1,"wait":50}')
    expect(resultText(fast)).toBe('{"n":2}')
    mcp.close()
  })

  it('turns a JSON-RPC error into a rejected call', async () => {
    const mcp = await connectStdio(process.execPath, ['-e', normal])
    await expect(mcp.callTool('nope', {})).rejects.toThrow('MCP tools/call: unknown tool')
    mcp.close()
  })

  it('rejects pending calls when the server exits', async () => {
    const mcp = await connectStdio(process.execPath, ['-e', normal])
    await expect(mcp.callTool('die', {})).rejects.toThrow('exited (3)')
    await expect(mcp.callTool('echo', {})).rejects.toThrow('exited (3)')
  })

  it('times out a server that never answers the handshake', async () => {
    await expect(connectStdio(process.execPath, ['-e', server('')], 300)).rejects.toThrow(
      'MCP initialize timed out after 300 ms',
    )
  })
})
