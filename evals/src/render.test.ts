// The render test runs in its own process; these run it for real on small screens.
// The "components" mode needs packages/ui/dist; on a clean clone (pnpm check tests before it
// builds) those cases are skipped and the stand-in cases still run.
import { existsSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import type { RenderMode } from './contracts.js'
import { renderScreen, REPO_ROOT, UI_DIST } from './render.js'

const good = `import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { toast } from "sonner"

const orders = [{ id: 1, status: "paid" }]

export default function OrdersPage() {
  const [query] = useState("")
  return (
    <Card>
      <CardContent onClick={() => toast.success("Saved")}>
        {orders.map((o) => (
          <Badge key={o.id} variant="success"><Check aria-hidden />{o.status}{query}</Badge>
        ))}
      </CardContent>
    </Card>
  )
}
`

const built = existsSync(UI_DIST)
const modes: [RenderMode, boolean][] = [
  ['stand-ins', true],
  ['components', built],
]

// Each case starts a Node process that renderScreen already stops after 20 s. Vitest's 5 s
// default cut it short on a busy machine, before that real limit: give the cases 30 s.
const RENDER_TEST_TIMEOUT = 30_000

describe.each(modes)('renderScreen with %s', { timeout: RENDER_TEST_TIMEOUT }, (mode, available) => {
  const render = (code: string, timeoutMs?: number) => renderScreen(code, { mode, timeoutMs })

  it.runIf(available)('renders a screen built from Atlas, React, lucide and sonner', async () => {
    expect(await render(good)).toEqual({ rendered: true })
  })

  it.runIf(available).each([
    ['an Atlas file that does not exist', good.replace('ui/badge', 'ui/label'), 'cannot resolve import'],
    [
      'another UI library',
      `import { Button } from "@mui/material"\nexport default function P() { return <Button /> }`,
      'cannot resolve import',
    ],
    ['a component nobody defined', 'export default function P() { return <DataGrid /> }', 'DataGrid'],
    [
      'a screen that needs props',
      'export default function P({ rows }) { return <p>{rows.length}</p> }',
      'length',
    ],
    ['a syntax error', 'export default function P() { return <div> }', 'does not compile'],
    ['a file with no component', 'export const n = 1', 'no component'],
  ])('fails on %s', async (_name, code, error) => {
    const result = await render(code)
    expect(result.rendered).toBe(false)
    expect(result.error).toContain(error)
  })

  it.runIf(available)('cannot write files', async () => {
    // node:fs can't be imported (not a known module), so reach it the way a hostile screen would.
    const code = `export default function P() {
  process.getBuiltinModule("node:fs").writeFileSync("evals-write-test.txt", "y")
  return <div />
}`
    const result = await render(code)
    expect(result.rendered).toBe(false)
    expect(result.error).toMatch(/restricted|ERR_ACCESS_DENIED/i)
  })

  it.runIf(available)('gets none of the harness environment', async () => {
    process.env.ATLAS_RENDER_TEST_SECRET = 'must-not-leak'
    try {
      const code = `export default function P() { if (process.env.ATLAS_RENDER_TEST_SECRET) throw new Error("leaked"); return <div /> }`
      expect(await render(code)).toEqual({ rendered: true })
    } finally {
      delete process.env.ATLAS_RENDER_TEST_SECRET
    }
  })

  it.runIf(available)('cannot read files at the repository root, where .env.local lives', async () => {
    const readme = JSON.stringify(path.join(REPO_ROOT, 'README.md'))
    const code = `export default function P() { process.getBuiltinModule("node:fs").readFileSync(${readme}); return <div /> }`
    const result = await render(code)
    expect(result.rendered).toBe(false)
    expect(result.error).toMatch(/ERR_ACCESS_DENIED|restricted/)
  })

  it.runIf(available)('kills a screen that never finishes', async () => {
    const result = await render('export default function P() { while (true) {} }', 2_000)
    expect(result).toEqual({ rendered: false, error: 'render timed out after 2000 ms' })
  })
})

describe.runIf(built)('renderScreen with the real components', { timeout: RENDER_TEST_TIMEOUT }, () => {
  it('fails on an icon lucide-react does not have', async () => {
    const result = await renderScreen(good.replace(/\bCheck\b/g, 'NotARealIcon'), { mode: 'components' })
    expect(result.rendered).toBe(false)
  })

  it('fails on a Tooltip outside its TooltipProvider, as the app would', async () => {
    const code = `import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
export default function P() {
  return <Tooltip><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>Tip</TooltipContent></Tooltip>
}
`
    const result = await renderScreen(code, { mode: 'components' })
    expect(result).toEqual({ rendered: false, error: '`Tooltip` must be used within `TooltipProvider`' })
  })

  it('renders the Atlas primitives that need a provider or a portal', async () => {
    const code = `import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

export default function P() {
  return (
    <div>
      <Tabs defaultValue="a"><TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList><TabsContent value="a">A</TabsContent></Tabs>
      <Select><SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger><SelectContent><SelectItem value="x">X</SelectItem></SelectContent></Select>
      <Dialog><DialogTrigger asChild><Button>Open</Button></DialogTrigger><DialogContent><DialogTitle>T</DialogTitle></DialogContent></Dialog>
      <TooltipProvider><Tooltip><TooltipTrigger asChild><Button>Hover</Button></TooltipTrigger><TooltipContent>Tip</TooltipContent></Tooltip></TooltipProvider>
      <Toaster />
    </div>
  )
}
`
    expect(await renderScreen(code, { mode: 'components' })).toEqual({ rendered: true })
  })
})
