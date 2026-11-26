import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 has-data-[slot=alert-action]:grid-cols-[0_1fr_auto] has-[>svg]:has-data-[slot=alert-action]:grid-cols-[calc(var(--spacing)*4)_1fr_auto] [&>svg]:size-4 [&>svg]:translate-y-[3px] [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive: 'border-destructive/40 bg-destructive-subtle text-destructive',
        // Atlas extensions. The description stays in muted text; title and icon take the status color.
        success: 'border-success/40 bg-success-subtle text-success',
        warning: 'border-warning/40 bg-warning-subtle text-warning',
        info: 'border-info/35 bg-info-subtle text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Alert({
  className,
  variant,
  role,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant ?? 'default'}
      // Destructive interrupts the screen reader; the other tones wait their turn.
      role={role ?? (variant === 'destructive' ? 'alert' : 'status')}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 min-h-4 leading-normal font-medium', className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm leading-normal text-muted-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-[3px] [&_p]:leading-normal',
        className,
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        'col-start-3 row-span-2 row-start-1 -my-2.5 -mr-3 self-start text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
