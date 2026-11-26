import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from './command.js'

function Palette({ onSelect }: { onSelect?: (v: string) => void }) {
  return (
    <>
      <CommandInput placeholder="Search components and tools" />
      <CommandList>
        <CommandEmpty>No results. Try "table" or "badge".</CommandEmpty>
        <CommandGroup heading="Components">
          <CommandItem onSelect={onSelect}>Table</CommandItem>
          <CommandItem onSelect={onSelect}>Tabs</CommandItem>
          <CommandItem onSelect={onSelect}>
            Badge
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  )
}

describe('Command', () => {
  it('filters as you type and says what to try when nothing matches', async () => {
    render(
      <Command label="Search the docs">
        <Palette />
      </Command>,
    )
    const input = screen.getByPlaceholderText('Search components and tools')
    await userEvent.type(input, 'tab')
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Table', 'Tabs'])
    await userEvent.clear(input)
    await userEvent.type(input, 'zzz')
    expect(screen.getByText(/No results/)).toBeInTheDocument()
  })

  it('runs the highlighted item with the arrow keys and Enter', async () => {
    const onSelect = vi.fn()
    render(
      <Command label="Search the docs">
        <Palette onSelect={onSelect} />
      </Command>,
    )
    await userEvent.click(screen.getByPlaceholderText('Search components and tools'))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onSelect).toHaveBeenCalledWith('Tabs')
  })

  it('items are 40 px tall, 44 px on touch', () => {
    render(
      <Command label="Search the docs">
        <Palette />
      </Command>,
    )
    expect(screen.getAllByRole('option')[0]).toHaveClass('min-h-10', 'pointer-coarse:min-h-11')
    expect(screen.getByPlaceholderText('Search components and tools')).toHaveClass(
      'h-10',
      'pointer-coarse:h-11',
    )
  })

  it('in a dialog, has a hidden title for screen readers', () => {
    render(
      <CommandDialog open title="Search the docs" description="Find a component">
        <Palette />
      </CommandDialog>,
    )
    expect(screen.getByRole('dialog', { name: 'Search the docs' })).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    render(
      <Command label="Search the docs">
        <Palette />
      </Command>,
    )
    expect(await axeViolations()).toEqual([])
  })
})
