import { useEffect, useState } from 'react'
import { addons } from 'storybook/preview-api'

export type Mode = 'light' | 'dark'

const current = (): Mode => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

// Storybook renders the docs page again when the "theme" global changes, and the focused
// button is replaced. The control that switched the theme gets the focus back (WCAG 2.4.3).
let pending: { key: string; at: number } | undefined

function restoreFocus() {
  if (!pending || Date.now() - pending.at > 2000) return
  const el = document.querySelector<HTMLElement>(`[data-focus-key="${pending.key}"]`)
  if (el && document.activeElement !== el) el.focus()
}

/** The docs theme follows the "theme" global, so the manager, stories and docs switch together. */
export function useMode(): [Mode, (m: Mode) => void] {
  const [mode, setMode] = useState<Mode>(current)
  useEffect(() => {
    const obs = new MutationObserver(() => setMode(current()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    restoreFocus()
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    // After the switch and after a new render of the page, in the next frame.
    const id = requestAnimationFrame(restoreFocus)
    return () => cancelAnimationFrame(id)
  }, [mode])
  const set = (m: Mode) => {
    const key = (document.activeElement as HTMLElement | null)
      ?.closest('[data-focus-key]')
      ?.getAttribute('data-focus-key')
    pending = key ? { key, at: Date.now() } : undefined
    document.documentElement.classList.toggle('dark', m === 'dark')
    addons.getChannel().emit('updateGlobals', { globals: { theme: m } })
  }
  return [mode, set]
}
