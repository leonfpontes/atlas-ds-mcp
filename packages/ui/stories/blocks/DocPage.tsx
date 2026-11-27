import { ChevronRight, Copy, Moon, Sun } from 'lucide-react'
import { Unstyled } from '@storybook/addon-docs/blocks'
import { useEffect, useState, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { GitHubIcon } from './icons'
import { docsHref, editHref } from './links'
import { useMode } from './theme'

import pkg from '../../package.json'

/** The @leonfpontes/atlas-ui version these docs describe. */
export const VERSION = pkg.version
export const UPDATED = '2026-11-27'

export interface TocItem {
  id: string
  label: string
}

export interface PageLink {
  label: string
  id: string
}

function useCopied() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])
  return [copied, () => setCopied(true)] as const
}

function TopBar({ crumb, file }: { crumb: [string, string]; file: string }) {
  const [mode, setMode] = useMode()
  const [copied, markCopied] = useCopied()
  return (
    <header className="flex h-[52px] items-center gap-1.5 border-b bg-background pr-4 pl-6 max-[900px]:hidden">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {crumb[0]}
        <ChevronRight className="size-3.5" aria-hidden />
        <span aria-current="page" className="font-medium text-foreground">
          {crumb[1]}
        </span>
      </nav>
      <span className="flex-1" />
      <Button variant="ghost" className="text-[13px]" asChild>
        <a href={editHref(file)} target="_blank" rel="noreferrer">
          <GitHubIcon />
          Edit on GitHub
        </a>
      </Button>
      <Button
        variant="ghost"
        className={cn('text-[13px]', copied && 'text-success hover:text-success')}
        onClick={() => {
          const text = document.querySelector('article')?.innerText ?? ''
          void navigator.clipboard?.writeText(text).catch(() => undefined)
          markCopied()
        }}
      >
        <Copy aria-hidden />
        {copied ? 'Copied' : 'Copy page'}
      </Button>
      <Button
        variant="ghost"
        className="text-[13px]"
        aria-label={`Theme: ${mode}. Switch to ${mode === 'dark' ? 'light' : 'dark'}`}
        data-focus-key="docs-theme"
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      >
        {mode === 'dark' ? <Moon aria-hidden /> : <Sun aria-hidden />}
        Theme
      </Button>
    </header>
  )
}

function Toc({ toc, side, active }: { toc: TocItem[]; side?: ReactNode; active: string }) {
  return (
    <aside
      aria-label="On this page"
      className="sticky top-6 grid gap-0.5 self-start text-[13.5px] max-[1100px]:hidden"
    >
      <p className="mb-2 font-medium">On this page</p>
      {toc.map((t) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          aria-current={active === t.id ? 'true' : undefined}
          className="border-l py-1 pl-3 text-muted-foreground no-underline hover:text-foreground aria-[current]:border-l-2 aria-[current]:border-foreground aria-[current]:pl-[11px] aria-[current]:font-medium aria-[current]:text-foreground"
        >
          {t.label}
        </a>
      ))}
      {side && (
        <div className="mt-6 grid gap-1.5 border-t pt-4 text-[13px] text-muted-foreground">{side}</div>
      )}
    </aside>
  )
}

function JumpMenu({ toc }: { toc: TocItem[] }) {
  return (
    <div className="mt-6 hidden max-[1100px]:block">
      <Select onValueChange={(id) => document.getElementById(id)?.scrollIntoView({ block: 'start' })}>
        <SelectTrigger aria-label="On this page" className="w-full">
          <SelectValue placeholder="On this page" />
        </SelectTrigger>
        <SelectContent position="popper">
          {toc.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/** Meta line in the right column: "Base shadcn/ui". */
export function SideMeta({ label, value }: { label: string; value: ReactNode }) {
  return (
    <span>
      {label} <b className="font-mono font-medium break-words text-foreground">{value}</b>
    </span>
  )
}

export function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('min-w-0 scroll-mt-6', className)}>
      {title && <h2 className="mb-3.5 text-xl leading-tight font-semibold">{title}</h2>}
      {children}
    </section>
  )
}

