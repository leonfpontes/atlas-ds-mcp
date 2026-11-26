import { Layers } from 'lucide-react'

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { EmptyTable } from '../components/Table.stories'
import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'
import { RuleList } from '../blocks/Steps'

export function EmptyStatesPage() {
  return (
    <DocPage
      crumb={['Patterns', 'Empty states']}
      eyebrow="Patterns"
      title="Empty states"
      lead="When there is nothing to show: say what is missing, why, and the one action that fills it. No illustrations."
      file="stories/patterns/EmptyStatesPage.tsx"
      {...nav('Empty states')}
      toc={[
        { id: 'examples', label: 'Examples' },
        { id: 'rules', label: 'Rules' },
      ]}
    >
      <Section id="examples" title="Examples">
        <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
          <div className="overflow-hidden rounded-lg border bg-card">
            <EmptyTable />
          </div>
          <Card className="justify-center border-dashed text-center">
            <CardHeader className="justify-items-center">
              <Layers className="mb-1 size-6 text-muted-foreground" aria-hidden />
              <CardTitle>No evaluation run yet</CardTitle>
              <CardDescription>
                Run <code>pnpm eval</code> to fill this in.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button variant="outline">Copy command</Button>
            </CardFooter>
          </Card>
        </div>
      </Section>
      <Section id="rules" title="Rules">
        <RuleList
          items={[
            ['Title', 'Says what is missing: "No orders yet".'],
            ['Sentence', 'One line on what happens next or what to do.'],
            ['Action', 'One button that fills the state. Outline if the page already has a primary.'],
            ['Never', 'Made-up numbers, illustrations, a table header with zero rows and no message.'],
          ]}
        />
      </Section>
    </DocPage>
  )
}
