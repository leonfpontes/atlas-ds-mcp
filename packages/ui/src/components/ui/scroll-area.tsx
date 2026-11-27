'use client'

import * as React from 'react'
import { cn } from '../../lib/utils.js'
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'

// Atlas: the scrollbar shows whenever the content overflows (Radix's "hover" hides it, and on
// touch nobody can tell the panel scrolls), the thumb is --input (3 : 1 on the background,
// where shadcn/ui's --border is not), and the focus ring is drawn inside, because the root
// clips anything outside. Give it an aria-label when nothing inside takes focus: the viewport
// becomes a named region that keyboard users can scroll. Radix wraps the content in a
// display: table box, which never lets text wrap to the width of the area; it is a block here, and
// content wider than the area (with a horizontal ScrollBar) still scrolls sideways.
function ScrollArea({
  className,
  children,
  type = 'auto',
  'aria-label': label,
  'aria-labelledby': labelledBy,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  const named = label !== undefined || labelledBy !== undefined
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      type={type}
      className={cn('relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset [&>div]:!block"
        {...(named
          ? { role: 'region', tabIndex: 0, 'aria-label': label, 'aria-labelledby': labelledBy }
          : {})}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        // 3 px in from the edge, so the bar never covers the inner focus ring or the border.
        orientation === 'vertical' && 'my-[3px] me-[3px] w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'mx-[3px] mb-[3px] h-2.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-input hover:bg-muted-foreground"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
