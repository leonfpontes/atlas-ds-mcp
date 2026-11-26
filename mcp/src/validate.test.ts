import { themeColors } from '@leonfpontes/atlas-tokens'
import { describe, expect, it } from 'vitest'

import { CANONICAL_AFTER, CANONICAL_BEFORE, data } from './test/fixtures.js'
import { ParseError, RULE_IDS, validateScreen } from './validate.js'

const colors = themeColors(data.tokens)
const check = (code: string) => validateScreen(code, data.manifest, colors)
const rules = (code: string) => check(code).issues.map((i) => `${i.line}:${i.rule}`)

const file = (body: string, imports = '') =>
  `${imports}\nexport function Screen({ orders, open }) {\n  return (\n${body}\n  )\n}\n`

describe('validate_screen · the canonical diff', () => {
  it('finds the four issues of the "before" file, one per rule, on lines 3, 7, 8 and 9', () => {
    const result = check(CANONICAL_BEFORE)
    expect(result.issues.map((i) => [i.line, i.rule])).toEqual([
      [3, 'internal-import'],
      [7, 'hard-coded-color'],
      [8, 'unknown-component'],
      [9, 'invalid-prop'],
    ])
    expect(result.valid).toBe(false)
    expect(result.summary).toBe(
      '4 issues: 1 hard-coded-color, 1 unknown-component, 1 invalid-prop, 1 internal-import. Fix them and call validate_screen again.',
    )
  })

  it('gives a fix the agent can apply for each one', () => {
    const fixes = Object.fromEntries(check(CANONICAL_BEFORE).issues.map((i) => [i.rule, i.fix]))
    expect(fixes['internal-import']).toBe('import { Table } from "@/components/ui/table"')
    expect(fixes['unknown-component']).toContain('Use Table: import { Table, TableHeader')
    expect(fixes['invalid-prop']).toBe('variant="success"')
    expect(fixes['hard-coded-color']).toContain('list_tokens')
  })

  it('passes the "after" file with 0 issues', () => {
    expect(check(CANONICAL_AFTER)).toEqual({
      valid: true,
      issueCount: 0,
      issues: [],
      summary: '0 issues: tokens only, Atlas components, valid props, public imports.',
    })
  })

  it('exposes exactly the four public rule ids', () => {
    expect(RULE_IDS).toEqual(['hard-coded-color', 'unknown-component', 'invalid-prop', 'internal-import'])
  })
})

describe('hard-coded-color', () => {
  it('flags hex, color functions and named colors in style, with the column', () => {
    const code = file(
      `    <div style={{ color: 'white', borderColor: "rgb(0 0 0)", background: \`#fff\` }} />`,
    )
    const issues = check(code).issues
    expect(issues.map((i) => i.message)).toEqual([
      'style.color uses the named color "white".',
      'style.borderColor uses a color function: rgb(0 0 0).',
      'style.background uses the fixed color #fff.',
    ])
    expect(issues[0]).toMatchObject({ line: 4, column: 26 })
  })

  it('maps a hex that is a token back to the token', () => {
    const [issue] = check(file(`    <p style={{ color: "#0b5cad" }}>Total</p>`)).issues
    expect(issue?.fix).toContain('the token "primary": use bg-primary')
  })

  it('flags palette and arbitrary color classes, also inside cn() and with variants', () => {
    const code = file(
      `    <div className={cn("p-4 bg-white", open && "hover:text-slate-900", "border-[#e5e7eb]")}>
      <span className="dark:bg-red-500/50 text-muted-foreground">Late</span>
    </div>`,
      'import { cn } from "@/lib/utils"',
    )
    expect(check(code).issues.map((i) => [i.message, i.fix])).toEqual([
      ['The class bg-white is a fixed palette color; it ignores the theme.', 'Use bg-background.'],
      [
        'The class hover:text-slate-900 is a fixed palette color; it ignores the theme.',
        'Use text-foreground or text-muted-foreground.',
      ],
      [
        'The class border-[#e5e7eb] sets a fixed color.',
        'Use a token class (bg-primary, text-foreground, border-border).',
      ],
      ['The class dark:bg-red-500/50 is a fixed palette color; it ignores the theme.', 'Use bg-destructive.'],
    ])
  })

  it('checks class strings built outside JSX, and color props such as fill', () => {
    const code = `const tone = cn("text-green-600")\nexport const Dot = () => <svg><circle fill="tomato" /></svg>\n`
    expect(rules(code)).toEqual(['1:hard-coded-color', '2:hard-coded-color'])
  })

  it('leaves text that only looks like a color alone', () => {
    const code = file(`    <p className="text-muted-foreground">Order #1042 · #fff is not a color here</p>`)
    expect(check(code).issues).toEqual([])
  })

  it('accepts token classes and CSS variables', () => {
    const code = file(
      `    <div className="bg-primary text-primary-foreground border-border" style={{ color: "var(--primary)" }} />`,
    )
    expect(check(code).issues).toEqual([])
  })
})

