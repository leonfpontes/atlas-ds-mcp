// The component manifest: what list_components, get_component, search_usage and
// validate_screen know about Atlas. Story F1 owns the file
// (packages/ui/atlas.manifest.json); this schema is the contract (docs/API.md#manifest).

import * as v from 'valibot'

const Id = v.pipe(v.string(), v.regex(/^[a-z0-9]+(-[a-z0-9]+)*$/))
const Pascal = v.pipe(v.string(), v.regex(/^[A-Z][A-Za-z0-9]*$/))

export const PropSchema = v.object({
  /** The export the prop belongs to, e.g. `Button` or `SheetContent`. */
  component: Pascal,
  name: v.string(),
  type: v.picklist(['enum', 'boolean', 'string', 'number', 'node', 'function']),
  /** Accepted values when `type` is `enum`. validate_screen checks literals against them. */
  values: v.optional(v.array(v.string())),
  default: v.optional(v.string()),
  description: v.string(),
})

export const ComponentSchema = v.object({
  name: Pascal,
  aliases: v.optional(v.array(v.string())),
  summary: v.string(),
  /** File name under `importBase`, e.g. `button` → `@/components/ui/button`. */
  file: Id,
  exports: v.pipe(v.array(Pascal), v.minLength(1)),
  /** Imports from other packages the component needs, e.g. `toast` from `sonner`. */
  extraImports: v.optional(v.array(v.object({ from: v.string(), names: v.array(v.string()) }))),
  props: v.array(PropSchema),
  examples: v.array(v.object({ title: v.string(), code: v.string() })),
  usage: v.object({ do: v.array(v.string()), dont: v.array(v.string()) }),
  /** Storybook docs id, e.g. `components-button--docs`. */
  storybook: v.string(),
})

export const RuleSchema = v.object({
  id: Id,
  title: v.string(),
  /** Components the rule is about; empty means every screen. */
  components: v.array(Pascal),
  tags: v.array(v.string()),
  do: v.array(v.string()),
  dont: v.array(v.string()),
})

export const ManifestSchema = v.pipe(
  v.object({
    version: v.string(),
    importBase: v.string(),
    components: v.pipe(v.array(ComponentSchema), v.minLength(1)),
    rules: v.array(RuleSchema),
  }),
  v.check((m) => {
    const exports = m.components.flatMap((c) => c.exports)
    return new Set(exports).size === exports.length
  }, 'Each export belongs to one component only.'),
  v.check((m) => {
    const names = new Set(m.components.map((c) => c.name))
    return m.rules.every((r) => r.components.every((c) => names.has(c)))
  }, 'A rule names a component that is not in the manifest.'),
)

export type Manifest = v.InferOutput<typeof ManifestSchema>
export type ComponentEntry = v.InferOutput<typeof ComponentSchema>
export type PropEntry = v.InferOutput<typeof PropSchema>
export type UsageRule = v.InferOutput<typeof RuleSchema>

/** Parses the manifest; throws with the path of the first bad field. */
export function parseManifest(input: unknown): Manifest {
  const result = v.safeParse(ManifestSchema, input)
  if (result.success) return result.output
  const issue = result.issues[0]
  const where = issue ? v.getDotPath(issue) : null
  throw new Error(
    `Invalid component manifest${where ? ` at ${where}` : ''}: ${issue?.message ?? 'unknown error'}`,
  )
}

/** The import line for a component, e.g. `import { Button } from "@/components/ui/button"`. */
export function importLine(manifest: Manifest, component: ComponentEntry, names = component.exports): string {
  return `import { ${names.join(', ')} } from "${manifest.importBase}/${component.file}"`
}
