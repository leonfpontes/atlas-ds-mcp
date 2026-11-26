import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoaderCircle, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Save order' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2.5">
      <Button>Save order</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="secondary">Export</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">View receipt</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  name: 'With icon',
  render: () => (
    <div className="flex flex-wrap gap-2.5">
      <Button>
        <Plus aria-hidden />
        With icon
      </Button>
      <Button variant="outline" size="icon" aria-label="Add order">
        <Plus aria-hidden />
      </Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <Button aria-busy="true" onClick={(e) => e.preventDefault()}>
      <LoaderCircle className="animate-spin" aria-hidden />
      Saving…
    </Button>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="grid justify-items-start gap-2">
      <Button disabled aria-describedby="save-hint">
        Save order
      </Button>
      <p id="save-hint" className="text-sm text-muted-foreground">
        Add a customer to continue.
      </p>
    </div>
  ),
}
