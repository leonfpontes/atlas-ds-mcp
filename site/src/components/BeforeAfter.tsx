import {
  Badge,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@leonfpontes/atlas-ui'
import { CircleCheck, Info, OctagonX, Plus, Search } from 'lucide-react'
import type { ReactNode } from 'react'

import { GuessedScreen } from './GuessedScreen'
import { Section, SectionHead } from './Section'

function Shot({
  title,
  sub,
  badge,
  children,
  output,
}: {
  title: string
  sub: string
  badge: ReactNode
  children: ReactNode
  output: ReactNode
}) {
  return (
    <figure className="m-0 flex flex-col overflow-hidden rounded-lg border">
      <figcaption className="flex items-center justify-between gap-2.5 border-b bg-muted px-4 py-3">
        <div>
          <b className="text-[15px] font-semibold">{title}</b>
          <small className="block text-[13px] text-muted-foreground">{sub}</small>
        </div>
        {badge}
      </figcaption>
      {children}
      <div className="min-h-[150px] bg-code-bg px-4 py-3 font-mono text-[13px]/[1.8] text-code-fg">
        {output}
      </div>
    </figure>
  )
}

const ORDERS = [
  ['#1042', 'Ana Ruiz', 'success', CircleCheck, 'Paid', '$84.00'],
  ['#1041', 'Tom Becker', 'destructive', OctagonX, 'Failed', '$19.50'],
  ['#1040', 'Mei Lin', 'info', Info, 'Shipped', '$132.10'],
] as const

/** The screen built with Atlas, rendered with the real components at a thumbnail's density. */
function AtlasScreen() {
  return (
    <div className="flex-1 bg-background text-sm" aria-hidden="true" inert>
      <div className="flex items-end justify-between gap-3 px-5 pt-4 pb-3">
        <div>
          <p className="text-lg font-semibold">Orders</p>
          <p className="text-[13px] text-muted-foreground">Fernhill Market · last 30 days</p>
        </div>
        <Button className="h-9 text-[13px] pointer-coarse:h-9" tabIndex={-1}>
          <Plus aria-hidden />
          New order
        </Button>
      </div>
      <div className="flex gap-2 px-5 pb-3">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            placeholder="Search orders"
            className="h-9 pl-9 text-[13px] pointer-coarse:h-9"
            tabIndex={-1}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger
            className="h-9 w-[130px] text-[13px] max-[600px]:hidden pointer-coarse:h-9"
            tabIndex={-1}
          >
            <SelectValue placeholder="All statuses">All statuses</SelectValue>
          </SelectTrigger>
        </Select>
      </div>
      <div className="mx-5 overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-10">Order</TableHead>
              <TableHead className="h-10 max-[600px]:hidden">Customer</TableHead>
              <TableHead className="h-10">Status</TableHead>
              <TableHead className="h-10 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ORDERS.map(([id, who, variant, Icon, label, total]) => (
              <TableRow key={id}>
                <TableCell className="h-11">{id}</TableCell>
                <TableCell className="h-11 max-[600px]:hidden">{who}</TableCell>
                <TableCell className="h-11">
                  <Badge variant={variant}>
                    <Icon />
                    {label}
                  </Badge>
                </TableCell>
                <TableCell className="h-11 text-right font-mono text-[13px]">{total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-3 pb-4 text-[13px] text-muted-foreground">
        <span>Showing 1–3 of 128 orders</span>
        <span className="flex gap-1 text-foreground">
          {['‹ Previous', '1', '2', '3', '…', 'Next ›'].map((p) => (
            <span
              key={p}
              className={`inline-grid h-8 min-w-8 place-items-center rounded-md px-2 ${p === '1' ? 'border bg-background' : ''}`}
            >
              {p}
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}

const ISSUES = [
  'line 3 · internal import atlas/src/internal',
  'line 7 · hard-coded color #7c3aed',
  'line 8 · unknown component <DataGrid>',
  'line 9 · Badge has no variant "green"',
]

export function BeforeAfter() {
  return (
    <Section id="before-after">
      <div className="wrap">
        <div className="mb-6">
          <SectionHead
            eyebrow="04 · Before and after"
            title={<span id="before-after-title">"Build an orders page for Fernhill Market"</span>}
          >
            Fernhill Market is a made-up store. Same prompt, same model, run twice.
          </SectionHead>
        </div>
        <div className="grid grid-cols-2 gap-6 max-[1000px]:grid-cols-1">
          <Shot
            title="What the agent guessed"
            sub="Without the MCP server"
            badge={
              <Badge variant="destructive">
                <OctagonX />4 issues
              </Badge>
            }
            output={
              <>
                <span className="text-code-dim">$ validate_screen OrdersPage.tsx</span>
                {ISSUES.map((t, i) => (
                  <span key={t} className="block">
                    <span className="text-code-del">✗</span> <b className="issue-chip">{i + 1}</b> {t}
                  </span>
                ))}
              </>
            }
          >
            <GuessedScreen />
          </Shot>
          <Shot
            title="What it built with Atlas"
            sub="With the MCP server"
            badge={
              <Badge variant="success">
                <CircleCheck />0 issues
              </Badge>
            }
            output={
              <>
                <span className="text-code-dim">$ validate_screen OrdersPage.tsx</span>
                <span className="block">
                  <span className="text-code-add">✓</span> 0 issues
                </span>
                <span className="block text-code-dim"> uses Card, Table, Badge, Button, Input, Select</span>
                <span className="block text-code-dim"> tokens only · valid props</span>
                <span className="block text-code-dim"> public imports only</span>
              </>
            }
          >
            <AtlasScreen />
          </Shot>
        </div>
        <p className="mt-3.5 flex items-start gap-2 text-sm text-muted-foreground">
          <Info className="mt-[3px] size-4 flex-none" aria-hidden />
          The purple gradient on the left is what the model invented on its own. It is shown on purpose, as
          the problem Atlas solves.
        </p>
      </div>
    </Section>
  )
}
