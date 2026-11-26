import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Textarea } from './textarea.js'

function Reason({ invalid }: { invalid?: boolean }) {
  return (
    <>
      <label htmlFor="reason">Reason</label>
      <Textarea
        id="reason"
        aria-invalid={invalid}
        aria-describedby="reason-hint"
        placeholder="For example: keep stock checks out of scope"
      />
      <p id="reason-hint">
        {invalid ? 'Add a reason of at least 10 characters.' : 'The agent reads this before it tries again.'}
      </p>
    </>
  )
}

describe('Textarea', () => {
  it('starts at 88 px, grows with the text and resizes only vertically', () => {
    render(<Reason />)
    expect(screen.getByLabelText('Reason')).toHaveClass('min-h-22', 'field-sizing-content', 'resize-y')
  })

  it('takes several lines and links the hint', async () => {
    render(<Reason />)
    const field = screen.getByLabelText('Reason')
    await userEvent.type(field, 'Also refuse a quantity{enter}above the stock')
    expect(field).toHaveValue('Also refuse a quantity\nabove the stock')
    expect(field).toHaveAccessibleDescription('The agent reads this before it tries again.')
  })

  it('marks an error with aria-invalid and the destructive border', () => {
    render(<Reason invalid />)
    const field = screen.getByLabelText('Reason')
    expect(field).toBeInvalid()
    expect(field.className).toContain('aria-invalid:border-destructive')
  })

  it('uses tokens only: the page background and the subtle placeholder', () => {
    render(<Reason />)
    expect(screen.getByLabelText('Reason')).toHaveClass(
      'bg-background',
      'placeholder:text-text-subtle',
      'focus-visible:ring-[3px]',
    )
  })

  it('has no axe violations', async () => {
    render(<Reason invalid />)
    expect(await axeViolations()).toEqual([])
  })
})
