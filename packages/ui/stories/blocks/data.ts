// The docs read the same data the MCP server serves: the component manifest and the
// tokens. "What the agent receives" calls the server's own get_component.
import type { TokenTree } from '@leonfpontes/atlas-tokens'
import tokens from '@leonfpontes/atlas-tokens/tokens.json'

import { parseManifest } from '../../../../mcp/src/manifest'
import { getComponent, runValidateScreen } from '../../../../mcp/src/tools'
import raw from '../../atlas.manifest.json'

export const manifest = parseManifest(raw)
export const tokenTree = tokens as TokenTree
const data = { manifest, tokens: tokenTree }

export const component = (name: string) => {
  const c = manifest.components.find((x) => x.name === name)
  if (!c) throw new Error(`${name} is not in atlas.manifest.json`)
  return c
}

export const agentAnswer = (name: string) => getComponent(data, name)
export const validate = (code: string) => runValidateScreen(data, code)
