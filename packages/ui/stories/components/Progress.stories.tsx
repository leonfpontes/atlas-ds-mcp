import type { Meta, StoryObj } from '@storybook/react-vite'
import { OctagonX } from 'lucide-react'

import { Progress } from '@/components/ui/progress'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  excludeStories: ['Budget'],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

/** Cost against a budget: the bar, and the numbers in words next to it. Example data. */
export function Budget({ used, limit }: { used: number; limit: number }) {
  const over = used >= limit
  const share = Math.round((Math.min(used, limit) / limit) * 100)
  return (
    <div className="grid w-64 gap-1.5 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Cost</span>
        <span className={over ? 'inline-flex items-center gap-1 font-mono text-destructive' : 'font-mono'}>
          {over && <OctagonX className="size-3.5" aria-hidden />}${used.toFixed(2)}{' '}
          <small className="font-sans text-muted-foreground">of ${limit.toFixed(2)}</small>
        </span>
      </div>
      <Progress
        value={Math.min(used, limit)}
        max={limit}
        variant={over ? 'destructive' : 'neutral'}
        aria-label={over ? `Over budget: ${share}% used` : `${share}% of the budget used`}
        className="h-1"
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <Progress value={40} aria-label="Upload 40% done" className="w-64" />,
}

export const BudgetUsed: Story = { name: 'Budget', render: () => <Budget used={3.3} limit={5} /> }

export const OverBudget: Story = { name: 'Over budget', render: () => <Budget used={0.25} limit={0.25} /> }
