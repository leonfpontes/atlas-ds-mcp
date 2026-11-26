#!/usr/bin/env node
// Local entry point.
//   npx @leonfpontes/design-system-mcp            MCP over stdin/stdout (Claude Code, Claude Desktop, Cursor)
//   npx @leonfpontes/design-system-mcp --http     MCP over HTTP on http://127.0.0.1:8000/mcp (PORT to change)
//   npx @leonfpontes/design-system-mcp --check    prints the ready line and exits (quickstart connection check)
//   npx @leonfpontes/design-system-mcp --version  prints the version
import { StdioTransport } from '@tmcp/transport-stdio'

import { loadData } from './data.js'
import { createHttpHandler } from './http.js'
import { serveHttp } from './node-http.js'
import { createServer, readyLine, SERVER_VERSION } from './server.js'

const args = new Set(process.argv.slice(2))

if (args.has('--version')) {
  console.log(SERVER_VERSION)
} else {
  try {
    const data = loadData()
    if (args.has('--check')) {
      console.log(readyLine(data, 'stdio'))
    } else if (args.has('--http')) {
      const port = Number(process.env.PORT ?? 8000)
      const server = serveHttp(createHttpHandler(data), { port })
      server.on('listening', () => console.error(`${readyLine(data, 'http')} · http://127.0.0.1:${port}/mcp`))
      server.on('error', (error) => {
        console.error(`Atlas didn't start: ${error.message}. Try another port: PORT=8001`)
        process.exitCode = 1
      })
    } else {
      new StdioTransport(createServer(data)).listen()
      // stdout carries the protocol; humans read stderr.
      console.error(readyLine(data, 'stdio'))
    }
  } catch (error) {
    console.error(`Atlas didn't start: ${(error as Error).message}`)
    console.error(
      'Check Node: node -v should print v20.19 or newer. Then reinstall: npx -y @leonfpontes/design-system-mcp',
    )
    process.exitCode = 1
  }
}
