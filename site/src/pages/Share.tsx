// The artboard behind the GitHub social preview (1280 × 640) and the OG image (1200 × 630).
// scripts/share-images.mjs opens share.html and saves each one to public/. Same sentence as the
// site's H1, same diff as the hero (docs/DESIGN.md → Code and labels).
import { CircleCheck, TriangleAlert } from 'lucide-react'

import { DIFF, DiffRows } from '../components/Diff'
import { PHRASE } from '../components/Hero'
import { Mark } from '../components/Mark'
import { scoreboard } from '../lib/scoreboard-data'

const SUB = 'Tokens, shadcn/ui components and usage rules over MCP, plus a tool that reviews the code.'
const ROWS = DIFF.filter((r) => r.kind !== 'ctx')
  .slice(0, 6)
  .map((r) => ({ ...r, code: r.code.trimStart() }))

const TOOLS_FOOTER = (
  <span>
    <b className="font-medium text-foreground">5 MCP tools</b> · list_components · get_component · list_tokens
    · search_usage · validate_screen
  </span>
)

export const ARTBOARDS = {
  // README cover: no scoreboard line, so it never goes stale next to the README's own table.
  cover: { width: 1280, height: 640, footer: TOOLS_FOOTER, proof: false },
  social: {
    width: 1280,
    height: 640,
    footer: (
      <>
        <span>
          <b className="font-medium text-foreground">github.com/leonfpontes/atlas-ds-mcp</b>
        </span>
        <span>MCP server · shadcn/ui · MIT</span>
      </>
    ),
    proof: true,
  },
  og: {
    width: 1200,
    height: 630,
    footer: (
      <>
        <span>
          <b className="font-medium text-foreground">How it works</b> · tools · evaluation · quickstart
        </span>
        <span>Atlas · MIT</span>
      </>
    ),
    proof: true,
  },
} as const

export function Artboard({ kind, id = `art-${kind}` }: { kind: keyof typeof ARTBOARDS; id?: string }) {
  const a = ARTBOARDS[kind]
  const hero = a.proof && scoreboard.kind === 'ready' ? scoreboard.view : undefined
  return (
    <div
      id={id}
      role="img"
      aria-label={`Atlas. ${PHRASE} A diff where validate_screen found 4 issues and the agent fixed them.`}
      className="grid grid-rows-[1fr_auto] overflow-hidden bg-background text-foreground"
      style={{ width: a.width, height: a.height }}
    >
      <div className="grid grid-cols-[440px_minmax(0,1fr)] items-start gap-x-10 px-14 pt-[52px]">
        <div>
          <div className="flex items-center gap-3 text-2xl font-semibold">
            <Mark size={34} />
            Atlas
          </div>
          <p className="mt-10 mb-[18px] text-[46px]/[1.08] font-semibold tracking-[-0.03em]">{PHRASE}</p>
          <p className="text-[23px]/[1.45] text-muted-foreground">{SUB}</p>
          <span className="mt-7 inline-block rounded-md border bg-muted px-4 py-3 font-mono text-lg whitespace-nowrap">
            <span className="text-text-subtle">$ </span>npx @leonfpontes/design-system-mcp
          </span>
        </div>
        <div>
          <div className="mt-1.5 overflow-hidden rounded-lg bg-code-bg font-mono text-code-fg dark:border">
            <div className="flex h-[52px] items-center border-b border-code-fg/15 px-4 text-lg">
              <span>
                validate_screen found <b className="font-medium text-code-del">4 issues</b> →{' '}
                <i className="text-code-add not-italic">fixed</i>
              </span>
            </div>
            <pre
              className={`m-0 py-2.5 ${kind === 'og' ? 'text-[18px]/[1.7] [&_.diff-gutter]:w-[100px]' : 'text-[20px]/[1.7] [&_.diff-gutter]:w-[108px]'} [&_.diff-gutter]:gap-2.5 [&_.diff-gutter]:pl-3.5 [&_.issue-chip]:size-[26px] [&_.issue-chip]:text-base`}
            >
              <code>
                <DiffRows rows={ROWS} />
              </code>
            </pre>
            <div className="flex items-center gap-2.5 border-t border-code-fg/15 px-4 py-3 text-[19px] text-code-add">
              <CircleCheck className="size-5" aria-hidden />0 issues after the fix
            </div>
          </div>
          {hero && (
            <p className="mt-5 flex flex-wrap items-center gap-3 text-[22px] text-muted-foreground">
              <span>
                <b className="font-mono text-foreground">{hero.hero.lookups}</b> valid screens with the
                lookups vs <b className="font-mono text-foreground">{hero.hero.without}</b> without
              </span>
              {hero.standIns && (
                <span className="note-tag text-base/6">
                  <TriangleAlert className="size-4" aria-hidden />
                  render with stand-ins
                </span>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="mt-7 flex justify-between gap-6 border-t px-14 py-[18px] font-mono text-[19px] text-muted-foreground">
        {a.footer}
      </div>
    </div>
  )
}

export function Share() {
  return (
    <main className="grid justify-items-start gap-10 p-10">
      <Artboard kind="social" />
      <Artboard kind="og" />
      <Artboard kind="cover" id="art-cover-light" />
      {/* The dark cover: the token variables switch under .dark. */}
      <div className="dark">
        <Artboard kind="cover" id="art-cover-dark" />
      </div>
    </main>
  )
}
