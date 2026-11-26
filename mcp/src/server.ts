// The Atlas MCP server. One server object serves both transports: stdio for a
// local agent (cli.ts) and HTTP for the public endpoint (http.ts). Every tool
// only reads, so the HTTP endpoint is read-only by construction.

import { readFileSync } from 'node:fs'

import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot'
import { McpServer } from 'tmcp'

import { loadData, type DesignSystemData } from './data.js'
import {
  GetComponentInput,
  GetComponentOutput,
  getComponent,
  ListComponentsOutput,
  listComponents,
  ListTokensInput,
  ListTokensOutput,
  listTokens,
  runValidateScreen,
  SearchUsageInput,
  SearchUsageOutput,
  searchUsage,
  ToolError,
  ValidateScreenInput,
  ValidateScreenOutput,
  withShortErrors,
} from './tools.js'
import { ParseError } from './validate.js'

export const SERVER_NAME = 'atlas-design-system'
// The version npm publishes, read from package.json (../package.json from both src/ and dist/).
export const SERVER_VERSION = (
  JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string }
).version

export const INSTRUCTIONS = `## Atlas design system

You are building UI with Atlas: shadcn/ui components (React 19 + Tailwind 4) themed by Atlas tokens.
Ask this server instead of guessing:

1. list_components, then get_component for each component you use: copy its import line, props and variants.
2. list_tokens for colors and sizes: use token classes (bg-primary, text-muted-foreground), never hex or bg-white.
3. search_usage before a design decision (status colors, buttons, forms, feedback).
4. validate_screen with the whole file when you finish. Fix every issue and call it again until it reports 0 issues.`

const READ_ONLY = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const

/** A tool answer: the JSON for clients that read text, and the same object as structured content. */
function ok<T extends object>(structuredContent: T) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(structuredContent, null, 2) }],
    structuredContent,
  }
}

function fail(error: unknown) {
  const text =
    error instanceof ParseError
      ? `validate_screen couldn't parse the file at line ${error.line}: ${error.message}. Send the whole JSX or TSX file, imports included.`
      : error instanceof ToolError
        ? error.message
        : `Atlas hit an unexpected error: ${String(error)}`
  return { isError: true as const, content: [{ type: 'text' as const, text }] }
}

export function createServer(data: DesignSystemData = loadData()): McpServer {
  const server = new McpServer(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
      description: 'Atlas design system: components, tokens and usage rules for coding agents.',
    },
    {
      adapter: new ValibotJsonSchemaAdapter(),
      instructions: INSTRUCTIONS,
      capabilities: { tools: { listChanged: true } },
    },
  )

  server.tool(
    {
      name: 'list_components',
      title: 'List Atlas components',
      description: `Every Atlas component (${data.manifest.components.length}) with a one-line summary and its import line. Start here.`,
      outputSchema: ListComponentsOutput,
      annotations: READ_ONLY,
    },
    () => ok(listComponents(data)),
  )

  server.tool(
    {
      name: 'get_component',
      title: 'Get one component',
      description:
        'Props, variants, examples, the exact import line and the usage rules of one component. Call it before you use the component.',
      schema: withShortErrors(GetComponentInput),
      outputSchema: GetComponentOutput,
      annotations: READ_ONLY,
    },
    ({ name }) => {
      try {
        return ok(getComponent(data, name))
      } catch (error) {
        return fail(error)
      }
    },
  )

  server.tool(
    {
      name: 'list_tokens',
      title: 'List design tokens',
      description:
        'Design tokens with their CSS variable, Tailwind classes (colors) and light and dark values. Filter by type or text.',
      schema: withShortErrors(ListTokensInput),
      outputSchema: ListTokensOutput,
      annotations: READ_ONLY,
    },
    (input) => ok(listTokens(data, input)),
  )

  server.tool(
    {
      name: 'search_usage',
      title: 'Search usage rules',
      description:
        'Usage rules (do and don\'t) that match what you are about to build, e.g. "status badge" or "delete button".',
      schema: withShortErrors(SearchUsageInput),
      outputSchema: SearchUsageOutput,
      annotations: READ_ONLY,
    },
    (input) => {
      try {
        return ok(searchUsage(data, input))
      } catch (error) {
        return fail(error)
      }
    },
  )

  server.tool(
    {
      name: 'validate_screen',
      title: 'Validate a screen',
      description:
        'Checks a JSX or TSX file for hard-coded colors, unknown components, invalid props and internal imports. Each issue has a line, a rule id and a fix.',
      schema: withShortErrors(ValidateScreenInput),
      outputSchema: ValidateScreenOutput,
      annotations: READ_ONLY,
    },
    ({ code }) => {
      try {
        return ok(runValidateScreen(data, code))
      } catch (error) {
        return fail(error)
      }
    },
  )

  return server
}

/** The one line the server prints when it starts (stderr on stdio; stdout with --check). */
export function readyLine(data: DesignSystemData, transport: string): string {
  const tokens = listTokens(data).count
  return `Atlas MCP ready · ${SERVER_VERSION} · 5 tools · ${data.manifest.components.length} components · ${tokens} tokens · ${transport}`
}
