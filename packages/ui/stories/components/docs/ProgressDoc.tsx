import { Progress } from '@/components/ui/progress'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { Budget } from '../Progress.stories'

export function ProgressDoc() {
  return (
    <ComponentDoc
      name="Progress"
      lead="Shows how much of a known total is used, such as a budget. The number is always written next to it."
      shadcn="https://ui.shadcn.com/docs/components/progress"
      primitive={{
        label: 'Radix Progress',
        href: 'https://www.radix-ui.com/primitives/docs/components/progress',
        pkg: '@radix-ui/react-progress',
      }}
      stories={4}
      canvas={{
        rows: [
          {
            label: 'default',
            children: <Progress value={40} aria-label="Upload 40% done" className="w-64" />,
          },
          { label: 'budget', children: <Budget used={3.3} limit={5} /> },
          { label: 'over', children: <Budget used={0.25} limit={0.25} /> },
        ],
        snippet: '<Progress value={3.3} max={5} variant="neutral" aria-label="66% of the budget used" />',
        source: `import { Progress } from "@/components/ui/progress"

export function BudgetBar({ used, limit }: { used: number; limit: number }) {
  const over = used >= limit
  const share = Math.round((Math.min(used, limit) / limit) * 100)
  return (
    <div className="grid gap-1.5 text-sm">
      <span>
        \${used.toFixed(2)} of \${limit.toFixed(2)}
      </span>
      <Progress
        value={Math.min(used, limit)}
        max={limit}
        variant={over ? "destructive" : "neutral"}
        aria-label={over ? \`Over budget: \${share}% used\` : \`\${share}% of the budget used\`}
      />
    </div>
  )
}`,
      }}
      variants={[
        {
          node: <Progress value={40} aria-label="40%" className="w-32" />,
          text: 'default: --primary, for a task with a known end.',
        },
        {
          node: <Progress value={66} variant="neutral" aria-label="66%" className="w-32" />,
          text: 'neutral: --foreground, for budgets and limits.',
        },
        {
          node: <Progress value={100} variant="destructive" aria-label="100%" className="w-32" />,
          text: 'destructive: the total is passed. Add the icon and the words.',
        },
      ]}
      doExample={{
        node: <Budget used={3.3} limit={5} />,
        text: 'The bar and the number together: "$3.30 of $5.00".',
      }}
      dontExample={{
        node: <Progress value={66} aria-label="Budget" className="w-56" />,
        text: "A bar alone. People who can't see it, or can't tell the color, get no number.",
      }}
      a11y={[
        <>
          A <code>progressbar</code> with <code>aria-valuenow</code> and <code>aria-valuemax</code>; give it
          an <code>aria-label</code> that says the share.
        </>,
        'Over the limit: destructive fill, the octagon icon and the words, never color alone.',
        'The fill moves in 180 ms and stands still with reduced motion.',
      ]}
    />
  )
}
