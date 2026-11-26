import { CircleCheck } from 'lucide-react'

// The canonical diff: the same lines and numbers on the site, the README cover, the social
// preview and the OG image (docs/DESIGN.md → Code and labels).
type Kind = 'ctx' | 'del' | 'add'
export const DIFF: { kind: Kind; line: number; issue?: number; code: string }[] = [
  { kind: 'ctx', line: 1, code: 'import { Badge } from "@/components/ui/badge"' },
  { kind: 'ctx', line: 2, code: 'import { Card } from "@/components/ui/card"' },
  { kind: 'del', line: 3, issue: 1, code: 'import { Table } from "atlas/src/internal"' },
  { kind: 'add', line: 3, code: 'import { Table } from "@/components/ui/table"' },
  { kind: 'ctx', line: 4, code: '' },
  { kind: 'ctx', line: 5, code: 'export function OrdersPage({ orders }) {' },
  { kind: 'ctx', line: 6, code: '  return (' },
  { kind: 'del', line: 7, issue: 2, code: '    <div style={{ background: "#7c3aed" }}>' },
  { kind: 'add', line: 7, code: '    <Card>' },
  { kind: 'del', line: 8, issue: 3, code: '      <DataGrid rows={orders} />' },
  { kind: 'add', line: 8, code: '      <OrdersTable orders={orders} />' },
  { kind: 'del', line: 9, issue: 4, code: '      <Badge variant="green">Paid</Badge>' },
  { kind: 'add', line: 9, code: '      <Badge variant="success">Paid</Badge>' },
]

export const ISSUE_NAMES = ['internal import', 'hard-coded color', 'unknown component', 'wrong prop']

const SIGN: Record<Kind, string> = { ctx: ' ', del: '-', add: '+' }
const SR: Record<Kind, string> = { ctx: 'line', del: 'removed line', add: 'added line' }

export function DiffRows({ rows = DIFF }: { rows?: typeof DIFF }) {
  return (
    <>
      {rows.map((r, i) => (
        <span key={i} className="diff-row" data-kind={r.kind}>
          <span className="diff-gutter" aria-hidden="true">
            <span className={r.kind === 'ctx' ? 'w-[1ch] text-code-dim' : 'w-[1ch]'}>{SIGN[r.kind]}</span>
            <span className="w-[2ch] text-right text-code-dim">{r.line}</span>
            {r.issue ? (
              <span className="issue-chip">{r.issue}</span>
            ) : (
              <span className="inline-block w-[18px]" />
            )}
          </span>
          <span className="sr-only">
            {SR[r.kind]} {r.line}
            {r.issue ? `, issue ${r.issue}` : ''}:{' '}
          </span>
          {r.code}
        </span>
      ))}
    </>
  )
}

export function DiffFigure() {
  return (
    <figure
      aria-label="Diff of src/OrdersPage.tsx: validate_screen found 4 issues and the agent fixed them"
      className="m-0 overflow-hidden rounded-lg bg-code-bg font-mono text-[13px] text-code-fg dark:border"
    >
      <div className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-0.5 border-b border-code-fg/15 px-3.5 py-2 text-xs">
        <span>
          validate_screen found <b className="font-medium text-code-del">4 issues</b> →{' '}
          <i className="text-code-add not-italic">fixed</i>
        </span>
        <span className="flex-1" />
        <span className="text-code-dim">src/OrdersPage.tsx</span>
      </div>
      <pre
        tabIndex={0}
        className="m-0 overflow-x-auto py-2.5 text-[13px]/[1.75] outline-none focus-visible:ring-[3px] focus-visible:ring-code-key/60 focus-visible:ring-inset max-[600px]:text-xs"
      >
        <code>
          <DiffRows />
        </code>
      </pre>
      <div className="grid grid-cols-[repeat(2,max-content)] gap-x-6 gap-y-1.5 border-t border-code-fg/15 px-4 py-2.5 text-xs text-code-dim">
        {ISSUE_NAMES.map((n, i) => (
          <span key={n} className="inline-flex items-center gap-1.5">
            <b className="issue-chip">{i + 1}</b>
            {n}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-code-fg/15 px-4 py-2.5 text-[13px] text-code-add">
        <CircleCheck className="size-4" aria-hidden />0 issues after the fix
      </div>
    </figure>
  )
}
