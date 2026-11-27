import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { ToggleGroup, ToggleGroupItem } from './toggle-group.js'

function Search({ onValueChange }: { onValueChange?: (v: string) => void }) {
  return (
    <ToggleGroup type="single" defaultValue="hybrid" aria-label="Search" onValueChange={onValueChange}>
      <ToggleGroupItem value="hybrid">Hybrid</ToggleGroupItem>
      <ToggleGroupItem value="vectors">Vectors</ToggleGroupItem>
      <ToggleGroupItem value="graph">Graph</ToggleGroupItem>
    </ToggleGroup>
  )
}

describe('ToggleGroup', () => {
  it('is a named radio group when type is single', () => {
    render(<Search />)
    expect(screen.getByRole('radiogroup', { name: 'Search' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Hybrid' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Vectors' })).toHaveAttribute('aria-checked', 'false')
  })

  it('picks another value on click and tells the app', async () => {
    const onValueChange = vi.fn()
    render(<Search onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Graph' }))
    expect(screen.getByRole('radio', { name: 'Graph' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Hybrid' })).toHaveAttribute('aria-checked', 'false')
    expect(onValueChange).toHaveBeenCalledWith('graph')
  })

  it('keeps the value when the pressed item is pressed again (a radio group never empties)', async () => {
    const onValueChange = vi.fn()
    render(<Search onValueChange={onValueChange} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Hybrid' }))
    expect(screen.getByRole('radio', { name: 'Hybrid' })).toHaveAttribute('aria-checked', 'true')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('works controlled too, and still never empties', async () => {
    function Controlled() {
      const [v, setV] = useState('vectors')
      return (
        <>
          <ToggleGroup type="single" value={v} onValueChange={setV} aria-label="Search">
            <ToggleGroupItem value="hybrid">Hybrid</ToggleGroupItem>
            <ToggleGroupItem value="vectors">Vectors</ToggleGroupItem>
          </ToggleGroup>
          <output>{v || 'empty'}</output>
        </>
      )
    }
    render(<Controlled />)
    await userEvent.click(screen.getByRole('radio', { name: 'Vectors' }))
    expect(screen.getByRole('status')).toHaveTextContent('vectors')
    await userEvent.click(screen.getByRole('radio', { name: 'Hybrid' }))
    expect(screen.getByRole('status')).toHaveTextContent('hybrid')
  })

  it('moves with the arrow keys', async () => {
    render(<Search />)
    screen.getByRole('radio', { name: 'Hybrid' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Vectors' })).toHaveFocus()
  })

  it('lets type multiple press several items and clear them all', async () => {
    render(
      <ToggleGroup type="multiple" aria-label="Links" defaultValue={['owner']}>
        <ToggleGroupItem value="owner">owner</ToggleGroupItem>
        <ToggleGroupItem value="mentions">mentions</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(screen.getByRole('toolbar', { name: 'Links' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'mentions' }))
    expect(screen.getByRole('button', { name: 'mentions' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'owner' }))
    expect(screen.getByRole('button', { name: 'owner' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('is a joined segmented control by default: 40 px (44 on touch), the pressed item on --secondary', () => {
    render(<Search />)
    const on = screen.getByRole('radio', { name: 'Hybrid' })
    expect(on).toHaveAttribute('data-variant', 'outline')
    expect(on).toHaveClass(
      'h-10',
      'min-w-10',
      'pointer-coarse:h-11',
      'first:rounded-l-md',
      'not-first:-ml-px',
      'data-[state=on]:bg-secondary',
      'data-[state=on]:border-input',
    )
    expect(on).toHaveAttribute('data-state', 'on')
  })

  it('has a ghost variant with no border', () => {
    render(
      <ToggleGroup type="single" variant="ghost" defaultValue="a" aria-label="View">
        <ToggleGroupItem value="a">3D</ToggleGroupItem>
      </ToggleGroup>,
    )
    const item = screen.getByRole('radio', { name: '3D' })
    expect(item).toHaveAttribute('data-variant', 'ghost')
    expect(item.className).not.toContain('border-border')
  })

  it('has no axe violations', async () => {
    render(<Search />)
    expect(await axeViolations()).toEqual([])
  })
})
