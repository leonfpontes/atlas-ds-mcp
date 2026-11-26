import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'

const SPACE = [4, 8, 12, 16, 20, 24, 32, 48]
const RADIUS = [
  ['sm', '3.6 px', 'rounded-sm'],
  ['md', '4.8 px', 'rounded-md'],
  ['lg', '6 px', 'rounded-lg'],
  ['xl', '8.4 px', 'rounded-xl'],
] as const

export function SpacingRadiusPage() {
  return (
    <DocPage
      crumb={['Foundations', 'Spacing & radius']}
      eyebrow="Foundations"
      title="Spacing & radius"
      lead="Space on a 4 px base. Radius from one token, --radius: 0.375rem, with the shadcn/ui scale derived from it."
      file="stories/foundations/SpacingRadiusPage.tsx"
      {...nav('Spacing & radius')}
      toc={[
        { id: 'space', label: 'Space' },
        { id: 'radius', label: 'Radius' },
        { id: 'targets', label: 'Targets' },
      ]}
    >
      <Section id="space" title="Space">
        <div className="grid border-t">
          {SPACE.map((n) => (
            <div
              key={n}
              className="grid grid-cols-[64px_80px_1fr] items-center gap-4 border-b py-2.5 text-sm"
            >
              <span className="font-mono text-[13px]">{n} px</span>
              <span className="font-mono text-[13px] text-muted-foreground">{`p-${n / 4}`}</span>
              <span className="h-3 bg-primary" style={{ width: n * 2 }} />
            </div>
          ))}
        </div>
      </Section>
      <Section id="radius" title="Radius">
        <div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2">
          {RADIUS.map(([name, px, cls]) => (
            <figure key={name} className="m-0 grid gap-2">
              <span className={`h-16 border bg-muted ${cls}`} />
              <figcaption className="text-sm">
                <b className="font-mono text-[13px] font-medium">{cls}</b>
                <span className="block text-muted-foreground">{px}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Atlas tops out at 8.4 px. Pills are not used.</p>
      </Section>
      <Section id="targets" title="Targets">
        <p className="text-muted-foreground">
          Controls are 40 px tall with a mouse and 44 px on touch (<code>@media (pointer: coarse)</code>). The
          token is <code>--control</code>; components use <code>h-10</code> and{' '}
          <code>pointer-coarse:h-11</code>.
        </p>
      </Section>
    </DocPage>
  )
}
