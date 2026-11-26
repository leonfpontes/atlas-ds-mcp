import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

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
