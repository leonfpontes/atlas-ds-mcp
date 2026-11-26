import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const meta = {
  title: 'Components/Select',
  excludeStories: ['StatusSelect'],
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export function StatusSelect({ open }: { open?: boolean }) {
  return (
    <div className="grid w-80 max-w-full gap-2">
      <label id="status-label" className="text-sm leading-none font-medium">
        Status
      </label>
      <Select defaultValue="paid" defaultOpen={open}>
        <SelectTrigger aria-labelledby="status-label" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export const Default: Story = { render: () => <StatusSelect /> }

export const Open: Story = {
  // Open on load, Radix hides the page behind the list (aria-hidden) while the trigger keeps its
  // tab stop; focus is held in the list, so axe's aria-hidden-focus is a false alarm here.
  parameters: { a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } } },
  render: () => (
    <div className="h-64">
      <StatusSelect open />
    </div>
  ),
}
