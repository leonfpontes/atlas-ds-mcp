import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import { ScrollArea, ScrollBar } from './scroll-area.js'

const viewport = () => document.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')!

const NOTES = Array.from({ length: 30 }, (_, i) => `Note ${i + 1}`)

describe('ScrollArea', () => {
  it('renders its content in a viewport', () => {
    render(
      <ScrollArea className="h-40">
        <ul>
          {NOTES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </ScrollArea>,
    )
    expect(screen.getByText('Note 30')).toBeInTheDocument()
    expect(viewport()).toContainElement(screen.getByText('Note 1'))
  })

  it('shows the scrollbar whenever the content overflows (type auto), not only on hover', () => {
    render(<ScrollArea className="h-40">x</ScrollArea>)
    // Radix sets overflow on the viewport from the type; "auto" scrolls like overflow: auto.
    expect(viewport().style.overflowY).toBe('scroll')
  })

  it('becomes a named region keyboard users can scroll when it has a label', () => {
    render(
      <ScrollArea aria-label="Neighbors" className="h-40">
        <p>Text only</p>
      </ScrollArea>,
    )
    const region = screen.getByRole('region', { name: 'Neighbors' })
    expect(region).toBe(viewport())
    expect(region).toHaveAttribute('tabindex', '0')
    expect(document.querySelector('[data-slot="scroll-area"]')).not.toHaveAttribute('aria-label')
  })

  it('stays out of the tab order without a label (focusable content inside is enough)', () => {
    render(
      <ScrollArea className="h-40">
        <button type="button">Person</button>
      </ScrollArea>,
    )
    expect(viewport()).not.toHaveAttribute('tabindex')
    expect(viewport()).not.toHaveAttribute('role')
  })

  it('draws the focus ring inside, where the root does not clip it', () => {
    render(<ScrollArea aria-label="Filters">x</ScrollArea>)
    expect(viewport()).toHaveClass('focus-visible:ring-[3px]', 'focus-visible:ring-inset')
  })

  it('lets text wrap to the width of the area: the content box is a block, not a table', () => {
    render(<ScrollArea className="h-40 w-40">A long sentence that has to wrap.</ScrollArea>)
    expect(viewport()).toHaveClass('[&>div]:!block')
    expect((viewport().firstElementChild as HTMLElement).style.display).toBe('table')
  })

  it('keeps the vertical bar 3 px in from the edge, clear of the focus ring and the border', () => {
    render(
      <ScrollArea type="always" aria-label="Neighbors" className="h-40">
        x
      </ScrollArea>,
    )
    const bar = document.querySelector('[data-slot="scroll-area-scrollbar"][data-orientation="vertical"]')
    expect(bar).toHaveClass('my-[3px]', 'me-[3px]')
    expect(bar).not.toHaveClass('h-full')
  })

  it('takes a horizontal scrollbar', () => {
    render(
      <ScrollArea type="always" className="w-40">
        <div className="w-96">wide</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>,
    )
    expect(
      document.querySelector('[data-slot="scroll-area-scrollbar"][data-orientation="horizontal"]'),
    ).toHaveClass('h-2.5', 'flex-col', 'mx-[3px]', 'mb-[3px]')
  })

  it('has no axe violations, with and without a label', async () => {
    render(
      <>
        <ScrollArea aria-label="Neighbors" className="h-40">
          <p>Text only</p>
        </ScrollArea>
        <ScrollArea className="h-40">
          <button type="button">Person</button>
        </ScrollArea>
      </>,
    )
    expect(await axeViolations()).toEqual([])
  })
})
