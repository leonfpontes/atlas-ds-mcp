// The demo behind the README GIF and the 1-minute video. scripts/record-demo.mjs renders it
// frame by frame (window.__setTime) and encodes the frames with ffmpeg. Everything the tools
// "answer" comes from the MCP server's own code, run on the two files in demo-script.ts.
import type { TokenTree } from '@leonfpontes/atlas-tokens'
import tokens from '@leonfpontes/atlas-tokens/tokens.json'
import { cn } from '@leonfpontes/atlas-ui'
import { CircleCheck, OctagonX, TriangleAlert } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

import { parseManifest } from '../../../mcp/src/manifest'
import { getComponent, runValidateScreen } from '../../../mcp/src/tools'
import manifestJson from '../../../packages/ui/atlas.manifest.json'
import { GuessedScreen } from '../components/GuessedScreen'
import { Mark } from '../components/Mark'
import { numberScene } from '../lib/scoreboard'
import { scoreboard } from '../lib/scoreboard-data'
import { AT, BAD_FILE, captionsFor, FIXED_FILE, PROMPT, SCENES } from './demo-script'

const data = { manifest: parseManifest(manifestJson), tokens: tokens as TokenTree }
const before = runValidateScreen(data, BAD_FILE)
const after = runValidateScreen(data, FIXED_FILE)
const look = (name: string) => getComponent(data, name)

const W = 1280
const H = 720

function Line({ show, children, className }: { show: boolean; children: ReactNode; className?: string }) {
  return show ? <div className={className}>{children}</div> : null
}

function Tool({ name, args }: { name: string; args: string }) {
  return (
    <div className="mt-3">
      <span className="text-code-add">●</span> <span className="text-code-key">atlas</span> · {name}
      <span className="text-code-dim">({args})</span>
    </div>
  )
}

function Terminal({ d }: { d: number }) {
  const typed = PROMPT.slice(0, Math.round((Math.min(d, AT.typeEnd) / AT.typeEnd) * PROMPT.length))
  const issuesShown =
    d < AT.issues ? 0 : Math.min(before.issues.length, 1 + Math.floor((d - AT.issues) / 300))
  const fixed = AT.fixLines.filter((x) => d >= x).length
  const card = look('Card')
  const badge = look('Badge')
  const table = look('Table')
  // Like a terminal: once the lines don't fit, the newest stay in view.
  const box = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight
  })
  return (
    <div
      ref={box}
      className="h-[calc(100%-44px)] overflow-hidden px-6 py-5 font-mono text-[15px]/[1.6] text-code-fg"
    >
      <div>
        <span className="text-code-dim">&gt; </span>
        {typed}
        {d < AT.typeEnd + 400 && (
          <span className="ml-0.5 inline-block h-[18px] w-2 translate-y-[3px] bg-code-fg" />
        )}
      </div>
      <Line show={d >= AT.check1}>
        <Tool name="validate_screen" args="src/OrdersPage.tsx" />
      </Line>
      <Line show={d >= AT.issues} className="pl-4 text-code-del">
        ⎿ {before.issueCount} issues
      </Line>
      {before.issues.slice(0, issuesShown).map((i) => (
        <div key={i.line} className="pl-8 text-code-fg">
          <span className="text-code-dim">line {i.line}</span> ·{' '}
          <span className="text-code-str">{i.rule}</span>
        </div>
      ))}
      <Line show={d >= AT.lookCard}>
        <Tool name="get_component" args={'"Card"'} />
        <div className="truncate pl-4 text-code-dim">⎿ {card.import}</div>
      </Line>
      <Line show={d >= AT.lookTable}>
        <Tool name="get_component" args={'"Table"'} />
        <div className="truncate pl-4 text-code-dim">⎿ {table.import}</div>
      </Line>
      <Line show={d >= AT.lookBadge}>
        <Tool name="get_component" args={'"Badge"'} />
        <div className="truncate pl-4 text-code-dim">
          ⎿ variant: {badge.props.find((p) => p.name === 'variant')?.values?.join(' | ')}
        </div>
      </Line>
      <Line show={d >= AT.edit} className="mt-3">
        <span className="text-code-add">●</span> Edit src/OrdersPage.tsx{' '}
        <span className="text-code-dim">
          ({fixed} of {AT.fixLines.length} lines)
        </span>
      </Line>
      <Line show={d >= AT.check2}>
        <Tool name="validate_screen" args="src/OrdersPage.tsx" />
      </Line>
      <Line show={d >= AT.clean} className="pl-4 text-code-add">
        ⎿ {after.issueCount} issues · {after.summary.replace(/^0 issues: /, '')}
      </Line>
      <Line show={d >= AT.summary} className="mt-3">
        Fixed {before.issueCount} issues. The screen now uses Atlas components, tokens and public imports.
      </Line>
    </div>
  )
}

