import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select.js'

function Status() {
  return (
    <Select defaultValue="all">
      <SelectTrigger aria-label="Status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="shipped">Shipped</SelectItem>
      </SelectContent>
    </Select>
  )
}

describe('Select', () => {
  it('trigger matches the Input: 40 px, 44 px on touch', () => {
    render(<Status />)
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveClass('h-10', 'pointer-coarse:h-11')
  })

  it('opens with the keyboard and picks an option', async () => {
    render(<Status />)
    const trigger = screen.getByRole('combobox', { name: 'Status' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    await userEvent.click(await screen.findByRole('option', { name: 'Paid' }))
    expect(trigger).toHaveTextContent('Paid')
  })

  it('has no axe violations', async () => {
    render(<Status />)
    expect(await axeViolations()).toEqual([])
  })
})
