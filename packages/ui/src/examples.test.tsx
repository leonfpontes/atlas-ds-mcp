// Every example in atlas.manifest.json is what get_component hands to a coding agent, which
// copies it. Each one has to render with the real components, the way an app would use it.
import { render } from '@testing-library/react'
import * as lucide from 'lucide-react'
import * as jsxRuntime from 'react/jsx-runtime'
import * as sonner from 'sonner'
import ts from 'typescript'
import { afterEach, describe, expect, it, vi } from 'vitest'

import raw from '../atlas.manifest.json'

interface Example {
  title: string
  code: string
}
const manifest = raw as {
  importBase: string
  components: { name: string; file: string; exports: string[]; examples: Example[] }[]
}

const files = import.meta.glob<Record<string, unknown>>(['./components/ui/*.tsx', '!**/*.test.tsx'], {
  eager: true,
})
const modules: Record<string, unknown> = {
  'react/jsx-runtime': jsxRuntime,
  sonner,
  'lucide-react': lucide,
}
for (const c of manifest.components)
  modules[`${manifest.importBase}/${c.file}`] = files[`./components/ui/${c.file}.tsx`]

/** The example as a file an agent would write: public imports, then the snippet in a component. */
function asFile(example: Example) {
  const imports = manifest.components
    .map((c) => `import { ${c.exports.join(', ')} } from "${manifest.importBase}/${c.file}"`)
    .join('\n')
  const icons = [
    ...new Set(example.code.match(/<([A-Z]\w+)\s*\/>/g)?.map((m) => m.slice(1, -2).trim()) ?? []),
  ].filter((n) => n in lucide)
  return `${imports}
import { toast } from "sonner"
${icons.length ? `import { ${icons.join(', ')} } from "lucide-react"` : ''}
export function Example({ open, setOpen }) {
  return (
    <>
${example.code.replace(/^\s*\/\/.*$/gm, '')}
    </>
  )
}`
}

function load(source: string) {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  })
  const exports: Record<string, unknown> = {}
  const require = (id: string) => {
    if (!(id in modules)) throw new Error(`The example imports ${id}, which an Atlas app doesn't have.`)
    return modules[id]
  }
  new Function('require', 'exports', outputText)(require, exports)
  return exports.Example as (props: { open: boolean; setOpen: (o: boolean) => void }) => React.ReactNode
}

afterEach(() => vi.restoreAllMocks())

describe('manifest examples render with the real components', () => {
  const cases = manifest.components.flatMap((c) =>
    c.examples.map((e) => [`${c.name} · ${e.title}`, e] as const),
  )

  it.each(cases)('%s', (_, example) => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const Example = load(asFile(example))
    expect(() => render(<Example open setOpen={() => {}} />)).not.toThrow()
    expect(errors.mock.calls.map((c) => String(c[0])).join('\n')).toBe('')
  })
})
