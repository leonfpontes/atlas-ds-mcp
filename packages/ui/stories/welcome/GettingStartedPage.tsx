import { CodeBlock } from '../blocks/CodeBlock'
import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'
import { Steps } from '../blocks/Steps'
import { SETUP_STEPS } from './IntroductionPage'

export function GettingStartedPage() {
  return (
    <DocPage
      crumb={['Welcome', 'Getting started']}
      eyebrow="Welcome"
      title="Getting started"
      lead="Three steps from a React app to Atlas screens that a coding agent can check on its own."
      file="stories/welcome/GettingStartedPage.tsx"
      {...nav('Getting started')}
      toc={[
        { id: 'install', label: 'Install' },
        { id: 'components', label: 'Add components' },
        { id: 'check', label: 'Check a screen' },
      ]}
    >
      <Section id="install" title="Install">
        <Steps items={SETUP_STEPS} />
      </Section>
      <Section id="components" title="Add components">
        <p className="mb-3.5 text-muted-foreground">
          Each component is a shadcn/ui file in <code>components/ui</code>. Add the ones the screen needs.
        </p>
        <CodeBlock lang="sh" title="Terminal" code="$ pnpm dlx shadcn@latest add button input table badge" />
      </Section>
      <Section id="check" title="Check a screen">
        <p className="mb-3.5 text-muted-foreground">
          With the MCP server connected, ask the agent to run <code>validate_screen</code> on the file it
          wrote. It returns each issue with the line, the rule and the fix.
        </p>
        <CodeBlock
          lang="sh"
          title="Claude Code"
          code={'$ claude "Build the orders page with Atlas, then run validate_screen on it"'}
        />
      </Section>
    </DocPage>
  )
}
