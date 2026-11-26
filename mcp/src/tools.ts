// The five tools. Each one is a pure function of the design system data, so the
// tests call them directly and through MCP. All five only read: the HTTP endpoint
// can be public. Schemas here are the contract in docs/API.md.

import { resolveTokens, themeColors, type TokenType } from '@leonfpontes/atlas-tokens'
import * as v from 'valibot'

import type { DesignSystemData } from './data.js'
import { importLine, type ComponentEntry } from './manifest.js'
import { RULE_IDS, validateScreen } from './validate.js'

export const TOOL_NAMES = [
  'list_components',
  'get_component',
  'list_tokens',
  'search_usage',
  'validate_screen',
] as const

export const MAX_CODE_LENGTH = 100_000

const TOKEN_TYPES = [
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'duration',
  'cubicBezier',
  'number',
  'shadow',
  'typography',
] as const satisfies readonly TokenType[]

// ── Schemas ─────────────────────────────────────────────────────────────────

const d = v.description

export const ListComponentsOutput = v.object({
  count: v.number(),
  components: v.array(
    v.object({
      name: v.string(),
      summary: v.string(),
      import: v.string(),
      exports: v.array(v.string()),
    }),
  ),
})

export const GetComponentInput = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1),
    d('Component name from list_components, e.g. "Table". Case-insensitive.'),
  ),
})

export const GetComponentOutput = v.object({
  name: v.string(),
  summary: v.string(),
  import: v.string(),
  exports: v.array(v.string()),
  extraImports: v.array(v.string()),
  props: v.array(
    v.object({
      component: v.string(),
      name: v.string(),
      type: v.string(),
      values: v.optional(v.array(v.string())),
      default: v.optional(v.string()),
      description: v.string(),
    }),
  ),
  examples: v.array(v.object({ title: v.string(), code: v.string() })),
  usage: v.object({ do: v.array(v.string()), dont: v.array(v.string()) }),
  rules: v.array(v.object({ id: v.string(), title: v.string() })),
  storybook: v.string(),
})

export const ListTokensInput = v.object({
  type: v.optional(v.pipe(v.picklist(TOKEN_TYPES), d('Only tokens of this type, e.g. "color".'))),
  query: v.optional(
    v.pipe(v.string(), d('Only tokens whose name or description contains this text, e.g. "primary".')),
  ),
})

export const ListTokensOutput = v.object({
  count: v.number(),
  tokens: v.array(
    v.object({
      name: v.string(),
      type: v.string(),
      cssVariable: v.optional(v.string()),
      classes: v.optional(v.array(v.string())),
      light: v.string(),
      dark: v.string(),
      description: v.optional(v.string()),
    }),
  ),
})

export const SearchUsageInput = v.object({
  query: v.pipe(
    v.string(),
    v.minLength(1),
    d('What you are about to build or decide, e.g. "status badge colors".'),
  ),
  component: v.optional(v.pipe(v.string(), d('Only rules about this component, e.g. "Button".'))),
  limit: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(20), d('Default 5.'))),
})

export const SearchUsageOutput = v.object({
  count: v.number(),
  rules: v.array(
    v.object({
      id: v.string(),
      title: v.string(),
      components: v.array(v.string()),
      do: v.array(v.string()),
      dont: v.array(v.string()),
    }),
  ),
})

export const ValidateScreenInput = v.object({
  code: v.pipe(
    v.string(),
    v.minLength(1, 'The file is empty. Send the whole JSX or TSX file, imports included.'),
    v.maxLength(
      MAX_CODE_LENGTH,
      (issue) =>
        `The file has ${Number(issue.received).toLocaleString('en-US')} characters; the limit is ${MAX_CODE_LENGTH.toLocaleString('en-US')}. Send one screen at a time.`,
    ),
    d('The full JSX or TSX file, imports included. Line numbers in the answer refer to it.'),
  ),
  filename: v.optional(v.pipe(v.string(), d('For the messages only, e.g. "OrdersPage.tsx".'))),
})

