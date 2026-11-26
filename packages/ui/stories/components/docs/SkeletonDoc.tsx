import { Skeleton } from '@/components/ui/skeleton'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { LoadingCard, LoadingRuns } from '../Skeleton.stories'

export function SkeletonDoc() {
  return (
    <ComponentDoc
      name="Skeleton"
      lead="Keeps the shape of the content while it loads, so the page doesn't jump when the data arrives."
      shadcn="https://ui.shadcn.com/docs/components/skeleton"
      stories={3}
      canvas={{
        rows: [
          { label: 'table', children: <LoadingRuns /> },
          { label: 'card', children: <LoadingCard /> },
        ],
        snippet:
          '<div role="region" aria-label="Runs" aria-busy="true">\n  <Skeleton className="h-4 w-48" />\n</div>',
        source: `import { Skeleton } from "@/components/ui/skeleton"

export function LoadingRuns() {
  return (
    <div role="region" aria-label="Runs" aria-busy="true" className="grid gap-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-40" />
    </div>
  )
}`,
      }}
      doExample={{
        node: <LoadingRuns />,
        text: 'Rows of the same size as the data, under the real header.',
      }}
      dontExample={{
        node: <Skeleton className="h-24 w-56" />,
        text: "One big block that doesn't look like what comes next, and stays forever when the request fails.",
      }}
      a11y={[
        <>
          The Skeleton is hidden from screen readers (<code>aria-hidden</code>); the region it fills gets{' '}
          <code>role="region"</code>, a label and <code>aria-busy="true"</code>.
        </>,
        'The pulse stops with reduced motion; the grey block stays.',
        'After a timeout, replace it with the error state and a way to try again.',
      ]}
    />
  )
}
