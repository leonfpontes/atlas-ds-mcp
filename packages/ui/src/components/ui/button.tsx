import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'
import { Slot } from 'radix-ui'

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-[color,background-color,box-shadow] duration-(--dur-fast) ease-(--ease-out) outline-none aria-busy:cursor-progress focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline decoration-1 underline-offset-4 has-[>svg]:px-1',
      },
      size: {
        // Atlas: 40 px with a mouse, 44 px on touch. Nothing smaller (docs/DESIGN.md, Targets).
        default: 'h-10 px-4 py-2 has-[>svg]:px-3 pointer-coarse:h-11',
        lg: 'h-12 px-6 text-[15px] has-[>svg]:px-4',
        icon: 'size-10 pointer-coarse:size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
