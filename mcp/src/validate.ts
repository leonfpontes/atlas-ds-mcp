// validate_screen: reads a JSX or TSX file and reports the four mistakes coding
// agents make with a design system. Each issue has a line, a rule id and a fix
// the agent can apply. Rule ids are public (docs/API.md); renaming one is breaking.
//
// The file is parsed, not matched with regular expressions, so an order number
// like "#1042" in the text is never mistaken for a color.

import { parse } from '@babel/parser'

import { importLine, type ComponentEntry, type Manifest } from './manifest.js'

export const RULE_IDS = ['hard-coded-color', 'unknown-component', 'invalid-prop', 'internal-import'] as const
export type RuleId = (typeof RULE_IDS)[number]

export interface Issue {
  line: number
  column: number
  rule: RuleId
  message: string
  fix: string
}

export interface ValidationResult {
  valid: boolean
  issueCount: number
  issues: Issue[]
  summary: string
}

export class ParseError extends Error {
  constructor(
    message: string,
    readonly line: number,
  ) {
    super(message)
  }
}

/** Colors the validator can map back to a token, e.g. `#0b5cad` → `primary`. */
export interface TokenColor {
  name: string
  light: string
  dark: string
}

// ── Syntax tree helpers ────────────────────────────────────────────────────

interface Loc {
  start: { line: number; column: number }
}
interface Node {
  type: string
  loc?: Loc
  [key: string]: unknown
}

const isNode = (x: unknown): x is Node =>
  typeof x === 'object' && x !== null && typeof (x as Node).type === 'string'

function children(node: Node): Node[] {
  const out: Node[] = []
  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'extra') continue
    if (Array.isArray(value)) {
      for (const item of value) if (isNode(item)) out.push(item)
    } else if (isNode(value)) {
      out.push(value)
    }
  }
  return out
}

function walk(node: Node, visit: (node: Node) => void) {
  visit(node)
  for (const child of children(node)) walk(child, visit)
}

const at = (node: Node) => ({ line: node.loc?.start.line ?? 1, column: (node.loc?.start.column ?? 0) + 1 })

/** Every string literal (and the static parts of template literals) under a node. */
function strings(node: Node): { value: string; node: Node }[] {
  const out: { value: string; node: Node }[] = []
  walk(node, (n) => {
    if (n.type === 'StringLiteral') out.push({ value: n.value as string, node: n })
    if (n.type === 'TemplateElement')
      out.push({ value: (n.value as { cooked?: string; raw: string }).raw, node: n })
  })
  return out
}

/** Names a pattern binds: `x`, `{ a, b: c }`, `[d, ...e]`, `f = 1`. */
function bindings(pattern: unknown, out: Set<string>) {
  if (!isNode(pattern)) return
  switch (pattern.type) {
    case 'Identifier':
      out.add(pattern.name as string)
      break
    case 'ObjectPattern':
      for (const p of pattern.properties as Node[])
        bindings(p.type === 'RestElement' ? p.argument : p.value, out)
      break
    case 'ArrayPattern':
      for (const p of pattern.elements as unknown[]) bindings(p, out)
      break
    case 'AssignmentPattern':
      bindings(pattern.left, out)
      break
    case 'RestElement':
      bindings(pattern.argument, out)
      break
    case 'TSParameterProperty':
      bindings(pattern.parameter, out)
      break
  }
}

// ── Colors ──────────────────────────────────────────────────────────────────

const HEX = /#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![0-9a-z])/gi
const COLOR_FUNCTION = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i
const COLOR_PROPERTY = /color|background|border|fill|stroke|outline|shadow|caret|accent|decoration/i
const COLOR_ATTRIBUTE = new Set([
  'color',
  'fill',
  'stroke',
  'bg',
  'background',
  'backgroundColor',
  'stopColor',
])
const CLASS_HELPERS = new Set(['cn', 'clsx', 'classnames', 'cva', 'twMerge', 'tw'])

