// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { loadData } from '../../../mcp/src/data'
import { readyLine } from '../../../mcp/src/server'
import { listComponents } from '../../../mcp/src/tools'
import { COMPONENT_COUNT, COMPONENTS_SAMPLE, READY_LINE } from './atlas-facts'

const data = loadData(new URL('../../../packages/ui/atlas.manifest.json', import.meta.url))

describe('Atlas facts on the site', () => {
  it('print the same ready line as the server', () => {
    expect(READY_LINE).toBe(readyLine(data, 'stdio'))
  })

  it('count the components list_components returns', () => {
    const { count, components } = listComponents(data)
    expect(COMPONENT_COUNT).toBe(count)
    expect(COMPONENTS_SAMPLE).toBe(
      `${count} components: ${components
        .slice(0, 3)
        .map((c) => c.name)
        .join(', ')}…`,
    )
  })
})
