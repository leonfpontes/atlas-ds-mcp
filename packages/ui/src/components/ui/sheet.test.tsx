import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './sheet.js'

function Order({ side }: { side?: 'left' | 'right' }) {
  return (
    <Sheet>
      <SheetTrigger>Open order #1042</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Order #1042</SheetTitle>
          <SheetDescription>Ana Ruiz · placed today 09:14</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

describe('Sheet', () => {
  it('opens as a named dialog from the right and closes with the close button', async () => {
    render(<Order />)
    await userEvent.click(screen.getByRole('button', { name: 'Open order #1042' }))
    const sheet = screen.getByRole('dialog', { name: 'Order #1042' })
    expect(sheet).toHaveClass('right-0', 'shadow-overlay')
    const close = screen.getByRole('button', { name: 'Close' })
    expect(close).toHaveClass('size-10', 'pointer-coarse:size-11')
    await userEvent.click(close)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('slides from the left when asked', async () => {
    render(<Order side="left" />)
    await userEvent.click(screen.getByRole('button', { name: 'Open order #1042' }))
    expect(screen.getByRole('dialog')).toHaveClass('left-0')
  })

  it('has no axe violations when open', async () => {
    render(<Order />)
    await userEvent.click(screen.getByRole('button', { name: 'Open order #1042' }))
    expect(await axeViolations()).toEqual([])
  })
})
