import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Checkbox } from './checkbox.js'

const box = () => document.querySelector<HTMLElement>('[data-slot="checkbox-box"]')!

describe('Checkbox', () => {
  it('is a checkbox named by the label around it, and the label toggles it', async () => {
    const onChange = vi.fn()
    render(
      <label>
        <Checkbox onCheckedChange={onChange} /> Decision
      </label>,
    )
    const cb = screen.getByRole('checkbox', { name: 'Decision' })
    expect(cb).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(screen.getByText('Decision'))
    expect(cb).toHaveAttribute('aria-checked', 'true')
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('toggles with the space bar', async () => {
    render(<Checkbox aria-label="Person" defaultChecked />)
    const cb = screen.getByRole('checkbox', { name: 'Person' })
    cb.focus()
    await userEvent.keyboard(' ')
    expect(cb).toHaveAttribute('aria-checked', 'false')
  })

  it('has a 40 px hit area (44 on touch) that takes no layout space, around a 16 px box', () => {
    render(<Checkbox aria-label="Project" />)
    expect(screen.getByRole('checkbox')).toHaveClass(
      'size-10',
      '-m-3',
      'pointer-coarse:size-11',
      'pointer-coarse:-m-3.5',
    )
    expect(box()).toHaveClass('size-4', 'border-input', 'rounded-[4px]')
  })

  it('shows a check when checked and a dash when indeterminate', () => {
    const { rerender } = render(<Checkbox aria-label="All types" checked />)
    const cb = screen.getByRole('checkbox')
    expect(cb).toHaveAttribute('data-state', 'checked')
    expect(box()).toHaveClass('group-data-[state=checked]/checkbox:bg-primary')
    expect(document.querySelector('.lucide-check')).not.toHaveClass('hidden')
    rerender(<Checkbox aria-label="All types" checked="indeterminate" />)
    expect(cb).toHaveAttribute('aria-checked', 'mixed')
    expect(cb).toHaveAttribute('data-state', 'indeterminate')
    expect(document.querySelector('.lucide-minus')).toHaveClass(
      'group-data-[state=indeterminate]/checkbox:block',
    )
  })

  it('draws the focus ring and the error on the box, not on the hit area', () => {
    render(<Checkbox aria-label="Terms" aria-invalid />)
    expect(box()).toHaveClass(
      'group-focus-visible/checkbox:ring-[3px]',
      'group-aria-invalid/checkbox:border-destructive',
    )
    expect(screen.getByRole('checkbox')).toHaveClass('outline-none')
  })

  it('cannot be changed when disabled', async () => {
    render(<Checkbox aria-label="Customer" disabled />)
    const cb = screen.getByRole('checkbox')
    await userEvent.click(cb)
    expect(cb).toHaveAttribute('aria-checked', 'false')
    expect(cb).toBeDisabled()
  })

  it('has no axe violations', async () => {
    render(
      <fieldset>
        <legend>Note types</legend>
        <label>
          <Checkbox defaultChecked /> Person
        </label>
        <label>
          <Checkbox checked="indeterminate" /> Project
        </label>
        <label>
          <Checkbox disabled /> Customer
        </label>
      </fieldset>,
    )
    expect(await axeViolations()).toEqual([])
  })
})
