import { act, render, screen } from '@testing-library/react'
import { toast } from 'sonner'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Toaster } from './sonner.js'

describe('Toaster (Sonner)', () => {
  it('shows a toast in a labelled live region, with the action', async () => {
    render(<Toaster />)
    act(() => {
      toast.success('Order #1043 created', { action: { label: 'Undo', onClick: () => {} } })
    })
    expect(await screen.findByText('Order #1043 created')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveClass('h-10!', 'pointer-coarse:h-11!')
    expect(screen.getByRole('region', { name: /Notifications/ })).toBeInTheDocument()
  })

  it('takes its colors from the tokens, so it follows the dark theme', async () => {
    render(<Toaster />)
    act(() => {
      toast('Order saved')
    })
    await screen.findByText('Order saved')
    const style = document.querySelector('[data-sonner-toaster]')?.getAttribute('style') ?? ''
    expect(style).toContain('--normal-bg: var(--popover)')
    expect(style).toContain('--normal-border: var(--border)')
  })

  it('has no axe violations', async () => {
    render(<Toaster />)
    act(() => {
      toast('Order #1043 created')
    })
    await screen.findByText('Order #1043 created')
    expect(await axeViolations()).toEqual([])
  })
})
