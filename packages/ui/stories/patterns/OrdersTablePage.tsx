import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { CodeBlock } from '../blocks/CodeBlock'
import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'
import { ORDERS_SOURCE, OrdersPattern } from './OrdersPattern'

const PARTS = [
  ['Page header', 'Title, one line of context, one primary action.'],
  ['Toolbar', 'Input with a search icon and a Select for status.'],
  ['Table', 'Rows of 48 px, money in mono and right-aligned.'],
  ['Badges', 'Status with icon and word, never color alone.'],
  ['Pagination', 'Count on the left, pages on the right.'],
  ['States', 'Empty, loading and error in Components → Table.'],
] as const

export function OrdersTablePage() {
  return (
    <DocPage
      crumb={['Patterns', 'Orders table']}
      eyebrow="Patterns"
      title="Orders table"
      lead="A full list page: header, search, status filter, table with status badges and pagination. Built only from Atlas components. Data is from Fernhill Market, a made-up store."
      file="stories/patterns/OrdersTablePage.tsx"
      {...nav('Orders table')}
      toc={[
        { id: 'preview', label: 'Preview' },
        { id: 'code', label: 'Code' },
        { id: 'parts', label: 'Parts' },
      ]}
    >
      <Section id="preview">
        <Tabs defaultValue="preview" className="gap-4">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <OrdersPattern />
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock code={ORDERS_SOURCE} title="OrdersPage.tsx" />
          </TabsContent>
        </Tabs>
      </Section>
      <Section id="code" title="Code">
        <CodeBlock code={ORDERS_SOURCE} title="OrdersPage.tsx" />
      </Section>
      <Section id="parts" title="Parts">
        <div className="grid grid-cols-2 rounded-lg border max-[900px]:grid-cols-1">
          {PARTS.map(([name, text], i) => (
            <div
              key={name}
              className={`border-b px-4 py-3 text-sm text-muted-foreground ${i >= PARTS.length - 2 ? 'min-[901px]:border-b-0' : ''} ${i === PARTS.length - 1 ? 'border-b-0' : ''}`}
            >
              <b className="block font-medium text-foreground">{name}</b>
              {text}
            </div>
          ))}
        </div>
      </Section>
    </DocPage>
  )
}
