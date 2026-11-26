import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.js'

function Status({ variant }: { variant?: 'default' | 'line' }) {
  return (
    <Tabs defaultValue="all">
      <TabsList variant={variant} aria-label="Order status">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="paid">Paid</TabsTrigger>
      </TabsList>
      <TabsContent value="all">128 orders</TabsContent>
      <TabsContent value="paid">96 paid</TabsContent>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('moves between tabs with the arrow keys', async () => {
    render(<Status />)
    await userEvent.click(screen.getByRole('tab', { name: 'All' }))
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Paid' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('96 paid')
  })

  it('triggers are 40 px, 44 px on touch', () => {
    render(<Status />)
    expect(screen.getByRole('tab', { name: 'All' })).toHaveClass(
      'h-10',
      'min-w-10',
      'pointer-coarse:h-11',
      'pointer-coarse:min-w-11',
    )
  })

  it('shows a focus ring on the panel, which is a tab stop', async () => {
    render(<Status />)
    await userEvent.click(screen.getByRole('tab', { name: 'All' }))
    await userEvent.tab()
    const panel = screen.getByRole('tabpanel')
    expect(panel).toHaveFocus()
    expect(panel).toHaveClass('focus-visible:ring-[3px]', 'focus-visible:ring-ring/50')
  })

  it('has a line variant for docs', () => {
    render(<Status variant="line" />)
    expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', 'line')
  })

  it('has no axe violations', async () => {
    render(<Status />)
    expect(await axeViolations()).toEqual([])
  })
})
