import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Button } from './button.js'

describe('Button', () => {
  it('is 40 px with a mouse and 44 px on touch, never smaller', () => {
    render(
      <>
        <Button>Save order</Button>
        <Button size="icon" aria-label="Copy command">
          ⧉
        </Button>
        <Button size="lg">Save order</Button>
      </>,
    )
    const [def, icon, lg] = screen.getAllByRole('button')
    expect(def).toHaveClass('h-10', 'pointer-coarse:h-11')
    expect(icon).toHaveClass('size-10', 'pointer-coarse:size-11')
    expect(lg).toHaveClass('h-12')
  })

  it.each(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const)(
    'renders the %s variant',
    (variant) => {
      render(<Button variant={variant}>Save order</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant)
    },
  )

  it('uses the destructive-foreground token, not a fixed white', () => {
    render(<Button variant="destructive">Delete order</Button>)
    expect(screen.getByRole('button').className).toContain('text-destructive-foreground')
    expect(screen.getByRole('button').className).not.toContain('text-white')
  })

  it('activates with Enter and Space, and shows the focus ring classes', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save order</Button>)
    const button = screen.getByRole('button', { name: 'Save order' })
    await userEvent.tab()
    expect(button).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
    expect(button.className).toContain('focus-visible:ring-[3px]')
  })

  it('renders a link with asChild', () => {
    render(
      <Button asChild variant="link">
        <a href="/receipt">View receipt</a>
      </Button>,
    )
    expect(screen.getByRole('link', { name: 'View receipt' })).toHaveAttribute('data-slot', 'button')
  })

  it('keeps the label while loading and is busy', () => {
    render(<Button aria-busy="true">Saving…</Button>)
    expect(screen.getByRole('button', { name: 'Saving…' })).toHaveAttribute('aria-busy', 'true')
  })

  it('has no axe violations', async () => {
    render(
      <>
        <Button>Save order</Button>
        <Button variant="outline" size="icon" aria-label="Add order">
          +
        </Button>
      </>,
    )
    expect(await axeViolations()).toEqual([])
  })
})