/** The file being checked: issue chips first, then the fixed lines arriving one by one. */
function FilePanel({ d }: { d: number }) {
  const bad = BAD_FILE.trimEnd().split('\n')
  const good = FIXED_FILE.trimEnd().split('\n')
  const changed = [3, 4, 7, 8, 9, 10]
  const flagged = new Map(before.issues.map((i, n) => [i.line, n + 1]))
  const done = AT.fixLines.filter((x) => d >= x).length
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-11 items-center justify-between border-b border-code-fg/15 px-4 font-mono text-[13px] text-code-dim">
        <span>src/OrdersPage.tsx</span>
        {d >= AT.clean ? (
          <span className="inline-flex items-center gap-1.5 text-code-add">
            <CircleCheck className="size-4" aria-hidden />0 issues
          </span>
        ) : d >= AT.issues ? (
          <span className="inline-flex items-center gap-1.5 text-code-del">
            <OctagonX className="size-4" aria-hidden />
            {before.issueCount} issues
          </span>
        ) : null}
      </div>
      <pre className="m-0 flex-1 py-3 font-mono text-[14px]/[1.75]">
        {bad.map((line, i) => {
          const n = i + 1
          const k = changed.indexOf(n)
          const isFixed = k >= 0 && k < done
          const chip = d >= AT.issues && !isFixed ? flagged.get(n) : undefined
          return (
            <div
              key={n}
              className={cn(
                'flex whitespace-pre',
                chip && 'bg-[color-mix(in_oklab,var(--code-del)_14%,var(--code-bg))] text-code-del',
                isFixed && 'bg-[color-mix(in_oklab,var(--code-add)_22%,var(--code-bg))] text-code-add',
              )}
            >
              <span className="w-12 flex-none pr-3 text-right text-code-dim">{n}</span>
              <span className="w-7 flex-none">
                {chip ? <span className="issue-chip">{chip}</span> : null}
              </span>
              {isFixed ? good[i] : line}
            </div>
          )
        })}
      </pre>
    </div>
  )
}

function Caption({ t }: { t: number }) {
  const c = CAPTIONS.find((x) => t >= x.from && t < x.to)
  if (!c) return null
  return (
    <div className="absolute inset-x-0 bottom-7 flex justify-center px-16">
      <p className="rounded-md bg-code-bg/90 px-5 py-2.5 text-center text-[24px]/[1.35] font-medium text-code-fg">
        {c.text}
      </p>
    </div>
  )
}

function Problem() {
  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)_420px] items-center gap-14 px-16 pb-24">
      <div className="overflow-hidden rounded-lg border">
        <div className="flex h-11 items-center border-b bg-muted px-4 text-sm text-muted-foreground">
          What the agent guessed · no design system
        </div>
        <div className="flex h-[300px]">
          <GuessedScreen />
        </div>
      </div>
      <div>
        <p className="text-[40px]/[1.15] font-semibold tracking-[-0.02em]">
          The agent doesn't know your design system.
        </p>
        <p className="mt-4 text-xl text-muted-foreground">So it invents one.</p>
      </div>
    </div>
  )
}

function DemoScene({ d }: { d: number }) {
  return (
    <div className="grid h-full grid-cols-[minmax(0,1fr)_520px] gap-6 px-10 pt-8 pb-28">
      <div className="overflow-hidden rounded-lg bg-code-bg">
        <div className="flex h-11 items-center gap-2 border-b border-code-fg/15 px-4 text-[13px] text-code-dim">
          <span className="font-mono">Terminal · coding agent with the Atlas MCP server</span>
        </div>
        <Terminal d={d} />
      </div>
      <div className="overflow-hidden rounded-lg bg-code-bg text-code-fg">
        <FilePanel d={d} />
      </div>
    </div>
  )
}

const NUMBERS = numberScene(scoreboard)
const CAPTIONS = captionsFor(NUMBERS)

function NumberScene() {
  const n = NUMBERS
  if (!n) return <p className="p-16 text-3xl">No evaluation run yet.</p>
  return (
    <div className="grid h-full content-center justify-items-start gap-8 px-24 pb-24">
      <div className="flex items-end gap-16">
        <div>
          <p className="font-mono text-[120px]/none font-semibold text-primary">{n.lookups}</p>
          <p className="mt-3 text-2xl text-muted-foreground">valid screens with the Atlas lookups</p>
        </div>
        <div>
          <p className="font-mono text-[120px]/none font-semibold">{n.without}</p>
          <p className="mt-3 text-2xl text-muted-foreground">without Atlas</p>
        </div>
      </div>
      <p className="text-lg text-muted-foreground">
        {n.model} · {n.prompts} prompts × {n.runs} runs · run {n.runDate}
      </p>
      {n.standIns && (
        <span className="note-tag text-base/6">
          <TriangleAlert className="size-4" aria-hidden />
          Render test with stand-ins, not the real components yet
        </span>
      )}
      <p className="font-mono text-lg">github.com/leonfpontes/atlas-ds-mcp</p>
    </div>
  )
}

export function Demo({ t }: { t: number }) {
  const [p0, p1] = SCENES.problem
  const [d0] = SCENES.demo
  const [n0] = SCENES.number
  return (
    <div className="relative overflow-hidden bg-background text-foreground" style={{ width: W, height: H }}>
      <div className="flex h-16 items-center gap-2.5 px-10 text-lg font-semibold">
        <Mark />
        Atlas
        <span className="ml-2 text-sm font-normal text-muted-foreground">Design system MCP server</span>
      </div>
      <div className="absolute inset-x-0 top-16 bottom-0">
        {t >= p0 && t < p1 && <Problem />}
        {t >= d0 && t < n0 && <DemoScene d={t - d0} />}
        {t >= n0 && <NumberScene />}
      </div>
      <Caption t={t} />
    </div>
  )
}

declare global {
  interface Window {
    __setTime?: (ms: number) => Promise<void>
  }
}

/** Page for the recorder: ?t= renders one moment; window.__setTime moves the clock. */
export function DemoPage() {
  const [t, setT] = useState(() => Number(new URLSearchParams(location.search).get('t') ?? 0))
  useEffect(() => {
    window.__setTime = (ms) =>
      new Promise((resolve) => {
        setT(ms)
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
  }, [])
  return <Demo t={t} />
}
