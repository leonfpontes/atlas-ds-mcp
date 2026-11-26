import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@leonfpontes/atlas-ui'
import { Menu } from 'lucide-react'

import { LINKS } from '../lib/links'
import { GitHubIcon, Mark } from './Mark'

const NAV = [
  { href: '/', label: 'How it works', current: true },
  { href: LINKS.docs, label: 'Docs' },
  { href: '/#eval', label: 'Evaluation' },
]

export function SiteHeader({ nav = true }: { nav?: boolean }) {
  return (
    <header className="border-b bg-background">
      <div className="wrap flex h-16 items-center gap-7">
        <a
          href="/"
          className="inline-flex min-h-11 items-center gap-2.5 text-[17px] font-semibold text-foreground no-underline"
        >
          <Mark />
          Atlas
        </a>
        {nav && (
          <>
            <nav aria-label="Main" className="flex gap-1 max-[600px]:hidden">
              {NAV.map((n) => (
                <a
                  key={n.label}
                  href={n.href}
                  aria-current={n.current ? 'page' : undefined}
                  className="inline-flex h-16 items-center border-b-2 border-transparent px-2.5 text-[15px] text-muted-foreground no-underline hover:text-foreground aria-[current]:border-foreground aria-[current]:font-medium aria-[current]:text-foreground"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" asChild className="max-[600px]:hidden">
                <a href={LINKS.repo}>
                  <GitHubIcon />
                  GitHub
                </a>
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Open menu"
                    className="hidden max-[600px]:inline-flex"
                  >
                    <Menu aria-hidden />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[86%] max-w-[340px]">
                  <SheetHeader>
                    <SheetTitle>Atlas</SheetTitle>
                    <SheetDescription>Design system MCP server</SheetDescription>
                  </SheetHeader>
                  <nav aria-label="Main" className="grid px-3">
                    {[...NAV, { href: LINKS.repo, label: 'GitHub' }].map((n) => (
                      <a
                        key={n.label}
                        href={n.href}
                        aria-current={'current' in n && n.current ? 'page' : undefined}
                        className="flex min-h-11 items-center rounded-md px-2 text-foreground no-underline hover:bg-accent aria-[current]:font-medium"
                      >
                        {n.label}
                      </a>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
