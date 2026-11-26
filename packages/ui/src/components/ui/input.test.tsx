import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Input } from './input.js'

function Email({ invalid }: { invalid?: boolean }) {
  return (
    <>
      <label htmlFor="email">Customer email</label>
      <Input
        id="email"
        type="email"
        aria-invalid={invalid}
        aria-describedby="email-hint"
        placeholder="name@example.com"
      />
      <p id="email-hint">{invalid ? 'Add the domain, e.g. ana@example.com' : 'We send the receipt here.'}</p>
    </>
  )
}

describe('Input', () => {
  it('is 40 px with a mouse and 44 px on touch', () => {
    render(<Email />)
    expect(screen.getByLabelText('Customer email')).toHaveClass('h-10', 'pointer-coarse:h-11')
  })

  it('takes text and links the hint', async () => {
    render(<Email />)
    const input = screen.getByLabelText('Customer email')
    await userEvent.type(input, 'ana@example.com')
    expect(input).toHaveValue('ana@example.com')
    expect(input).toHaveAccessibleDescription('We send the receipt here.')
  })

  it('marks an error with aria-invalid and the destructive border', () => {
    render(<Email invalid />)
    const input = screen.getByLabelText('Customer email')
    expect(input).toBeInvalid()
    expect(input.className).toContain('aria-invalid:border-destructive')
  })

  it('has no axe violations', async () => {
    render(<Email invalid />)
    expect(await axeViolations()).toEqual([])
  })
})
