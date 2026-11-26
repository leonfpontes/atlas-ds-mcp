import { Command } from '@/components/ui/command'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { Palette } from '../Command.stories'

export function CommandDoc() {
  return (
    <ComponentDoc
      name="Command"
      lead="A search-first list of actions. Atlas uses it for the ⌘K search in the docs."
      shadcn="https://ui.shadcn.com/docs/components/command"
      primitive={{ label: 'cmdk', href: 'https://github.com/pacocoursey/cmdk', pkg: 'cmdk' }}
      stories={3}
      canvas={{
        rows: [
          {
            label: 'palette',
            children: (
              <Command
                label="Search the docs"
                className="w-[360px] max-w-full rounded-lg border shadow-overlay"
              >
                <Palette />
              </Command>
            ),
          },
        ],
        snippet:
          '<CommandDialog open={open} onOpenChange={setOpen}>\n  <CommandInput placeholder="Search components and tools" />\n</CommandDialog>',
        source: `import { useState } from "react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function DocsSearch() {
  const [open, setOpen] = useState(false)
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search components and tools" />
      <CommandList>
        <CommandEmpty>No results. Try "table" or "badge".</CommandEmpty>
        <CommandGroup heading="Components">
          <CommandItem>Table</CommandItem>
          <CommandItem>Tabs</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}`,
      }}
      doExample={{
        node: <p className="text-sm">"No results. Try "table" or "badge"."</p>,
        text: 'An empty result says what to try next.',
      }}
      dontExample={{
        node: <p className="text-sm">"Nothing found."</p>,
        text: "A dead end. The person doesn't know what the search covers.",
      }}
      a11y={[
        <>
          Arrow keys move through items, <kbd>Enter</kbd> runs one, <kbd>Esc</kbd> closes the dialog.
        </>,
        <>
          Give <code>Command</code> a <code>label</code>; <code>CommandDialog</code> has a hidden title and
          description for screen readers.
        </>,
        'Items are 40 px tall (44 on touch).',
      ]}
    />
  )
}
