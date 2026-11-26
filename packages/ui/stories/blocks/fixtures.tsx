// Example data for stories and docs: Fernhill Market, a made-up store. Not real people.
import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert } from 'lucide-react'
import { useId, type ComponentProps, type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type OrderStatus = 'paid' | 'failed' | 'shipped' | 'low-stock'

export const ORDERS: { id: string; customer: string; status: OrderStatus; total: string }[] = [
  { id: '#1042', customer: 'Ana Ruiz', status: 'paid', total: '$84.00' },
  { id: '#1041', customer: 'Tom Becker', status: 'failed', total: '$19.50' },
  { id: '#1040', customer: 'Mei Lin', status: 'shipped', total: '$132.10' },
  { id: '#1039', customer: 'Sam Okafor', status: 'low-stock', total: '$47.25' },
]

const STATUS = {
  paid: { variant: 'success', icon: CircleCheck, label: 'Paid' },
  failed: { variant: 'destructive', icon: OctagonX, label: 'Failed' },
  shipped: { variant: 'info', icon: Info, label: 'Shipped' },
  'low-stock': { variant: 'warning', icon: TriangleAlert, label: 'Low stock' },
} as const

/** Status = color + icon shape + word. */
export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS[status]
  const Icon = s.icon
  return (
    <Badge variant={s.variant}>
      <Icon aria-hidden />
      {s.label}
    </Badge>
  )
}

export type FieldState = 'idle' | 'loading' | 'error' | 'success'

const HINT_TONE: Record<FieldState, string> = {
  idle: 'text-muted-foreground',
  loading: 'text-muted-foreground',
  error: 'text-destructive',
  success: 'text-success',
}

/** A labelled Input with its message under it, linked by aria-describedby. */
export function Field({
  label,
  hint,
  state = 'idle',
  className,
  ...props
}: { label: string; hint?: ReactNode; state?: FieldState; className?: string } & ComponentProps<
  typeof Input
>) {
  const id = useId()
  const HintIcon = state === 'error' ? OctagonX : state === 'success' ? CircleCheck : undefined
  const EndIcon = state === 'loading' ? LoaderCircle : HintIcon
  return (
    <div className={cn('grid w-80 max-w-full gap-2', className)}>
      <label htmlFor={id} className="text-sm leading-none font-medium">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={hint ? `${id}-hint` : undefined}
          aria-busy={state === 'loading' || undefined}
          className={cn(
            EndIcon && 'pr-10',
            state === 'success' && 'border-success',
            state === 'loading' && 'bg-muted',
          )}
          {...props}
        />
        {EndIcon && (
          <EndIcon
            aria-hidden
            className={cn(
              'pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2',
              state === 'loading' && 'animate-spin text-muted-foreground',
              state === 'error' && 'text-destructive',
              state === 'success' && 'text-success',
            )}
          />
        )}
      </div>
      {hint && (
        <p
          id={`${id}-hint`}
          className={cn('flex items-start gap-1.5 text-sm leading-[1.45]', HINT_TONE[state])}
        >
          {HintIcon && <HintIcon aria-hidden className="mt-0.5 size-4 flex-none" />}
          {hint}
        </p>
      )}
    </div>
  )
}
