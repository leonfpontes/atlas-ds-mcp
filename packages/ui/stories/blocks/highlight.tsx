// A small highlighter for the code samples in the docs: TSX, CSS, JSON and shell.
// Colors are the --code-* tokens; nothing here is a hex value.
import type { ReactNode } from 'react'

export type Lang = 'tsx' | 'css' | 'json' | 'sh'

const KEYWORDS =
  /^(import|from|export|function|return|const|let|type|interface|default|async|await|if|else|true|false|null)$/

const PATTERNS: Record<Lang, RegExp> = {
  // strings · comments · JSX tag names · words · punctuation
  tsx: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|(\/\/[^\n]*)|(<\/?[A-Za-z][\w.]*|\/?>)|([A-Za-z_$][\w$-]*)|([^\s"'`/<>A-Za-z_$]+|[/<>])/g,
  css: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\/\*[\s\S]*?\*\/)|(@[\w-]+)|(--[\w-]+)|([^\s"'@-]+|-)/g,
  json: /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|(true|false|null)|([^\s"\d-]+|-)/g,
  sh: /^(\$)|(#[^\n]*)|("(?:[^"\\]|\\.)*")|(\S+)/gm,
}

const span = (cls: string, text: string, key: number) => (
  <span key={key} className={cls}>
    {text}
  </span>
)

export function highlight(code: string, lang: Lang): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let k = 0
  const re = new RegExp(PATTERNS[lang])
  for (const m of code.matchAll(re)) {
    const i = m.index ?? 0
    if (i > last) out.push(code.slice(last, i))
    last = i + m[0].length
    const [all, a, b, c, d] = m
    if (lang === 'tsx') {
      if (a) out.push(span('text-code-str', all, k++))
      else if (b) out.push(span('text-code-dim', all, k++))
      else if (c) out.push(span('text-code-key', all, k++))
      else if (d && KEYWORDS.test(d)) out.push(span('text-code-key', all, k++))
      else out.push(all)
    } else if (lang === 'css') {
      if (a) out.push(span('text-code-str', all, k++))
      else if (b) out.push(span('text-code-dim', all, k++))
      else if (c) out.push(span('text-code-key', all, k++))
      else if (d) out.push(span('text-code-add', all, k++))
      else out.push(all)
    } else if (lang === 'json') {
      if (a && b) out.push(span('text-code-key', a, k++), b)
      else if (a) out.push(span('text-code-str', all, k++))
      else if (c || d) out.push(span('text-code-add', all, k++))
      else out.push(all)
    } else {
      if (a || b) out.push(span('text-code-dim', all, k++))
      else if (c) out.push(span('text-code-str', all, k++))
      else out.push(all)
    }
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}