// CSS named colors (CSS Color 4), lowercase.
const NAMED_COLORS = new Set(
  (
    'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown ' +
    'burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan ' +
    'darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid ' +
    'darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet ' +
    'deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ' +
    'ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki ' +
    'lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow ' +
    'lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray ' +
    'lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine ' +
    'mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise ' +
    'mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab ' +
    'orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru ' +
    'pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown ' +
    'seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan ' +
    'teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen'
  ).split(' '),
)

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
const COLOR_UTILITY =
  'bg|text|border(?:-[trblxyse])?|ring|ring-offset|fill|stroke|from|via|to|outline|decoration|divide|placeholder|caret|accent|shadow|inset-shadow|drop-shadow'
const PALETTE_CLASS = new RegExp(
  `^(${COLOR_UTILITY})-(?:(${PALETTE})-(?:50|[1-9]00|950)|(white|black))(?:/\\d+)?$`,
)
const ARBITRARY_COLOR_CLASS = new RegExp(
  `^(${COLOR_UTILITY})-\\[(?:#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?|oklch|oklab|hwb|lab|lch)\\(.*\\)|color:.*)\\](?:/\\d+)?$`,
)

// Palette hue → the token that carries that meaning in Atlas.
const HUE_TO_TOKEN: Record<string, string> = {
  red: 'destructive',
  rose: 'destructive',
  orange: 'destructive',
  green: 'success',
  emerald: 'success',
  teal: 'success',
  lime: 'success',
  amber: 'warning',
  yellow: 'warning',
  blue: 'primary',
  sky: 'info',
  cyan: 'info',
  indigo: 'primary',
  violet: 'primary',
  purple: 'primary',
  fuchsia: 'primary',
  pink: 'primary',
}

function paletteFix(utility: string, hue: string | undefined, shade: string | undefined): string {
  const base = utility.replace(/-[trblxyse]$/, '')
  if (shade === 'white')
    return base === 'text' ? 'text-primary-foreground or text-background' : `${base}-background`
  if (shade === 'black') return base === 'text' ? 'text-foreground' : `${base}-foreground`
  if (hue && HUE_TO_TOKEN[hue]) return `${base}-${HUE_TO_TOKEN[hue]}`
  if (base === 'text') return 'text-foreground or text-muted-foreground'
  if (base === 'border' || base === 'divide' || base === 'ring' || base === 'outline') return `${base}-border`
  return `${base}-muted or ${base}-secondary`
}

function normalizeHex(hex: string): string {
  const h = hex.slice(1).toLowerCase()
  return h.length === 3 || h.length === 4
    ? `#${[...h.slice(0, 3)].map((c) => c + c).join('')}`
    : `#${h.slice(0, 6)}`
}

// When several tokens share a color, the one a screen should name.
const PREFERRED_TOKENS = [
  'primary',
  'foreground',
  'background',
  'destructive',
  'success',
  'warning',
  'muted-foreground',
  'border',
  'muted',
  'secondary',
  'card',
]

// ── Components ──────────────────────────────────────────────────────────────

// Names agents reach for, and the Atlas component that does the job.
const SYNONYMS: Record<string, string> = {
  datagrid: 'Table',
  datatable: 'Table',
  grid: 'Table',
  list: 'Table',
  modal: 'Dialog',
  popup: 'Dialog',
  alertdialog: 'Dialog',
  confirm: 'Dialog',
  drawer: 'Sheet',
  sidepanel: 'Sheet',
  panel: 'Card',
  box: 'Card',
  paper: 'Card',
  chip: 'Badge',
  tag: 'Badge',
  pill: 'Badge',
  label: 'Badge',
  status: 'Badge',
  snackbar: 'Sonner',
  notification: 'Sonner',
  toast: 'Sonner',
  banner: 'Alert',
  callout: 'Alert',
  message: 'Alert',
  dropdown: 'Select',
  picker: 'Select',
  combobox: 'Command',
  autocomplete: 'Command',
  search: 'Command',
  textfield: 'Input',
  textinput: 'Input',
  searchinput: 'Input',
  tab: 'Tabs',
  tabbar: 'Tabs',
  hint: 'Tooltip',
  iconbutton: 'Button',
  link: 'Button',
  segmented: 'ToggleGroup',
  segmentedcontrol: 'ToggleGroup',
  buttongroup: 'ToggleGroup',
  accordion: 'Collapsible',
  disclosure: 'Collapsible',
  expander: 'Collapsible',
  scrollview: 'ScrollArea',
  scrollable: 'ScrollArea',
}

