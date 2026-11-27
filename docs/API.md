# Atlas MCP server · API

Package `@leonfpontes/design-system-mcp`, server name `atlas-design-system`. Five tools, all
read-only (`readOnlyHint: true`). Every answer carries the result twice: as `structuredContent`
(validated against the output schema below) and as the same JSON in a text block for clients
that only read text. The schemas live in [`mcp/src/tools.ts`](../mcp/src/tools.ts); a change
there changes this page in the same PR.

## Running it

| Command                                           | Transport                                              |
| ------------------------------------------------- | ------------------------------------------------------ |
| `npx -y @leonfpontes/design-system-mcp`           | stdio (Claude Code, Claude Desktop, Cursor)            |
| `npx -y @leonfpontes/design-system-mcp --http`    | HTTP on `http://127.0.0.1:8000/mcp` (`PORT` to change) |
| `npx -y @leonfpontes/design-system-mcp --check`   | prints the ready line and exits 0                      |
| `npx -y @leonfpontes/design-system-mcp --version` | prints the version                                     |

On start the server prints one line (stderr on stdio, so the protocol on stdout stays clean):

```
Atlas MCP ready · 0.3.0 · 5 tools · 22 components · 77 tokens · stdio
```

If it can't start, it prints `Atlas didn't start: <reason>` and what to check, and exits 1.

**Origin.** A request with an `Origin` header is served only from a local page (`localhost`,
`127.0.0.1`, `[::1]`, any port) or from an origin in `ATLAS_ALLOWED_ORIGINS`, `SITE_URL` or the
Vercel production domain; anything else gets `403` ([ADR 0005](adr/0005-http-origin-check.md)).
Clients that send no `Origin` (Claude Code, Cursor) are not affected.

**HTTP is read-only.** No tool writes, and the server has no resources or prompts. Bodies over
256 KB get `413` before parsing. The same handler (`createHttpHandler`) backs the public endpoint.

## Tools

### `list_components`

Every component with a one-line summary. No input.

```ts
{ count: number, components: { name: string, summary: string, import: string, exports: string[] }[] }
```

`import` is the line to copy, e.g. `import { Badge } from "@/components/ui/badge"`.

### `get_component`

Input `{ name: string }`: a component name, one of its exports (`TableRow`) or an alias (`Toast`), any case.

```ts
{
  name: string, summary: string,
  import: string,                  // the import line for every export
  exports: string[],
  extraImports: string[],          // e.g. 'import { toast } from "sonner"'
  props: { component: string, name: string, type: string, values?: string[], default?: string, description: string }[],
  examples: { title: string, code: string }[],
  usage: { do: string[], dont: string[] },
  rules: { id: string, title: string }[],   // usage rules that apply (search_usage has the text)
  storybook: string                // Storybook docs id
}
```

Unknown name → `isError: true` with the list of components.

**Invalid arguments** (any tool) → `isError: true` with
`Invalid arguments for tool <name>: [{"message": …, "path": […]}]`. The message never repeats the
value you sent; a file over the limit gets
`The file has 100,001 characters; the limit is 100,000. Send one screen at a time.`

### `list_tokens`

Input `{ type?: "color" | "dimension" | "fontFamily" | "fontWeight" | "duration" | "cubicBezier" | "number" | "shadow" | "typography", query?: string }`.
`query` matches the token name, description or CSS variable.

```ts
{
  count: number,
  tokens: {
    name: string,            // DTCG path, e.g. "color.primary"
    type: string,
    cssVariable?: string,    // e.g. "--primary", "--radius", "--dur-fast"
    classes?: string[],      // colors only: bg-, text-, border-
    light: string,           // resolved value; non-colors are the same in both themes
    dark: string,
    description?: string
  }[]
}
```

### `search_usage`

Input `{ query: string, component?: string, limit?: 1–20 (default 5) }`. Searches the global rules
and each component's do / don't; tags and titles weigh more than body text.

```ts
{ count: number, rules: { id: string, title: string, components: string[], do: string[], dont: string[] }[] }
```

Component do / don't come back with the id `<file>-usage`, e.g. `badge-usage`.

### `validate_screen`

Input `{ code: string (1–100 000 characters), filename?: string }`: the whole JSX or TSX file, imports included.

```ts
{
  valid: boolean,          // true when issueCount is 0
  issueCount: number,
  issues: { line: number, column: number, rule: RuleId, message: string, fix: string }[],
  summary: string          // "4 issues: 1 hard-coded-color, …" or "0 issues: …"
}
```

Lines and columns start at 1. A file that doesn't parse → `isError: true`,
`validate_screen couldn't parse the file at line N: …`.

