// Serves the Fetch handler on Node's http module, for running the HTTP transport
// locally (`design-system-mcp --http`). The public endpoint uses the same handler
// on a serverless function instead.

import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'

import { MAX_BODY_BYTES } from './http.js'

async function readBody(req: IncomingMessage): Promise<Buffer | 'too-large'> {
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    size += (chunk as Buffer).length
    if (size > MAX_BODY_BYTES) return 'too-large'
    chunks.push(chunk as Buffer)
  }
  return Buffer.concat(chunks)
}

async function send(res: ServerResponse, response: Response) {
  res.writeHead(response.status, Object.fromEntries(response.headers))
  if (!response.body) return res.end()
  const reader = response.body.getReader()
  res.on('close', () => void reader.cancel().catch(() => {}))
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    res.write(value)
  }
  res.end()
}

export function serveHttp(
  handler: (request: Request) => Promise<Response>,
  { host = '127.0.0.1', port = 8000, path = '/mcp' } = {},
): Server {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', `http://${req.headers.host ?? host}`)
      if (url.pathname !== path)
        return send(res, new Response(`Not found. The MCP endpoint is ${path}.`, { status: 404 }))
      const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req)
      if (body === 'too-large') {
        return send(
          res,
          new Response(`Request too large: the limit is ${MAX_BODY_BYTES} bytes.`, { status: 413 }),
        )
      }
      const headers = new Headers()
      for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
      await send(res, await handler(new Request(url, { method: req.method, headers, body })))
    } catch (error) {
      console.error(`Atlas HTTP error: ${(error as Error).message}`)
      if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain' })
      res.end('Atlas hit an unexpected error.')
    }
  }).listen(port, host)
}
