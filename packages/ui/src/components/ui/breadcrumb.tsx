import * as React from 'react'
import { cn } from '../../lib/utils.js'
import { MoreHorizontal } from 'lucide-react'
import { Slot } from 'radix-ui'

// Atlas: a slash between levels (the design's separator; shadcn/ui draws a chevron), links
// 24 px tall (44 on touch) with the Atlas focus ring, and the current page as plain text with
// aria-current (shadcn/ui adds role="link" to a span nobody can focus or follow).
function Breadcrumb({ 'aria-label': label = 'Breadcrumb', ...props }: React.ComponentProps<'nav'>) {
  return <nav aria-label={label} data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        'm-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-sm break-words text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn('inline-flex min-w-0 items-center gap-1.5', className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : 'a'
  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        'inline-flex min-h-6 items-center rounded-sm text-muted-foreground no-underline transition-colors duration-(--dur-fast) outline-none pointer-coarse:min-h-11 hover:text-foreground hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn('min-w-0 font-normal text-foreground [overflow-wrap:anywhere]', className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn('text-text-subtle select-none [&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? '/'}
    </li>
  )
}

/** Stands for levels left out. Decorative: put it in a button with an aria-label to open them. */
function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      aria-hidden="true"
      className={cn('flex size-6 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
