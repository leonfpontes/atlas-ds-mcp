import { describe, expect, it } from 'vitest'

import { CANONICAL_BEFORE, data } from './test/fixtures.js'
import {
  getComponent,
  listComponents,
  listTokens,
  runValidateScreen,
  searchUsage,
  ToolError,
} from './tools.js'

describe('list_components', () => {
  it('lists the 13 components in alphabetical order with their import line', () => {
    const { count, components } = listComponents(data)
    expect(count).toBe(13)
    expect(components.map((c) => c.name)).toEqual([
      'Alert',
      'Badge',
      'Button',
      'Card',
      'Command',
      'Dialog',
      'Input',
      'Select',
      'Sheet',
      'Sonner',
      'Table',
      'Tabs',
      'Tooltip',
    ])
    expect(components.find((c) => c.name === 'Badge')?.import).toBe(
      'import { Badge } from "@/components/ui/badge"',
    )
  })
})

describe('get_component', () => {
  it('returns props, variants, examples and the rules that apply', () => {
    const button = getComponent(data, 'button')
    expect(button.import).toBe('import { Button } from "@/components/ui/button"')
    expect(button.props).toHaveLength(4)
    expect(button.props.find((p) => p.name === 'variant')?.values).toHaveLength(6)
    expect(button.rules.map((r) => r.id)).toEqual(
      expect.arrayContaining(['color-tokens-only', 'one-primary-action', 'labels-say-what-happens']),
    )
    expect(button.examples.length).toBeGreaterThan(0)
  })

  it('finds a component by an alias or by one of its parts', () => {
    expect(getComponent(data, 'Toast').name).toBe('Sonner')
    expect(getComponent(data, 'Toast').extraImports).toEqual(['import { toast } from "sonner"'])
    expect(getComponent(data, 'TableRow').name).toBe('Table')
  })

  it('names the components when it does not know the one asked', () => {
    expect(() => getComponent(data, 'DataGrid')).toThrow(ToolError)
    expect(() => getComponent(data, 'DataGrid')).toThrow(
      'Atlas has no component "DataGrid". It has: Alert, Badge',
    )
  })
})

describe('list_tokens', () => {
  it('gives each color its variable, classes and light and dark values', () => {
    const primary = listTokens(data, { query: 'primary' }).tokens.find((t) => t.name === 'color.primary')
    expect(primary).toMatchObject({
      type: 'color',
      cssVariable: '--primary',
      classes: ['bg-primary', 'text-primary', 'border-primary'],
      light: '#0B5CAD',
      dark: '#6FA8F5',
    })
  })

  it('filters by type and formats non-color values with their variable', () => {
    const durations = listTokens(data, { type: 'duration' }).tokens
    expect(durations.map((t) => [t.name, t.cssVariable, t.light])).toEqual([
      ['duration.fast', '--dur-fast', '120ms'],
      ['duration.base', '--dur', '180ms'],
      ['duration.slow', '--dur-slow', '240ms'],
    ])
    const radius = listTokens(data, { type: 'dimension', query: 'radius.base' }).tokens[0]
    expect(radius).toMatchObject({ cssVariable: '--radius', light: '0.375rem' })
    const easing = listTokens(data, { type: 'cubicBezier' }).tokens[0]
    expect(easing?.light).toBe('cubic-bezier(0.2, 0.8, 0.2, 1)')
  })

  it('lists every token without a filter, and none for a query that matches nothing', () => {
    const all = listTokens(data)
    expect(all.count).toBe(all.tokens.length)
    expect(all.tokens.every((t) => t.light && t.dark)).toBe(true)
    expect(listTokens(data, { query: 'no-such-token' }).count).toBe(0)
  })
})

describe('search_usage', () => {
  it('puts the status rule first for a status question', () => {
    const { rules } = searchUsage(data, { query: 'status badge colors' })
    expect(rules[0]?.id).toBe('status-color-icon-text')
    expect(rules.length).toBeLessThanOrEqual(5)
  })

  it("finds component do and don't, and filters by component", () => {
    const { rules } = searchUsage(data, { query: 'delete refund', component: 'Dialog', limit: 3 })
    expect(rules.map((r) => r.id)).toContain('confirm-destructive')
    expect(rules.every((r) => r.components.length === 0 || r.components.includes('Dialog'))).toBe(true)
    expect(searchUsage(data, { query: 'placeholder label' }).rules.map((r) => r.id)).toContain(
      'visible-labels',
    )
  })

  it('returns no rules for unrelated words and rejects an unknown component', () => {
    expect(searchUsage(data, { query: 'zzz' })).toEqual({ count: 0, rules: [] })
    expect(() => searchUsage(data, { query: 'x', component: 'DataGrid' })).toThrow(ToolError)
  })
})

describe('validate_screen', () => {
  it('runs with the real tokens', () => {
    expect(runValidateScreen(data, CANONICAL_BEFORE).issueCount).toBe(4)
  })
})