## Rules of `validate_screen`

The four ids are public: the evaluation counts them (`ISSUE_KINDS` in `evals/src/contracts.ts`,
kept equal by `tests/repo.test.ts`) and the Storybook page "validate_screen rules" documents them.

| Rule id             | Flags                                                                                                                                                                                                                                                  | Fix it suggests                                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `hard-coded-color`  | Hex, `rgb()`/`hsl()`/`oklch()`… or a named color in `style`, in color props (`color`, `fill`, `stroke`…), and Tailwind palette or arbitrary color classes (`bg-white`, `text-slate-900`, `border-[#e5e7eb]`) in `className`, `cn()`, `clsx()`, `cva()` | The token with that exact value when there is one (`#0B5CAD` → `primary`), else the token for the hue (`bg-red-500` → `bg-destructive`) |
| `unknown-component` | A capitalized JSX element that Atlas doesn't have and the file doesn't define, import or receive as a prop; an import of a missing Atlas file or name; an import from another UI library (MUI, Chakra, Ant…)                                           | The Atlas component for the job (`DataGrid` → `Table`, `Modal` → `Dialog`) with its import line                                         |
| `invalid-prop`      | A literal value of an enum prop that the component doesn't accept (`<Badge variant="green">`)                                                                                                                                                          | The closest accepted value (`green` → `success`, `primary` → `default`)                                                                 |
| `internal-import`   | Imports from Atlas internals (`…/src`, `/dist`, `/internal`, `/lib`) or straight from Radix                                                                                                                                                            | The public import line                                                                                                                  |

What it does not check: dynamic values (`variant={v}`), prop names outside the manifest (Atlas
components accept the HTML attributes of their element), and anything at runtime. The render test
of the evaluation covers that.

## Manifest

The data behind four of the five tools. Story F1 owns the file,
[`packages/ui/atlas.manifest.json`](../packages/ui/atlas.manifest.json) (exported as
`@leonfpontes/atlas-ui/manifest.json`), and keeps it equal to the components. The MCP build copies
it into `mcp/data/`, so the published server doesn't pull React. Schema: `ManifestSchema` in
[`mcp/src/manifest.ts`](../mcp/src/manifest.ts).

```ts
{
  version: string,
  importBase: string,                  // "@/components/ui"
  components: {
    name: string,                      // PascalCase, e.g. "Sonner"
    aliases?: string[],                // other names agents use, e.g. ["Toast"]
    summary: string,
    file: string,                      // kebab-case file under importBase, e.g. "sonner"
    exports: string[],                 // every export; each belongs to one component
    extraImports?: { from: string, names: string[] }[],
    props: {
      component: string,               // the export the prop belongs to
      name: string,
      type: "enum" | "boolean" | "string" | "number" | "node" | "function",
      values?: string[],               // required for enum; checked by validate_screen
      default?: string,
      description: string
    }[],
    examples: { title: string, code: string }[],   // must pass validate_screen
    usage: { do: string[], dont: string[] },
    storybook: string                  // docs id, e.g. "components-button--docs"
  }[],
  rules: {
    id: string,                        // kebab-case
    title: string,
    components: string[],              // [] = every screen
    tags: string[],
    do: string[],
    dont: string[]
  }[]
}
```

Checks (`mcp/src/manifest.test.ts`): the components are exactly the ones the evaluation cases
expect; each enum prop has values that include its default; each example passes `validate_screen`;
an export belongs to one component; a rule names only existing components.
