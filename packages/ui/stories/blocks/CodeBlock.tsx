import { Check, Copy } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { highlight, type Lang } from './highlight'

/** Copy button with the Motion spec: check + "Copied" in --success for 1.6 s. */
export function CopyButton({ text, label = 'Copy code' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])
  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : label}
      onClick={() => {
        void navigator.clipboard?.writeText(text).catch(() => undefined)
        setCopied(true)
      }}
      className={cn(
        '-mr-2.5 inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 text-code-dim transition-colors duration-(--dur-fast) ease-(--ease-out) outline-none hover:text-code-fg focus-visible:ring-[3px] focus-visible:ring-code-key/60 pointer-coarse:h-11 pointer-coarse:min-w-11',
        copied && 'text-code-add hover:text-code-add',
      )}
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {copied && <span className="font-sans text-xs font-medium">Copied</span>}
    </button>
  )
}

export function CodeBlock({
  code,
  lang = 'tsx',
  title,
  header,
  copy = true,
  className,
  maxHeight,
}: {
  code: string
  lang?: Lang
  title?: ReactNode
  /** Replaces the title, e.g. package-manager tabs. */
  header?: ReactNode
  copy?: boolean
  className?: string
  maxHeight?: number
}) {
  const copyText = lang === 'sh' ? code.replace(/^\$ /gm, '') : code
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg bg-code-bg font-mono text-[13px]/[1.7] text-code-fg dark:border dark:border-border',
        className,
      )}
    >
      {(title || header || copy) && (
        <div className="flex h-11 items-center gap-3 border-b border-code-fg/15 px-3.5 text-xs text-code-dim">
          {header ?? <span>{title}</span>}
          <span className="flex-1" />
          {copy && <CopyButton text={copyText} />}
        </div>
      )}
      <pre
        tabIndex={0}
        className="m-0 overflow-auto px-4 py-3.5 whitespace-pre outline-none focus-visible:ring-[3px] focus-visible:ring-code-key/60 focus-visible:ring-inset"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <code className="text-[13px]">{highlight(code, lang)}</code>
      </pre>
    </div>
  )
}
