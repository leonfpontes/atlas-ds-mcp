import { ScrollArea } from '@/components/ui/scroll-area'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { FiltersPanel, LinkTags, NEIGHBORS, NeighborsPanel } from '../ScrollArea.stories'

export function ScrollAreaDoc() {
  return (
    <ComponentDoc
      name="ScrollArea"
      title="Scroll Area"
      lead="A box of fixed height whose content scrolls, with the Atlas scrollbar: side panels of filters and neighbors."
      shadcn="https://ui.shadcn.com/docs/components/scroll-area"
      primitive={{
        label: 'Radix Scroll Area',
        href: 'https://www.radix-ui.com/primitives/docs/components/scroll-area',
        pkg: '@radix-ui/react-scroll-area',
      }}
      stories={4}
      canvas={{
        rows: [
          { label: 'filters panel', children: <FiltersPanel /> },
          { label: 'text only · labelled', children: <NeighborsPanel /> },
          { label: 'horizontal', children: <LinkTags /> },
        ],
        snippet: '<ScrollArea aria-label="Neighbors" className="h-56 rounded-lg border">\n  …\n</ScrollArea>',
        source: `import { ScrollArea } from "@/components/ui/scroll-area"

export function Neighbors({ links }: { links: { title: string; rel: string }[] }) {
  return (
    // Text only inside: the aria-label makes the viewport a named region the keyboard can scroll.
    <ScrollArea aria-label="Neighbors" className="h-56 rounded-lg border bg-card">
      <ul className="grid gap-0.5 p-4 text-sm">
        {links.map((l) => (
          <li key={l.title} className="flex min-h-10 items-center justify-between gap-3">
            <span>{l.title}</span>
            <span className="font-mono text-xs text-muted-foreground">{l.rel}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}`,
      }}
      doExample={{
        node: <NeighborsPanel />,
        text: 'A fixed height on the root, and a name when there is nothing inside to focus.',
      }}
      dontExample={{
        node: (
          <ScrollArea aria-label="Note" className="h-40 w-60 rounded-lg border bg-card text-left text-sm">
            <div className="grid gap-2 p-3">
              <strong>Frame supplier for the spring range</strong>
              <p className="m-0 text-muted-foreground">Links of this note:</p>
              <ScrollArea aria-label="Links" className="h-24 rounded-md border">
                <ul className="m-0 grid list-none gap-1 p-2">
                  {NEIGHBORS.map(([title]) => (
                    <li key={title}>{title}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </ScrollArea>
        ),
        text: 'A scroll box inside another: the wheel and the swipe get stuck in the inner one.',
      }}
      a11y={[
        'The scrollbar shows whenever the content overflows, so a touch or keyboard user can tell the box scrolls.',
        <>
          With nothing focusable inside, give it <code>aria-label</code>: the viewport becomes a named{' '}
          <code>region</code> in the tab order, and the arrow keys scroll it.
        </>,
        'The focus ring is drawn inside the box (the root clips anything outside it).',
        'The thumb is --input, 3 : 1 on the background in both themes.',
      ]}
    />
  )
}
