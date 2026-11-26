// The manifest is what the MCP server teaches. It has to say what the code exports.
import { describe, expect, it } from 'vitest'

import raw from '../atlas.manifest.json'
import * as atlas from './index.js'

const manifest = raw as { components: { name: string; file: string; exports: string[] }[] }

// Parts that SelectContent and DialogContent already render. Exported for shadcn parity; not
// taught to agents, so a screen never needs them.
const INTERNAL_PARTS = new Set([
  'DialogOverlay',
  'DialogPortal',
  'SelectScrollUpButton',
  'SelectScrollDownButton',
])

const modules = import.meta.glob(['./components/ui/*.tsx', '!**/*.test.tsx'], { eager: true }) as Record<
  string,
  Record<string, unknown>
>

describe('atlas.manifest.json', () => {
  it.each(manifest.components.map((c) => [c.name, c] as const))(
    '%s lists exactly the components its file exports',
    (_, c) => {
      const mod = modules[`./components/ui/${c.file}.tsx`]
      expect(mod, `components/ui/${c.file}.tsx`).toBeDefined()
      const components = Object.keys(mod ?? {}).filter((k) => /^[A-Z]/.test(k) && !INTERNAL_PARTS.has(k))
      expect([...c.exports].sort()).toEqual(components.sort())
    },
  )

  it('every file in components/ui has an entry', () => {
    const files = Object.keys(modules).map((p) => p.replace('./components/ui/', '').replace('.tsx', ''))
    expect(manifest.components.map((c) => c.file).sort()).toEqual(files.sort())
  })

  it('the package entry exports every component', () => {
    for (const c of manifest.components) for (const e of c.exports) expect(atlas, e).toHaveProperty(e)
  })
})
