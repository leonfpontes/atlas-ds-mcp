// What the model wrote without Atlas, redrawn as it rendered: the purple gradient, the pills
// and the heavy shadows are the model's own choices. These fixed colors are the point of the
// picture (docs/DESIGN.md calls them the problem Atlas solves), so they are the one place on the
// site that doesn't use tokens. The figure is hidden from screen readers; its caption and the
// validate_screen output beside it carry the content.
import type { CSSProperties, ReactNode } from 'react'

const S = {
  page: { fontFamily: 'Inter, system-ui, sans-serif', background: '#faf5ff' },
  top: {
    background: 'linear-gradient(90deg, #7c3aed, #3b82f6)',
    color: '#fff',
    padding: '16px 20px',
    fontWeight: 700,
    fontSize: 18,
  },
  topButton: {
    background: '#fff',
    color: '#7c3aed',
    borderRadius: 999,
    padding: '6px 14px',
    fontWeight: 700,
    fontSize: 12,
    boxShadow: '0 4px 14px rgba(124,58,237,.5)',
  },
  row: {
    background: '#fff',
    borderRadius: 16,
    padding: '12px 14px',
    boxShadow: '0 6px 20px rgba(124,58,237,.12)',
    fontSize: 13,
    color: '#374151',
  },
  ok: {
    background: '#dcfce7',
    color: '#15803d',
    borderRadius: 999,
    padding: '2px 10px',
    fontSize: 11,
    fontWeight: 700,
  },
  bad: {
    background: '#fee2e2',
    color: '#b91c1c',
    borderRadius: 999,
    padding: '2px 10px',
    fontSize: 11,
    fontWeight: 700,
  },
} satisfies Record<string, CSSProperties>

/** A numbered marker in the left gutter, with a dashed guide to the element that has the issue. */
function Pin({ n, children, guide = 24 }: { n: number; children: ReactNode; guide?: number }) {
  return (
    <div className="relative">
      <span className="absolute top-1/2 -left-[31px] z-[2] inline-grid size-[22px] -translate-y-1/2 place-items-center rounded-[4px] border-[1.5px] border-code-bg bg-background font-mono text-xs font-semibold text-foreground dark:border-foreground">
        {n}
        <span
          className="absolute top-1/2 left-[calc(100%+1.5px)] border-t-[1.5px] border-dashed border-code-bg dark:border-foreground"
          style={{ width: guide }}
        />
      </span>
      {children}
    </div>
  )
}

export function GuessedScreen() {
  const rows: [number, string, 'ok' | 'bad', string, string][] = [
    [3, '#1042 · Ana Ruiz', 'ok', 'Paid', '$84.00'],
    [1, '#1041 · Tom Becker', 'bad', 'Failed', '$19.50'],
    [4, '#1040 · Mei Lin', 'ok', 'Shipped', '$132.10'],
  ]
  return (
    <div className="flex-1 pl-10 max-[600px]:pl-9" style={S.page} aria-hidden="true">
      <div style={S.page}>
        <Pin n={2} guide={6}>
          <div className="flex items-center justify-between" style={S.top}>
            Fernhill Orders <span style={S.topButton}>+ New Order</span>
          </div>
        </Pin>
        <div className="grid gap-2.5 px-5 py-4">
          {rows.map(([n, who, kind, status, total]) => (
            <Pin key={who} n={n} guide={6}>
              <div className="flex justify-between max-[600px]:text-xs" style={S.row}>
                <span>{who}</span>
                <span style={kind === 'ok' ? S.ok : S.bad}>{status}</span>
                <b>{total}</b>
              </div>
            </Pin>
          ))}
        </div>
      </div>
    </div>
  )
}
