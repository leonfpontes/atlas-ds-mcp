// Everything the server reads: the component manifest and the token tree.
// The server takes them as arguments, so tests and the HTTP function can pass their own.

import { readFileSync } from 'node:fs'

import { themeColors, type TokenTree } from '@leonfpontes/atlas-tokens'

import { parseManifest, type Manifest } from './manifest.js'

export interface DesignSystemData {
  manifest: Manifest
  tokens: TokenTree
}

const readJson = (url: URL) => JSON.parse(readFileSync(url, 'utf8')) as unknown

/**
 * Reads the manifest bundled in mcp/data/ (copied at build time) and the tokens from
 * @leonfpontes/atlas-tokens. Fails early, with the file and the field, if either is broken.
 */
export function loadData(
  manifestUrl = new URL('../data/manifest.json', import.meta.url),
  tokensUrl = new URL(import.meta.resolve('@leonfpontes/atlas-tokens/tokens.json')),
): DesignSystemData {
  const manifest = parseManifest(readJson(manifestUrl))
  const tokens = readJson(tokensUrl) as TokenTree
  themeColors(tokens) // throws on a broken alias or a color that isn't hex
  return { manifest, tokens }
}
