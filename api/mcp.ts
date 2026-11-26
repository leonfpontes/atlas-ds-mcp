// The public MCP endpoint on Vercel: the same Fetch handler as `design-system-mcp --http`,
// read-only, with the 256 KB body limit and the Origin check (ADR 0005). The function reads the
// component manifest and the tokens from disk; vercel.json ships both with `includeFiles`.
import path from 'node:path'

import { createHttpHandler, loadData } from '@leonfpontes/design-system-mcp'

const root = process.cwd()
const data = loadData(
  new URL(`file://${path.join(root, 'mcp/data/manifest.json')}`),
  new URL(`file://${path.join(root, 'packages/tokens/tokens.json')}`),
)
const handle = createHttpHandler(data)

export const GET = handle
export const POST = handle
export const DELETE = handle
