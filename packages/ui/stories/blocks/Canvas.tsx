import { Moon, Sun } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { CodeBlock } from './CodeBlock'
import { useMode } from './theme'

export interface CanvasRow {
  label: string
  children: ReactNode
}

/** A caption under a demo, e.g. "default · 40 px". */
export function Demo({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="m-0 grid justify-items-start gap-1.5">
      {children}
      <figcaption className="font-mono text-xs text-muted-foreground">{caption}</figcaption>
    </figure>
  )
}

function ModeSwitch() {
  const [mode, setMode] = useMode()
  return (
    <div role="group" aria-label="Canvas theme" className="inline-flex overflow-hidden rounded-md border">
      {(['light', 'dark'] as const).map((m) => (
        <button
          key={m}
          type="button"
          aria-pressed={mode === m}
          data-focus-key={`canvas-${m}`}
          onClick={() => setMode(m)}
          className="inline-flex h-10 cursor-pointer items-center gap-1.5 bg-background px-3 text-[13px] font-medium text-muted-foreground outline-none not-first:border-l focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset aria-pressed:bg-secondary aria-pressed:text-foreground pointer-coarse:h-11"
        >
          {m === 'light' ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
          {m === 'light' ? 'Light' : 'Dark'}
        </button>
      ))}
    </div>
  )
}

/** Preview / Code, with the canvas rows and the code under them (the component page anatomy). */
export function Canvas({
  name,
  rows,
  snippet,
  source,
  file,
}: {
  name: string
  rows: CanvasRow[]
  /** Two or three lines shown under the preview. */
  snippet: string
  /** The full example file for the Code tab. */
  source: string
  file: string
}) {
  return (
    <Tabs defaultValue="preview" className="gap-4">
      <TabsList variant="line" className="w-full justify-start">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div className="overflow-hidden rounded-lg border">
          <div className="flex min-h-12 items-center justify-between gap-3 border-b bg-muted pr-2 pl-3.5 text-[13px] text-muted-foreground">
            <span>Canvas · {name}</span>
            <ModeSwitch />
          </div>
          <div className="grid bg-background">
            {rows.map((r) => (
              <div
                key={r.label}
                className="grid grid-cols-[96px_1fr] items-center gap-4 border-b border-dashed px-5 py-[18px] last:border-b-0 max-[900px]:grid-cols-1 max-[900px]:gap-2 max-[900px]:px-4 max-[900px]:py-3.5"
              >
                <span className="font-mono text-xs text-muted-foreground">{r.label}</span>
                <div className="flex flex-wrap items-center gap-2.5">{r.children}</div>
              </div>
            ))}
          </div>
          <CodeBlock code={snippet} copy={false} className="rounded-none dark:border-0 dark:border-t" />
        </div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock code={source} title={file} />
      </TabsContent>
    </Tabs>
  )
}

/** A stage for a single demo, e.g. in Do and don't. */
export function Stage({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-center gap-2 bg-muted px-4 py-7', className)}
      {...props}
    />
  )
}
