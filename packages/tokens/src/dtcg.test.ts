import { describe, expect, it } from 'vitest'

import { flattenTokens, isToken, resolveTokens, type TokenTree } from './index.js'

const tree: TokenTree = {
  $description: 'Example tokens',
  color: {
    $type: 'color',
    blue: { 600: { $value: '#0B5CAD' } },
    primary: { $value: '{color.blue.600}', $description: 'Main action' },
  },
  radius: { md: { $type: 'dimension', $value: { value: 6, unit: 'px' } } },
  brand: { $value: '{color.primary}' },
}

describe('isToken', () => {
  it('is true only for objects with $value', () => {
    expect(isToken({ $value: 1 })).toBe(true)
    expect(isToken({ $type: 'color' })).toBe(false)
    expect(isToken(null)).toBe(false)
    expect(isToken(['$value'])).toBe(false)
  })
})

describe('flattenTokens', () => {
  it('lists every token in order, with the group $type inherited', () => {
    const flat = flattenTokens(tree)
    expect(flat.map((t) => [t.name, t.type])).toEqual([
      ['color.blue.600', 'color'],
      ['color.primary', 'color'],
      ['radius.md', 'dimension'],
      ['brand', undefined],
    ])
    expect(flat[1]).toMatchObject({
      path: ['color', 'primary'],
      value: '{color.blue.600}',
      description: 'Main action',
    })
  })

  it('skips metadata keys and non-object values', () => {
    expect(flattenTokens({ $schema: 'x', note: 'text', list: [1] })).toEqual([])
  })
})

describe('resolveTokens', () => {
  it('follows aliases to the final value and borrows the target type', () => {
    const byName = Object.fromEntries(resolveTokens(tree).map((t) => [t.name, t]))
    expect(byName['color.primary']?.value).toBe('#0B5CAD')
    expect(byName['brand']).toMatchObject({ value: '#0B5CAD', type: 'color' })
  })

  it('names the token when an alias points nowhere', () => {
    expect(() => resolveTokens({ a: { $value: '{b}' } })).toThrow(
      'Token "a" points to "b", which doesn\'t exist.',
    )
  })

  it('stops on a cycle', () => {
    expect(() => resolveTokens({ a: { $value: '{b}' }, b: { $value: '{a}' } })).toThrow(
      'Alias cycle: a → b → a',
    )
  })
})
