'use client'

import * as React from 'react'
import { cn } from '../../lib/utils.js'
import { HoverCard as HoverCardPrimitive } from 'radix-ui'

// Atlas: opens after 300 ms (Radix waits 700), a 320 px card that never passes the screen
// edge, the overlay shadow and radius of every Atlas popover. A preview only: touch screens
// never open it, so what it shows has to be one click away too.
function HoverCard({
  openDelay = 300,
  closeDelay = 200,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return (
    <HoverCardPrimitive.Root
      data-slot="hover-card"
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...props}
    />
  )
}

function HoverCardTrigger({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

function HoverCardContent({
  className,
  align = 'start',
  sideOffset = 8,
  collisionPadding = 16,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'z-50 grid w-80 max-w-[calc(100vw-2rem)] origin-(--radix-hover-card-content-transform-origin) gap-2 rounded-lg border bg-popover px-4 py-3.5 text-sm text-popover-foreground shadow-overlay outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
