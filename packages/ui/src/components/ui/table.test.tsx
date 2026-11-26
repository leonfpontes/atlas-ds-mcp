import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table.js'

function Orders() {
  return (
    <Table>
      <TableCaption>Today's orders</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>#1042</TableCell>
          <TableCell className="text-right">$84.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right">$84.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

describe('Table', () => {
  it('is a real table named by its caption, inside a scroll container', () => {
    render(<Orders />)
    const table = screen.getByRole('table', { name: "Today's orders" })
    expect(table.parentElement).toHaveClass('overflow-x-auto')
    expect(within(table).getAllByRole('row')).toHaveLength(3)
  })

  it('header in muted text, rows 48 px', () => {
    render(<Orders />)
    expect(screen.getByRole('columnheader', { name: 'Order' })).toHaveClass('text-muted-foreground', 'h-11')
    expect(screen.getAllByRole('cell')[0]).toHaveClass('h-12')
  })

  it('has no axe violations', async () => {
    render(<Orders />)
    expect(await axeViolations()).toEqual([])
  })
})