function useActive(toc: TocItem[]) {
  const [active, setActive] = useState(toc[0]?.id ?? '')
  useEffect(() => {
    const onScroll = () => {
      let cur = toc[0]?.id ?? ''
      for (const t of toc) {
        const el = document.getElementById(t.id)
        if (el && el.getBoundingClientRect().top < 120) cur = t.id
      }
      setActive(cur)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [toc])
  return active
}

export function DocPage({
  crumb,
  eyebrow,
  title,
  lead,
  meta,
  toc,
  side,
  file,
  prev,
  next,
  children,
}: {
  crumb: [string, string]
  eyebrow?: string
  title: string
  lead: ReactNode
  meta?: ReactNode
  toc: TocItem[]
  side?: ReactNode
  /** Source of the page, for "Edit this page on GitHub". */
  file: string
  prev?: PageLink
  next?: PageLink
  children: ReactNode
}) {
  const active = useActive(toc)
  return (
    <Unstyled className="min-h-screen bg-background font-sans text-base/[1.6] text-foreground">
      <TopBar crumb={crumb} file={file} />
      <nav
        aria-label="Breadcrumb"
        className="hidden px-4 pt-3 text-[13px] text-muted-foreground max-[900px]:block"
      >
        {crumb[0]} / {crumb[1]}
      </nav>
      <main className="grid grid-cols-[minmax(0,760px)_200px] justify-center gap-14 px-12 pt-12 pb-24 max-[1100px]:grid-cols-[minmax(0,1fr)] max-[1100px]:px-8 max-[1100px]:pt-10 max-[1100px]:pb-20 max-[900px]:px-4 max-[900px]:pt-4 max-[900px]:pb-16">
        <article className="grid min-w-0 gap-12 max-[900px]:gap-10">
          <header>
            {eyebrow && <p className="text-[13px]/none font-medium text-muted-foreground">{eyebrow}</p>}
            <h1
              className={cn(
                'text-4xl leading-tight font-semibold tracking-[-0.02em] max-[900px]:text-[30px]',
                eyebrow && 'mt-3',
              )}
            >
              {title}
            </h1>
            <div className="mt-2.5 text-[17px] text-muted-foreground">{lead}</div>
            {meta && (
              <div className="mt-[18px] flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">{meta}</div>
            )}
            <JumpMenu toc={toc} />
          </header>
          {children}
          <div className="flex flex-wrap justify-between gap-3 text-[13px] text-muted-foreground">
            <span>
              Last updated {UPDATED} · Atlas v{VERSION}
            </span>
            <a
              href={editHref(file)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-6 items-center gap-1.5 text-muted-foreground underline underline-offset-[3px] hover:text-foreground pointer-coarse:min-h-11"
            >
              <GitHubIcon size={14} />
              Edit this page on GitHub
            </a>
          </div>
          {(prev || next) && (
            <nav
              aria-label="Previous and next page"
              className="grid grid-cols-2 gap-4 border-t pt-6 max-[900px]:grid-cols-1"
            >
              {prev ? <PageCard dir="Previous" link={prev} /> : <span />}
              {next ? <PageCard dir="Next" link={next} /> : <span />}
            </nav>
          )}
        </article>
        <Toc toc={toc} side={side} active={active} />
      </main>
    </Unstyled>
  )
}

function PageCard({ dir, link }: { dir: 'Previous' | 'Next'; link: PageLink }) {
  return (
    <a
      href={docsHref(link.id)}
      target="_top"
      className={cn(
        'grid min-h-11 rounded-lg border px-4 py-3 font-medium text-foreground no-underline outline-none hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        dir === 'Next' && 'text-right',
      )}
    >
      <small className="text-[13px] font-normal text-muted-foreground">{dir}</small>
      {link.label}
    </a>
  )
}

/** A link inside the docs to another docs page. */
export function DocLink({
  id,
  children,
  className,
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={docsHref(id)}
      target="_top"
      className={cn('text-primary underline underline-offset-[3px]', className)}
    >
      {children}
    </a>
  )
}

/** Header meta link, e.g. "shadcn/ui Button ↗". */
export function MetaLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center gap-1 text-muted-foreground no-underline hover:text-foreground"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
      </svg>
    </a>
  )
}
