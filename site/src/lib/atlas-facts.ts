// Counts the site shows about Atlas, read from the same files the MCP server serves, so a
// new component or token can't leave the page behind. atlas-facts.test.ts checks them against
// the server's own ready line.
import { resolveTokens, type TokenTree } from '@leonfpontes/atlas-tokens'
import tokens from '@leonfpontes/atlas-tokens/tokens.json'
import manifest from '@leonfpontes/atlas-ui/manifest.json'

import mcpPackage from '../../../mcp/package.json'

const names = manifest.components.map((c) => c.name).sort()

export const COMPONENT_COUNT = names.length
export const TOKEN_COUNT = resolveTokens(tokens as TokenTree).length
export const SERVER_VERSION = mcpPackage.version

/** What `npx @leonfpontes/design-system-mcp --check` prints (mcp/src/server.ts → readyLine). */
export const READY_LINE = `Atlas MCP ready · ${SERVER_VERSION} · 5 tools · ${COMPONENT_COUNT} components · ${TOKEN_COUNT} tokens · stdio`

/** The list_components sample in the tools table: "16 components: Alert, Badge, Button…". */
export const COMPONENTS_SAMPLE = `${COMPONENT_COUNT} components: ${names.slice(0, 3).join(', ')}…`
