import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'

const meta = {
  title: 'Components/Toast',
  excludeStories: ['orderCreated'],
  component: Toaster,
  decorators: [
    (Story) => (
      <>
        {Story()}
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const orderCreated = () =>
  toast.success('Order #1043 created', {
    description: 'Ana Ruiz · $64.00',
    action: { label: 'Undo', onClick: () => toast('Order #1043 removed') },
  })

export const Default: Story = {
  render: () => (
    <Button variant="outline" onClick={orderCreated}>
      Create order
    </Button>
  ),
}

function Shown() {
  useEffect(() => {
    orderCreated()
  }, [])
  return <p className="text-sm text-muted-foreground">The toast shows at the bottom right.</p>
}

export const Shown_: Story = { name: 'Shown', render: () => <Shown />, parameters: { layout: 'fullscreen' } }
