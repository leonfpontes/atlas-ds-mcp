import type { AddressInfo } from 'node:net'

import { afterAll, describe, expect, it } from 'vitest'

import { createHttpHandler, MAX_BODY_BYTES } from './http.js'
import { serveHttp } from './node-http.js'
import { data } from './test/fixtures.js'

const server = serveHttp(createHttpHandler(data), { port: 0 })
await new Promise((resolve) => server.once('listening', resolve))
const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`
afterAll(() => new Promise((resolve) => server.close(resolve)))

const post = (path: string, body: string) =>
  fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body,
  })

describe('local HTTP server', () => {
  it('answers the MCP handshake on /mcp', async () => {
    const response = await post(
      '/mcp',
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '1' } },
      }),
    )
    expect(response.status).toBe(200)
    expect(await response.text()).toContain('atlas-design-system')
  })

  it('answers 404 elsewhere and 413 for a body over the limit', async () => {
    expect((await post('/other', '{}')).status).toBe(404)
    expect((await post('/mcp', 'x'.repeat(MAX_BODY_BYTES + 1))).status).toBe(413)
  })
})
