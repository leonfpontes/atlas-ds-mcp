// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { siteOrigin } from '../../vite.config'

describe('siteOrigin', () => {
  it('uses SITE_URL without a trailing slash', () => {
    expect(siteOrigin({ SITE_URL: 'https://atlas.example.dev/' })).toBe('https://atlas.example.dev')
  })

  it("falls back to Vercel's production domain", () => {
    expect(siteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: 'atlas.vercel.app' })).toBe('https://atlas.vercel.app')
  })

  it('stays relative locally and refuses a production deploy without an origin', () => {
    expect(siteOrigin({})).toBe('')
    expect(() => siteOrigin({ VERCEL_ENV: 'production' })).toThrow('Set SITE_URL')
  })
})
