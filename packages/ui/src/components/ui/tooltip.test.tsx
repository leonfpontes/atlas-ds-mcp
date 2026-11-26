import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js'

function CopyId() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger aria-label="Copy order ID">⧉</TooltipTrigger>
        <TooltipContent>Copy order ID</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

describe('Tooltip', () => {
  it('shows on keyboard focus and hides with Esc', async () => {
    render(<CopyId />)
    await userEvent.tab()
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Copy order ID')
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('is inverted: foreground background, background text', async () => {
    render(<CopyId />)
    await userEvent.tab()
    await screen.findByRole('tooltip')
    expect(document.querySelector('[data-slot="tooltip-content"]')).toHaveClass(
      'bg-foreground',
      'text-background',
    )
  })

  it('has no axe violations', async () => {
    render(<CopyId />)
    await userEvent.tab()
    await screen.findByRole('tooltip')
    expect(await axeViolations()).toEqual([])
  })
})
