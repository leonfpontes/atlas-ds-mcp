import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Button } from './button.js'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog.js'

function DeleteOrder() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete order #1041?</DialogTitle>
          <DialogDescription>The customer won't be notified.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

describe('Dialog', () => {
  it('opens from the trigger, is named by its title and closes with Esc, returning focus', async () => {
    render(<DeleteOrder />)
    const trigger = screen.getByRole('button', { name: 'Delete order' })
    await userEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Delete order #1041?' })
    expect(dialog).toHaveAccessibleDescription("The customer won't be notified.")
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(trigger).toHaveFocus()
  })

  it('has a 40 px close button (44 on touch) with a label', async () => {
    render(<DeleteOrder />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete order' }))
    const close = screen.getByRole('button', { name: 'Close' })
    expect(close).toHaveClass('size-10', 'pointer-coarse:size-11')
  })

  it('uses the overlay shadow and a token scrim', async () => {
    render(<DeleteOrder />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete order' }))
    expect(document.querySelector('[data-slot="dialog-content"]')).toHaveClass('shadow-overlay')
    const overlay = document.querySelector('[data-slot="dialog-overlay"]')
    expect(overlay?.className).not.toContain('bg-black')
  })

  it('has no axe violations when open', async () => {
    render(<DeleteOrder />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete order' }))
    expect(await axeViolations()).toEqual([])
  })
})
