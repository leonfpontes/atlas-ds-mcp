import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card.js'

function Citation({ open }: { open?: boolean }) {
  return (
    <p>
      The frame ships in March{' '}
      <HoverCard defaultOpen={open}>
        <HoverCardTrigger href="#source-1" aria-label="Source 1">
          1
        </HoverCardTrigger>
        <HoverCardContent>
          <strong>Frame supplier decision</strong>
          <blockquote>We move the frame order to March.</blockquote>
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  )
}

afterEach(() => vi.useRealTimers())

describe('HoverCard', () => {
  it('is closed until the pointer rests on the trigger', () => {
    render(<Citation />)
    expect(screen.queryByText('Frame supplier decision')).not.toBeInTheDocument()
  })

  it('opens on keyboard focus too, and closes on blur', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<Citation />)
    const link = screen.getByRole('link', { name: 'Source 1' })
    act(() => link.focus())
    await act(() => vi.advanceTimersByTimeAsync(350))
    expect(screen.getByText('Frame supplier decision')).toBeInTheDocument()
    act(() => link.blur())
    await act(() => vi.advanceTimersByTimeAsync(400))
    expect(screen.queryByText('Frame supplier decision')).not.toBeInTheDocument()
  })

  it('waits 300 ms before it opens (Radix waits 700)', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<Citation />)
    await userEvent.hover(screen.getByRole('link', { name: 'Source 1' }))
    await act(() => vi.advanceTimersByTimeAsync(150))
    expect(screen.queryByText('Frame supplier decision')).not.toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(250))
    expect(screen.getByText('Frame supplier decision')).toBeInTheDocument()
  })

  it('keeps the trigger a real link: a click goes to the source', () => {
    render(<Citation />)
    expect(screen.getByRole('link', { name: 'Source 1' })).toHaveAttribute('href', '#source-1')
  })

  it('is a 320 px card that never passes the screen edge, with the overlay shadow', () => {
    render(<Citation open />)
    const card = document.querySelector('[data-slot="hover-card-content"]')!
    expect(card).toHaveClass('w-80', 'max-w-[calc(100vw-2rem)]', 'bg-popover', 'shadow-overlay', 'rounded-lg')
  })

  it('has no axe violations when open', async () => {
    render(<Citation open />)
    expect(await axeViolations()).toEqual([])
  })
})