export const ValidateScreenOutput = v.object({
  valid: v.boolean(),
  issueCount: v.number(),
  issues: v.array(
    v.object({
      line: v.number(),
      column: v.number(),
      rule: v.picklist(RULE_IDS),
      message: v.string(),
      fix: v.string(),
    }),
  ),
  summary: v.string(),
})

/** Valibot quotes what it received ("but received \"xxx…\""); a long value is cut to its first 30 characters. */
const shortMessage = (message: string) =>
  message.replace(/"[^"]{40,}"/g, (quoted) => `${quoted.slice(0, 31)}…" (${quoted.length - 2} characters)`)

/**
 * The same schema, with validation errors that carry only the message and the path. tmcp prints
 * the issues as they come, and valibot's include the input: a 100,000-character file came back
 * three times in one error. The JSON Schema the client sees doesn't change.
 */
export function withShortErrors<S extends v.GenericSchema>(schema: S): S {
  const standard = schema['~standard']
  return {
    ...schema,
    '~standard': {
      ...standard,
      validate(value: unknown) {
        type Result = Awaited<ReturnType<typeof standard.validate>>
        const shorten = (result: Result): Result =>
          result.issues
            ? {
                issues: result.issues.map((issue) => ({
                  message: shortMessage(issue.message),
                  ...(issue.path
                    ? { path: issue.path.map((p) => (typeof p === 'object' && p !== null ? p.key : p)) }
                    : {}),
                })),
              }
            : result
        const result = standard.validate(value)
        return result instanceof Promise ? result.then(shorten) : shorten(result)
      },
    },
  } as S
}

// ── Tool logic ──────────────────────────────────────────────────────────────

export class ToolError extends Error {}

export function listComponents({ manifest }: DesignSystemData): v.InferOutput<typeof ListComponentsOutput> {
  const components = [...manifest.components]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({ name: c.name, summary: c.summary, import: importLine(manifest, c), exports: c.exports }))
  return { count: components.length, components }
}

export function findComponent({ manifest }: DesignSystemData, name: string): ComponentEntry | undefined {
  const wanted = name.trim().toLowerCase()
  return manifest.components.find(
    (c) =>
      c.name.toLowerCase() === wanted ||
      c.exports.some((e) => e.toLowerCase() === wanted) ||
      (c.aliases ?? []).some((a) => a.toLowerCase() === wanted),
  )
}

export function getComponent(data: DesignSystemData, name: string): v.InferOutput<typeof GetComponentOutput> {
  const { manifest } = data
  const c = findComponent(data, name)
  if (!c) {
    throw new ToolError(
      `Atlas has no component "${name}". It has: ${manifest.components.map((x) => x.name).join(', ')}.`,
    )
  }
  return {
    name: c.name,
    summary: c.summary,
    import: importLine(manifest, c),
    exports: c.exports,
    extraImports: (c.extraImports ?? []).map((x) => `import { ${x.names.join(', ')} } from "${x.from}"`),
    props: c.props,
    examples: c.examples,
    usage: c.usage,
    rules: manifest.rules
      .filter((r) => r.components.length === 0 || r.components.includes(c.name))
      .map((r) => ({ id: r.id, title: r.title })),
    storybook: c.storybook,
  }
}

type Dimension = { value: number; unit: string }
const isDimension = (x: unknown): x is Dimension =>
  typeof x === 'object' && x !== null && typeof (x as Dimension).value === 'number'

function formatValue(value: unknown, type: string | undefined): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (isDimension(value)) return `${value.value}${value.unit}`
  if (type === 'cubicBezier' && Array.isArray(value)) return `cubic-bezier(${value.join(', ')})`
  if (type === 'fontFamily' && Array.isArray(value)) return value.join(', ')
  if (type === 'shadow' && Array.isArray(value)) {
    return value
      .map((s: Record<string, unknown>) =>
        [s.offsetX, s.offsetY, s.blur, s.spread]
          .map((x) => formatValue(x, 'dimension'))
          .concat(String(s.color))
          .join(' '),
      )
      .join(', ')
  }
  return JSON.stringify(value)
}

/** CSS variable of a non-color token, as written by the token build (tokens.css / theme.css). */
function cssVariableOf(path: string[]): string | undefined {
  const [group, a, b] = path
  if (group === 'radius') return a === 'base' ? '--radius' : `--radius-${a}`
  if (group === 'font' && a === 'family') return `--font-${b}`
  if (group === 'font' && a === 'weight') return `--font-weight-${b}`
  if (group === 'font' && a === 'size') return `--text-${b}`
  if (group === 'space' && a === 'base') return '--spacing'
  if (group === 'size') return `--${a}`
  if (group === 'duration') return a === 'base' ? '--dur' : `--dur-${a}`
  if (group === 'easing') return `--ease-${a}`
  if (group === 'shadow') return `--shadow-${a}`
  return undefined
}

export function listTokens(
  { tokens }: DesignSystemData,
  { type, query }: v.InferOutput<typeof ListTokensInput> = {},
): v.InferOutput<typeof ListTokensOutput> {
  const colors = new Map(themeColors(tokens).map((c) => [c.token, c]))
  const q = query?.trim().toLowerCase()
  const list = resolveTokens(tokens)
    .filter((t) => !type || t.type === type)
    .map((t) => {
      const color = colors.get(t.name)
      if (color) {
        return {
          name: t.name,
          type: 'color',
          cssVariable: `--${color.name}`,
          classes: [`bg-${color.name}`, `text-${color.name}`, `border-${color.name}`],
          light: color.light,
          dark: color.dark,
          ...(t.description ? { description: t.description } : {}),
        }
      }
      const value = formatValue(t.value, t.type)
      const cssVariable = cssVariableOf(t.path)
      return {
        name: t.name,
        type: t.type ?? 'unknown',
        ...(cssVariable ? { cssVariable } : {}),
        light: value,
        dark: value,
        ...(t.description ? { description: t.description } : {}),
      }
    })
    .filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.description ?? '').toLowerCase().includes(q) ||
        (t.cssVariable ?? '').includes(q),
    )
  return { count: list.length, tokens: list }
}

const words = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g) ?? []

export function searchUsage(
  { manifest }: DesignSystemData,
  { query, component, limit = 5 }: v.InferOutput<typeof SearchUsageInput>,
): v.InferOutput<typeof SearchUsageOutput> {
  const target = component ? findComponent({ manifest } as DesignSystemData, component) : undefined
  if (component && !target) {
    throw new ToolError(`Atlas has no component "${component}". Call list_components to see the names.`)
  }
  // Global rules plus each component's own do / don't, searched the same way.
  const candidates = [
    ...manifest.rules,
    ...manifest.components.map((c) => ({
      id: `${c.file}-usage`,
      title: `${c.name}: do and don't`,
      components: [c.name],
      tags: [c.name.toLowerCase(), ...(c.aliases ?? []).map((a) => a.toLowerCase())],
      do: c.usage.do,
      dont: c.usage.dont,
    })),
  ].filter((r) => !target || r.components.includes(target.name) || r.components.length === 0)

  const terms = new Set(words(query).filter((w) => w.length > 1))
  const scored = candidates
    .map((r) => {
      const title = new Set(words(r.title))
      const tags = new Set(r.tags.flatMap(words))
      const named = new Set(r.components.flatMap(words))
      const body = new Set(words([...r.do, ...r.dont].join(' ')))
      let score = 0
      for (const t of terms) {
        const stem = t.replace(/(es|s)$/, '')
        const has = (set: Set<string>) =>
          set.has(t) || set.has(stem) || [...set].some((w) => w.replace(/(es|s)$/, '') === stem)
        if (has(tags)) score += 3
        if (has(title)) score += 3
        if (has(named)) score += 2
        if (has(body)) score += 1
      }
      return { rule: r, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.rule.id.localeCompare(b.rule.id))
    .slice(0, limit)
    .map(({ rule }) => ({
      id: rule.id,
      title: rule.title,
      components: rule.components,
      do: rule.do,
      dont: rule.dont,
    }))
  return { count: scored.length, rules: scored }
}

export function runValidateScreen(data: DesignSystemData, code: string) {
  const colors = themeColors(data.tokens).map((c) => ({ name: c.name, light: c.light, dark: c.dark }))
  return validateScreen(code, data.manifest, colors)
}
