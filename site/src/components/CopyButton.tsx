import { cn } from '@leonfpontes/atlas-ui'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

/** Copy with the Motion spec: a check and "Copied" in --success for 1.6 s. */
export function CopyButton({
  text,
  label = 'Copy command',
  className,
}: {
  text: string
  label?: string
  className?: string
}) {
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
        'inline-flex h-10 min-w-10 flex-none cursor-pointer items-center justify-center gap-1 rounded-md px-2.5 outline-none transition-colors duration-(--dur-fast) ease-(--ease-out) focus-visible:ring-[3px] focus-visible:ring-ring/50 pointer-coarse:h-11 pointer-coarse:min-w-11',
        copied && 'text-success',
        className,
      )}
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {copied && <span className="font-sans text-xs font-medium">Copied</span>}
    </button>
  )
}
