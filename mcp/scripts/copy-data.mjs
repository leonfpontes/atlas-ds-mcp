// Copies the component manifest into mcp/data/ so the published package carries it
// without depending on @leonfpontes/atlas-ui (and its React peers) at runtime.
import { copyFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const source = fileURLToPath(import.meta.resolve('@leonfpontes/atlas-ui/manifest.json'))
const target = new URL('../data/', import.meta.url)
mkdirSync(target, { recursive: true })
copyFileSync(source, new URL('manifest.json', target))
console.log('mcp/data/manifest.json ← @leonfpontes/atlas-ui/manifest.json')
