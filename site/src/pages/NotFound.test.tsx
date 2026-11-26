import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NotFound } from './NotFound'

const INDEX = {
  entries: {
    'components-button--docs': { id: 'components-button--docs', title: 'Components/Button', type: 'docs' },
    'components-button--variants': {
      id: 'components-button--variants',
      title: 'Components/Button',
      type: 'story',
    },
    'foundations-colors--docs': { id: 'foundations-colors--docs', title: 'Foundations/Colors', type: 'docs' },
  },
}

afterEach(() => vi.unstubAllGlobals())

describe('404', () => {
  it('says the page is missing and offers three ways back', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<NotFound />)
    expect(screen.getByRole('heading', { level: 1, name: "This page isn't here" })).toBeInTheDocument()
    const list = screen.getByRole('list')
    expect(
      within(list)
        .getAllByRole('link')
        .map((a) => a.getAttribute('href')),
    ).toEqual(['/', '/storybook/', '/#quickstart'])
    expect(screen.getByRole('link', { name: /Back to How it works/ })).toHaveAttribute('href', '/')
  })

  it('searches the docs pages from the Storybook index', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(INDEX) }))
    render(<NotFound />)
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search docs and components' }), 'butt')
    const hit = await screen.findByRole('link', { name: 'Components › Button' })
    expect(hit).toHaveAttribute('href', '/storybook/?path=/docs/components-button--docs')
    await userEvent.clear(screen.getByRole('searchbox'))
    await userEvent.type(screen.getByRole('searchbox'), 'zzz')
    expect(screen.getByText(/No page matches/)).toBeInTheDocument()
  })

  it('has no axe violations', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<NotFound />)
    const r = await axe.run(document.body, { rules: { 'color-contrast': { enabled: false } } })
    expect(r.violations.map((v) => v.id)).toEqual([])
  })
})
