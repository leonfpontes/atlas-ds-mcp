import { LoaderCircle, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Demo } from '../../blocks/Canvas'
import { ComponentDoc } from '../../blocks/ComponentDoc'

export function ButtonDoc() {
  return (
    <ComponentDoc
      name="Button"
      lead="Starts an action. One primary button per view; the rest use outline, secondary or ghost."
      shadcn="https://ui.shadcn.com/docs/components/button"
      primitive={{
        label: 'Radix Slot',
        href: 'https://www.radix-ui.com/primitives/docs/utilities/slot',
        pkg: '@radix-ui/react-slot',
      }}
      stories={5}
      canvas={{
        rows: [
          {
            label: 'variants',
            children: (
              <>
                <Button>Save order</Button>
                <Button variant="outline">Cancel</Button>
                <Button variant="secondary">Export</Button>
                <Button variant="ghost">Skip</Button>
                <Button variant="destructive">Delete</Button>
                <Button variant="link">View receipt</Button>
              </>
            ),
          },
          {
            label: 'sizes',
            children: (
              <>
                <Demo caption="default · 40 px">
                  <Button>Save order</Button>
                </Demo>
                <Demo caption="lg · 48 px">
                  <Button size="lg">Save order</Button>
                </Demo>
                <Demo caption="icon · 40 px">
                  <Button variant="outline" size="icon" aria-label="Add order">
                    <Plus aria-hidden />
                  </Button>
                </Demo>
                <Demo caption="touch · 44 px">
                  <Button className="h-11">Save order</Button>
                </Demo>
              </>
            ),
          },
          {
            label: 'states',
            children: (
              <>
                <Button>
                  <Plus aria-hidden />
                  With icon
                </Button>
                <Button aria-busy="true">
                  <LoaderCircle className="animate-spin" aria-hidden />
                  Saving…
                </Button>
                <Button disabled>Disabled</Button>
                <Button className="border-ring ring-[3px] ring-ring/50">Focused</Button>
              </>
            ),
          },
        ],
        snippet: '<Button>Save order</Button>\n<Button variant="outline">Cancel</Button>',
        source: `import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function OrderActions() {
  return (
    <div className="flex gap-2">
      <Button>
        <Plus />
        Save order
      </Button>
      <Button variant="outline">Cancel</Button>
    </div>
  )
}`,
      }}
      variants={[
        { node: <Button>Default</Button>, text: 'The one main action of the view: save, create, continue.' },
        {
          node: <Button variant="outline">Outline</Button>,
          text: 'Secondary action next to a primary: cancel, back.',
        },
        {
          node: <Button variant="secondary">Secondary</Button>,
          text: 'Neutral actions in toolbars: export, filter.',
        },
        {
          node: <Button variant="ghost">Ghost</Button>,
          text: 'Low-emphasis or repeated actions: inside tables and menus.',
        },
        {
          node: <Button variant="destructive">Destructive</Button>,
          text: 'Deletes or cancels something. Always confirm in a Dialog.',
        },
        {
          node: <Button variant="link">Link</Button>,
          text: 'An action inside a sentence. Always underlined.',
        },
      ]}
      doExample={{
        node: (
          <>
            <Button>Save order</Button>
            <Button variant="outline">Cancel</Button>
          </>
        ),
        text: 'One primary action. The label is a verb and an object, so it says what happens.',
      }}
      dontExample={{
        node: (
          <>
            <Button>OK</Button>
            <Button>Cancel</Button>
          </>
        ),
        text: 'Two primaries side by side. People can\'t tell which one is the main action, and "OK" doesn\'t say what it does.',
      }}
      a11y={[
        <>
          Activates with <kbd>Enter</kbd> and <kbd>Space</kbd>; focus ring is 3 px in <code>--ring</code>.
        </>,
        <>
          40 px tall on desktop and 44 × 44 px on touch, icon-only buttons included. Icon-only buttons need{' '}
          <code>aria-label</code>.
        </>,
        <>
          While loading: <code>aria-busy="true"</code>, label stays, clicks are blocked.
        </>,
        'Text contrast 6.7 : 1 on the default variant.',
      ]}
    />
  )
}
