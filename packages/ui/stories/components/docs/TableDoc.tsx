import type { ReactNode } from 'react'

import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { EmptyTable, ErrorTable, LoadingTable, OrdersRows } from '../Table.stories'

const Head = () => (
  <TableHeader>
    <TableRow>
      <TableHead>Order</TableHead>
      <TableHead className="max-[480px]:hidden">Customer</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Total</TableHead>
    </TableRow>
  </TableHeader>
)

const Frame = ({ children, label }: { children: ReactNode; label: string }) => (
  <figure className="m-0 grid gap-2">
    <figcaption className="font-mono text-xs text-muted-foreground">{label}</figcaption>
    <div className="overflow-hidden rounded-lg border bg-card">{children}</div>
  </figure>
)

export function TableDoc() {
  return (
    <ComponentDoc
      name="Table"
      lead="Rows of records you compare or scan. Header in muted text, rows 48 px, money in mono and right-aligned."
      shadcn="https://ui.shadcn.com/docs/components/table"
      stories={5}
      canvas={{
        rows: [
          {
            label: 'data',
            children: (
              <div className="w-full overflow-hidden rounded-lg border bg-card">
                <Table aria-label="Orders">
                  <Head />
                  <OrdersRows />
                </Table>
              </div>
            ),
          },
        ],
        snippet:
          '<TableRow>\n  <TableCell>#1042</TableCell>\n  <TableCell className="text-right font-mono">$84.00</TableCell>\n</TableRow>',
        source: `import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function OrdersTable({ orders }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.id}>
            <TableCell>{o.id}</TableCell>
            <TableCell>
              <Badge variant={o.status}>{o.label}</Badge>
            </TableCell>
            <TableCell className="text-right font-mono">{o.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}`,
      }}
      extra={[
        {
          id: 'states',
          label: 'States',
          node: (
            <div className="grid gap-5">
              <Frame label="empty">
                <EmptyTable />
              </Frame>
              <Frame label="loading">
                <LoadingTable />
              </Frame>
              <Frame label="error">
                <ErrorTable />
              </Frame>
            </div>
          ),
        },
      ]}
      doExample={{
        node: <span className="font-mono text-[13px] tabular-nums">$84.00 · $132.10</span>,
        text: 'Numbers in mono, right-aligned, so the decimals line up.',
      }}
      dontExample={{
        node: <span className="text-sm">A table header with zero rows</span>,
        text: "An empty table with no message. Say why it's empty and what to do.",
      }}
      a11y={[
        <>
          Give the table a name: <code>aria-label</code> or a <code>TableCaption</code>.
        </>,
        <>
          While loading, the header stays and the table has <code>aria-busy="true"</code>.
        </>,
        'Status cells use badges with an icon and a word.',
        "On narrow screens the table scrolls inside its own box; the page doesn't.",
      ]}
    />
  )
}
