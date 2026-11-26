import {
  Box,
  Check,
  ChevronDown,
  CircleCheck,
  Copy,
  Info,
  OctagonX,
  Plus,
  Search,
  Store,
  TriangleAlert,
  X,
} from 'lucide-react'

import { CodeBlock } from '../blocks/CodeBlock'
import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'

const STATUS = [
  [Info, 'Info', 'circle "i"', 'text-info'],
  [CircleCheck, 'CircleCheck', 'circle with a check', 'text-success'],
  [TriangleAlert, 'TriangleAlert', 'triangle "!"', 'text-warning'],
  [OctagonX, 'OctagonX', 'octagon "×"', 'text-destructive'],
] as const

const UI = [
  [Search, 'Search'],
  [Copy, 'Copy'],
  [Check, 'Check'],
  [X, 'X'],
  [ChevronDown, 'ChevronDown'],
  [Plus, 'Plus'],
  [Box, 'Box'],
  [Store, 'Store'],
] as const

export function IconsPage() {
  return (
    <DocPage
      crumb={['Foundations', 'Icons']}
      eyebrow="Foundations"
      title="Icons"
      lead="Line icons from lucide, 2 px stroke, 16 px in controls. Each status has its own shape, so it reads without color."
      file="stories/foundations/IconsPage.tsx"
      {...nav('Icons')}
      toc={[
        { id: 'status', label: 'Status icons' },
        { id: 'ui', label: 'Interface icons' },
        { id: 'use', label: 'Use' },
      ]}
    >
      <Section id="status" title="Status icons">
        <div className="grid grid-cols-4 rounded-lg border max-[900px]:grid-cols-2">
          {STATUS.map(([Icon, name, shape, tone]) => (
            <div
              key={name}
              className="grid justify-items-start gap-2 border-r p-4 last:border-0 max-[900px]:nth-2:border-r-0"
            >
              <Icon className={`size-6 ${tone}`} aria-hidden />
              <b className="font-mono text-[13px] font-medium">{name}</b>
              <span className="text-sm text-muted-foreground">{shape}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section id="ui" title="Interface icons">
        <div className="grid grid-cols-4 gap-2 max-[900px]:grid-cols-2">
          {UI.map(([Icon, name]) => (
            <div key={name} className="flex items-center gap-3 rounded-lg border px-3 py-3 text-sm">
              <Icon className="size-4" aria-hidden />
              <span className="font-mono text-[13px]">{name}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section id="use" title="Use">
        <CodeBlock
          code={`import { CircleCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export function Paid() {
  return (
    <Badge variant="success">
      <CircleCheck />
      Paid
    </Badge>
  )
}`}
          title="Paid.tsx"
        />
      </Section>
    </DocPage>
  )
}
