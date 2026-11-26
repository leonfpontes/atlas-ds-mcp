import { describe, expect, it } from 'vitest'

import { cn } from './utils.js'

describe('cn', () => {
  it('drops falsy values and lets the last Tailwind class of a kind win', () => {
    const hidden = false
    expect(cn('px-2 py-1', hidden && 'hidden', 'px-4')).toBe('py-1 px-4')
  })

  it('keeps token classes that do not conflict', () => {
    expect(cn('bg-primary text-primary-foreground', { 'ring-2': true })).toBe(
      'bg-primary text-primary-foreground ring-2',
    )
  })
})
