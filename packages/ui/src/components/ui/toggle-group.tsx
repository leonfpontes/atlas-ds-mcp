'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'

// Atlas: the segmented control of the design (joined buttons, the pressed one on --secondary
// with an --input border) is the default; ghost is the shadcn/ui look with no border. The item
// styles live here, so the group needs no separate Toggle component.
const toggleGroupItemVariants = cva(
  "inline-flex h-10 min-w-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 px-3 text-[13px] font-medium whitespace-nowrap text-muted-foreground transition-[color,background-color,border-color,box-shadow] duration-(--dur-fast) ease-(--ease-out) outline-none pointer-coarse:h-11 pointer-coarse:min-w-11 hover:text-foreground focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        outline:
          'border border-border bg-background not-first:-ml-px first:rounded-l-md last:rounded-r-md data-[state=on]:z-[1] data-[state=on]:border-input data-[state=on]:bg-secondary',
        ghost: 'rounded-md bg-transparent hover:bg-accent data-[state=on]:bg-secondary',
      },
    },
    defaultVariants: { variant: 'outline' },
  },
)

type Variant = VariantProps<typeof toggleGroupItemVariants>['variant']

const ToggleGroupContext = React.createContext<{ variant: Variant }>({ variant: 'outline' })

type ToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> & { variant?: Variant }

/**
 * type="single" is a radio group: once a value is picked, pressing it again keeps it (Radix
 * would clear it, leaving no mode at all). type="multiple" works as in Radix.
 */
function ToggleGroup({ className, variant = 'outline', children, ...props }: ToggleGroupProps) {
  const single = props.type === 'single'
  const [own, setOwn] = React.useState(single ? (props.defaultValue ?? '') : '')
  let root = props
  if (props.type === 'single') {
    const { defaultValue: _defaultValue, value, onValueChange, ...rest } = props
    const controlled = value !== undefined
    root = {
      ...rest,
      value: controlled ? value : own,
      onValueChange: (next: string) => {
        if (!next) return
        if (!controlled) setOwn(next)
        onValueChange?.(next)
      },
    }
  }
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      className={cn(
        'group/toggle-group inline-flex w-fit items-center data-[variant=ghost]:gap-0.5',
        className,
      )}
      {...root}
    >
      <ToggleGroupContext.Provider value={{ variant }}>{children}</ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  const { variant } = React.useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={variant}
      className={cn(toggleGroupItemVariants({ variant }), className)}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem, toggleGroupItemVariants }
