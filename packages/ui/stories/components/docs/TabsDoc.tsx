import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ComponentDoc } from '../../blocks/ComponentDoc'

const Segmented = () => (
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
)

const Line = () => (
  <Tabs defaultValue="preview">
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
)

export function TabsDoc() {
  return (
    <ComponentDoc
      name="Tabs"
      lead="Switches between views of the same content. Muted track, the selected tab on the background."
      shadcn="https://ui.shadcn.com/docs/components/tabs"
      primitive={{
        label: 'Radix Tabs',
        href: 'https://www.radix-ui.com/primitives/docs/components/tabs',
        pkg: '@radix-ui/react-tabs',
      }}
      stories={3}
      canvas={{
        rows: [
          { label: 'default', children: <Segmented /> },
          { label: 'line', children: <Line /> },
        ],
        snippet: '<TabsList>\n  <TabsTrigger value="all">All</TabsTrigger>\n</TabsList>',
        source: `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function OrderTabs() {
  return (
    <Tabs defaultValue="all">
      <TabsList aria-label="Order status">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="paid">Paid</TabsTrigger>
      </TabsList>
      <TabsContent value="all">128 orders</TabsContent>
      <TabsContent value="paid">96 paid</TabsContent>
    </Tabs>
  )
}`,
      }}
      variants={[
        { node: <Segmented />, text: 'default: a segmented track, for views inside the product.' },
        { node: <Line />, text: 'line: an underline, for docs and code samples.' },
      ]}
      doExample={{ node: <Segmented />, text: 'Short nouns for views of the same list.' }}
      dontExample={{
        node: <p className="text-sm">Tabs for steps 1, 2, 3</p>,
        text: 'Steps that depend on each other are a flow, not tabs.',
      }}
      a11y={[
        <>
          Arrow keys move between tabs; <kbd>Tab</kbd> moves into the panel.
        </>,
        <>
          Name the list with <code>aria-label</code>.
        </>,
        'Tabs are 40 px tall (44 on touch); the selected tab changes weight of color and the track, not color alone.',
      ]}
    />
  )
}
