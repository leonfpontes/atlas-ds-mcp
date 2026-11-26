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
  // Radix refuses a value outside 0…max (console error, and the bar turns indeterminate). The
  // bar stops at the end; over the limit, screen readers still hear the real number.
  const clamped = value == null ? null : Math.min(max, Math.max(0, value))
  const share = ((clamped ?? 0) / max) * 100
  const over = value != null && value > max
  const valueText = props['aria-valuetext'] ?? (over ? `${value} of ${max}` : undefined)
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      data-variant={variant}
      value={clamped}
      max={max}
      className={cn('relative h-2 w-full overflow-hidden rounded-sm bg-secondary', className)}
      {...props}
      {...(valueText === undefined ? {} : { 'aria-valuetext': valueText })}
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
