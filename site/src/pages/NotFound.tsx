import { Button } from '@leonfpontes/atlas-ui'
import { ArrowLeft, Search } from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'

import { SiteHeader } from '../components/SiteHeader'
import { LINKS } from '../lib/links'

const GO = [
  ['/', 'How it works', 'the overview'],
  [LINKS.docs, 'Docs', 'Storybook'],
  ['/#quickstart', 'Quickstart', 'three commands'],
] as const

interface Entry {
  id: string
  title: string
  type: string
}

/** Searches the docs pages listed in the Storybook index, which ships with the site. */
function DocsSearch({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [query, setQuery] = useState('')
  useEffect(() => {
    fetch(`${LINKS.docs}index.json`)
      .then((r) =>
        r.ok
          ? (r.json() as Promise<{ entries: Record<string, Entry> }>)
          : Promise.reject(new Error(String(r.status))),
      )
      .then((d) => setEntries(Object.values(d.entries).filter((e) => e.type === 'docs')))
      .catch(() => setEntries([]))
  }, [])
  const q = query.trim().toLowerCase()
  const hits = q ? entries.filter((e) => e.title.toLowerCase().includes(q)).slice(0, 6) : []
  return (
    <div role="search" className="mb-5">
      <div className="relative">
        <label htmlFor="q" className="sr-only">
          Search docs and components
        </label>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-subtle"
          aria-hidden
        />
        <input
          ref={inputRef}
          id="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-controls="q-results"
          placeholder="Search docs and components"
          className="flex h-10 w-full rounded-md border border-input bg-background pr-14 pl-9 text-sm outline-none placeholder:text-text-subtle focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 pointer-coarse:h-11"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded-sm border bg-background px-[5px] py-[3px] font-mono text-[11px]/none text-muted-foreground">
          ⌘K
        </kbd>
      </div>
      <div id="q-results" aria-live="polite">
        {q && hits.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            No page matches "{query}". Try "button" or "colors".
          </p>
        )}
        {hits.length > 0 && (
          <ul className="m-0 mt-2 grid list-none rounded-lg border p-1">
            {hits.map((h) => (
              <li key={h.id}>
                <a
                  href={LINKS.doc(h.id)}
                  className="flex min-h-10 items-center rounded-md px-2 text-sm text-foreground no-underline hover:bg-accent"
                >
                  {h.title.replaceAll('/', ' › ')}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export function NotFound() {
  const search = useRef<HTMLInputElement>(null)
  // ⌘K / Ctrl+K jumps to the search, as in the docs.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        search.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
  return (
    <>
      <SiteHeader nav={false} />
      <main className="wrap pt-[88px] pb-[120px]">
        <div className="max-w-[560px]">
          <p className="font-mono text-sm font-medium text-muted-foreground">404</p>
          <h1 className="mt-2.5 mb-3 text-4xl font-semibold tracking-[-0.02em]">This page isn't here</h1>
          <p className="mb-7 text-[17px] text-muted-foreground">
            The link may be old, or the page moved to the docs. Search for it, or start from one of these.
          </p>
          <DocsSearch inputRef={search} />
          <ul className="m-0 mb-7 list-none border-t p-0">
            {GO.map(([href, label, note]) => (
              <li key={label}>
                <a
                  href={href}
                  className="flex min-h-12 items-center justify-between border-b text-[15px] text-foreground no-underline hover:bg-muted"
                >
                  {label} <span className="text-sm text-muted-foreground">{note}</span>
                </a>
              </li>
            ))}
          </ul>
          <Button asChild>
            <a href="/">
              <ArrowLeft aria-hidden />
              Back to How it works
            </a>
          </Button>
        </div>
      </main>
    </>
  )
}
