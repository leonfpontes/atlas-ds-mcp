import { cn } from '@leonfpontes/atlas-ui'
import type { ReactNode } from 'react'

export function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="max-w-[760px]">
      <p className="text-[13px]/none font-medium text-muted-foreground">{eyebrow}</p>
      <h2 className="my-2.5 text-[28px]/[1.2] font-semibold tracking-[-0.02em] max-[600px]:text-2xl">
        {title}
      </h2>
      {children && <div className="text-muted-foreground">{children}</div>}
    </div>
  )
}

export function Section({
  id,
  children,
  last,
  className,
}: {
  id: string
  children: ReactNode
  last?: boolean
  className?: string
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn('scroll-mt-4 py-11 max-[600px]:py-10', !last && 'border-b', className)}
    >
      {children}
    </section>
  )
}
