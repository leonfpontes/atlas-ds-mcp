import { CircleCheck, OctagonX } from 'lucide-react'

import { CodeBlock } from '../blocks/CodeBlock'
import { validate } from '../blocks/data'
import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'

// The canonical example: the same four lines as the site, the README cover and the social preview.
export const BAD_SCREEN = `import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Table } from "atlas/src/internal"

export function Orders({ orders }) {
  return (
    <div style={{ background: "#7c3aed" }}>
      <DataGrid rows={orders} />
      <Badge variant="green">Paid</Badge>
    </div>
  )
}
`

const RULES = [
  [
    'hard-coded-color',
    'Hard-coded color',
    'A hex, rgb or named color instead of a token.',
    '<div style={{ background: "#7c3aed" }}>',
    '<Card>  // or className="bg-primary"',
  ],
  [
    'unknown-component',
    'Unknown component',
    "A component Atlas doesn't have.",
    '<DataGrid rows={orders} />',
    '<Table>…</Table>',
  ],
  [
    'invalid-prop',
    'Wrong prop or variant',
    "A prop or variant the component doesn't accept.",
    '<Badge variant="green">Paid</Badge>',
    '<Badge variant="success">Paid</Badge>',
  ],
  [
    'internal-import',
    'Internal import',
    'An import from Atlas internals instead of the public path.',
    'import { Table } from "atlas/src/internal"',
    'import { Table } from "@/components/ui/table"',
  ],
] as const

export function ValidateRulesPage() {
  const result = validate(BAD_SCREEN)
  const short = `[${result.issues.map((i) => `{ "line": ${i.line}, "rule": "${i.rule}" }`).join(',\n ')}]`
  return (
    <DocPage
      crumb={['MCP', 'validate_screen rules']}
      eyebrow="MCP"
      title="validate_screen rules"
      lead="The four rules the server checks in a JSX or TSX file. Each finding has a line, a rule id and a fix the agent can apply."
      file="stories/mcp/ValidateRulesPage.tsx"
      {...nav('validate_screen rules')}
      toc={[
        { id: 'output', label: 'What the agent gets back' },
        ...RULES.map(([id, title]) => ({ id, label: title })),
      ]}
    >
      <Section id="output" title="What the agent gets back">
        <p className="mb-3.5 text-muted-foreground">
          The result of <code>validate_screen</code> on the orders screen below, computed by the server's own
          code when this page loads.
        </p>
        <div className="grid gap-2">
          <CodeBlock lang="json" title="validate_screen · issues" code={short} />
          <CodeBlock title="Orders.tsx" code={BAD_SCREEN.trimEnd()} />
        </div>
      </Section>
      {RULES.map(([id, title, text, bad, good]) => {
        const issue = result.issues.find((i) => i.rule === id)
        return (
          <section key={id} id={id} className="scroll-mt-6 border-t pt-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-xl font-semibold">{title}</h2>
              <code className="text-[13px] text-muted-foreground">{id}</code>
            </div>
            <p className="mt-1.5 mb-3.5 text-muted-foreground">{text}</p>
            <div className="grid grid-cols-2 gap-3 max-[900px]:grid-cols-1">
              <CodeBlock
                copy={false}
                header={
                  <span className="inline-flex items-center gap-1.5 font-sans font-medium text-code-del">
                    <OctagonX className="size-3.5" aria-hidden />
                    Flagged
                  </span>
                }
                code={bad}
              />
              <CodeBlock
                copy={false}
                header={
                  <span className="inline-flex items-center gap-1.5 font-sans font-medium text-code-add">
                    <CircleCheck className="size-3.5" aria-hidden />
                    Fix
                  </span>
                }
                code={good}
              />
            </div>
            {issue && (
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Server message:</span> {issue.message}
              </p>
            )}
          </section>
        )
      })}
    </DocPage>
  )
}
