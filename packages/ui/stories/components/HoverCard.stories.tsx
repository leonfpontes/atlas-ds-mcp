import type { Meta, StoryObj } from '@storybook/react-vite'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

const meta = {
  title: 'Components/Hover Card',
  excludeStories: ['CitedSentence', 'SourcePreview'],
  component: HoverCard,
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj<typeof meta>

/** What a citation points to: the note, where the chunk is, and the exact words. Example data. */
export function SourcePreview() {
  return (
    <>
      <span className="font-mono text-xs text-muted-foreground">Decision</span>
      <strong className="font-semibold">Frame supplier for the spring range</strong>
      <span className="font-mono text-[13px] text-muted-foreground tabular-nums">
        frame-supplier.md · chunk 1 of 3 · updated 2026-03-14
      </span>
      <blockquote className="m-0 border-l-[3px] border-border pl-3 leading-[1.55]">
        We move the frame order to the March run, so the first bikes ship in April.
      </blockquote>
      <a
        href="#frame-supplier"
        className="inline-flex min-h-6 items-center text-primary pointer-coarse:min-h-11"
      >
        Open the note
      </a>
    </>
  )
}

/** A sentence of an answer that ends with its citation; resting on [1] shows the source. */
export function CitedSentence({ open }: { open?: boolean }) {
  return (
    <p className="m-0 max-w-[52ch] text-base leading-[1.7]">
      The first bikes ship in April, because the frame order moved to the March run{' '}
      <HoverCard defaultOpen={open}>
        <HoverCardTrigger
          href="#source-1"
          aria-label="Source 1: Frame supplier for the spring range"
          className="rounded-sm bg-secondary px-1 font-mono text-[13px] font-medium text-foreground no-underline hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          1
        </HoverCardTrigger>
        <HoverCardContent className="w-[380px]">
          <SourcePreview />
        </HoverCardContent>
      </HoverCard>
      .
    </p>
  )
}

export const Default: Story = { name: 'Citation', render: () => <CitedSentence /> }

export const Open: Story = {
  render: () => (
    <div className="pb-64">
      <CitedSentence open />
    </div>
  ),
}
