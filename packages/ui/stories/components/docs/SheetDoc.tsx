import { ComponentDoc } from '../../blocks/ComponentDoc'
import { OrderSheet } from '../Sheet.stories'

export function SheetDoc() {
  return (
    <ComponentDoc
      name="Sheet"
      lead="A side panel for details and filters, without leaving the list. Also the docs sidebar on phones."
      shadcn="https://ui.shadcn.com/docs/components/sheet"
      primitive={{
        label: 'Radix Dialog',
        href: 'https://www.radix-ui.com/primitives/docs/components/dialog',
        pkg: '@radix-ui/react-dialog',
      }}
      stories={3}
      canvas={{
        rows: [{ label: 'details', children: <OrderSheet /> }],
        snippet: '<SheetContent side="right">\n  <SheetTitle>Order #1042</SheetTitle>\n</SheetContent>',
        source: `import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function OrderDetails() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open order #1042</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Order #1042</SheetTitle>
          <SheetDescription>Ana Ruiz · placed today 09:14</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Save note</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}`,
      }}
      doExample={{
        node: <p className="text-sm">Order details next to the list</p>,
        text: 'Use a Sheet to look at one item while keeping the list in view.',
      }}
      dontExample={{
        node: <p className="text-sm">A long form in a Sheet</p>,
        text: 'A multi-step form belongs on its own page.',
      }}
      a11y={[
        'Focus moves into the panel and returns to the trigger on close.',
        <>
          <kbd>Esc</kbd> and the close button (40 × 40 px, 44 on touch) close it.
        </>,
        'Slides in 240 ms, out 180 ms; with reduced motion it appears without sliding.',
      ]}
    />
  )
}
