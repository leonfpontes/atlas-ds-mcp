// The demo's timeline: what is on screen and which caption shows at each moment. The tool
// answers are not written here: Demo.tsx runs the MCP server's own validate_screen and
// get_component on these two files.

export const BAD_FILE = `import { Badge } from "@/components/ui/badge"
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

export const FIXED_FILE = `import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { OrdersTable } from "./OrdersTable"
export function OrdersPage({ orders }) {
  return (
    <Card>
      <OrdersTable orders={orders} />
      <Badge variant="success">Paid</Badge>
    </Card>
  )
}
`

export const PROMPT = 'Check src/OrdersPage.tsx against Atlas and fix what it finds'

/** Scenes of the 1-minute video, in ms. The GIF plays the demo scene alone. */
export const SCENES = { problem: [0, 10_000], demo: [10_000, 50_000], number: [50_000, 60_000] } as const
export const VIDEO_MS = 60_000

/** Demo-scene moments, in ms from the start of the demo scene. */
export const AT = {
  typeEnd: 3_000,
  check1: 3_600,
  issues: 4_600,
  lookCard: 11_000,
  lookTable: 13_000,
  lookBadge: 15_000,
  edit: 18_000,
  fixLines: [19_000, 20_200, 21_400, 22_600, 23_800, 25_000],
  check2: 28_000,
  clean: 29_500,
  summary: 33_000,
} as const

/** English captions only, no narration (owner's decision). Times are absolute, in ms. */
const SCRIPTED: { from: number; to: number; text: string }[] = [
  { from: 0, to: 5_000, text: 'Coding agents guess at your design system.' },
  {
    from: 5_000,
    to: 10_000,
    text: 'Hex colors, made-up components, wrong props. It looks fine; it isn’t your system.',
  },
  { from: 10_000, to: 14_600, text: 'Here the agent asks Atlas to check a screen.' },
  { from: 14_600, to: 21_000, text: 'validate_screen finds 4 issues, each with a line, a rule and a fix.' },
  { from: 21_000, to: 28_000, text: 'The agent looks up the real components instead of guessing.' },
  {
    from: 28_000,
    to: 38_000,
    text: 'It fixes each line: a public import, Card, a defined component, a real variant.',
  },
  { from: 38_000, to: 43_000, text: 'Then it checks again: 0 issues.' },
  { from: 43_000, to: 50_000, text: 'The agent can run this check on every screen, before you review it.' },
]

/** Every caption, the last one with the run size from latest.json. */
export function captionsFor(n: { prompts: number; runs: number } | null) {
  return [
    ...SCRIPTED,
    {
      from: 50_000,
      to: 60_000,
      text: n
        ? `Measured on ${n.prompts} prompts × ${n.runs} runs: valid screens with the Atlas lookups vs without.`
        : 'No evaluation run yet.',
    },
  ]
}
