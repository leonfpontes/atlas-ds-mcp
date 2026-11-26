import type { Meta, StoryObj } from '@storybook/react-vite'
import { OctagonX, Plus, Store } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { ORDERS, StatusBadge } from '../blocks/fixtures'

const meta = {
  title: 'Components/Table',
  excludeStories: ['OrdersRows', 'EmptyTable', 'LoadingTable', 'ErrorTable'],
  component: Table,
  decorators: [
    (Story) => (
      <div className="w-[560px] max-w-[calc(100vw-32px)] overflow-hidden rounded-lg border bg-card">
        {Story()}
      </div>
    ),
  ],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

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

export function OrdersRows() {
  return (
    <TableBody>
      {ORDERS.map((o) => (
        <TableRow key={o.id}>
          <TableCell>{o.id}</TableCell>
          <TableCell className="max-[480px]:hidden">{o.customer}</TableCell>
          <TableCell>
            <StatusBadge status={o.status} />
          </TableCell>
          <TableCell className="text-right font-mono text-[13px] tabular-nums">{o.total}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}

export const Data: Story = {
  render: () => (
    <Table aria-label="Orders">
      <Head />
      <OrdersRows />
    </Table>
  ),
}

export function EmptyTable() {
  return (
    <>
      <Table aria-label="Orders">
        <Head />
      </Table>
      <div className="grid justify-items-center gap-1 px-6 py-8 text-center">
        <Store className="size-6 text-muted-foreground" aria-hidden />
        <b className="font-medium">No orders yet</b>
        <p className="text-sm text-muted-foreground">New orders show up here.</p>
        <Button variant="outline" className="mt-1.5">
          <Plus aria-hidden />
          Create order
        </Button>
      </div>
    </>
  )
}

export function LoadingTable() {
  return (
    <Table aria-label="Orders" aria-busy="true">
      <Head />
      <TableBody>
        {[44, 40, 44, 40].map((w, i) => (
          <TableRow key={i}>
            {[w, 72, 56, 48].map((x, j) => (
              <TableCell key={j} className={j === 1 ? 'max-[480px]:hidden' : undefined}>
                <span
                  className={
                    j === 3
                      ? 'ml-auto block h-2.5 rounded-sm bg-secondary'
                      : 'block h-2.5 rounded-sm bg-secondary'
                  }
                  style={{ width: x }}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function ErrorTable() {
  return (
    <>
      <Table aria-label="Orders">
        <Head />
      </Table>
      <div className="p-3">
        <Alert variant="destructive">
          <OctagonX aria-hidden />
          <AlertTitle>Couldn't load orders</AlertTitle>
          <AlertDescription>
            <p>The server didn't answer.</p>
            <Button variant="outline" className="mt-2.5">
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </>
  )
}

export const Empty: Story = { render: () => <EmptyTable /> }
export const Loading: Story = { render: () => <LoadingTable /> }
export const ErrorState: Story = { name: 'Error', render: () => <ErrorTable /> }
