import { contrastRatio, themeColors } from '@leonfpontes/atlas-tokens'
import { Check } from 'lucide-react'

import { Checks } from '../blocks/ComponentDoc'
import { tokenTree } from '../blocks/data'
import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'

const colors = new Map(themeColors(tokenTree).map((c) => [c.name, c]))
const hex = (name: string, mode: 'light' | 'dark') => {
  const c = colors.get(name)
  if (!c) throw new Error(`--${name} is not a token`)
  return c[mode]
}

// The pairs shown here, in the order a reader looks for them. Ratios are computed from tokens.json.
const ROWS: [string, string, 'text' | 'non-text'][] = [
  ['foreground', 'background', 'text'],
  ['muted-foreground', 'background', 'text'],
  ['text-subtle', 'background', 'text'],
  ['primary', 'background', 'text'],
  ['primary-foreground', 'primary', 'text'],
  ['success', 'background', 'text'],
  ['success', 'success-subtle', 'text'],
  ['warning', 'background', 'text'],
  ['warning', 'warning-subtle', 'text'],
  ['destructive', 'background', 'text'],
  ['destructive', 'destructive-subtle', 'text'],
  ['info', 'info-subtle', 'text'],
  ['input', 'background', 'non-text'],
]

function Swatch({ value }: { value: string }) {
  return (
    <>
      {/* The swatch shows the token's own value, so it is set inline from the token data. */}
      <span
        className="mr-2 inline-block size-4 rounded-[3px] border border-muted-foreground/40 align-[-3px]"
        style={{ background: value }}
      />
      {value}
    </>
  )
}

function Ratio({ a, b, min }: { a: string; b: string; min: number }) {
  const r = contrastRatio(a, b)
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[13px] font-medium text-success">
      {r >= min && <Check className="size-3" aria-hidden />}
      {r.toFixed(1)}
      <span className="sr-only">{r >= min ? ' passes' : ' fails'}</span>
    </span>
  )
}

const cell = 'h-12 px-3 font-mono text-[13px] whitespace-nowrap max-[900px]:h-auto max-[900px]:p-0'

export function ColorsPage() {
  return (
    <DocPage
      crumb={['Foundations', 'Colors']}
      eyebrow="Foundations"
      title="Colors"
      lead="Every Atlas color token in light and dark, with the contrast of the pair it is used on. Text pairs pass 4.5 : 1; the input border passes 3 : 1 as a non-text element."
      file="stories/foundations/ColorsPage.tsx"
      {...nav('Colors')}
      toc={[
        { id: 'pairs', label: 'Tokens and contrast' },
        { id: 'rules', label: 'Rules' },
      ]}
    >
      <Section id="pairs" title="Tokens and contrast">
        <div
          className="overflow-x-auto rounded-lg border bg-card"
          tabIndex={0}
          role="region"
          aria-label="Color tokens, scrolls sideways"
        >
          <table
            className="w-full border-collapse text-[13px] max-[900px]:block"
            aria-label="Color tokens with contrast in light and dark"
          >
            <thead className="max-[900px]:hidden">
              <tr className="border-b">
                {['Token', 'Light', 'Dark', 'On', 'Light', 'Dark', 'Kind'].map((h, i) => (
                  <th
                    key={i}
                    className={`h-11 px-3 font-medium text-muted-foreground ${i === 4 || i === 5 ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="max-[900px]:block">
              {ROWS.map(([fg, bg, kind]) => {
                const min = kind === 'text' ? 4.5 : 3
                return (
                  <tr
                    key={`${fg}-${bg}`}
                    className="border-b last:border-0 max-[900px]:grid max-[900px]:grid-cols-2 max-[900px]:gap-x-3 max-[900px]:gap-y-1 max-[900px]:p-3"
                  >
                    <td className={`${cell} max-[900px]:col-span-2 max-[900px]:font-semibold`}>--{fg}</td>
                    <td className={cell}>
                      <Swatch value={hex(fg, 'light')} />
                    </td>
                    <td className={cell}>
                      <Swatch value={hex(fg, 'dark')} />
                    </td>
                    <td className={`${cell} max-[900px]:col-span-2 max-[900px]:text-muted-foreground`}>
                      <span className="hidden max-[900px]:inline">on </span>--{bg}
                    </td>
                    <td className={`${cell} text-right max-[900px]:text-left`}>
                      <span className="hidden text-muted-foreground max-[900px]:inline">light </span>
                      <Ratio a={hex(fg, 'light')} b={hex(bg, 'light')} min={min} />
                    </td>
                    <td className={`${cell} text-right max-[900px]:text-left`}>
                      <span className="hidden text-muted-foreground max-[900px]:inline">dark </span>
                      <Ratio a={hex(fg, 'dark')} b={hex(bg, 'dark')} min={min} />
                    </td>
                    <td className={`${cell} font-sans whitespace-normal max-[900px]:col-span-2`}>
                      {kind === 'text' ? 'text' : 'non-text (≥ 3)'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Section>
      <Section id="rules" title="Rules">
        <Checks
          items={[
            <>
              Use the token, never the hex. <code>validate_screen</code> flags hex values.
            </>,
            'Status always pairs color with an icon shape and a word.',
            'Amber means example or warning. Nothing else.',
          ]}
        />
      </Section>
    </DocPage>
  )
}
