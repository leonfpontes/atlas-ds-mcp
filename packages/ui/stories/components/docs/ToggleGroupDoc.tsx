import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { GraphView, LinkTypes, SearchMode } from '../ToggleGroup.stories'

export function ToggleGroupDoc() {
  return (
    <ComponentDoc
      name="ToggleGroup"
      title="Toggle Group"
      lead="Joined buttons that change a mode in place: one at a time (single), or several on at once (multiple)."
      shadcn="https://ui.shadcn.com/docs/components/toggle-group"
      primitive={{
        label: 'Radix Toggle Group',
        href: 'https://www.radix-ui.com/primitives/docs/components/toggle-group',
        pkg: '@radix-ui/react-toggle-group',
      }}
      stories={4}
      canvas={{
        rows: [
          { label: 'single · outline', children: <SearchMode /> },
          { label: 'single · ghost', children: <GraphView /> },
          { label: 'multiple', children: <LinkTypes /> },
        ],
        snippet:
          '<ToggleGroup type="single" defaultValue="hybrid" aria-label="Search">\n  <ToggleGroupItem value="hybrid">Hybrid</ToggleGroupItem>\n</ToggleGroup>',
        source: `import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Mode = "hybrid" | "vectors" | "graph"

export function SearchMode({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span id="search-mode" className="text-[13px] text-muted-foreground">Search</span>
      {/* type="single" never empties: pressing the current mode again keeps it. */}
      <ToggleGroup type="single" value={mode} onValueChange={(v) => onChange(v as Mode)} aria-labelledby="search-mode">
        <ToggleGroupItem value="hybrid">Hybrid</ToggleGroupItem>
        <ToggleGroupItem value="vectors">Vectors</ToggleGroupItem>
        <ToggleGroupItem value="graph">Graph</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}`,
      }}
      variants={[
        {
          node: <SearchMode />,
          text: 'outline (default): joined, the pressed item on --secondary with an --input border.',
        },
        { node: <GraphView />, text: 'ghost: no border, for a toolbar on a canvas.' },
      ]}
      doExample={{
        node: <SearchMode />,
        text: 'Short words for modes of the same result, named by a label.',
      }}
      dontExample={{
        node: (
          <Tabs defaultValue="answer">
            <TabsList aria-label="Panels">
              <TabsTrigger value="answer">Answer</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
            </TabsList>
          </Tabs>
        ),
        text: 'Switching between panels of content is Tabs, not a Toggle Group.',
      }}
      a11y={[
        <>
          <code>type="single"</code> is a <code>radiogroup</code> of <code>radio</code> items; it never
          empties once a value is picked. <code>type="multiple"</code> is a <code>toolbar</code> of buttons
          with <code>aria-pressed</code>.
        </>,
        <>
          Arrow keys move between items, <kbd>Space</kbd> or <kbd>Enter</kbd> presses one, and <kbd>Tab</kbd>{' '}
          leaves the group.
        </>,
        <>
          Name the group with <code>aria-label</code> or <code>aria-labelledby</code>.
        </>,
        'Items are 40 px tall (44 on touch). Pressed changes the fill, the border and the text, not one color alone.',
      ]}
    />
  )
}
