import { Button } from '@leonfpontes/atlas-ui'
import { ArrowRight, TriangleAlert } from 'lucide-react'

import { LINKS } from '../lib/links'
import type { ScoreState } from '../lib/scoreboard'
import { CopyButton } from './CopyButton'
import { DiffFigure } from './Diff'
import { GitHubIcon } from './Mark'

export const PHRASE = 'Your coding agent gets the design system, then checks its own screen.'
export const INSTALL = 'claude mcp add atlas -- npx -y @leonfpontes/design-system-mcp'

export function Hero({ score }: { score: ScoreState }) {
  return (
    <div id="hero" className="border-b pt-14 pb-12 max-[600px]:pt-9">
      <div className="wrap grid grid-cols-2 items-start gap-14 max-[1000px]:grid-cols-1 max-[1000px]:gap-10 [&>*]:min-w-0">
        <div>
          <p className="text-[13px]/none font-medium text-muted-foreground">
            Atlas MCP server · open source · MIT
          </p>
          <h1 className="mt-3.5 mb-4 text-[44px]/[1.1] font-semibold tracking-[-0.025em] max-[600px]:text-[32px]">
            {PHRASE}
          </h1>
          <p className="mb-5 text-[17px] text-muted-foreground">
            Tokens, shadcn/ui components and usage rules for Claude Code and Cursor, plus a tool that reviews
            the code they write.
          </p>
          <p className="mb-5 flex flex-wrap items-center gap-2.5 text-[15px] text-muted-foreground">
            {score.kind === 'ready' && (
              <>
                <span>
                  <b className="font-mono font-semibold text-foreground">{score.view.hero.lookups}</b> valid
                  screens with the lookups vs{' '}
                  <b className="font-mono font-semibold text-foreground">{score.view.hero.without}</b> without
                  · {score.view.hero.prompts} prompts × {score.view.hero.runs} runs
                </span>
                {score.view.standIns && (
                  <span className="note-tag">
                    <TriangleAlert className="size-3" aria-hidden />
                    render with stand-ins
                  </span>
                )}
              </>
            )}
            <a
              href="#eval"
              className="inline-flex min-h-6 items-center gap-1 text-sm text-primary underline underline-offset-[3px] max-[600px]:min-h-11"
            >
              Evaluation
              <ArrowRight className="size-3.5" aria-hidden />
            </a>
          </p>
          <div className="mb-4 flex min-h-12 items-center rounded-lg border bg-muted pl-3.5 font-mono text-[12.5px]/[1.5] max-[600px]:pl-2.5 max-[600px]:text-[11.5px]">
            <span className="mr-2 flex-none text-text-subtle" aria-hidden>
              $
            </span>
            <code className="min-w-0 flex-1 py-3 max-[1200px]:whitespace-normal">
              <span className="whitespace-nowrap">claude mcp add atlas --</span>{' '}
              <span className="whitespace-nowrap max-[1200px]:block">
                npx -y @leonfpontes/design-system-mcp
              </span>
            </code>
            <CopyButton text={INSTALL} className="mx-0.5 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-2 max-[600px]:[&>*]:flex-1">
            <Button asChild>
              <a href="#quickstart">Quickstart</a>
            </Button>
            <Button variant="outline" asChild>
              <a href={LINKS.repo}>
                <GitHubIcon />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-[31px] max-[1000px]:mt-0">
          <DiffFigure />
        </div>
      </div>
    </div>
  )
}
