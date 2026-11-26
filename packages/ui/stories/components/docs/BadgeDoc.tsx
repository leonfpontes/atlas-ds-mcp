import { Badge } from '@/components/ui/badge'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { StatusBadge } from '../../blocks/fixtures'

export function BadgeDoc() {
  return (
    <ComponentDoc
      name="Badge"
      lead="A short label for a status or a category. Rounded 4.8 px, not a pill."
      shadcn="https://ui.shadcn.com/docs/components/badge"
      primitive={{
        label: 'Radix Slot',
        href: 'https://www.radix-ui.com/primitives/docs/utilities/slot',
        pkg: '@radix-ui/react-slot',
      }}
      stories={3}
      canvas={{
        rows: [
          {
            label: 'variants',
            children: (
              <>
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </>
            ),
          },
          {
            label: 'status',
            children: (
              <>
                <StatusBadge status="failed" />
                <StatusBadge status="paid" />
                <StatusBadge status="low-stock" />
                <StatusBadge status="shipped" />
              </>
            ),
          },
        ],
        snippet: '<Badge variant="success">\n  <CircleCheck />\n  Paid\n</Badge>',
        source: `import { CircleCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function PaidBadge() {
  return (
    <Badge variant="success">
      <CircleCheck />
      Paid
    </Badge>
  )
}`,
      }}
      variants={[
        { node: <Badge>Default</Badge>, text: 'A count or a highlight on the accent color.' },
        { node: <Badge variant="secondary">Secondary</Badge>, text: 'Neutral tags and categories.' },
        { node: <Badge variant="outline">Outline</Badge>, text: 'Quiet labels, such as a version.' },
        { node: <StatusBadge status="paid" />, text: 'success: done, paid, passed.' },
        { node: <StatusBadge status="low-stock" />, text: 'warning: needs attention soon.' },
        { node: <StatusBadge status="shipped" />, text: 'info: in progress or neutral news.' },
        { node: <StatusBadge status="failed" />, text: 'destructive: failed or blocked.' },
      ]}
      doExample={{
        node: <StatusBadge status="paid" />,
        text: 'Status with its icon and a word. Readable without color.',
      }}
      dontExample={{
        node: <span className="inline-block size-3 rounded-full bg-success" aria-hidden />,
        text: "A colored dot alone. Many people can't tell green from amber.",
      }}
      a11y={[
        'Status badges pair color, icon shape and a word.',
        'Text contrast passes AA on every subtle fill, light and dark.',
        <>
          A badge is not interactive. With <code>asChild</code> on a link, it takes the link's focus ring.
        </>,
      ]}
    />
  )
}
