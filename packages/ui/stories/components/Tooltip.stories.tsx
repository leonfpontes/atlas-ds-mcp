import type { Meta, StoryObj } from '@storybook/react-vite'
import { Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const meta = {
  title: 'Components/Tooltip',
  excludeStories: ['CopyId'],
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export function CopyId({ open }: { open?: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip defaultOpen={open}>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Copy order ID">
            <Copy aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy order ID</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export const IconButton: Story = { name: 'Icon button', render: () => <CopyId /> }

export const Open: Story = {
  render: () => (
    <div className="pt-12">
      <CopyId open />
    </div>
  ),
}
