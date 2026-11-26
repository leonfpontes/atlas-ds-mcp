// Runs the render test for one screen in a separate Node process: model-written code never
// runs inside the harness. The child runs under Node's permission model (it can read the
// repository, nothing else: no writes, no child processes, no workers) and is killed after
// a timeout. The render mode is "components" (the real Atlas components from packages/ui/dist)
// unless the caller asks for stand-ins.

import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { RenderMode } from './contracts.js'
import type { Job } from './render-worker.js'

const here = fileURLToPath(import.meta.url)
export const REPO_ROOT = path.resolve(path.dirname(here), '../..')
const WORKER = path.join(path.dirname(here), `render-worker${path.extname(here)}`)

interface ManifestLike {
  importBase: string
  components: { file: string; exports: string[]; extraImports?: { from: string; names: string[] }[] }[]
}

export interface RenderResult {
  rendered: boolean
  error?: string
}

const UI_DIR = path.join(REPO_ROOT, 'packages/ui')
export const UI_DIST = path.join(UI_DIR, 'dist/index.js')

// Model-written code runs in the child. It gets no environment (ANTHROPIC_API_KEY stays in the
// harness) and reads only what the render needs: the worker, the dependencies and the built
// components. The repository root, where .env.local lives, stays out of reach.
const READABLE = [
  path.join(REPO_ROOT, 'node_modules'),
  path.join(REPO_ROOT, 'package.json'),
  UI_DIR,
  path.join(REPO_ROOT, 'evals'),
]

let jobBase: Omit<Job, 'code' | 'mode'> | undefined

function base() {
  if (jobBase) return jobBase
  const manifest = JSON.parse(
    readFileSync(path.join(REPO_ROOT, 'packages/ui/atlas.manifest.json'), 'utf8'),
  ) as ManifestLike
  const extraImports: Record<string, string[]> = {}
  for (const c of manifest.components)
    for (const extra of c.extraImports ?? []) (extraImports[extra.from] ??= []).push(...extra.names)
  jobBase = {
    uiDir: UI_DIR,
    reactFrom: path.join(REPO_ROOT, 'packages/ui/package.json'),
    typescriptFrom: path.join(REPO_ROOT, 'package.json'),
    importBase: manifest.importBase.replace(/\/$/, ''),
    files: Object.fromEntries(manifest.components.map((c) => [c.file, c.exports])),
    extraImports,
  }
  return jobBase
}

export function renderScreen(
  code: string,
  { mode = 'components', timeoutMs = 20_000 }: { mode?: RenderMode; timeoutMs?: number } = {},
): Promise<RenderResult> {
  if (mode === 'components' && !existsSync(UI_DIST))
    return Promise.resolve({
      rendered: false,
      error: 'packages/ui/dist is missing: build @leonfpontes/atlas-ui first',
    })
  const job: Job = { ...base(), code, mode }
  return new Promise((resolve) => {
    const child = spawn(
      process.execPath,
      ['--permission', ...READABLE.map((p) => `--allow-fs-read=${p}`), WORKER],
      {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {},
      },
    )
    let out = ''
    let err = ''
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      resolve({ rendered: false, error: `render timed out after ${timeoutMs} ms` })
    }, timeoutMs)
    child.stdout.on('data', (d: Buffer) => (out += d.toString()))
    child.stderr.on('data', (d: Buffer) => (err += d.toString()))
    child.on('close', () => {
      clearTimeout(timer)
      try {
        resolve(JSON.parse(out) as RenderResult)
      } catch {
        resolve({ rendered: false, error: `render process failed: ${err.trim().slice(-300)}` })
      }
    })
    child.stdin.end(JSON.stringify(job))
  })
}
