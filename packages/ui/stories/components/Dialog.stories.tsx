import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const meta = {
  title: 'Components/Dialog',
  excludeStories: ['ConfirmDelete'],
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export function ConfirmDelete({ open }: { open?: boolean }) {
  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete order #1041?</DialogTitle>
          <DialogDescription>The customer won't be notified. This can't be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive">Delete order</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const Confirm: Story = { render: () => <ConfirmDelete /> }

export const Open: Story = {
  render: () => <ConfirmDelete open />,
  parameters: { layout: 'fullscreen' },
}
