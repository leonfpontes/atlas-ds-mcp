import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { Field, StatusBadge } from '../blocks/fixtures'

const meta = {
  title: 'Components/Sheet',
  excludeStories: ['OrderSheet'],
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export function OrderSheet({ open }: { open?: boolean }) {
  return (
    <Sheet defaultOpen={open}>
      <SheetTrigger asChild>
        <Button variant="outline">Open order #1042</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Order #1042</SheetTitle>
          <SheetDescription>Ana Ruiz · placed today 09:14</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 px-5">
          <div>
            <StatusBadge status="paid" />
          </div>
          <Field label="Note" placeholder="Add a note for the team" className="w-full" />
        </div>
        <SheetFooter>
          <Button>Save note</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const Details: Story = { render: () => <OrderSheet /> }

export const Open: Story = { render: () => <OrderSheet open />, parameters: { layout: 'fullscreen' } }
