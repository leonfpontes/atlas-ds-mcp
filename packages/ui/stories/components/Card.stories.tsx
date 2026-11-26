import type { Meta, StoryObj } from '@storybook/react-vite'
import { Plus, Store } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Metric: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Fernhill Market</CardTitle>
        <CardDescription>Orders in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="font-mono text-[28px] font-semibold">128</CardContent>
      <CardFooter>
        <Button variant="outline">View orders</Button>
      </CardFooter>
    </Card>
  ),
}

export const Empty: Story = {
  render: () => (
    <Card className="w-80 items-center text-center">
      <CardHeader className="w-full justify-items-center">
        <Store className="mb-1 size-6 text-muted-foreground" aria-hidden />
        <CardTitle>No orders yet</CardTitle>
        <CardDescription>Share your store link to get the first one.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>
          <Plus aria-hidden />
          Copy store link
        </Button>
      </CardFooter>
    </Card>
  ),
}
