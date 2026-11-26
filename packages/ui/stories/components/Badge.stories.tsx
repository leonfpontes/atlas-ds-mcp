import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from '@/components/ui/badge'

import { StatusBadge } from '../blocks/fixtures'

const meta = {
  title: 'Components/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

export const Status: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="failed" />
      <StatusBadge status="paid" />
      <StatusBadge status="low-stock" />
      <StatusBadge status="shipped" />
    </div>
  ),
}
