import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { axeViolations } from '../../test/axe.js'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb.js'

function NotePath() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/explore">Explore</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/explore?type=decision">Decisions</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-mono">frame-supplier.md</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

describe('Breadcrumb', () => {
  it('is a navigation landmark named Breadcrumb, with an ordered list', () => {
    render(<NotePath />)
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(within(nav).getByRole('list').tagName).toBe('OL')
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3)
  })

  it('takes another name', () => {
    render(<Breadcrumb aria-label="You are here" />)
    expect(screen.getByRole('navigation', { name: 'You are here' })).toBeInTheDocument()
  })

  it('links the levels above and marks the current page as plain text', () => {
    render(<NotePath />)
    expect(screen.getAllByRole('link').map((a) => a.textContent)).toEqual(['Explore', 'Decisions'])
    const page = screen.getByText('frame-supplier.md')
    expect(page).toHaveAttribute('aria-current', 'page')
    expect(page).not.toHaveAttribute('role')
  })

  it('separates levels with a slash that screen readers skip', () => {
    render(<NotePath />)
    const seps = document.querySelectorAll('[data-slot="breadcrumb-separator"]')
    expect(seps).toHaveLength(2)
    for (const s of seps) {
      expect(s).toHaveTextContent('/')
      expect(s).toHaveAttribute('aria-hidden', 'true')
    }
  })

  it('gives links 24 px of height (44 on touch) and the focus ring', () => {
    render(<NotePath />)
    expect(screen.getByRole('link', { name: 'Explore' })).toHaveClass(
      'min-h-6',
      'pointer-coarse:min-h-11',
      'focus-visible:ring-[3px]',
    )
  })

  it('has a decorative ellipsis for levels left out', () => {
    render(<BreadcrumbEllipsis data-testid="more" />)
    expect(screen.getByTestId('more')).toHaveAttribute('aria-hidden', 'true')
  })

  it('has no axe violations', async () => {
    render(<NotePath />)
    expect(await axeViolations()).toEqual([])
  })
})
