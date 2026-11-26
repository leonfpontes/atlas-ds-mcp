import { Check, CircleCheck, CircleX } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { Canvas, Stage, type CanvasRow } from './Canvas'
import { CodeBlock } from './CodeBlock'
import { agentAnswer, component, manifest } from './data'
import { DocPage, MetaLink, Section, SideMeta } from './DocPage'
import { REPO } from './links'
import { nav } from './pages'

export interface Example {
  node: ReactNode
  text: string
}

export interface ComponentDocProps {
  /** Name in the manifest, e.g. "Sonner". */
  name: string
  /** Title of the page, e.g. "Toast". */
  title?: string
  lead: string
  shadcn: string
  primitive?: { label: string; href: string; pkg: string }
  canvas: { rows: CanvasRow[]; snippet: string; source: string }
  /** Visual list of variants, when the component has them. */
  variants?: Example[]
  doExample: Example
  dontExample: Example
  a11y: ReactNode[]
  stories: number
  /** Extra sections after the props, e.g. States. */
  extra?: { id: string; label: string; node: ReactNode }[]
}

const MANAGERS = [
  ['pnpm', 'pnpm dlx shadcn@latest add'],
  ['npm', 'npx shadcn@latest add'],
  ['bun', 'bunx --bun shadcn@latest add'],
] as const

function Install({ file }: { file: string }) {
  const [pm, setPm] = useState<(typeof MANAGERS)[number][0]>('pnpm')
  const cmd = `$ ${MANAGERS.find(([p]) => p === pm)?.[1]} ${file}`
  return (
    <CodeBlock
      lang="sh"
      code={cmd}
      header={
        <div role="tablist" aria-label="Package manager" className="-ml-1 flex gap-1">
          {MANAGERS.map(([p]) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={pm === p}
              onClick={() => setPm(p)}
              className="h-10 min-w-10 cursor-pointer rounded-md px-2 font-sans text-xs font-medium text-code-dim outline-none hover:text-code-fg focus-visible:ring-[3px] focus-visible:ring-code-key/60 aria-selected:text-code-fg pointer-coarse:h-11 pointer-coarse:min-w-11"
            >
              {p}
            </button>
          ))}
        </div>
      }
    />
  )
}

function typeOf(p: { type: string; values?: string[] }) {
  return p.type === 'enum' ? (p.values ?? []).map((v) => `"${v}"`) : [p.type]
}

