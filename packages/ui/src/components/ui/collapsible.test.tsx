import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChevronDown } from 'lucide-react'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Button } from './button.js'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible.js'

function Properties({ open }: { open?: boolean }) {
  return (
    <Collapsible defaultOpen={open}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost">
          Properties
          <ChevronDown aria-hidden />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <dl>
          <dt>type</dt>
          <dd>decision</dd>
        </dl>
      </CollapsibleContent>
    </Collapsible>
  )
}

describe('Collapsible', () => {
  it('starts closed, and the trigger says so', () => {
    render(<Properties />)
    const trigger = screen.getByRole('button', { name: 'Properties' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('decision')).not.toBeInTheDocument()
  })

  it('opens and closes from the trigger, which controls the content', async () => {
    render(<Properties />)
    const trigger = screen.getByRole('button', { name: 'Properties' })
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('data-state', 'open')
    const content = screen.getByText('decision').closest('[data-slot="collapsible-content"]')!
    expect(trigger).toHaveAttribute('aria-controls', content.id)
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens with Enter and Space', async () => {
    render(<Properties />)
    const trigger = screen.getByRole('button', { name: 'Properties' })
    trigger.focus()
    await userEvent.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard(' ')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens without motion or a clipping box, so focus rings inside are never cut', () => {
    render(<Properties open />)
    const content = document.querySelector('[data-slot="collapsible-content"]')!
    expect(content.className).toBe('')
  })

  it('has no axe violations, open or closed', async () => {
    const { rerender } = render(<Properties />)
    expect(await axeViolations()).toEqual([])
    rerender(<Properties open />)
    expect(await axeViolations()).toEqual([])
  })
})
