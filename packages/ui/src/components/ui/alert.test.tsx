import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Alert, AlertAction, AlertDescription, AlertTitle } from './alert.js'

describe('Alert', () => {
  it('interrupts only for destructive: role alert there, status elsewhere', () => {
    render(
      <>
        <Alert variant="destructive">
          <AlertTitle>Payment failed</AlertTitle>
        </Alert>
        {(['default', 'success', 'warning', 'info'] as const).map((v) => (
          <Alert key={v} variant={v}>
            <AlertTitle>{v}</AlertTitle>
          </Alert>
        ))}
      </>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Payment failed')
    expect(screen.getAllByRole('status')).toHaveLength(4)
  })

  it('takes a role from the caller', () => {
    render(<Alert role="note">Orders sync every 5 minutes</Alert>)
    expect(screen.getByRole('note')).toBeInTheDocument()
  })

  it.each([
    ['success', 'bg-success-subtle'],
    ['warning', 'bg-warning-subtle'],
    ['info', 'bg-info-subtle'],
    ['destructive', 'bg-destructive-subtle'],
  ] as const)('gives %s its subtle fill', (variant, cls) => {
    render(<Alert variant={variant}>x</Alert>)
    expect(screen.getByRole(variant === 'destructive' ? 'alert' : 'status')).toHaveClass(cls)
  })

  it('keeps a long title whole (no line clamp)', () => {
    render(
      <Alert>
        <AlertTitle>Orders sync every 5 minutes, and the last sync finished at 10:42</AlertTitle>
      </Alert>,
    )
    expect(screen.getByText(/Orders sync/).className).not.toContain('line-clamp')
  })

  it('has no axe violations, with a dismiss action', async () => {
    render(
      <Alert variant="warning">
        <svg aria-hidden />
        <AlertTitle>Low stock</AlertTitle>
        <AlertDescription>3 items left.</AlertDescription>
        <AlertAction>
          <button type="button" aria-label="Dismiss">
            ×
          </button>
        </AlertAction>
      </Alert>,
    )
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
    expect(await axeViolations()).toEqual([])
  })
})
