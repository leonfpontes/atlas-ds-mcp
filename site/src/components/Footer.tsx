import { Button } from '@leonfpontes/atlas-ui'
import { ExternalLink } from 'lucide-react'

import { LINKS } from '../lib/links'
import { GitHubIcon } from './Mark'

const linkCls =
  'inline-flex min-h-8 items-center text-muted-foreground no-underline hover:text-foreground hover:underline max-[600px]:min-h-11'

export function Footer() {
  return (
    <footer className="py-10 text-sm text-muted-foreground">
      <div className="wrap grid grid-cols-[minmax(0,2fr)_1fr_1fr] gap-8 max-[600px]:grid-cols-2">
        <div className="max-[600px]:col-span-2">
          <p className="mb-1.5 text-xl font-semibold text-foreground">Built by Leonardo Pontes</p>
          <p>Design system, MCP server and evaluation, end to end.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <a href={LINKS.linkedin}>
                LinkedIn
                <ExternalLink aria-hidden />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={LINKS.ownerGithub}>
                <GitHubIcon />
                GitHub
              </a>
            </Button>
          </div>
        </div>
        <div>
          <h2 className="mb-1 text-[13px] font-semibold text-foreground">Project</h2>
          <ul className="m-0 grid list-none p-0">
            <li>
              <a className={linkCls} href={LINKS.repo}>
                Repository
              </a>
            </li>
            <li>
              <a className={linkCls} href="/#eval">
                Evaluation
              </a>
            </li>
            <li>
              <a className={linkCls} href={LINKS.changelog}>
                Changelog
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="mb-1 text-[13px] font-semibold text-foreground">Docs</h2>
          <ul className="m-0 grid list-none p-0">
            <li>
              <a className={linkCls} href={LINKS.docs}>
                Storybook
              </a>
            </li>
            <li>
              <a className={linkCls} href="/#quickstart">
                Quickstart
              </a>
            </li>
            <li>
              <a className={linkCls} href={LINKS.doc('mcp-validate-screen-rules--docs')}>
                validate_screen rules
              </a>
            </li>
          </ul>
        </div>
        <p className="col-span-full border-t pt-4 text-[13px]">Atlas · MIT license</p>
      </div>
    </footer>
  )
}
