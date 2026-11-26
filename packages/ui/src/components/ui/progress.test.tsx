import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Progress } from './progress.js'

const indicator = () => document.querySelector<HTMLElement>('[data-slot="progress-indicator"]')!

describe('Progress', () => {
  it('is a named progressbar with its value', () => {
    render(<Progress value={66} aria-label="66% of the budget used" />)
    const bar = screen.getByRole('progressbar', { name: '66% of the budget used' })
    expect(bar).toHaveAttribute('aria-valuenow', '66')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('fills to the share of max, and never past it', () => {
    const { rerender } = render(<Progress value={3.3} max={5} aria-label="Budget" />)
    expect(indicator().style.transform).toBe('translateX(-34%)')
    rerender(<Progress value={9} max={5} aria-label="Budget" />)
    expect(indicator().style.transform).toMatch(/^translateX\(-?0%\)$/)
  })

  it('stops at max without a console error, and says the real number when it is over', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { rerender } = render(<Progress value={9} max={5} variant="destructive" aria-label="Budget" />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '5')
    expect(bar).toHaveAttribute('aria-valuetext', '9 of 5')
    expect(bar).toHaveAttribute('data-state', 'complete')
    expect(indicator().style.transform).toMatch(/^translateX\(-?0%\)$/)
    rerender(
      <Progress
        value={0.31}
        max={0.25}
        variant="destructive"
        aria-label="Budget"
        aria-valuetext="$0.31 of $0.25"
      />,
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '$0.31 of $0.25')
    rerender(<Progress value={-2} max={5} aria-label="Budget" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    expect(errors).not.toHaveBeenCalled()
    errors.mockRestore()
  })

  it('keeps the Radix value text under the max, and no value means indeterminate', () => {
    const { rerender } = render(<Progress value={33} aria-label="Upload" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '33%')
    rerender(<Progress aria-label="Upload" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-state', 'indeterminate')
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it.each([
    ['default', 'bg-primary'],
    ['neutral', 'bg-foreground'],
    ['destructive', 'bg-destructive'],
  ] as const)('gives the %s variant its fill', (variant, cls) => {
    render(<Progress value={50} variant={variant} aria-label="Budget" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-variant', variant)
    expect(indicator()).toHaveClass(cls)
  })

  it('is not a pill: a --secondary track with a small radius', () => {
    render(<Progress value={10} aria-label="Budget" />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveClass('bg-secondary', 'rounded-sm')
    expect(bar.className).not.toContain('rounded-full')
  })

  it('has no axe violations', async () => {
    render(<Progress value={100} variant="destructive" aria-label="100% of the budget used" />)
    expect(await axeViolations()).toEqual([])
  })
})
