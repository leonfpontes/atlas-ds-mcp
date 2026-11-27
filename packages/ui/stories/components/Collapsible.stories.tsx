import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

const meta = {
  title: 'Components/Collapsible',
  excludeStories: ['Properties', 'Constellation', 'PROPS'],
  component: Collapsible,
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

/** The frontmatter of an example note. Example data. */
export const PROPS = [
  ['type', 'decision'],
  ['status', 'accepted'],
  ['owner', 'head-of-product'],
  ['decided_in', 'weekly-sync-2026-03-14'],
  ['updated', '2026-03-14'],
] as const

/** The properties of a note: a table that opens and closes, open by default on wide screens. */
export function Properties({ open = true }: { open?: boolean }) {
  return (
    <Collapsible defaultOpen={open} className="w-80 max-w-full">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="-ml-3 [&[data-state=open]>svg]:rotate-180">
          Properties (frontmatter)
          <ChevronDown aria-hidden className="transition-transform duration-(--dur-fast)" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <dl className="m-0 mt-2.5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 font-mono text-[13px]">
          {PROPS.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="m-0 [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
        </dl>
      </CollapsibleContent>
    </Collapsible>
  )
}

/** A block of a list view: the group's name and count open its notes. Example data. */
export function Constellation() {
  return (
    <Collapsible defaultOpen className="w-80 max-w-full rounded-lg border">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto min-h-14 w-full justify-between rounded-lg px-4 py-1.5 font-normal [&[data-state=open]>svg]:rotate-180"
        >
          <span>
            <strong className="font-semibold">Trail e-bike</strong>{' '}
            <span className="font-mono text-[13px] text-muted-foreground">35 notes</span>
          </span>
          <ChevronDown aria-hidden />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="m-0 grid list-none gap-0.5 border-t px-4 py-2 text-sm">
          <li className="flex min-h-10 items-center">Frame supplier for the spring range</li>
          <li className="flex min-h-10 items-center">Weekly sync, 14 March</li>
          <li className="flex min-h-10 items-center">Head of product</li>
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const Default: Story = { name: 'Properties', render: () => <Properties /> }

export const Closed: Story = { render: () => <Properties open={false} /> }

export const Group: Story = { render: () => <Constellation /> }
