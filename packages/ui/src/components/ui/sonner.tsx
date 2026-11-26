'use client'

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

// shadcn reads the theme from next-themes; Atlas has no theme provider, so the theme is a
// prop. The colors come from the tokens either way, so the toast follows the .dark class.
const Toaster = ({ theme = 'system', ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'font-sans! shadow-overlay!',
          // Atlas targets: 40 px with a mouse, 44 px on touch (Sonner's own buttons are 24 px).
          actionButton: 'h-10! min-w-10! px-3! text-sm! pointer-coarse:h-11! pointer-coarse:min-w-11!',
          cancelButton: 'h-10! min-w-10! px-3! text-sm! pointer-coarse:h-11! pointer-coarse:min-w-11!',
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
          '--success-text': 'var(--success)',
          '--error-text': 'var(--destructive)',
          '--warning-text': 'var(--warning)',
          '--info-text': 'var(--info)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
