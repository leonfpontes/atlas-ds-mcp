import type { ReactNode } from 'react'

/** Numbered steps with the code beside each one. */
export function Steps({ items }: { items: { title: string; text: ReactNode; code?: ReactNode }[] }) {
  return (
    <ol className="m-0 grid list-none gap-5 p-0">
      {items.map((s, i) => (
        <li key={s.title} className="grid grid-cols-[28px_1fr] gap-3">
          <span
            aria-hidden
            className="h-6 rounded-sm border text-center font-mono text-xs/6 font-medium text-muted-foreground"
          >
            {i + 1}
          </span>
          <div className="min-w-0">
            <h3 className="mb-1 text-[15px] font-semibold">{s.title}</h3>
            <div
              className={s.code ? 'mb-2.5 text-sm text-muted-foreground' : 'text-sm text-muted-foreground'}
            >
              {s.text}
            </div>
            {s.code}
          </div>
        </li>
      ))}
    </ol>
  )
}

/** Two-column list of rules: a short name and a sentence. */
export function RuleList({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <ul className="m-0 list-none border-t p-0">
      {items.map(([a, b], i) => (
        <li
          key={i}
          className="grid grid-cols-[200px_1fr] gap-4 border-b py-3 text-sm max-[900px]:grid-cols-1 max-[900px]:gap-0.5"
        >
          <b className="font-medium">{a}</b>
          <span className="text-muted-foreground">{b}</span>
        </li>
      ))}
    </ul>
  )
}
