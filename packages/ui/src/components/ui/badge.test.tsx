import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Badge } from './badge.js'

describe('Badge', () => {
  it('is rounded 4.8 px, not a pill', () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText('New')
    expect(badge).toHaveClass('rounded-md')
    expect(badge.className).not.toContain('rounded-full')
  })

  it.each([
    ['success', 'bg-success-subtle', 'text-success'],
    ['warning', 'bg-warning-subtle', 'text-warning'],
    ['info', 'bg-info-subtle', 'text-info'],
    ['destructive', 'bg-destructive-subtle', 'text-destructive'],
  ] as const)('shows %s on its subtle fill', (variant, bg, fg) => {
    render(<Badge variant={variant}>Paid</Badge>)
    expect(screen.getByText('Paid')).toHaveClass(bg, fg)
    expect(screen.getByText('Paid')).toHaveAttribute('data-variant', variant)
  })

  it('renders a link with asChild', () => {
    render(
      <Badge asChild variant="outline">
        <a href="#v">v0.1.0</a>
      </Badge>,
    )
    expect(screen.getByRole('link', { name: 'v0.1.0' })).toHaveAttribute('data-slot', 'badge')
  })

  it('has no axe violations', async () => {
    render(
      <Badge variant="success">
        <svg aria-hidden />
        Paid
      </Badge>,
    )
    expect(await axeViolations()).toEqual([])
  })
})
