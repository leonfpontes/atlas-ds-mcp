import { CodeBlock } from '../blocks/CodeBlock'
import { DocLink, DocPage, Section, SideMeta, VERSION } from '../blocks/DocPage'
import { GROUPS, nav, pageId, type Group } from '../blocks/pages'
import { RuleList, Steps } from '../blocks/Steps'

const BROWSE: [Group, string[]][] = [
  ['Foundations', [...GROUPS.Foundations]],
  ['Components', ['Alert', 'Button', 'Dialog', 'Table']],
  ['Patterns', [...GROUPS.Patterns]],
  ['MCP', [...GROUPS.MCP]],
]

export const SETUP_STEPS = [
  {
    title: 'Set up shadcn/ui',
    text: 'Atlas is a theme, so the components come from the shadcn CLI.',
    code: <CodeBlock lang="sh" title="Terminal" code="$ pnpm dlx shadcn@latest init" />,
  },
  {
    title: 'Add the Atlas theme',
    text: (
      <>
        Replaces the default variables in <code>globals.css</code> with Atlas tokens, light and dark.
      </>
    ),
    code: (
      <CodeBlock
        lang="css"
        title="app/globals.css"
        code={
          '@import "tailwindcss";\n@import "@leonfpontes/atlas-tokens/theme.css";\n@import "@leonfpontes/atlas-tokens/tokens.css";'
        }
      />
    ),
  },
  {
    title: 'Connect your agent',
    text: 'Optional. Lets Claude Code read this documentation through MCP.',
    code: (
      <CodeBlock
        lang="sh"
        title="Terminal"
        code="$ claude mcp add atlas -- npx -y @leonfpontes/design-system-mcp"
      />
    ),
  },
]

export function IntroductionPage() {
  return (
    <DocPage
      crumb={['Welcome', 'Introduction']}
      eyebrow={`Atlas design system · v${VERSION}`}
      title="Atlas"
      lead="A neutral theme and usage rules for shadcn/ui, written for people and for coding agents. Every page here is also what the Atlas MCP server returns."
      file="stories/welcome/IntroductionPage.tsx"
      {...nav('Introduction')}
      toc={[
        { id: 'start', label: 'Get started' },
        { id: 'browse', label: 'Browse' },
        { id: 'rules', label: 'Five rules' },
      ]}
      side={
        <>
          <SideMeta label="Base" value="shadcn/ui" />
          <SideMeta label="Fonts" value="IBM Plex" />
          <SideMeta label="License" value="MIT" />
        </>
      }
    >
      <Section id="start" title="Get started">
        <Steps items={SETUP_STEPS} />
      </Section>
      <Section id="browse" title="Browse">
        <div className="grid grid-cols-4 rounded-lg border max-[900px]:grid-cols-2">
          {BROWSE.map(([group, items], i) => (
            <div
              key={group}
              className={[
                'border-r p-4 last:border-r-0',
                i === 1 ? 'max-[900px]:border-r-0' : '',
                i < 2 ? 'max-[900px]:border-b' : '',
              ].join(' ')}
            >
              <h3 className="mb-2 flex justify-between text-sm font-semibold">
                {group}
                <span className="font-mono text-xs font-normal text-text-subtle">{GROUPS[group].length}</span>
              </h3>
              <ul className="m-0 grid list-none p-0">
                {items.map((label) => (
                  <li key={label}>
                    <DocLink
                      id={pageId(group, label)}
                      className="flex min-h-8 items-center text-sm text-muted-foreground no-underline hover:text-foreground hover:underline pointer-coarse:min-h-11"
                    >
                      {label}
                    </DocLink>
                  </li>
                ))}
                {group === 'Components' && (
                  <li>
                    <DocLink
                      id={pageId('Components', 'Alert')}
                      className="flex min-h-8 items-center text-sm text-muted-foreground no-underline hover:text-foreground hover:underline pointer-coarse:min-h-11"
                    >
                      All 13 →
                    </DocLink>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </Section>
      <Section id="rules" title="Five rules">
        <RuleList
          items={[
            [
              'Tokens, never hex',
              <>
                A hard-coded color is a <code>validate_screen</code> error.
              </>,
            ],
            ['40 px, 44 px on touch', 'Buttons, inputs, selects, tabs and close buttons. Never smaller.'],
            ['Color + icon + text', 'Every status has its own icon shape and a label.'],
            ['One primary per view', 'Other actions use outline, secondary or ghost.'],
            ['shadcn first', 'If shadcn/ui has the component, use it. Atlas only adds variants.'],
          ]}
        />
      </Section>
    </DocPage>
  )
}
