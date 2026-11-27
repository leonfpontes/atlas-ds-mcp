import { Button } from '@/components/ui/button'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { CitedSentence, SourcePreview } from '../HoverCard.stories'

/** The open card, drawn in place (no portal), so the docs can show it next to the text. */
function StaticCard() {
  return (
    <div className="grid w-[380px] max-w-full gap-2 rounded-lg border bg-popover px-4 py-3.5 text-left text-sm text-popover-foreground shadow-overlay">
      <SourcePreview />
    </div>
  )
}

export function HoverCardDoc() {
  return (
    <ComponentDoc
      name="HoverCard"
      title="Hover Card"
      lead="A preview that opens when the pointer rests on a link, or the keyboard focuses it. Used for the source behind a citation."
      shadcn="https://ui.shadcn.com/docs/components/hover-card"
      primitive={{
        label: 'Radix Hover Card',
        href: 'https://www.radix-ui.com/primitives/docs/components/hover-card',
        pkg: '@radix-ui/react-hover-card',
      }}
      stories={3}
      canvas={{
        rows: [
          { label: 'citation · rest on [1]', children: <CitedSentence /> },
          { label: 'open', children: <StaticCard /> },
        ],
        snippet:
          '<HoverCard>\n  <HoverCardTrigger href="#source-1">1</HoverCardTrigger>\n  <HoverCardContent>…</HoverCardContent>\n</HoverCard>',
        source: `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export function Citation({ n, title, file, excerpt }: { n: number; title: string; file: string; excerpt: string }) {
  return (
    <HoverCard>
      {/* A real link: a click goes to the source, and touch screens never open the card. */}
      <HoverCardTrigger href={\`#source-\${n}\`} aria-label={\`Source \${n}: \${title}\`}>
        {n}
      </HoverCardTrigger>
      <HoverCardContent className="w-[380px]">
        <strong>{title}</strong>
        <span className="font-mono text-[13px] text-muted-foreground">{file}</span>
        <blockquote className="m-0 border-l-[3px] pl-3">{excerpt}</blockquote>
      </HoverCardContent>
    </HoverCard>
  )
}`,
      }}
      doExample={{
        node: <StaticCard />,
        text: 'A short preview of what the link opens: the title, where it is, the exact words.',
      }}
      dontExample={{
        node: (
          <div className="grid w-64 gap-2 rounded-lg border bg-popover px-4 py-3.5 text-left text-sm shadow-overlay">
            <strong>Change the supplier?</strong>
            <Button>Confirm</Button>
          </div>
        ),
        text: 'Buttons or forms in a hover card: it closes as the pointer leaves. Use a Dialog.',
      }}
      a11y={[
        <>
          Opens 300 ms after the pointer rests on the link or the keyboard focuses it; it closes on blur and
          on <kbd>Esc</kbd>.
        </>,
        'The trigger is a link with its own name ("Source 1: …"); screen readers follow the link, not the card.',
        'Touch screens never open it: on a phone, show the same preview in a Sheet, or follow the link.',
        'At most 320 px wide (set it per use), never wider than the screen minus 32 px; it flips to the side with room.',
      ]}
    />
  )
}
