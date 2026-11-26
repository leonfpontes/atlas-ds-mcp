import { CodeBlock } from '../blocks/CodeBlock'
import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'
import { RuleList } from '../blocks/Steps'

const SCALE = [
  [44, 'Hero headline', 600],
  [36, 'Page title (docs)', 600],
  [28, 'Section title', 600],
  [20, 'Subsection', 600],
  [17, 'Lead paragraph', 400],
  [16, 'Body on marketing pages', 400],
  [14, 'Body in dense UI, controls', 400],
  [13, 'Labels, meta, code', 500],
  [12, 'Badges, captions', 500],
] as const

export function TypographyPage() {
  return (
    <DocPage
      crumb={['Foundations', 'Typography']}
      eyebrow="Foundations"
      title="Typography"
      lead="IBM Plex Sans for the interface, IBM Plex Mono for code and token names. Both under the SIL Open Font License."
      file="stories/foundations/TypographyPage.tsx"
      {...nav('Typography')}
      toc={[
        { id: 'scale', label: 'Scale' },
        { id: 'rules', label: 'Rules' },
        { id: 'code', label: 'Code' },
      ]}
    >
      <Section id="scale" title="Scale">
        <div className="grid border-t">
          {SCALE.map(([size, use, weight]) => (
            <div
              key={size}
              className="grid grid-cols-[64px_1fr_auto] items-baseline gap-4 border-b py-3 max-[900px]:grid-cols-[48px_1fr]"
            >
              <span className="font-mono text-[13px] text-muted-foreground">{size}</span>
              <span
                className="truncate"
                style={{
                  fontSize: size,
                  fontWeight: weight,
                  letterSpacing: size >= 32 ? '-0.02em' : undefined,
                  lineHeight: 1.2,
                }}
              >
                Save order
              </span>
              <span className="text-[13px] text-muted-foreground max-[900px]:col-span-2">{use}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section id="rules" title="Rules">
        <RuleList
          items={[
            ['Weights', '400 for text, 500 for labels, 600 for headings. No bold 700.'],
            ['Tracking', '−0.02em from 32 px up; none below.'],
            ['Line height', '1.6 on marketing pages, 1.5 in dense UI, 1.2 for headings.'],
            ['Mono', 'Only for code, commands and token names. Labels and meta stay in Plex Sans.'],
          ]}
        />
      </Section>
      <Section id="code" title="Code">
        <CodeBlock
          lang="css"
          title="Tailwind theme (from @leonfpontes/atlas-tokens/theme.css)"
          code={
            "--font-sans: 'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;\n--font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace;"
          }
        />
      </Section>
    </DocPage>
  )
}
