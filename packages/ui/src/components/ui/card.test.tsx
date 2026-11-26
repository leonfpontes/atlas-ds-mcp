import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card.js'

describe('Card', () => {
  it('is flat: a border, radius xl and no shadow', () => {
    render(<Card data-testid="card">x</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveClass('border', 'rounded-xl', 'bg-card')
    expect(card.className).not.toMatch(/shadow/)
  })

  it('renders every part in its slot', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Fernhill Market</CardTitle>
          <CardDescription>Orders in the last 30 days</CardDescription>
          <CardAction>
            <button type="button">View orders</button>
          </CardAction>
        </CardHeader>
        <CardContent>128</CardContent>
        <CardFooter>Updated 10:42</CardFooter>
      </Card>,
    )
    for (const slot of [
      'card-header',
      'card-title',
      'card-description',
      'card-action',
      'card-content',
      'card-footer',
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull()
    }
    expect(screen.getByText('128')).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>
            <h3>Fernhill Market</h3>
          </CardTitle>
        </CardHeader>
      </Card>,
    )
    expect(await axeViolations()).toEqual([])
  })
})
