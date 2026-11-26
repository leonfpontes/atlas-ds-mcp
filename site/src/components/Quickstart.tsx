import { Tabs, TabsContent, TabsList, TabsTrigger } from '@leonfpontes/atlas-ui'
import type { ReactNode } from 'react'

import { CopyButton } from './CopyButton'
import { INSTALL } from './Hero'
import { Section, SectionHead } from './Section'

const SERVER_JSON = `{
  "mcpServers": {
    "atlas": {
      "command": "npx",
      "args": ["-y", "@leonfpontes/design-system-mcp"]
    }
  }
}`

const CHECK = 'npx -y @leonfpontes/design-system-mcp --check'

/** `--check` starts the server, prints its ready line and exits (docs/API.md). */
function ReadyCheck() {
  return (
    <>
      <span className="block">
        <span className="text-code-dim select-none">$ </span>
        {CHECK}
      </span>
      <span className="block text-code-add">
        Atlas MCP ready · 0.1.0 · 5 tools · 13 components · 77 tokens · stdio
      </span>
    </>
  )
}

interface Step {
  title: string
  text: ReactNode
  code: ReactNode
  copy: string
}

const STEPS: Record<'code' | 'desktop' | 'cursor', Step[]> = {
  code: [
    {
      title: 'Add the server',
      text: 'Registers Atlas for this project. It runs locally over stdio.',
      code: (
        <>
          <span className="block whitespace-nowrap">
            <span className="text-code-dim select-none">$ </span>claude mcp add atlas --
          </span>
          <span className="block pl-[2ch] whitespace-nowrap">npx -y @leonfpontes/design-system-mcp</span>
        </>
      ),
      copy: INSTALL,
    },
    {
      title: 'Check the connection',
      text: 'Atlas shows as connected. Inside Claude Code, /mcp lists its five tools.',
      code: (
        <>
          <span className="block">
            <span className="text-code-dim select-none">$ </span>claude mcp list
          </span>
          <span className="block">
            atlas: npx -y @leonfpontes/design-system-mcp - <span className="text-code-add">✔ Connected</span>
          </span>
        </>
      ),
      copy: 'claude mcp list',
    },
    {
      title: 'Ask for a screen',
      text: 'Name the design system in the prompt. The agent calls the tools on its own.',
      code: (
        <>
          <span className="text-code-dim select-none">&gt; </span>Build an orders page with Atlas components
        </>
      ),
      copy: 'Build an orders page with Atlas components',
    },
  ],
  desktop: [
    {
      title: 'Add the server',
      text: (
        <>
          Settings → Developer → Edit Config opens <code>claude_desktop_config.json</code>. Add Atlas under{' '}
          <code>mcpServers</code>.
        </>
      ),
      code: SERVER_JSON,
      copy: SERVER_JSON,
    },
    {
      title: 'Check the server, then restart Claude Desktop',
      text: 'The check prints the ready line. After the restart, Atlas is in the tools menu.',
      code: <ReadyCheck />,
      copy: CHECK,
    },
    {
      title: 'Ask for a screen',
      text: 'Name the design system in the prompt. Claude calls the tools on its own.',
      code: (
        <>
          <span className="text-code-dim select-none">&gt; </span>Build an orders page with Atlas components
        </>
      ),
      copy: 'Build an orders page with Atlas components',
    },
  ],
  cursor: [
    {
      title: 'Add the server',
      text: (
        <>
          Create <code>.cursor/mcp.json</code> in the project (or <code>~/.cursor/mcp.json</code> for every
          project).
        </>
      ),
      code: SERVER_JSON,
      copy: SERVER_JSON,
    },
    {
      title: 'Check the server',
      text: 'The check prints the ready line. Settings → MCP then lists Atlas and its five tools.',
      code: <ReadyCheck />,
      copy: CHECK,
    },
    {
      title: 'Ask for a screen',
      text: 'In Agent mode, name the design system in the prompt.',
      code: (
        <>
          <span className="text-code-dim select-none">&gt; </span>Build an orders page with Atlas components
        </>
      ),
      copy: 'Build an orders page with Atlas components',
    },
  ],
}

function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="m-0 grid list-none gap-4 p-0">
      {steps.map((s, i) => (
        <li
          key={s.title}
          className="relative grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start gap-10 pl-11 max-[1000px]:grid-cols-1 max-[1000px]:gap-3"
        >
          <span
            aria-hidden
            className="absolute top-0 left-0 h-[26px] w-7 rounded-sm border text-center font-mono text-xs/6 font-medium"
          >
            {i + 1}
          </span>
          <div>
            <h3 className="mb-1 text-base font-semibold">{s.title}</h3>
            <p className="text-[15px] text-muted-foreground">{s.text}</p>
          </div>
          <div className="flex items-start overflow-hidden rounded-lg bg-code-bg text-code-fg dark:border">
            <pre
              tabIndex={0}
              className="m-0 min-w-0 flex-1 overflow-x-auto px-4 py-3 font-mono text-[13px]/[1.7] whitespace-pre-wrap outline-none focus-visible:ring-[3px] focus-visible:ring-code-key/60 focus-visible:ring-inset"
            >
              <code>{s.code}</code>
            </pre>
            <CopyButton text={s.copy} label="Copy" className="m-1 text-code-dim hover:text-code-fg" />
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Quickstart() {
  return (
    <Section id="quickstart" last>
      <div className="wrap grid grid-cols-[minmax(0,4fr)_minmax(0,8fr)] items-start gap-12 max-[1200px]:grid-cols-1 max-[1200px]:gap-6">
        <SectionHead
          eyebrow="05 · Quickstart"
          title={<span id="quickstart-title">Running in under two minutes</span>}
        >
          Node 20.19 or newer. No clone needed.
        </SectionHead>
        <Tabs defaultValue="code" className="gap-5">
          <TabsList variant="line" aria-label="MCP client" className="w-full justify-start">
            <TabsTrigger value="code">Claude Code</TabsTrigger>
            <TabsTrigger value="desktop">Claude Desktop</TabsTrigger>
            <TabsTrigger value="cursor">Cursor</TabsTrigger>
          </TabsList>
          {(['code', 'desktop', 'cursor'] as const).map((k) => (
            <TabsContent key={k} value={k}>
              <Steps steps={STEPS[k]} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Section>
  )
}
