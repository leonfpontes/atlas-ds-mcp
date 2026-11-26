// A minimal MCP client over stdio: starts the built Atlas server the way Claude Code does,
// lists its tools and calls them. JSON-RPC ids keep concurrent calls apart.

import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'

export interface McpTool {
  name: string
  description?: string
  inputSchema: Record<string, unknown>
}

export interface McpToolResult {
  content: { type: string; text?: string }[]
  structuredContent?: unknown
  isError?: boolean
}

export interface McpSession {
  serverVersion: string
  instructions: string
  tools: McpTool[]
  callTool(name: string, args: unknown): Promise<McpToolResult>
  close(): void
}

interface JsonRpcReply {
  id?: number
  result?: unknown
  error?: { code: number; message: string }
}

export async function connectStdio(command: string, args: string[], timeoutMs = 15_000): Promise<McpSession> {
  const child: ChildProcessWithoutNullStreams = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] })
  const pending = new Map<number, (reply: JsonRpcReply) => void>()
  let stderr = ''
  let buffer = ''
  let exited: string | undefined
  child.stderr.on('data', (d: Buffer) => (stderr += d.toString()))
  child.on('exit', (code) => {
    exited = `the Atlas MCP server exited (${code}): ${stderr.trim().slice(-300)}`
    for (const resolve of pending.values()) resolve({ error: { code: -1, message: exited } })
    pending.clear()
  })
  child.stdout.on('data', (chunk: Buffer) => {
    buffer += chunk.toString()
    let newline: number
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim()
      buffer = buffer.slice(newline + 1)
      if (!line) continue
      const reply = JSON.parse(line) as JsonRpcReply
      if (reply.id !== undefined) {
        pending.get(reply.id)?.(reply)
        pending.delete(reply.id)
      }
    }
  })

  let nextId = 0
  const request = <T>(method: string, params: unknown = {}): Promise<T> =>
    new Promise((resolve, reject) => {
      if (exited) return reject(new Error(exited))
      const id = ++nextId
      const timer = setTimeout(() => {
        pending.delete(id)
        reject(new Error(`MCP ${method} timed out after ${timeoutMs} ms`))
      }, timeoutMs)
      pending.set(id, (reply) => {
        clearTimeout(timer)
        if (reply.error) reject(new Error(`MCP ${method}: ${reply.error.message}`))
        else resolve(reply.result as T)
      })
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
    })

  try {
    const init = await request<{ serverInfo: { version: string }; instructions?: string }>('initialize', {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'atlas-evals', version: '1.0.0' },
    })
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n')
    const { tools } = await request<{ tools: McpTool[] }>('tools/list')
    return {
      serverVersion: init.serverInfo.version,
      instructions: init.instructions ?? '',
      tools,
      callTool: (name, args) => request<McpToolResult>('tools/call', { name, arguments: args }),
      close: () => child.kill(),
    }
  } catch (error) {
    child.kill()
    throw error
  }
}

/** The text a model reads from a tool answer. */
export function resultText(result: McpToolResult): string {
  return result.content
    .map((c) => c.text ?? '')
    .join('\n')
    .trim()
}
