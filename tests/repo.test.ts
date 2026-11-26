// Repository guards: the team skeleton is in place, and no third-party brand,
// client or personal name reaches a repository that will be public.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (file: string) => readFileSync(path.join(root, file), 'utf8')

/** Tracked files plus new files not ignored by git: what a commit would carry. */
function repoFiles(): string[] {
  const out = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: root,
    encoding: 'utf8',
  })
  return out.split('\0').filter((f) => f && existsSync(path.join(root, f)))
}

// Names from other projects of the owner, and of the private team that built this one.
// Whole words, any case.
const BANNED = [
  /\bgirahub\b/i,
  /\batra\b/i,
  /\bsofisa\b/i,
  /\bopenbot\b/i,
  /\bnick fury\b/i,
  /\bvespa\b/i,
  /\bbatman\b/i,
  /\bhomem-aranha\b/i,
  /\bdemolidor\b/i,
  /\btony stark\b/i,
  /\bor[aá]culo\b/i,
]

const ALLOWED_TO_MENTION = new Set(['tests/repo.test.ts'])

const BINARY = /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|otf|mp4|webm|pdf|zip)$/i

describe('team skeleton', () => {
  it.each([
    'README.md',
    'AGENTS.md',
    'CLAUDE.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    'LICENSE',
    '.editorconfig',
    '.gitignore',
    '.env.example',
    '.nvmrc',
    '.github/workflows/ci.yml',
    '.github/workflows/security.yml',
    '.github/dependabot.yml',
    'docs/ARCHITECTURE.md',
    'docs/adr/0001-pnpm-shadcn-tmcp.md',
    'docs/adr/0002-package-names-and-layout.md',
    'docs/adr/0003-validate-screen.md',
    'docs/API.md',
  ])('has %s', (file) => {
    expect(existsSync(path.join(root, file))).toBe(true)
  })

  it('is MIT licensed', () => {
    expect(read('LICENSE')).toMatch(/^MIT License/)
    expect(JSON.parse(read('package.json')).license).toBe('MIT')
  })

  it('keeps Claude Code away from secrets and typechecks on stop', () => {
    const settings = JSON.parse(read('.claude/settings.json'))
    expect(settings.permissions.deny).toEqual(expect.arrayContaining(['Read(./.env)', 'Read(./.env.local)']))
    const hook = settings.hooks.Stop[0].hooks[0].command as string
    const script = hook.replace('"$CLAUDE_PROJECT_DIR"', root)
    expect(read(path.relative(root, script))).toContain('typecheck')
    expect(statSync(script).mode & 0o111).not.toBe(0)
  })

  it('runs gitleaks in CI', () => {
    expect(read('.github/workflows/security.yml')).toContain('gitleaks/gitleaks-action')
  })

  it('never commits real environment files', () => {
    const files = repoFiles()
    expect(files.filter((f) => /(^|\/)\.env(\.|$)/.test(f) && !f.endsWith('.env.example'))).toEqual([])
    expect(read('.env.example')).not.toMatch(/^[A-Z0-9_]+=\S/m)
  })
})

describe('monorepo', () => {
  // ADR 0002: a rename is a breaking change for every import line the MCP server teaches.
  it.each([
    ['packages/tokens', '@leonfpontes/atlas-tokens', false],
    ['packages/ui', '@leonfpontes/atlas-ui', false],
    ['mcp', '@leonfpontes/design-system-mcp', false],
    ['evals', 'atlas-evals', true],
    ['site', 'atlas-site', true],
  ])('%s is %s with its own build', (dir, name, isPrivate) => {
    const pkg = JSON.parse(read(`${dir}/package.json`))
    expect(pkg.name).toBe(name)
    expect(Boolean(pkg.private)).toBe(isPrivate)
    expect(pkg.scripts.build).toBeTruthy()
    expect(pkg.license).toBe('MIT')
  })
})

describe('published packages: version and npm page', () => {
  const published = ['packages/tokens', 'packages/ui', 'mcp']
  const version = JSON.parse(read('mcp/package.json')).version as string

  it.each(published)('%s publishes the same version as the server, with a README', (dir) => {
    const pkg = JSON.parse(read(`${dir}/package.json`))
    expect(pkg.version).toBe(version)
    expect(existsSync(path.join(root, dir, 'README.md'))).toBe(true)
  })
})

describe('public repository', () => {
  it('names no other brand, client, person or private team', () => {
    const hits: string[] = []
    for (const file of repoFiles()) {
      if (ALLOWED_TO_MENTION.has(file) || BINARY.test(file)) continue
      const text = read(file)
      for (const word of BANNED) if (word.test(text)) hits.push(`${file}: ${word}`)
    }
    expect(hits).toEqual([])
  })
})

describe('contracts between packages', () => {
  it('the evaluation counts the same four rule ids validate_screen reports', async () => {
    const { RULE_IDS } = await import('../mcp/src/validate.js')
    const { ISSUE_KINDS } = await import('../evals/src/contracts.js')
    expect([...ISSUE_KINDS]).toEqual([...RULE_IDS])
  })
})

describe('published packages', () => {
  // A consumer installs only `dependencies` and `peerDependencies`: everything the shipped
  // code or CSS imports has to be in one of them, or the package breaks outside this repo.
  const bareImports = (dir: string): Set<string> => {
    const found = new Set<string>()
    const files = repoFiles().filter(
      (f) =>
        f.startsWith(`${dir}/src/`) &&
        /\.(ts|tsx|css)$/.test(f) &&
        !/\.(test|stories)\.tsx?$/.test(f) &&
        !f.includes('/src/test/'),
    )
    for (const file of files) {
      const text = read(file)
      const pattern = file.endsWith('.css')
        ? /^@import\s+['"]([^'"]+)['"]/gm
        : /(?:^import\s+|\bfrom\s+)['"]([^'"]+)['"]/gm
      // Template strings and messages ("comes from …") are not imports.
      const specifiers = [...text.matchAll(pattern)]
        .map((m) => m[1] as string)
        .filter((x) => !/[\s$]/.test(x))
      for (const s of specifiers) {
        if (s.startsWith('.') || s.startsWith('node:') || s.startsWith('@/')) continue
        found.add(s.startsWith('@') ? s.split('/').slice(0, 2).join('/') : (s.split('/')[0] as string))
      }
    }
    return found
  }

  it.each(['packages/tokens', 'packages/ui', 'mcp'])('%s declares every package its src imports', (dir) => {
    const pkg = JSON.parse(read(`${dir}/package.json`))
    const declared = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ])
    expect([...bareImports(dir)].filter((name) => !declared.has(name) && name !== pkg.name)).toEqual([])
  })
})
