import { CodeBlock } from '../blocks/CodeBlock'
import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'
import { RuleList, Steps } from '../blocks/Steps'

export function HowAgentsReadPage() {
  return (
    <DocPage
      crumb={['MCP', 'How agents read Atlas']}
      eyebrow="MCP"
      title="How agents read Atlas"
      lead="The MCP server gives a coding agent the same data as these pages: the components, the tokens and the rules. Then it checks the screen the agent wrote."
      file="stories/mcp/HowAgentsReadPage.tsx"
      {...nav('How agents read Atlas')}
      toc={[
        { id: 'loop', label: 'The loop' },
        { id: 'connect', label: 'Connect' },
        { id: 'same-data', label: 'Same data as the docs' },
      ]}
    >
      <Section id="loop" title="The loop">
        <Steps
          items={[
            {
              title: 'Look up',
              text: 'The agent calls list_components and get_component for what the screen needs.',
              code: null,
            },
            {
              title: 'Write',
              text: 'It writes the screen with the import lines and variants it got back.',
              code: null,
            },
            { title: 'Check', text: 'It sends the file to validate_screen.', code: null },
            {
              title: 'Fix',
              text: 'Each issue has a line and a fix. The agent applies them and checks again, until there are none.',
              code: null,
            },
          ]}
        />
      </Section>
      <Section id="connect" title="Connect">
        <CodeBlock
          lang="sh"
          title="Claude Code"
          code="$ claude mcp add atlas -- npx -y @leonfpontes/design-system-mcp"
        />
      </Section>
      <Section id="same-data" title="Same data as the docs">
        <RuleList
          items={[
            [
              'Components',
              "packages/ui/atlas.manifest.json: the props, examples and do / don't on each component page.",
            ],
            ['Tokens', 'packages/tokens/tokens.json: the Colors page and list_tokens.'],
            ['Rules', 'The same manifest: search_usage and the validate_screen rules page.'],
          ]}
        />
      </Section>
    </DocPage>
  )
}