const FOREIGN_UI =
  /^(@mui\/|@material-ui\/|antd$|antd\/|@chakra-ui\/|react-bootstrap|@mantine\/|@headlessui\/react|@nextui-org\/|@heroui\/|semantic-ui-react|primereact)/

const RADIX_TO_ATLAS: Record<string, string> = {
  dialog: 'Dialog',
  'alert-dialog': 'Dialog',
  select: 'Select',
  tabs: 'Tabs',
  tooltip: 'Tooltip',
  toast: 'Sonner',
  progress: 'Progress',
  checkbox: 'Checkbox',
  toggle: 'ToggleGroup',
  'toggle-group': 'ToggleGroup',
  'hover-card': 'HoverCard',
  collapsible: 'Collapsible',
  accordion: 'Collapsible',
  'scroll-area': 'ScrollArea',
}

function distance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0] as number
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j] as number
      row[j] = Math.min(
        (row[j] as number) + 1,
        (row[j - 1] as number) + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
      prev = tmp
    }
  }
  return row[b.length] as number
}

// Values agents guess for status variants, and the Atlas value.
const VALUE_SYNONYMS: Record<string, string[]> = {
  success: ['green', 'ok', 'positive', 'paid', 'done', 'complete', 'completed', 'active'],
  destructive: ['red', 'danger', 'error', 'negative', 'failed', 'critical', 'delete'],
  warning: ['yellow', 'amber', 'orange', 'caution', 'pending', 'warn'],
  info: ['blue', 'information', 'notice', 'neutral'],
  default: ['primary', 'solid', 'filled', 'contained', 'normal', 'md', 'medium'],
  secondary: ['gray', 'grey', 'muted', 'subtle'],
  outline: ['outlined', 'bordered', 'stroke'],
  ghost: ['text', 'plain', 'transparent', 'tertiary'],
  sm: ['small', 'xs'],
  lg: ['large', 'xl'],
}

function closestValue(value: string, allowed: string[]): string | undefined {
  const v = value.toLowerCase()
  for (const [target, guesses] of Object.entries(VALUE_SYNONYMS)) {
    if (allowed.includes(target) && guesses.includes(v)) return target
  }
  const ranked = allowed.map((a) => [a, distance(v, a)] as const).sort((x, y) => x[1] - y[1])
  return ranked[0] && ranked[0][1] <= 2 ? ranked[0][0] : undefined
}

// ── The validator ───────────────────────────────────────────────────────────

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