function Props({ name }: { name: string }) {
  const c = component(name)
  if (c.props.length === 0) {
    return (
      <p className="text-muted-foreground">
        No props of its own. Each part takes the HTML attributes of its element; {c.exports.length} exports:{' '}
        <code>{c.exports.join(', ')}</code>.
      </p>
    )
  }
  const many = new Set(c.props.map((p) => p.component)).size > 1 || c.props[0]?.component !== c.exports[0]
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full border-collapse text-sm max-[900px]:block" aria-label={`${c.name} props`}>
        <thead className="max-[900px]:hidden">
          <tr className="border-b">
            <th className="h-11 px-3 text-left font-medium text-muted-foreground">Prop</th>
            <th className="h-11 px-3 text-left font-medium text-muted-foreground">Type</th>
            <th className="h-11 px-3 text-right font-medium text-muted-foreground">Default</th>
          </tr>
        </thead>
        <tbody className="max-[900px]:block">
          {c.props.map((p) => (
            <tr
              key={`${p.component}.${p.name}`}
              className="border-b align-top last:border-0 max-[900px]:grid max-[900px]:grid-cols-[1fr_auto] max-[900px]:gap-x-3 max-[900px]:gap-y-1 max-[900px]:p-3"
            >
              <td className="px-3 py-3.5 font-mono text-[13px] font-medium whitespace-nowrap max-[900px]:p-0">
                {many && <span className="text-muted-foreground">{p.component}.</span>}
                {p.name}
              </td>
              <td className="px-3 py-3.5 max-[900px]:order-3 max-[900px]:col-span-2 max-[900px]:p-0">
                <span className="font-mono text-[13px] leading-[1.7] [overflow-wrap:anywhere]">
                  {typeOf(p).map((t, i) => (
                    <span key={t} className="inline-block whitespace-nowrap">
                      {i > 0 && <span className="px-1 text-text-subtle">|</span>}
                      {t}
                    </span>
                  ))}
                </span>
                <span className="mt-0.5 block text-[13px] text-muted-foreground">{p.description}</span>
              </td>
              <td className="px-3 py-3.5 text-right font-mono text-[13px] max-[900px]:p-0">
                {p.default ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DoDont({
  doExample,
  dontExample,
  name,
}: {
  doExample: Example
  dontExample: Example
  name: string
}) {
  const usage = component(name).usage
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        {(
          [
            ['Do', doExample, CircleCheck, 'text-success'],
            ["Don't", dontExample, CircleX, 'text-destructive'],
          ] as const
        ).map(([label, ex, Icon, tone]) => (
          <figure key={label} className="m-0 overflow-hidden rounded-lg border">
            <Stage inert>{ex.node}</Stage>
            <figcaption className="grid grid-cols-[16px_1fr] gap-2 border-t px-4 py-3 text-sm text-muted-foreground">
              <Icon className={cn('mt-1 size-4', tone)} aria-hidden />
              <span>
                <b className={cn('block font-semibold', tone)}>{label}</b>
                {ex.text}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {(usage.do.length > 0 || usage.dont.length > 0) && (
        <ul className="m-0 grid gap-1.5 pl-[18px] text-sm text-muted-foreground">
          {usage.do.map((t) => (
            <li key={t}>{t}</li>
          ))}
          {usage.dont.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Checks({ items }: { items: ReactNode[] }) {
  return (
    <ul className="m-0 grid list-none gap-2.5 p-0">
      {items.map((t, i) => (
        <li key={i} className="grid grid-cols-[20px_1fr] gap-2.5 text-muted-foreground">
          <Check className="mt-1 size-4 text-success" aria-hidden />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

export function ComponentDoc(props: ComponentDocProps) {
  const {
    name,
    lead,
    shadcn,
    primitive,
    canvas,
    variants,
    doExample,
    dontExample,
    a11y,
    stories,
    extra = [],
  } = props
  const title = props.title ?? name
  const c = component(name)
  const importLine = `import { ${c.exports.join(', ')} } from "${manifest.importBase}/${c.file}"`
  const extraImports = (c.extraImports ?? []).map((x) => `import { ${x.names.join(', ')} } from "${x.from}"`)
  const { prev, next } = nav(title)
  const toc = [
    { id: 'preview', label: 'Preview' },
    { id: 'installation', label: 'Installation' },
    ...(variants ? [{ id: 'variants', label: 'Variants' }] : []),
    { id: 'props', label: 'Props' },
    ...extra.map((e) => ({ id: e.id, label: e.label })),
    { id: 'do-dont', label: "Do and don't" },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'agent', label: 'What the agent receives' },
  ]
  return (
    <DocPage
      crumb={['Components', title]}
      title={title}
      lead={lead}
      file={`stories/components/${title}.mdx`}
      toc={toc}
      prev={prev}
      next={next}
      meta={
        <>
          <Badge variant="success">
            <CircleCheck aria-hidden />
            Stable
          </Badge>
          <MetaLink href={shadcn}>shadcn/ui {name === 'Sonner' ? 'Sonner' : title}</MetaLink>
          {primitive && <MetaLink href={primitive.href}>{primitive.label}</MetaLink>}
          <MetaLink href={`${REPO}/issues/new?title=${encodeURIComponent(`${title}: `)}`}>
            Report an issue
          </MetaLink>
        </>
      }
      side={
        <>
          <SideMeta label="Base" value="shadcn/ui" />
          {primitive && <SideMeta label="Primitive" value={primitive.pkg} />}
          <SideMeta label="Stories" value={stories} />
        </>
      }
    >
      <Section id="preview">
        <Canvas name={title} {...canvas} file={`${title}Example.tsx`} />
      </Section>
      <Section id="installation" title="Installation">
        <div className="grid gap-2">
          <Install file={c.file} />
          <CodeBlock title="Import" code={[importLine, ...extraImports].join('\n')} />
        </div>
      </Section>
      {variants && (
        <Section id="variants" title="Variants">
          <div className="overflow-hidden rounded-lg border">
            {variants.map((v) => (
              <div
                key={v.text}
                className="grid grid-cols-[150px_1fr] items-center gap-4 border-b px-2 py-1.5 text-sm last:border-0 max-[900px]:grid-cols-1 max-[900px]:gap-1.5 max-[900px]:p-3"
              >
                <div className="flex">{v.node}</div>
                <span className="text-muted-foreground">{v.text}</span>
              </div>
            ))}
          </div>
        </Section>
      )}
      <Section id="props" title="Props">
        <Props name={name} />
      </Section>
      {extra.map((e) => (
        <Section key={e.id} id={e.id} title={e.label}>
          {e.node}
        </Section>
      ))}
      <Section id="do-dont" title="Do and don't">
        <DoDont doExample={doExample} dontExample={dontExample} name={name} />
      </Section>
      <Section id="accessibility" title="Accessibility">
        <Checks items={a11y} />
      </Section>
      <Section id="agent" title="What the agent receives">
        <p className="mb-3.5 text-muted-foreground">
          The answer of <code>get_component("{title}")</code>, from the same function the MCP server runs.
        </p>
        <CodeBlock
          lang="json"
          title="get_component · response"
          code={JSON.stringify(agentAnswer(name), null, 2)}
          maxHeight={440}
        />
      </Section>
    </DocPage>
  )
}
