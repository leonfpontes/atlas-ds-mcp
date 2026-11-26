import { CodeBlock } from '../blocks/CodeBlock'
import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'

const TOOLS = [
  [
    'list_components',
    'Every component with a one-line summary and its import line.',
    'No input.',
    '{ count, components: { name, summary, import, exports }[] }',
  ],
  [
    'get_component',
    "Props, variants, examples, do and don't, and the rules that apply.",
    '{ name: string } · a name, an export or an alias, any case',
    '{ name, summary, import, exports, extraImports, props, examples, usage, rules, storybook }',
  ],
  [
    'list_tokens',
    'Tokens with the CSS variable, the Tailwind classes and the light and dark values.',
    '{ type?: "color" | "dimension" | …, query?: string }',
    '{ count, tokens: { name, type, cssVariable?, classes?, light, dark }[] }',
  ],
  [
    'search_usage',
    'Usage rules that match a question, ranked by tags and titles.',
    '{ query: string, component?: string, limit?: 1–20 }',
    '{ count, rules: { id, title, components, do, dont }[] }',
  ],
  [
    'validate_screen',
    'Checks a JSX or TSX file against the four rules and returns each issue with its fix.',
    '{ code: string } · up to 100,000 characters',
    '{ valid, issueCount, issues: { line, column, rule, message, fix }[], summary }',
  ],
] as const

export function ToolsReferencePage() {
  return (
    <DocPage
      crumb={['MCP', 'Tools reference']}
      eyebrow="MCP"
      title="Tools reference"
      lead="Five tools, all read-only. Each answer comes as structured content and as the same JSON in text."
      file="stories/mcp/ToolsReferencePage.tsx"
      {...nav('Tools reference')}
      toc={[{ id: 'run', label: 'Run the server' }, ...TOOLS.map(([id]) => ({ id, label: id }))]}
    >
      <Section id="run" title="Run the server">
        <CodeBlock
          lang="sh"
          title="Terminal"
          code={
            '$ npx -y @leonfpontes/design-system-mcp          # stdio\n$ npx -y @leonfpontes/design-system-mcp --http   # http://127.0.0.1:8000/mcp'
          }
        />
      </Section>
      {TOOLS.map(([id, text, input, output]) => (
        <Section key={id} id={id} title={<code className="font-mono text-lg">{id}</code>}>
          <p className="mb-3 text-muted-foreground">{text}</p>
          <dl className="m-0 grid grid-cols-[80px_1fr] gap-x-4 gap-y-2 text-sm max-[900px]:grid-cols-1">
            <dt className="font-medium">Input</dt>
            <dd className="m-0 font-mono text-[13px] [overflow-wrap:anywhere] text-muted-foreground">
              {input}
            </dd>
            <dt className="font-medium">Output</dt>
            <dd className="m-0 font-mono text-[13px] [overflow-wrap:anywhere] text-muted-foreground">
              {output}
            </dd>
          </dl>
        </Section>
      ))}
    </DocPage>
  )
}
