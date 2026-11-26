// The render test, in its own Node process (see render.ts). Reads one job as JSON on stdin,
// writes { rendered, error? } on stdout. The screen is compiled with TypeScript and rendered
// with react-dom/server. Atlas imports resolve to one of two things (job.mode):
//   components: the real Atlas components built in packages/ui/dist, with the real lucide-react
//               and sonner, so a wrong icon name or a component used outside its provider fails;
//   stand-ins:  one stand-in per manifest export that renders its children (before the
//               components existed).
// Either way it checks that the file compiles, that every import exists, that every component
// it uses is defined and that the render doesn't throw. It doesn't check looks.

import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import type * as TS from 'typescript'

export interface Job {
  code: string
  mode: 'stand-ins' | 'components'
  /** packages/ui: the built components live in its dist/. */
  uiDir: string
  /** package.json files to resolve from: React through Atlas UI, TypeScript from the root. */
  reactFrom: string
  typescriptFrom: string
  importBase: string
  /** Atlas component file → its exports. */
  files: Record<string, string[]>
  /** Other packages Atlas documents (sonner) → names. */
  extraImports: Record<string, string[]>
}

type Module = Record<string, unknown>
interface ReactLike {
  createElement(type: unknown, props?: object | null, ...children: unknown[]): unknown
}
interface ServerLike {
  renderToString(element: unknown): string
}

async function readStdin(): Promise<string> {
  let data = ''
  for await (const chunk of process.stdin) data += chunk
  return data
}

async function run(job: Job): Promise<void> {
  const requireReact = createRequire(job.reactFrom)
  const React = requireReact('react') as ReactLike
  const jsxRuntime = requireReact('react/jsx-runtime') as Module
  const server = requireReact('react-dom/server') as ServerLike
  const ts = createRequire(job.typescriptFrom)('typescript') as typeof TS

  const stand = (name: string) => {
    const component = (props: { children?: unknown }) =>
      React.createElement('div', { 'data-atlas': name }, props.children)
    component.displayName = name
    return component
  }
  const callable = (name: string): unknown =>
    new Proxy(() => name, {
      get: (_t, key) => (key === 'then' ? undefined : callable(`${name}.${String(key)}`)),
    })
  const cn = (...args: unknown[]) => args.filter((a) => typeof a === 'string' && a).join(' ')
  const icons = new Proxy({} as Module, {
    get: (_t, key) => (typeof key === 'string' && /^[A-Z]/.test(key) ? stand(`icon:${key}`) : undefined),
  })

  const modules = new Map<string, Module>([
    ['react', React as unknown as Module],
    ['react/jsx-runtime', jsxRuntime],
  ])
  if (job.mode === 'components') {
    const load = async (file: string) =>
      (await import(pathToFileURL(path.join(job.uiDir, 'dist', file)).href)) as Module
    modules.set('@leonfpontes/atlas-ui', await load('index.js'))
    modules.set('@/lib/utils', await load('lib/utils.js'))
    for (const file of Object.keys(job.files))
      modules.set(`${job.importBase}/${file}`, await load(`components/ui/${file}.js`))
    for (const pkg of ['lucide-react', 'sonner', ...Object.keys(job.extraImports)])
      if (!modules.has(pkg))
        modules.set(pkg, (await import(pathToFileURL(requireReact.resolve(pkg)).href)) as Module)
  } else {
    const atlasRoot: Module = { cn }
    modules.set('lucide-react', icons)
    modules.set('@/lib/utils', { cn })
    modules.set('@leonfpontes/atlas-ui', atlasRoot)
    for (const [file, names] of Object.entries(job.files)) {
      const mod: Module = {}
      for (const name of names) mod[name] = atlasRoot[name] = stand(name)
      modules.set(`${job.importBase}/${file}`, mod)
    }
    for (const [pkg, names] of Object.entries(job.extraImports)) {
      const mod: Module = modules.get(pkg) ?? {}
      for (const name of names) mod[name] = callable(name)
      if (pkg === 'sonner') mod.Toaster ??= stand('Toaster')
      modules.set(pkg, mod)
    }
  }

  const out = ts.transpileModule(job.code, {
    reportDiagnostics: true,
    fileName: 'screen.tsx',
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  })
  const syntax = out.diagnostics?.find((d) => d.category === ts.DiagnosticCategory.Error)
  if (syntax) throw new Error(`does not compile: ${ts.flattenDiagnosticMessageText(syntax.messageText, ' ')}`)

  const exportsObject: Module = {}
  const fakeRequire = (specifier: string) => {
    const mod = modules.get(specifier)
    if (!mod) throw new Error(`cannot resolve import "${specifier}"`)
    return mod
  }
  new Function('require', 'module', 'exports', out.outputText)(
    fakeRequire,
    { exports: exportsObject },
    exportsObject,
  )

  const Screen =
    exportsObject.default ??
    Object.entries(exportsObject).find(([k, v]) => /^[A-Z]/.test(k) && typeof v === 'function')?.[1]
  if (typeof Screen !== 'function') throw new Error('no component is exported')

  // React warnings (keys, nesting) are not failures; errors thrown while rendering are.
  console.error = () => {}
  const html = server.renderToString(React.createElement(Screen))
  if (!html) throw new Error('the screen rendered nothing')
}

const job = JSON.parse(await readStdin()) as Job
let reply: { rendered: boolean; error?: string }
try {
  await run(job)
  reply = { rendered: true }
} catch (error) {
  reply = { rendered: false, error: String((error as Error)?.message ?? error).slice(0, 300) }
}
process.stdout.write(JSON.stringify(reply))
