// The token contract shared by the token build (story O1), the MCP server's
// list_tokens tool (B2) and the site. It follows the W3C Design Tokens format
// (DTCG): a token is any object with `$value`; groups may set `$type` for
// everything below them; a value like "{color.primary}" is an alias.

export type TokenType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow'
  | 'typography'

export interface DesignToken {
  $value: unknown
  $type?: TokenType
  $description?: string
  $extensions?: Record<string, unknown>
}

/** A token file: nested groups whose leaves are tokens. Keys starting with `$` are metadata. */
export type TokenTree = { [key: string]: unknown }

export interface FlatToken {
  /** Dot path, e.g. `color.primary`. */
  name: string
  path: string[]
  /** Own `$type`, or the closest group's. */
  type: TokenType | undefined
  /** The value as written; aliases stay as `{…}`. */
  value: unknown
  description: string | undefined
  extensions: Record<string, unknown> | undefined
}

const ALIAS = /^\{([^{}]+)\}$/

export function isToken(node: unknown): node is DesignToken {
  return typeof node === 'object' && node !== null && !Array.isArray(node) && '$value' in node
}

/** Every token in document order, with the inherited `$type`. */
export function flattenTokens(tree: TokenTree): FlatToken[] {
  const out: FlatToken[] = []
  const visit = (node: TokenTree, path: string[], inherited: TokenType | undefined) => {
    const groupType = (node.$type as TokenType | undefined) ?? inherited
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue
      const here = [...path, key]
      if (isToken(child)) {
        out.push({
          name: here.join('.'),
          path: here,
          type: child.$type ?? groupType,
          value: child.$value,
          description: child.$description,
          extensions: child.$extensions,
        })
      } else if (typeof child === 'object' && child !== null && !Array.isArray(child)) {
        visit(child as TokenTree, here, groupType)
      }
    }
  }
  visit(tree, [], undefined)
  return out
}

/**
 * Tokens with aliases replaced by the final value. Throws on an alias to a token
 * that doesn't exist, or on a cycle, naming the token so the build error is useful.
 */
export function resolveTokens(tree: TokenTree): FlatToken[] {
  const tokens = flattenTokens(tree)
  const byName = new Map(tokens.map((t) => [t.name, t]))
  const resolve = (token: FlatToken, seen: string[]): unknown => {
    const match = typeof token.value === 'string' ? ALIAS.exec(token.value) : null
    if (!match) return token.value
    const target = match[1] as string
    if (seen.includes(target)) throw new Error(`Alias cycle: ${[...seen, target].join(' → ')}`)
    const next = byName.get(target)
    if (!next) throw new Error(`Token "${token.name}" points to "${target}", which doesn't exist.`)
    return resolve(next, [...seen, target])
  }
  return tokens.map((t) => {
    const value = resolve(t, [t.name])
    const target = typeof t.value === 'string' ? ALIAS.exec(t.value)?.[1] : undefined
    return { ...t, value, type: t.type ?? (target ? byName.get(target)?.type : undefined) }
  })
}
