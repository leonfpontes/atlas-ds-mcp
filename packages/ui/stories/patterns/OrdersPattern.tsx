import { Plus, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { ORDERS, StatusBadge } from '../blocks/fixtures'

/** The orders list page, built only from Atlas components. */
export function OrdersPattern() {
  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-4 pb-3">
        <div>
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-[13px] text-muted-foreground">Fernhill Market · last 30 days</p>
        </div>
        <Button>
          <Plus aria-hidden />
          New order
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 px-5 pb-3">
        <div className="relative min-w-[180px] flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input aria-label="Search orders" placeholder="Search orders" className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger aria-label="Status" className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mx-5 overflow-hidden rounded-lg border bg-card">
        <Table aria-label="Orders">
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead className="max-[900px]:hidden">Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ORDERS.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell className="max-[900px]:hidden">{o.customer}</TableCell>
                <TableCell>
                  <StatusBadge status={o.status} />
                </TableCell>
                <TableCell className="text-right font-mono text-[13px] tabular-nums">{o.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-3 pb-4 text-[13px] text-muted-foreground">
        <span>Showing 1–4 of 128 orders</span>
        <nav aria-label="Pagination" className="flex gap-1">
          <Button variant="ghost" disabled className="min-w-10 px-2.5 text-[13px] pointer-coarse:min-w-11">
            Previous
          </Button>
          <Button
            variant="outline"
            aria-current="page"
            className="min-w-10 px-2.5 text-[13px] pointer-coarse:min-w-11"
          >
            1
          </Button>
          <Button variant="ghost" className="min-w-10 px-2.5 text-[13px] pointer-coarse:min-w-11">
            2
          </Button>
          <Button variant="ghost" className="min-w-10 px-2.5 text-[13px] pointer-coarse:min-w-11">
            3
          </Button>
          <Button variant="ghost" className="min-w-10 px-2.5 text-[13px] pointer-coarse:min-w-11">
            Next
          </Button>
        </nav>
      </div>
    </div>
  )
}

export const ORDERS_SOURCE = `import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function OrdersPage({ orders }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.id}>
            <TableCell>{o.id}</TableCell>
            <TableCell><Badge variant={o.status}>{o.label}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}`
