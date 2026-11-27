'use client'

import * as React from 'react'
import { cn } from '../../lib/utils.js'
import { CheckIcon, MinusIcon } from 'lucide-react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'

// Atlas: the 16 px box of shadcn/ui inside a 40 px hit area (44 on touch). A negative margin
// gives the area back to the layout, so a list of filters lines up on the box while every
// checkbox stays a target you can hit. Indeterminate (some of a group) shows a dash.
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'group/checkbox peer relative -m-3 inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md outline-none pointer-coarse:-m-3.5 pointer-coarse:size-11 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <span
        data-slot="checkbox-box"
        className={cn(
          'grid size-4 place-content-center rounded-[4px] border border-input bg-background text-primary-foreground shadow-xs transition-[background-color,border-color,box-shadow] duration-(--dur-fast) ease-(--ease-out)',
          'group-focus-visible/checkbox:border-ring group-focus-visible/checkbox:ring-[3px] group-focus-visible/checkbox:ring-ring/50',
          'group-aria-invalid/checkbox:border-destructive group-aria-invalid/checkbox:ring-destructive/20 dark:group-aria-invalid/checkbox:ring-destructive/40',
          'group-data-[state=checked]/checkbox:border-primary group-data-[state=checked]/checkbox:bg-primary',
          'group-data-[state=indeterminate]/checkbox:border-primary group-data-[state=indeterminate]/checkbox:bg-primary',
        )}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none"
        >
          <CheckIcon className="size-3.5 group-data-[state=indeterminate]/checkbox:hidden" aria-hidden />
          <MinusIcon
            className="hidden size-3.5 group-data-[state=indeterminate]/checkbox:block"
            aria-hidden
          />
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
