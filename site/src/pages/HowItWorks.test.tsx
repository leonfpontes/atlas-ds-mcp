import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'

import { scoreboard } from '../lib/scoreboard-data'
import { HowItWorks } from './HowItWorks'

async function violations() {
  const r = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } })
  return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
}

describe('How it works', () => {
  it('has one H1, the sentence of the README cover and the share images', () => {
    render(<HowItWorks />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Your coding agent gets the design system, then checks its own screen.',
    )
  })

  it('has the five sections in order', () => {
    render(<HowItWorks />)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'Five tools, all read-only',
      'One request, start to finish',
      'The lookups do the work. validate_screen is the safety net.',
      '"Build an orders page for Fernhill Market"',
      'Running in under two minutes',
      'Project',
      'Docs',
    ])
  })

  it('never links to "#" alone', () => {
    render(<HowItWorks />)
    for (const a of document.querySelectorAll('a'))
      expect(a.getAttribute('href'), a.textContent ?? '').not.toBe('#')
  })

  it('signs the footer with the LinkedIn link and no job-seeking line', () => {
    render(<HowItWorks />)
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByText('Built by Leonardo Pontes')).toBeInTheDocument()
    expect(within(footer).getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      expect.stringContaining('linkedin.com/in/'),
    )
    expect(footer.textContent).not.toMatch(/open to|hiring|roles/i)
  })

  it.skipIf(scoreboard.kind !== 'ready')(
    'shows the real scoreboard, with the stand-ins marker only for a stand-ins run',
    () => {
      render(<HowItWorks />)
      if (scoreboard.kind !== 'ready') return
      const table = screen.getByRole('table', { name: /Evaluation/ })
      expect(within(table).getAllByRole('row')).toHaveLength(7)
      const marker = screen.queryByText('Render test with stand-ins, not the real components yet')
      if (scoreboard.board.renderMode === 'stand-ins') expect(marker).toBeInTheDocument()
      else expect(marker).toBeNull()
    },
  )

  it('shows the empty state when there is no run', () => {
    render(<HowItWorks score={{ kind: 'empty' }} />)
    expect(screen.getByText('No evaluation run yet')).toBeInTheDocument()
    expect(screen.queryByRole('table', { name: /Evaluation/ })).toBeNull()
  })

  it('says what went wrong when latest.json is broken', () => {
    render(<HowItWorks score={{ kind: 'error', message: 'latest.json has no results.' }} />)
    expect(screen.getByRole('alert')).toHaveTextContent("Couldn't read the results")
  })

  it('switches the quickstart between clients with the keyboard', async () => {
    render(<HowItWorks />)
    await userEvent.click(screen.getByRole('tab', { name: 'Claude Code' }))
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Claude Desktop' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('claude_desktop_config.json')
  })

  it('copies the install command and says so', async () => {
    const user = userEvent.setup()
    render(<HowItWorks />)
    const [copy] = screen.getAllByRole('button', { name: 'Copy command' })
    await user.click(copy!)
    expect(await navigator.clipboard.readText()).toBe(
      'claude mcp add atlas -- npx -y @leonfpontes/design-system-mcp',
    )
    expect(screen.getAllByRole('button', { name: 'Copied' }).length).toBeGreaterThan(0)
  })

  it('opens the menu on small screens', async () => {
    render(<HowItWorks />)
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(
      within(screen.getByRole('dialog', { name: 'Atlas' })).getByRole('link', { name: 'Docs' }),
    ).toHaveAttribute('href', '/storybook/')
  })

  // axe walks the whole page in jsdom: well over Vitest's 5 s default on a busy machine.
  it('has no axe violations (contrast is checked in the browser)', { timeout: 20_000 }, async () => {
    render(<HowItWorks />)
    expect(await violations()).toEqual([])
  })
})
