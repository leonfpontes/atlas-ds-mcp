// The prompts live in evals/prompts/*.md. Both variants share the system prompt and the
// request; with the server the model also gets the server's own instructions, the way an
// MCP client passes them on. The hash goes in the scoreboard as the prompt version.

import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'

export interface Prompts {
  version: string
  system: string
  systemWithMcp(serverInstructions: string): string
  user(prompt: string): string
}

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => {
    if (!(key in values)) throw new Error(`prompt placeholder {{${key}}} has no value`)
    return values[key] ?? ''
  })

export function loadPrompts(dir: string): Prompts {
  const read = (file: string) => readFileSync(path.join(dir, file), 'utf8').trim()
  const system = read('system.md')
  const withMcp = read('with-mcp.md')
  const user = read('user.md')
  const version = createHash('sha256').update([system, withMcp, user].join('\0')).digest('hex').slice(0, 8)
  return {
    version,
    system,
    systemWithMcp: (serverInstructions) =>
      `${system}\n\n${fill(withMcp, { serverInstructions: serverInstructions.trim() })}`,
    user: (prompt) => fill(user, { prompt }),
  }
}
