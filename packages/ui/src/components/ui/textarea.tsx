import * as React from 'react'
import { cn } from '../../lib/utils.js'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Atlas: 88 px tall to start, grows with the text, resizes only vertically; 16 px text on phones.
        'flex field-sizing-content min-h-22 w-full resize-y rounded-md border border-input bg-background px-3 py-2.5 text-base/normal text-foreground shadow-xs transition-[color,box-shadow] outline-none placeholder:text-text-subtle focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm/normal dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