export function validateScreen(
  code: string,
  manifest: Manifest,
  tokenColors: TokenColor[] = [],
): ValidationResult {
  let ast: Node
  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: false,
    }) as unknown as Node
  } catch (error) {
    const e = error as { message?: string; loc?: { line: number } }
    throw new ParseError(e.message ?? String(error), e.loc?.line ?? 1)
  }

  const issues: Issue[] = []
  const report = (node: Node, rule: RuleId, message: string, fix: string) =>
    issues.push({ ...at(node), rule, message, fix })

  const base = manifest.importBase.replace(/\/$/, '')
  const byExport = new Map<string, ComponentEntry>()
  for (const c of manifest.components) for (const e of c.exports) byExport.set(e, c)
  const byFile = new Map(manifest.components.map((c) => [c.file, c]))
  // Several tokens can share a value (primary, ring, chart-1): suggest the plainest name.
  const rank = (name: string) => {
    const preferred = PREFERRED_TOKENS.indexOf(name)
    return preferred >= 0 ? preferred : (/^(chart-|sidebar-|ring$)/.test(name) ? 100 : 50) + name.length
  }
  const byHex = new Map<string, string>()
  for (const t of [...tokenColors].sort((a, b) => rank(a.name) - rank(b.name))) {
    if (!byHex.has(normalizeHex(t.light))) byHex.set(normalizeHex(t.light), t.name)
  }
  for (const t of tokenColors) if (!byHex.has(normalizeHex(t.dark))) byHex.set(normalizeHex(t.dark), t.name)

  const suggestComponent = (name: string): string => {
    const synonym = SYNONYMS[name.toLowerCase()]
    const hit =
      synonym ??
      manifest.components
        .map((c) => [c.name, distance(name.toLowerCase(), c.name.toLowerCase())] as const)
        .sort((a, b) => a[1] - b[1])
        .find(([, d]) => d <= 2)?.[0]
    const component = hit ? manifest.components.find((c) => c.name === hit) : undefined
    return component
      ? `Use ${component.name}: ${importLine(manifest, component)}. Call get_component("${component.name}") for its props.`
      : `Build it from Atlas components, or define it in this file. Call list_components to see the ${manifest.components.length} components.`
  }

  // 1. Imports: what each local name refers to.
  const program = ast.program as Node
  const atlasLocals = new Map<string, string>() // local name → Atlas export
  const declared = new Set<string>() // any other binding in the file
  const reported = new Set<string>() // locals already reported at the import

  for (const statement of program.body as Node[]) {
    if (statement.type !== 'ImportDeclaration') continue
    const source = (statement.source as Node).value as string
    const specifiers = statement.specifiers as Node[]
    const named = specifiers.map((s) => {
      const imported = s.imported as Node | undefined
      return {
        node: s,
        imported:
          s.type === 'ImportSpecifier'
            ? ((imported?.name as string | undefined) ?? (imported?.value as string))
            : undefined,
        local: (s.local as Node).name as string,
      }
    })
    for (const n of named) declared.add(n.local)

    // internal-import: Atlas internals or Radix underneath.
    const radix = /^@radix-ui\/react-([a-z-]+)$/.exec(source) ?? (source === 'radix-ui' ? [source, ''] : null)
    const internal =
      /(^|\/)atlas[\w-]*\/(?:.+\/)?(src|internal|dist|lib)(\/|$)/.test(source) ||
      /^@leonfpontes\/atlas-(ui|tokens)\/(src|dist|lib|internal)(\/|$)/.test(source) ||
      /(^|\/)packages\/ui\/src(\/|$)/.test(source)
    if (internal || radix) {
      const atlasNames = named.filter((n) => n.imported && byExport.has(n.imported))
      const groups = new Map<ComponentEntry, string[]>()
      for (const n of atlasNames) {
        const c = byExport.get(n.imported as string) as ComponentEntry
        groups.set(c, [...(groups.get(c) ?? []), n.imported as string])
        atlasLocals.set(n.local, n.imported as string)
        declared.delete(n.local)
      }
      const radixTarget = radix
        ? manifest.components.find((c) => c.name === RADIX_TO_ATLAS[radix[1] ?? ''])
        : undefined
      const fix = groups.size
        ? [...groups].map(([c, names]) => importLine(manifest, c, names)).join('\n')
        : radixTarget
          ? `${importLine(manifest, radixTarget)} — Atlas wraps Radix with the theme and labels.`
          : `Import from the public path: ${base}/<component>. get_component returns the exact line.`
      report(
        statement,
        'internal-import',
        radix
          ? `"${source}" is a primitive under Atlas; screens use the Atlas component instead.`
          : `"${source}" is inside Atlas. Internal paths change without notice.`,
        fix,
      )
      continue
    }

    // unknown-component: another UI library.
    if (FOREIGN_UI.test(source)) {
      for (const n of named) {
        reported.add(n.local)
        report(
          n.node,
          'unknown-component',
          `${n.imported ?? n.local} comes from "${source}", not from Atlas.`,
          suggestComponent(n.imported ?? n.local),
        )
      }
      continue
    }

    // Public Atlas paths: the file must exist and export the name.
    const isAtlasRoot = source === '@leonfpontes/atlas-ui'
    if (source.startsWith(`${base}/`) || isAtlasRoot) {
      const file = isAtlasRoot ? undefined : source.slice(base.length + 1)
      const component = file ? byFile.get(file) : undefined
      for (const n of named) {
        const name = n.imported ?? n.local
        if (isAtlasRoot && name === 'cn') continue
        const owner = byExport.get(name)
        if (owner && (isAtlasRoot || owner === component)) {
          atlasLocals.set(n.local, name)
          declared.delete(n.local)
          continue
        }
        reported.add(n.local)
        if (owner) {
          report(
            n.node,
            'unknown-component',
            `${name} is not in "${source}".`,
            importLine(manifest, owner, [name]),
          )
        } else if (file && !component) {
          report(n.node, 'unknown-component', `Atlas has no "${file}" component.`, suggestComponent(name))
        } else {
          report(n.node, 'unknown-component', `Atlas has no ${name}.`, suggestComponent(name))
        }
      }
      continue
    }
    // Other packages (sonner, lucide-react, local files) are the screen's own business.
  }

  // 2. Every other name the file declares (functions, variables, parameters, classes).
  walk(program, (n) => {
    if ((n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration') && isNode(n.id))
      declared.add(n.id.name as string)
    if (n.type === 'VariableDeclarator') bindings(n.id, declared)
    if (
      n.type === 'FunctionDeclaration' ||
      n.type === 'FunctionExpression' ||
      n.type === 'ArrowFunctionExpression'
    ) {
      for (const p of n.params as Node[]) bindings(p, declared)
    }
    if (n.type === 'CatchClause') bindings(n.param, declared)
  })
  for (const local of declared) if (atlasLocals.has(local)) atlasLocals.delete(local)

  // 3. JSX: unknown components, invalid props, colors in style and className.
  const unknownSeen = new Map<string, { node: Node; count: number }>()
  const checkColorString = (value: string, node: Node, context: string, namedToo: boolean) => {
    for (const match of value.matchAll(HEX)) {
      const token = byHex.get(normalizeHex(match[0]))
      report(
        node,
        'hard-coded-color',
        `${context} uses the fixed color ${match[0]}.`,
        token
          ? `${match[0]} is the token "${token}": use bg-${token} / text-${token} / border-${token}, or var(--${token}).`
          : 'Use a token class (bg-primary, text-foreground, border-border) or var(--token). list_tokens lists them.',
      )
    }
    if (COLOR_FUNCTION.test(value) && !/^\s*var\(/.test(value)) {
      report(
        node,
        'hard-coded-color',
        `${context} uses a color function: ${value.trim()}.`,
        'Use var(--token) or a token class. list_tokens lists them.',
      )
    }
    if (namedToo) {
      const named = value
        .toLowerCase()
        .split(/[\s,()]+/)
        .find((w) => NAMED_COLORS.has(w))
      if (named)
        report(
          node,
          'hard-coded-color',
          `${context} uses the named color "${named}".`,
          'Use var(--token) or a token class. list_tokens lists them.',
        )
    }
  }
  const checkClasses = (value: string, node: Node) => {
    for (const raw of value.split(/\s+/)) {
      const cls = raw.replace(/^!/, '').split(':').at(-1) ?? ''
      const palette = PALETTE_CLASS.exec(cls)
      if (palette) {
        const [, utility, hue, bw] = palette
        report(
          node,
          'hard-coded-color',
          `The class ${raw} is a fixed palette color; it ignores the theme.`,
          `Use ${paletteFix(utility as string, hue, bw ?? 'shade')}.`,
        )
        continue
      }
      if (ARBITRARY_COLOR_CLASS.test(cls)) {
        const hex = /#[0-9a-fA-F]{3,8}/.exec(cls)?.[0]
        const token = hex ? byHex.get(normalizeHex(hex)) : undefined
        const utility = cls.split('-[')[0] as string
        report(
          node,
          'hard-coded-color',
          `The class ${raw} sets a fixed color.`,
          token
            ? `Use ${utility}-${token}.`
            : 'Use a token class (bg-primary, text-foreground, border-border).',
        )
      }
    }
  }

  walk(program, (n) => {
    if (
      n.type === 'CallExpression' &&
      isNode(n.callee) &&
      n.callee.type === 'Identifier' &&
      CLASS_HELPERS.has(n.callee.name as string)
    ) {
      // cn('…') outside JSX; inside className it is checked below, so skip parents that are JSX.
      if (!(n as { _inJsx?: boolean })._inJsx) for (const s of strings(n)) checkClasses(s.value, s.node)
    }
    if (n.type !== 'JSXOpeningElement') return
    const nameNode = n.name as Node
    const root =
      nameNode.type === 'JSXIdentifier'
        ? (nameNode.name as string)
        : nameNode.type === 'JSXMemberExpression'
          ? rootOf(nameNode)
          : undefined
    const attributes = (n.attributes as Node[]).filter((a) => a.type === 'JSXAttribute')

    for (const attr of attributes) {
      const attrName = (attr.name as Node).name as string
      const value = attr.value as Node | null
      if (!value) continue
      if (attrName === 'className' || attrName === 'class') {
        markJsx(value)
        for (const s of strings(value)) checkClasses(s.value, s.node)
      } else if (attrName === 'style' && value.type === 'JSXExpressionContainer') {
        walk(value, (p) => {
          if (p.type !== 'ObjectProperty') return
          const key = isNode(p.key)
            ? ((p.key.name as string | undefined) ?? (p.key.value as string | undefined) ?? '')
            : ''
          for (const s of strings(p.value as Node))
            checkColorString(s.value, s.node, `style.${key}`, COLOR_PROPERTY.test(key))
        })
      } else if (COLOR_ATTRIBUTE.has(attrName)) {
        for (const s of strings(value)) checkColorString(s.value, s.node, `${attrName}=`, true)
      }
    }

    if (!root || !/^[A-Z]/.test(root)) return
    if (reported.has(root)) return
    const atlasName = atlasLocals.get(root) ?? (!declared.has(root) && byExport.has(root) ? root : undefined)
    if (atlasName && nameNode.type === 'JSXIdentifier') {
      // invalid-prop: enum props with a literal value Atlas doesn't accept.
      const owner = byExport.get(atlasName) as ComponentEntry
      for (const attr of attributes) {
        const attrName = (attr.name as Node).name as string
        const prop = owner.props.find(
          (p) => p.component === atlasName && p.name === attrName && p.type === 'enum',
        )
        if (!prop?.values) continue
        const literal = literalOf(attr.value as Node | null)
        if (literal === undefined || prop.values.includes(literal)) continue
        const suggestion = closestValue(literal, prop.values)
        report(
          attr,
          'invalid-prop',
          `${atlasName} has no ${attrName} "${literal}". It accepts: ${prop.values.join(', ')}.`,
          suggestion ? `${attrName}="${suggestion}"` : `Pick one of: ${prop.values.join(', ')}.`,
        )
      }
      return
    }
    if (atlasName || declared.has(root)) return
    const seen = unknownSeen.get(root)
    if (seen) seen.count++
    else unknownSeen.set(root, { node: n, count: 1 })
  })

  for (const [name, { node, count }] of unknownSeen) {
    report(
      node,
      'unknown-component',
      `Atlas has no ${name}${count > 1 ? ` (used ${count} times)` : ''}, and this file doesn't define or import it.`,
      suggestComponent(name),
    )
  }

  issues.sort((a, b) => a.line - b.line || a.column - b.column)
  const counts = RULE_IDS.map((r) => [r, issues.filter((i) => i.rule === r).length] as const).filter(
    ([, n]) => n > 0,
  )
  const summary = issues.length
    ? `${plural(issues.length, 'issue')}: ${counts.map(([r, n]) => `${n} ${r}`).join(', ')}. Fix them and call validate_screen again.`
    : '0 issues: tokens only, Atlas components, valid props, public imports.'
  return { valid: issues.length === 0, issueCount: issues.length, issues, summary }
}

function rootOf(node: Node): string | undefined {
  let current: Node = node
  while (current.type === 'JSXMemberExpression') current = current.object as Node
  return current.type === 'JSXIdentifier' ? (current.name as string) : undefined
}

function markJsx(node: Node) {
  walk(node, (n) => {
    if (n.type === 'CallExpression') (n as { _inJsx?: boolean })._inJsx = true
  })
}

/** The static string of a JSX attribute value: "x", {"x"} or {`x`}; undefined if dynamic. */
function literalOf(value: Node | null): string | undefined {
  if (!value) return undefined
  if (value.type === 'StringLiteral') return value.value as string
  if (value.type === 'JSXExpressionContainer') {
    const e = value.expression as Node
    if (e.type === 'StringLiteral') return e.value as string
    if (e.type === 'TemplateLiteral' && (e.expressions as Node[]).length === 0) {
      return ((e.quasis as Node[])[0]?.value as { cooked?: string } | undefined)?.cooked ?? undefined
    }
  }
  return undefined
}
