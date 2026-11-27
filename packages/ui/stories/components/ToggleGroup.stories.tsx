import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId } from 'react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

const meta = {
  title: 'Components/Toggle Group',
  excludeStories: ['SearchMode', 'GraphView', 'LinkTypes'],
  component: ToggleGroup,
  // The stories render their own groups; the required prop only satisfies the types.
  args: { type: 'single' },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

/** The search mode of a question box: one mode at a time, named by the visible label. */
export function SearchMode() {
  // The docs page shows this demo three times: each copy needs its own id.
  const label = useId()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span id={label} className="text-[13px] text-muted-foreground">
        Search
      </span>
      <ToggleGroup type="single" defaultValue="hybrid" aria-labelledby={label}>
        <ToggleGroupItem value="hybrid">Hybrid</ToggleGroupItem>
        <ToggleGroupItem value="vectors">Vectors</ToggleGroupItem>
        <ToggleGroupItem value="graph">Graph</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

/** A view switch on a canvas toolbar: ghost, words only (an outlined square would read as an unchecked box). */
export function GraphView() {
  return (
    <ToggleGroup type="single" variant="ghost" defaultValue="3d" aria-label="Graph view">
      <ToggleGroupItem value="3d">3D</ToggleGroupItem>
      <ToggleGroupItem value="2d">2D</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
    </ToggleGroup>
  )
}

/** Several options on at once (type multiple): a toolbar of toggles. */
export function LinkTypes() {
  return (
    <ToggleGroup type="multiple" defaultValue={['owner', 'decided_in']} aria-label="Link types">
      <ToggleGroupItem value="mentions" className="font-mono">
        mentions
      </ToggleGroupItem>
      <ToggleGroupItem value="owner" className="font-mono">
        owner
      </ToggleGroupItem>
      <ToggleGroupItem value="decided_in" className="font-mono">
        decided_in
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export const Default: Story = { name: 'Search mode', render: () => <SearchMode /> }

export const Ghost: Story = { render: () => <GraphView /> }

export const Multiple: Story = { render: () => <LinkTypes /> }
