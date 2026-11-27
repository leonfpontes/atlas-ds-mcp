import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { TypeFilters } from './Checkbox.stories'

const meta = {
  title: 'Components/Scroll Area',
  excludeStories: ['FiltersPanel', 'NeighborsPanel', 'LinkTags', 'NEIGHBORS'],
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

/** Notes one link away from a note, with the link type. Example data. */
export const NEIGHBORS = [
  ['Head of product', 'owner'],
  ['Weekly sync, 14 March', 'decided_in'],
  ['Trail e-bike', 'mentions'],
  ['Frame supplier, 2025', 'supersedes'],
  ['March production plan', 'mentions'],
  ['Dealer pricing sheet', 'mentions'],
  ['Battery warranty terms', 'mentions'],
  ['Spring launch checklist', 'mentions'],
  ['Color options review', 'mentions'],
] as const

/** A side panel of filters: a fixed height, the list scrolls inside it. */
export function FiltersPanel() {
  return (
    <ScrollArea className="h-64 w-72 max-w-full rounded-lg border bg-card">
      <div className="p-3">
        <TypeFilters />
      </div>
    </ScrollArea>
  )
}

/** Text only, nothing to focus: the label makes the viewport a region the keyboard can scroll. */
export function NeighborsPanel() {
  return (
    <ScrollArea aria-label="Neighbors" className="h-56 w-72 max-w-full rounded-lg border bg-card">
      <ul className="m-0 grid list-none gap-0.5 p-4 text-sm">
        {NEIGHBORS.map(([title, rel]) => (
          <li key={title} className="flex min-h-10 items-center justify-between gap-3">
            <span>{title}</span>
            <span className="font-mono text-xs text-muted-foreground">{rel}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}

/** A row that scrolls sideways: add a horizontal ScrollBar inside. */
export function LinkTags() {
  return (
    <ScrollArea aria-label="Link types" className="w-72 max-w-full rounded-lg border">
      <div className="flex w-max gap-2 p-3">
        {['mentions', 'owner', 'decided_in', 'supersedes', 'attended', 'customer_of', 'documents'].map(
          (t) => (
            <Badge key={t} variant="secondary" className="font-mono">
              {t}
            </Badge>
          ),
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export const Default: Story = { name: 'Filters panel', render: () => <FiltersPanel /> }

export const Labelled: Story = { name: 'Text only', render: () => <NeighborsPanel /> }

export const Horizontal: Story = { render: () => <LinkTags /> }
