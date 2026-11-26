import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box, Plug, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command'

const meta = {
  title: 'Components/Command',
  excludeStories: ['Palette'],
  component: Command,
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export function Palette() {
  return (
    <>
      <CommandInput placeholder="Search components and tools" />
      <CommandList>
        <CommandEmpty>No results. Try "table" or "badge".</CommandEmpty>
        <CommandGroup heading="Components">
          <CommandItem>
            <Box aria-hidden />
            Table
          </CommandItem>
          <CommandItem>
            <Box aria-hidden />
            Tabs
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="MCP">
          <CommandItem>
            <Plug aria-hidden />
            get_component("Table")
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  )
}

export const Inline: Story = {
  render: () => (
    <Command
      label="Search the docs"
      className="w-[360px] max-w-[calc(100vw-32px)] rounded-lg border shadow-overlay"
    >
      <Palette />
    </Command>
  ),
}

function WithShortcut() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Search aria-hidden />
        Search components
        <kbd className="ml-2 rounded-sm border px-1.5 font-mono text-[11px] text-muted-foreground">⌘K</kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search the docs"
        description="Find a component or an MCP tool"
      >
        <Palette />
      </CommandDialog>
    </>
  )
}

export const Dialog: Story = { render: () => <WithShortcut /> }
