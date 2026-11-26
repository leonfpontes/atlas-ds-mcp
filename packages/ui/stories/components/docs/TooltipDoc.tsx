import { Button } from '@/components/ui/button'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { CopyId } from '../Tooltip.stories'

export function TooltipDoc() {
  return (
    <ComponentDoc
      name="Tooltip"
      lead="Names an icon button. Inverted: --foreground background. Only for icon buttons."
      shadcn="https://ui.shadcn.com/docs/components/tooltip"
      primitive={{
        label: 'Radix Tooltip',
        href: 'https://www.radix-ui.com/primitives/docs/components/tooltip',
        pkg: '@radix-ui/react-tooltip',
      }}
      stories={3}
      canvas={{
        rows: [{ label: 'icon button', children: <CopyId /> }],
        snippet:
          '<TooltipProvider>\n  <Tooltip>\n    <TooltipTrigger asChild>…</TooltipTrigger>\n    <TooltipContent>Copy order ID</TooltipContent>\n  </Tooltip>\n</TooltipProvider>',
        source: `import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mount one TooltipProvider at the root of the app: every Tooltip needs it.
export function CopyOrderId() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Copy order ID">
            <Copy />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy order ID</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}`,
      }}
      doExample={{ node: <CopyId />, text: 'The tooltip repeats the aria-label of an icon button.' }}
      dontExample={{
        node: <Button variant="outline">Save order</Button>,
        text: 'A tooltip on a labelled button, or one that hides needed information. Touch screens never show it.',
      }}
      a11y={[
        <>
          Every <code>Tooltip</code> sits inside a <code>TooltipProvider</code> (one at the app root is
          enough); without it, the tooltip throws.
        </>,
        'Shows on hover and on keyboard focus; Esc hides it.',
        <>
          The icon button keeps its own <code>aria-label</code>; the tooltip is a visual repeat.
        </>,
        'Text contrast is 17 : 1 (background on foreground).',
      ]}
    />
  )
}
