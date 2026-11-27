import { ComponentDoc } from '../../blocks/ComponentDoc'
import { LongPath, NotePath } from '../Breadcrumb.stories'

export function BreadcrumbDoc() {
  return (
    <ComponentDoc
      name="Breadcrumb"
      lead="The path from a section to the page you are on. A link for each level above it, a slash between levels, the page itself as plain text."
      shadcn="https://ui.shadcn.com/docs/components/breadcrumb"
      stories={3}
      canvas={{
        rows: [
          { label: 'note path', children: <NotePath /> },
          { label: 'collapsed', children: <LongPath /> },
        ],
        snippet:
          '<BreadcrumbItem>\n  <BreadcrumbLink href="/explore">Explore</BreadcrumbLink>\n</BreadcrumbItem>\n<BreadcrumbSeparator />',
        source: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function NotePath({ typeLabel, typeHref, file }: { typeLabel: string; typeHref: string; file: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/explore">Explore</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={typeHref}>{typeLabel}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-mono text-[13px]">{file}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`,
      }}
      doExample={{
        node: <NotePath />,
        text: 'Every level above is a link; the page is text, in mono for a file name.',
      }}
      dontExample={{
        node: (
          <p className="m-0 text-sm text-muted-foreground">
            Step 1 › <span className="text-foreground">Step 2</span> › Step 3
          </p>
        ),
        text: 'Steps of a flow are not a path: the levels after the page do not exist yet.',
      }}
      a11y={[
        <>
          A <code>nav</code> landmark named "Breadcrumb" (change it with <code>aria-label</code>) around an
          ordered list.
        </>,
        <>
          The page carries <code>aria-current="page"</code> and is plain text: nothing to focus or follow.
        </>,
        'Separators and the ellipsis are aria-hidden; levels left out go behind a button with an aria-label.',
        'Links are 24 px tall (44 on touch) and show the 3 px focus ring.',
      ]}
    />
  )
}
