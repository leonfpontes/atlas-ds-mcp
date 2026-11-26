import { LINKS } from '../lib/links'
import { Section, SectionHead } from './Section'

const TOOLS = [
  ['list_components', 'Every component with a one-line summary', '13 components: Alert, Badge, Button…'],
  ['get_component', 'Props, variants, examples and the import line', '{ import, variants: 6, props: 4 }'],
  ['list_tokens', 'Tokens by type, with light and dark values', '--primary · #0B5CAD · #6FA8F5'],
  ['search_usage', "Usage rules: do and don't", '"One primary button per view"'],
  ['validate_screen', 'Issues in a JSX or TSX file, with line and rule', 'line 7 · hard-coded-color'],
] as const

export function Tools() {
  return (
    <Section id="tools">
      <div className="wrap grid grid-cols-[minmax(0,4fr)_minmax(0,8fr)] items-start gap-12 max-[1200px]:grid-cols-1 max-[1200px]:gap-6">
        <SectionHead eyebrow="01 · Tools" title={<span id="tools-title">Five tools, all read-only</span>}>
          The agent asks the server instead of guessing. Answers come from the same source as the Storybook.
        </SectionHead>
        <div className="max-w-[960px] overflow-hidden rounded-lg border bg-card">
          <table className="w-full border-collapse text-sm max-[600px]:block">
            <caption className="sr-only">
              The five Atlas MCP tools, what each returns and a sample response
            </caption>
            <thead className="max-[600px]:hidden">
              <tr className="border-b">
                {['Tool', 'Returns', 'Sample response'].map((h) => (
                  <th
                    key={h}
                    className="h-11 px-3 text-left font-medium whitespace-nowrap text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="max-[600px]:block">
              {TOOLS.map(([name, returns, sample]) => (
                <tr
                  key={name}
                  className="border-b align-top last:border-0 max-[600px]:grid max-[600px]:gap-1 max-[600px]:p-3"
                >
                  <td className="p-3 max-[600px]:p-0">
                    <a
                      href={LINKS.doc('mcp-tools-reference--docs')}
                      className="inline-flex min-h-6 items-center font-mono text-sm font-medium whitespace-nowrap text-primary underline underline-offset-[3px] max-[600px]:min-h-11"
                    >
                      {name}
                    </a>
                  </td>
                  <td className="p-3 max-[600px]:p-0">{returns}</td>
                  <td className="p-3 font-mono text-[13px] whitespace-nowrap max-[600px]:p-0 max-[600px]:whitespace-normal">
                    {sample}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  )
}
