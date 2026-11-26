'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'
import { Progress as ProgressPrimitive } from 'radix-ui'

// Atlas: a --secondary track, a small radius (no pill), and two variants shadcn lacks:
// neutral (the budget bar) and destructive (over the limit). Say the number in text too.
const progressIndicatorVariants = cva(
  'h-full w-full flex-1 transition-transform duration-(--dur) ease-(--ease-out) motion-reduce:transition-none',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        neutral: 'bg-foreground',
        destructive: 'bg-destructive',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function Progress({
  className,
  value,
  max = 100,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & VariantProps<typeof progressIndicatorVariants>) {
  const share = Math.min(100, Math.max(0, ((value ?? 0) / max) * 100))
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-variant={variant}
      value={value}
      max={max}
      className={cn('relative h-2 w-full overflow-hidden rounded-sm bg-secondary', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={progressIndicatorVariants({ variant })}
        style={{ transform: `translateX(-${100 - share}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress, progressIndicatorVariants }
