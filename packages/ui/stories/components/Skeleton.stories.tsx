import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  excludeStories: ['LoadingRuns', 'LoadingCard'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

const WIDTHS = [
  [90, '60%', 48, 52],
  [70, '45%', 48, 52],
  [90, '70%', 48, 52],
] as const

/** A table while its rows load: the header stays, the rows keep their shape. */
export function LoadingRuns() {
  return (
    <div className="w-[560px] max-w-[calc(100vw-32px)] overflow-hidden rounded-lg border bg-card">
      <Table aria-label="Runs" aria-busy="true">
        <TableHeader>
          <TableRow>
            <TableHead>Run</TableHead>
            <TableHead>Request</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right max-[480px]:hidden">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {WIDTHS.map((row, i) => (
            <TableRow key={i}>
              {row.map((w, j) => (
                <TableCell key={j} className={j === 3 ? 'max-[480px]:hidden' : undefined}>
                  <Skeleton className={j >= 2 ? 'ml-auto h-2.5' : 'h-2.5'} style={{ width: w }} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

/** A card while its numbers load. */
export function LoadingCard() {
  return (
    <Card className="w-72" role="region" aria-busy="true" aria-label="Run summary">
      <CardHeader>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-1 h-3 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24" />
      </CardContent>
    </Card>
  )
}

export const TableRows: Story = { name: 'Table rows', render: () => <LoadingRuns /> }

export const CardShape: Story = { name: 'Card', render: () => <LoadingCard /> }
