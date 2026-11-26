// Test data: the real manifest and tokens from the workspace, read from source,
// so the tests run before any build.
import { loadData } from '../data.js'

export const data = loadData(
  new URL('../../../packages/ui/atlas.manifest.json', import.meta.url),
  new URL('../../../packages/tokens/tokens.json', import.meta.url),
)

/** The canonical "before" file of the site, README cover and social preview (docs/DESIGN.md). */
export const CANONICAL_BEFORE = `import { Badge } from "@/components/ui/badge"
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

/** The same screen after the agent applied the fixes. */
export const CANONICAL_AFTER = `import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { OrdersTable } from "./orders-table"

export function OrdersPage({ orders }) {
  return (
    <Card>
      <OrdersTable orders={orders} />
      <Badge variant="success">Paid</Badge>
    </Card>
  )
}
`
