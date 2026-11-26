import { DocPage, Section } from '../blocks/DocPage'
import { nav } from '../blocks/pages'

export function ChangelogPage() {
  return (
    <DocPage
      crumb={['Welcome', 'Changelog']}
      eyebrow="Welcome"
      title="Changelog"
      lead="What changed in each version. The full log is CHANGELOG.md in the repository."
      file="stories/welcome/ChangelogPage.tsx"
      {...nav('Changelog')}
      toc={[
        { id: 'v0-2-0', label: '0.2.0' },
        { id: 'v0-1-0', label: '0.1.0' },
      ]}
    >
      <Section id="v0-2-0" title="0.2.0">
        <ul className="m-0 grid gap-1.5 pl-[18px] text-muted-foreground">
          <li>Textarea, Skeleton and Progress, from the shadcn/ui source with the Atlas theme.</li>
          <li>Progress adds the neutral and destructive variants for budgets and limits.</li>
          <li>list_components lists 16 components.</li>
        </ul>
      </Section>
      <Section id="v0-1-0" title="0.1.0">
        <ul className="m-0 grid gap-1.5 pl-[18px] text-muted-foreground">
          <li>Atlas tokens in the W3C format, light and dark, with the shadcn/ui theme.</li>
          <li>13 shadcn/ui components themed by variables; Alert and Badge add success, warning and info.</li>
          <li>
            The MCP server with 5 tools: list_components, get_component, list_tokens, search_usage,
            validate_screen.
          </li>
          <li>This Storybook: foundations, components, patterns and the MCP pages.</li>
        </ul>
      </Section>
    </DocPage>
  )
}
