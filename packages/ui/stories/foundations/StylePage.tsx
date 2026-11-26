import { OctagonX } from 'lucide-react'

import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'

const MIX = [
  [
    'primary',
    'Minimalism',
    'One type family, one accent, a rigid grid, hierarchy by size and weight. Real code or data in every first fold.',
  ],
  [
    'secondary',
    'Flat',
    'No shadows on surfaces, 1 px borders, solid fills, 2 px line icons. Affordance from fills, underlines and focus.',
  ],
  [
    'theme',
    'Dark Mode',
    'Charcoal, not black. Surfaces one step lighter, desaturated accents, AA in both themes.',
  ],
] as const

const box = 'inline-block h-9 w-14 flex-none border bg-card'

const TOKENS = [
  [
    '--radius',
    '0.375rem · 6 px',
    <span key="r" className={`${box} rounded-[6px]`} />,
    'Small and calm. Badges are not pills.',
  ],
  ['shadow (surfaces)', 'none', <span key="s" className={box} />, 'Flat: borders separate, not depth.'],
  [
    '--shadow-overlay',
    'Dialog, Sheet, Popover, Toast',
    <span key="o" className={`${box} rounded-[6px] shadow-overlay`} />,
    'Only things that float get a shadow.',
  ],
  [
    '--border',
    '1 px · --border',
    <span key="b" className={`${box} border-foreground`} />,
    'One weight of line everywhere.',
  ],
  [
    'type scale',
    '13 · 14 · 16 · 17 · 20 · 28 · 36 · 44',
    <span key="t">
      <span className="text-[28px]/none font-semibold">Aa</span> <span className="text-sm">Aa</span>
    </span>,
    'Clear jumps; section titles always 28.',
  ],
  [
    'space',
    '4 px base',
    <span key="sp" className="flex items-center gap-3">
      {[1, 4, 8].map((n) => (
        <i key={n} className="inline-block h-3 bg-primary" style={{ width: n * 4 }} />
      ))}
    </span>,
    'Rhythm in multiples of 4 and 8.',
  ],
] as const

const OUT = [
  ['Aurora', 'Blurred multi-color gradients. The number one sign of a generated site.'],
  [
    'Glass, Liquid Glass',
    'No floating layer over media. If one appears: only that layer, opaque fallback, prefers-reduced-transparency.',
  ],
  [
    'Bento',
    'Tools are a table. Bento only if a future feature section needs blocks of different sizes with real content.',
  ],
  ['Material, Neobrutalism, Clay', 'Wrong voice for developer docs and a recruiter audience.'],
] as const

export function StylePage() {
  return (
    <DocPage
      crumb={['Foundations', 'Style']}
      eyebrow="Foundations"
      title="Style"
      lead="Minimalism, with Flat as the secondary style and Dark Mode as a theme. Type and grid do the work; the content is the image."
      file="stories/foundations/StylePage.tsx"
      {...nav('Style')}
      toc={[
        { id: 'mix', label: 'The mix' },
        { id: 'tokens', label: 'Tokens that define it' },
        { id: 'out', label: 'What stays out' },
      ]}
    >
      <Section id="mix" title="The mix">
        <div className="grid grid-cols-3 rounded-lg border max-[900px]:grid-cols-1">
          {MIX.map(([kind, name, text]) => (
            <div
              key={name}
              className="grid content-start gap-1.5 border-r p-4 last:border-0 max-[900px]:border-r-0 max-[900px]:border-b"
            >
              <small className="font-mono text-xs font-medium text-muted-foreground">{kind}</small>
              <b className="text-base font-semibold">{name}</b>
              <p className="text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section id="tokens" title="Tokens that define it">
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full border-collapse text-sm max-[900px]:block" aria-label="Style tokens">
            <thead className="max-[900px]:hidden">
              <tr className="border-b">
                {['Token', 'Value', 'Looks like', 'Why'].map((h) => (
                  <th key={h} className="h-11 px-3 text-left font-medium text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="max-[900px]:block">
              {TOKENS.map(([token, value, look, why]) => (
                <tr
                  key={token}
                  className="border-b last:border-0 max-[900px]:grid max-[900px]:gap-1.5 max-[900px]:p-3"
                >
                  <td className="h-12 px-3 font-mono text-[13px] font-medium whitespace-nowrap max-[900px]:h-auto max-[900px]:p-0">
                    {token}
                  </td>
                  <td className="px-3 font-mono text-[13px] max-[900px]:p-0">{value}</td>
                  <td className="px-3 py-2 max-[900px]:p-0">{look}</td>
                  <td className="px-3 text-muted-foreground max-[900px]:p-0">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="out" title="What stays out">
        <div className="grid border-t">
          {OUT.map(([name, text]) => (
            <div
              key={name}
              className="grid grid-cols-[180px_1fr] gap-4 border-b py-3 text-sm max-[900px]:grid-cols-1 max-[900px]:gap-0.5"
            >
              <b className="flex items-center gap-2 font-medium">
                <OctagonX className="size-4 text-destructive" aria-hidden />
                {name}
              </b>
              <span className="text-muted-foreground">{text}</span>
            </div>
          ))}
        </div>
      </Section>
    </DocPage>
  )
}
