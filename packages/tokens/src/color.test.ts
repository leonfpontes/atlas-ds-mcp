import { describe, expect, it } from 'vitest'

import { contrastRatio, hexToOklch, parseHex, toOklchCss } from './color.js'

describe('parseHex', () => {
  it('reads #RGB, #RRGGBB and #RRGGBBAA', () => {
    expect(parseHex('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(parseHex('#0B5CAD')).toEqual({ r: 11, g: 92, b: 173, a: 1 })
    expect(parseHex('#161A2240').a).toBeCloseTo(0.251, 3)
  })

  it('names the bad value', () => {
    expect(() => parseHex('blue')).toThrow('"blue" is not a hex color')
  })
})

describe('contrastRatio', () => {
  it('matches the WCAG reference points', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2)
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1)
  })

  it('is symmetric', () => {
    expect(contrastRatio('#0B5CAD', '#FFFFFF')).toBe(contrastRatio('#FFFFFF', '#0B5CAD'))
  })
})

describe('oklch', () => {
  // Reference values from the shadcn/ui theme table in docs/DESIGN.md.
  it.each([
    ['#FFFFFF', 'oklch(1 0 0)'],
    ['#161A22', 'oklch(0.217 0.017 264.1)'],
    ['#0B5CAD', 'oklch(0.478 0.147 254.3)'],
    ['#4D5566', 'oklch(0.449 0.03 265.3)'],
    ['#B23A00', 'oklch(0.518 0.165 39.3)'],
    ['#00745A', 'oklch(0.497 0.098 170.2)'],
    ['#FFF3D6', 'oklch(0.966 0.04 88.2)'],
  ])('%s → %s', (hex, css) => {
    expect(toOklchCss(hex)).toBe(css)
  })

  it('gives greys hue 0 and keeps alpha', () => {
    expect(hexToOklch('#808080').h).toBe(0)
    expect(toOklchCss('#161A2240')).toBe('oklch(0.217 0.017 264.1 / 0.251)')
  })
})
