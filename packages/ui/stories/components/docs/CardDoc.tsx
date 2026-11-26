import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { ComponentDoc } from '../../blocks/ComponentDoc'

const metric = (
  <Card className="w-80 max-w-full">
    <CardHeader>
      <CardTitle>Fernhill Market</CardTitle>
      <CardDescription>Orders in the last 30 days</CardDescription>
    </CardHeader>
    <CardContent className="font-mono text-[28px] font-semibold">128</CardContent>
    <CardFooter>
      <Button variant="outline">View orders</Button>
    </CardFooter>
  </Card>
)

export function CardDoc() {
  return (
    <ComponentDoc
      name="Card"
      lead="Groups content about one thing. Border only, no shadow, radius 8.4 px."
      shadcn="https://ui.shadcn.com/docs/components/card"
      stories={3}
      canvas={{
        rows: [{ label: 'metric', children: metric }],
        snippet:
          '<Card>\n  <CardHeader>\n    <CardTitle>Fernhill Market</CardTitle>\n  </CardHeader>\n</Card>',
        source: `import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function OrdersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fernhill Market</CardTitle>
        <CardDescription>Orders in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="font-mono text-[28px] font-semibold">128</CardContent>
      <CardFooter>
        <Button variant="outline">View orders</Button>
      </CardFooter>
    </Card>
  )
}`,
      }}
      doExample={{
        node: (
          <Card className="w-56 gap-2 py-4">
            <CardHeader className="px-4">
              <CardDescription>Revenue today</CardDescription>
              <CardTitle className="font-mono text-xl">$2,140</CardTitle>
            </CardHeader>
          </Card>
        ),
        text: 'One card, one subject. The number is the main element.',
      }}
      dontExample={{
        node: (
          <div className="w-56 rounded-xl bg-card p-4 shadow-overlay">
            <p className="text-sm text-muted-foreground">Revenue today</p>
          </div>
        ),
        text: 'A floating shadow on a surface. Atlas separates with borders; shadows are for overlays.',
      }}
      a11y={[
        <>
          <code>CardTitle</code> is a <code>div</code>: wrap it in the heading level the page needs, e.g.{' '}
          <code>{'<h3>'}</code>.
        </>,
        'Border contrast is decorative; the content carries the meaning.',
      ]}
    />
  )
}
