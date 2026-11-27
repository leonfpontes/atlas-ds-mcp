import { ComponentDoc } from '../../blocks/ComponentDoc'
import { Constellation, Properties } from '../Collapsible.stories'

export function CollapsibleDoc() {
  return (
    <ComponentDoc
      name="Collapsible"
      lead="A section that opens and closes from a button: the properties of a note, a group in a list. No styles of its own; the trigger is an Atlas Button."
      shadcn="https://ui.shadcn.com/docs/components/collapsible"
      primitive={{
        label: 'Radix Collapsible',
        href: 'https://www.radix-ui.com/primitives/docs/components/collapsible',
        pkg: '@radix-ui/react-collapsible',
      }}
      stories={4}
      canvas={{
        rows: [
          { label: 'open', children: <Properties /> },
          { label: 'closed', children: <Properties open={false} /> },
          { label: 'group', children: <Constellation /> },
        ],
        snippet:
          '<Collapsible defaultOpen>\n  <CollapsibleTrigger asChild>\n    <Button variant="ghost">Properties <ChevronDown /></Button>\n  </CollapsibleTrigger>\n  <CollapsibleContent>…</CollapsibleContent>\n</Collapsible>',
        source: `import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function Properties({ props }: { props: [string, string][] }) {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger asChild>
        {/* The chevron turns with data-state on the trigger. */}
        <Button variant="ghost" className="-ml-3 [&[data-state=open]>svg]:rotate-180">
          Properties (frontmatter)
          <ChevronDown />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-mono text-[13px]">
          {props.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="m-0">{v}</dd>
            </div>
          ))}
        </dl>
      </CollapsibleContent>
    </Collapsible>
  )
}`,
      }}
      doExample={{
        node: <Properties open={false} />,
        text: 'A Button that names the section, with a chevron that turns when it opens.',
      }}
      dontExample={{
        node: <p className="m-0 text-sm text-muted-foreground">▸ More</p>,
        text: 'A bare word with an arrow: it says nothing about what opens, and it is not a button.',
      }}
      a11y={[
        <>
          The trigger is a <code>button</code> with <code>aria-expanded</code> and <code>aria-controls</code>;{' '}
          <kbd>Enter</kbd> and <kbd>Space</kbd> open and close it.
        </>,
        'Closed content leaves the page, so it is skipped by the keyboard and by screen readers.',
        'It opens without motion and without a clipping box, like <details>: focus rings inside are never cut.',
        'The chevron is decorative (aria-hidden); the state is in aria-expanded.',
      ]}
    />
  )
}
