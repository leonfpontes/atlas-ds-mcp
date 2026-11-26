// `pnpm --filter @leonfpontes/atlas-tokens build` runs tsc, then this file:
// it reads tokens.json and writes dist/tokens.css and dist/theme.css.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildCss } from './css.js'
import type { TokenTree } from './dtcg.js'

const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tree = JSON.parse(readFileSync(path.join(pkg, 'tokens.json'), 'utf8')) as TokenTree
const { tokensCss, themeCss } = buildCss(tree)

mkdirSync(path.join(pkg, 'dist'), { recursive: true })
writeFileSync(path.join(pkg, 'dist/tokens.css'), tokensCss)
writeFileSync(path.join(pkg, 'dist/theme.css'), themeCss)
console.log('atlas-tokens: wrote dist/tokens.css and dist/theme.css')
