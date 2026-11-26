import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Skeleton } from './skeleton.js'

describe('Skeleton', () => {
  it('is hidden from screen readers: the region it fills says it is loading', () => {
    render(
      <div role="region" aria-label="Runs" aria-busy="true">
        <Skeleton data-testid="row" className="h-4 w-48" />
      </div>,
    )
    expect(screen.getByTestId('row')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByRole('region', { name: 'Runs' })).toHaveAttribute('aria-busy', 'true')
  })

  it('takes the --secondary fill, a small radius and stops pulsing with reduced motion', () => {
    render(<Skeleton data-testid="s" />)
    expect(screen.getByTestId('s')).toHaveClass(
      'bg-secondary',
      'rounded-sm',
      'animate-pulse',
      'motion-reduce:animate-none',
    )
  })

  it('takes its size from the caller', () => {
    render(<Skeleton data-testid="s" className="h-4 w-48" />)
    expect(screen.getByTestId('s')).toHaveClass('h-4', 'w-48')
  })

  it('has no axe violations', async () => {
    render(
      <div role="region" aria-label="Runs" aria-busy="true">
        <Skeleton className="h-4 w-48" />
      </div>,
    )
    expect(await axeViolations()).toEqual([])
  })
})
