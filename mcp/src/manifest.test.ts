import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { importLine, parseManifest } from './manifest.js'
import { data } from './test/fixtures.js'
import { validateScreen } from './validate.js'

const manifest = data.manifest
const raw = JSON.parse(
  readFileSync(new URL('../../packages/ui/atlas.manifest.json', import.meta.url), 'utf8'),
)

describe('component manifest', () => {
  it('covers exactly the components the evaluation cases expect', () => {
    const cases = JSON.parse(readFileSync(new URL('../../evals/cases.json', import.meta.url), 'utf8')) as {
      expectedComponents: string[]
    }[]
    const expected = new Set(cases.flatMap((c) => c.expectedComponents))
    expect(manifest.components.map((c) => c.name).sort()).toEqual([...expected].sort())
  })

  it('gives every enum prop its values, and the values include the default', () => {
    for (const c of manifest.components) {
      for (const p of c.props) {
        if (p.type !== 'enum') continue
        expect(p.values, `${c.name}.${p.name}`).toBeDefined()
        if (p.default) expect(p.values).toContain(p.default)
        expect(c.exports, `${c.name}.${p.name} belongs to an export`).toContain(p.component)
      }
    }
  })

  it('has examples that pass validate_screen', () => {
    for (const c of manifest.components) {
      const imports = manifest.components.map((x) => importLine(manifest, x)).join('\n')
      for (const e of c.examples) {
        const code = `${imports}\nimport { toast } from "sonner"\nimport { Copy, TriangleAlert } from "lucide-react"\nexport function Example({ open, setOpen }) {\n  return (\n    <>\n${e.code.replace(/^\/\/.*$/gm, '')}\n    </>\n  )\n}\n`
        const result = validateScreen(code, manifest)
        expect(result.issues, `${c.name} · ${e.title}`).toEqual([])
      }
    }
  })

  it('rejects an export claimed by two components', () => {
    const broken = structuredClone(raw)
    broken.components[1].exports.push('Alert')
    expect(() => parseManifest(broken)).toThrow('Each export belongs to one component only.')
  })

  it('rejects a rule about a component that does not exist', () => {
    const broken = structuredClone(raw)
    broken.rules[0].components = ['DataGrid']
    expect(() => parseManifest(broken)).toThrow('A rule names a component that is not in the manifest.')
  })

  it('names the bad field', () => {
    const broken = structuredClone(raw)
    broken.components[0].file = 'Not A File'
    expect(() => parseManifest(broken)).toThrow(/at components\.0\.file/)
  })
})