describe('unknown-component', () => {
  it('flags each unknown component once, with the count', () => {
    const code = file(`    <>\n      <Modal />\n      <Modal />\n    </>`)
    const [issue] = check(code).issues
    expect(issue).toMatchObject({ rule: 'unknown-component', line: 5 })
    expect(issue?.message).toBe(
      "Atlas has no Modal (used 2 times), and this file doesn't define or import it.",
    )
    expect(issue?.fix).toContain('Use Dialog:')
  })

  it('accepts components the file defines, imports from elsewhere or receives as props', () => {
    const code = `import { Copy } from "lucide-react"
import { OrdersTable } from "./orders-table"
function Row() { return <tr /> }
const Empty = () => null
export function Screen({ icon: Icon, ...rest }) {
  return <><Copy /><OrdersTable /><Row /><Empty /><Icon /></>
}
`
    expect(check(code).issues).toEqual([])
  })

  it('flags imports from other UI libraries and missing Atlas files or names', () => {
    const code = `import { Button as MuiButton } from "@mui/material"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/button"
export const S = () => <MuiButton />
`
    const issues = check(code).issues
    expect(issues.map((i) => `${i.line}:${i.rule}`)).toEqual([
      '1:unknown-component',
      '2:unknown-component',
      '3:unknown-component',
    ])
    expect(issues[0]?.message).toBe('Button comes from "@mui/material", not from Atlas.')
    expect(issues[1]?.message).toBe('Atlas has no "data-table" component.')
    expect(issues[2]?.fix).toBe('import { Badge } from "@/components/ui/badge"')
  })

  it('accepts the toast helper from sonner and aliases on import', () => {
    const code = `import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Button as AtlasButton } from "@/components/ui/button"
export const S = () => <><Toaster /><AtlasButton variant="outline" onClick={() => toast.success("Order saved")}>Save order</AtlasButton></>
`
    expect(check(code).issues).toEqual([])
  })
})

describe('invalid-prop', () => {
  it('flags enum values Atlas does not accept, as string or {"string"}', () => {
    const code = file(
      `    <>
      <Button variant="primary" size={"large"}>Save order</Button>
      <SheetContent side="center" />
    </>`,
      'import { Button } from "@/components/ui/button"\nimport { SheetContent } from "@/components/ui/sheet"',
    )
    expect(check(code).issues.map((i) => [i.line, i.message, i.fix])).toEqual([
      [
        6,
        'Button has no variant "primary". It accepts: default, destructive, outline, secondary, ghost, link.',
        'variant="default"',
      ],
      [6, 'Button has no size "large". It accepts: default, lg, icon.', 'size="lg"'],
      [
        7,
        'SheetContent has no side "center". It accepts: top, right, bottom, left.',
        'Pick one of: top, right, bottom, left.',
      ],
    ])
  })

  it('leaves dynamic values and local components with the same name alone', () => {
    const code = `import { Button } from "@/components/ui/button"
function Badge({ variant }) { return <span>{variant}</span> }
export const S = ({ v }) => <><Button variant={v} /><Badge variant="green" /></>
`
    expect(check(code).issues).toEqual([])
  })
})

describe('internal-import', () => {
  it('flags Atlas internals and Radix primitives with the public import', () => {
    const code = `import { Button } from "@leonfpontes/atlas-ui/src/components/button"
import * as DialogPrimitive from "@radix-ui/react-dialog"
export const S = () => <Button>Save order</Button>
`
    const issues = check(code).issues
    expect(issues.map((i) => [i.line, i.rule, i.fix])).toEqual([
      [1, 'internal-import', 'import { Button } from "@/components/ui/button"'],
      [
        2,
        'internal-import',
        'import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog" — Atlas wraps Radix with the theme and labels.',
      ],
    ])
  })
})

describe('parsing', () => {
  it('reads TSX with types and generics', () => {
    const code = `import { Badge } from "@/components/ui/badge"
type Status = "paid" | "failed"
export function Cell<T extends { status: Status }>({ row }: { row: T }) {
  return <Badge variant={row.status === "paid" ? "success" : "destructive"}>{row.status}</Badge>
}
`
    expect(check(code).issues).toEqual([])
  })

  it('throws a ParseError with the line of a syntax error', () => {
    expect(() => check('const a = 1\nexport const S = () => <div>\n')).toThrow(ParseError)
    try {
      check('const a = 1\nconst b = (\n')
    } catch (error) {
      expect((error as ParseError).line).toBe(3)
    }
  })
})
