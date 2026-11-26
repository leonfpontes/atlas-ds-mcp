import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Segmented: Story = {
  render: () => (
    <Tabs defaultValue="all">
      <TabsList aria-label="Order status">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="paid">Paid</TabsTrigger>
        <TabsTrigger value="shipped">Shipped</TabsTrigger>
        <TabsTrigger value="failed">Failed</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="text-sm text-muted-foreground">
        128 orders
      </TabsContent>
      <TabsContent value="paid" className="text-sm text-muted-foreground">
        96 paid
      </TabsContent>
      <TabsContent value="shipped" className="text-sm text-muted-foreground">
        27 shipped
      </TabsContent>
      <TabsContent value="failed" className="text-sm text-muted-foreground">
        5 failed
      </TabsContent>
    </Tabs>
  ),
}

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="preview" className="w-[360px] max-w-[calc(100vw-32px)]">
      <TabsList variant="line" aria-label="View">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="text-sm text-muted-foreground">
        The rendered screen.
      </TabsContent>
      <TabsContent value="code" className="text-sm text-muted-foreground">
        The source of the screen.
      </TabsContent>
    </Tabs>
  ),
}
