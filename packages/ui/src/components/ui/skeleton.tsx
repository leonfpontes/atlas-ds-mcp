import * as React from 'react'
import { cn } from '../../lib/utils.js'

// Atlas: the --secondary fill of the prototype, a small radius, and no pulse with reduced motion.
// It is decorative: put aria-busy="true" on the region that is loading.
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn('animate-pulse rounded-sm bg-secondary motion-reduce:animate-none', className)}
      {...props}
    />
  )
}

export { Skeleton }
