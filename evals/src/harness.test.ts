// The harness without the network: a fake Messages API and a fake MCP server.
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { ApiError, createClient, retryDelay, type MessageRequest, type MessageResponse } from './anthropic.js'
import type { EvalCase, ScreenResult } from './contracts.js'
import { extractCode } from './extract.js'
import { Budget, BudgetExceeded, generateScreen, instructionsFor, MAX_REQUESTS } from './generate.js'
import { gradeScreen } from './grade.js'
import type { McpSession } from './mcp-client.js'
import { requestCost } from './pricing.js'
import { loadPrompts } from './prompts.js'
import { stdDev, summarize, toMarkdown } from './scoreboard.js'

const prompts = loadPrompts(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../prompts'))
const aCase: EvalCase = {
  id: 'orders-table',
  prompt: "Build the orders page for Fernhill Market's admin.",
  expectedComponents: ['Table'],
}
const usage = { input_tokens: 1000, output_tokens: 500 }
const screen = '```tsx\nexport default function Page() {\n  return <div />\n}\n```'
const reply = (content: MessageResponse['content'], stop = 'end_turn'): MessageResponse => ({
  id: 'msg',
  content,
  stop_reason: stop,
  usage,
})

function fakeMcp(): McpSession & { calls: string[] } {
  const calls: string[] = []
  return {
    calls,
    serverVersion: '0.1.0',
    instructions: 'Ask this server instead of guessing.\n4. validate_screen with the whole file.',
    tools: [
      { name: 'list_components', description: 'All components', inputSchema: { type: 'object' } },
      { name: 'validate_screen', description: 'Checks a screen', inputSchema: { type: 'object' } },
    ],
    callTool: async (name) => {
      calls.push(name)
      return { content: [{ type: 'text', text: '{"count":13}' }] }
    },
    close: () => {},
  }
}

describe('pricing', () => {
  it('prices Claude Haiku 5.5 per million tokens, cache reads and writes included', () => {
    expect(requestCost({ input_tokens: 100_000, output_tokens: 0 })).toBeCloseTo(0.01, 6)
    expect(requestCost({ input_tokens: 0, output_tokens: 1_000_000 })).toBeCloseTo(0.5, 6)
    expect(
      requestCost({
        input_tokens: 0,
        output_tokens: 0,
        cache_creation_input_tokens: 50_000,
        cache_read_input_tokens: 50_000,
      }),
    ).toBeCloseTo(0.00675, 6)
  })

  it('uses the long-prompt prices past 100,000 prompt tokens', () => {
    expect(requestCost({ input_tokens: 200_000, output_tokens: 0 })).toBeCloseTo(0.1, 6)
  })
})

describe('the Messages client', () => {
  const request: MessageRequest = { model: 'm', max_tokens: 10, messages: [{ role: 'user', content: 'hi' }] }
  const ok = () => new Response(JSON.stringify(reply([{ type: 'text', text: 'hi' }])), { status: 200 })

  it('retries overloaded and rate-limited answers, then succeeds', async () => {
    const answers = [
      new Response('{"error":{"type":"overloaded_error"}}', { status: 529 }),
      new Response('', { status: 429, headers: { 'retry-after': '2' } }),
      ok(),
    ]
    const waits: number[] = []
    const send = createClient({
      apiKey: 'test',
      fetch: async () => answers.shift()!,
      sleep: async (ms) => void waits.push(ms),
    })
    expect((await send(request)).content).toEqual([{ type: 'text', text: 'hi' }])
    expect(waits).toHaveLength(2)
    expect(waits[1]).toBe(2000)
  })

  it('does not retry a bad request and says why', async () => {
    let calls = 0
    const send = createClient({
      apiKey: 'test',
      fetch: async () => {
        calls++
        return new Response('{"error":{"type":"invalid_request_error","message":"bad"}}', { status: 400 })
      },
      sleep: async () => {},
    })
    await expect(send(request)).rejects.toThrow('400 invalid_request_error: bad')
    expect(calls).toBe(1)
  })

  it('gives up after the retries with the last error', async () => {
    const send = createClient({
      apiKey: 'test',
      maxRetries: 2,
      fetch: async () => {
        throw new Error('socket hang up')
      },
      sleep: async () => {},
    })
    await expect(send(request)).rejects.toBeInstanceOf(ApiError)
  })

  it('backs off exponentially, capped', () => {
    expect(retryDelay(0, null)).toBeLessThanOrEqual(1000)
    expect(retryDelay(10, null)).toBeLessThanOrEqual(30_000)
    expect(retryDelay(0, '90')).toBe(30_000)
  })
})

describe('extractCode', () => {
  it('takes the last closed tsx block', () => {
    expect(extractCode('a\n```tsx\nconst a = 1\n```\nb\n```tsx\nconst b = 2\n```')).toBe('const b = 2\n')
  })
  it('treats a cut-off block or prose as no code', () => {
    expect(extractCode('```tsx\nconst a = 1')).toBeUndefined()
    expect(extractCode('Here is the screen.')).toBeUndefined()
  })
})

describe('generateScreen', () => {
  it('without the server: one request, no tools', async () => {
    const seen: MessageRequest[] = []
    const g = await generateScreen(aCase, 'without-mcp', {
      prompts,
      budget: new Budget(3),
      createMessage: async (r) => (seen.push(r), reply([{ type: 'text', text: screen }])),
    })
    expect(seen[0]?.tools).toBeUndefined()
    expect(seen[0]?.model).toBe('claude-haiku-5-5')
    expect(seen[0]?.system).toBe(prompts.system)
    expect(g).toMatchObject({ requests: 1, toolCalls: 0, inputTokens: 1000, outputTokens: 500 })
    expect(g.code).toContain('export default function Page')
  })

  it('with the server: runs the tool calls and sends every answer back', async () => {
    const mcp = fakeMcp()
    const seen: MessageRequest[] = []
    const answers = [
      reply(
        [
          { type: 'tool_use', id: 't1', name: 'list_components', input: {} },
          { type: 'tool_use', id: 't2', name: 'list_components', input: {} },
        ],
        'tool_use',
      ),
      reply([{ type: 'text', text: screen }]),
    ]
    const g = await generateScreen(aCase, 'with-mcp', {
      prompts,
      mcp,
      budget: new Budget(3),
      createMessage: async (r) => (seen.push(structuredClone(r)), answers.shift()!),
    })
    expect(seen[0]?.tools?.map((t) => t.name)).toEqual(['list_components', 'validate_screen'])
    expect(seen[0]?.system).toContain('Ask this server instead of guessing.')
    const toolAnswers = seen[1]?.messages.at(-1)?.content as { tool_use_id: string }[]
    expect(toolAnswers.map((a) => a.tool_use_id)).toEqual(['t1', 't2'])
    expect(g).toMatchObject({ requests: 2, toolCalls: 2 })
    expect(g.costUsd).toBeCloseTo(2 * requestCost(usage))
  })

  it('stops calling tools at the request limit', async () => {
    const seen: MessageRequest[] = []
    await generateScreen(aCase, 'with-mcp', {
      prompts,
      mcp: fakeMcp(),
      budget: new Budget(3),
      createMessage: async (r) => {
        seen.push(r)
        return r.tool_choice?.type === 'none'
          ? reply([{ type: 'text', text: screen }])
          : reply(
              [{ type: 'tool_use', id: `t${seen.length}`, name: 'list_components', input: {} }],
              'tool_use',
            )
      },
    })
    expect(seen).toHaveLength(MAX_REQUESTS)
    expect(seen.at(-1)?.tool_choice).toEqual({ type: 'none' })
  })

  it('lookups only: no validate_screen, and no instruction to call it', async () => {
    const seen: MessageRequest[] = []
    await generateScreen(aCase, 'docs-mcp', {
      prompts,
      mcp: fakeMcp(),
      budget: new Budget(3),
      createMessage: async (r) => (seen.push(r), reply([{ type: 'text', text: screen }])),
    })
    expect(seen[0]?.tools?.map((t) => t.name)).toEqual(['list_components'])
    expect(seen[0]?.system).toContain('Ask this server instead of guessing.')
    expect(seen[0]?.system).not.toContain('validate_screen')
    expect(instructionsFor('with-mcp', 'a\nvalidate_screen')).toBe('a\nvalidate_screen')
  })

  it('keeps the file sent to the first validate_screen call as the first draft', async () => {
    const answers = [
      reply(
        [{ type: 'tool_use', id: 't1', name: 'validate_screen', input: { code: 'draft 1' } }],
        'tool_use',
      ),
      reply(
        [{ type: 'tool_use', id: 't2', name: 'validate_screen', input: { code: 'draft 2' } }],
        'tool_use',
      ),
      reply([{ type: 'text', text: screen }]),
    ]
    const g = await generateScreen(aCase, 'with-mcp', {
      prompts,
      mcp: fakeMcp(),
      budget: new Budget(3),
      createMessage: async () => answers.shift()!,
    })
    expect(g).toMatchObject({ firstDraftCode: 'draft 1', selfChecks: 2, toolCalls: 2 })
  })

  it('stops before a request that could pass the budget', async () => {
    const budget = new Budget(0.005)
    budget.spent = 0.004
    let called = false
    await expect(
      generateScreen(aCase, 'without-mcp', {
        prompts,
        budget,
        createMessage: async () => ((called = true), reply([])),
      }),
    ).rejects.toBeInstanceOf(BudgetExceeded)
    expect(called).toBe(false)
  })
})

describe('gradeScreen', () => {
  const rendered = async () => ({ rendered: true })
  const grader = (issues: { line: number; rule: string; message: string }[], isError = false) => ({
    callTool: async () => ({ content: [], structuredContent: { issues }, isError }),
  })

  it('is valid with 0 issues and a render', async () => {
    expect(await gradeScreen('code', grader([]), rendered)).toMatchObject({ valid: true, issues: [] })
  })
  it('keeps the rule of each issue', async () => {
    const g = await gradeScreen(
      'code',
      grader([{ line: 3, rule: 'invalid-prop', message: 'green' }]),
      rendered,
    )
    expect(g).toMatchObject({ valid: false, issues: [{ kind: 'invalid-prop', line: 3 }] })
  })
  it('is not valid when the file does not parse or there is no code', async () => {
    expect((await gradeScreen('code', grader([], true), rendered)).valid).toBe(false)
    expect(await gradeScreen(undefined, grader([]), rendered)).toMatchObject({
      valid: false,
      rendered: false,
    })
  })
})

describe('scoreboard', () => {
  const result = (over: Partial<ScreenResult>): ScreenResult => ({
    caseId: 'a',
    variant: 'without-mcp',
    run: 1,
    hasCode: true,
    valid: false,
    issues: [],
    rendered: true,
    toolCalls: 0,
    selfChecks: 0,
    requests: 1,
    inputTokens: 1000,
    outputTokens: 500,
    costUsd: 0.001,
    ...over,
  })
  const meta = {
    model: 'claude-haiku-5-5',
    runAt: '2026-11-25T12:00:00.000Z',
    atlasVersion: '0.1.0',
    promptVersion: 'abc12345',
    cases: 2,
    runsPerCase: 2,
    renderMode: 'stand-ins' as const,
    budgetUsd: 3,
  }
  const draft = {
    valid: false,
    rendered: false,
    issues: [{ kind: 'unknown-component' as const, line: 1, message: '' }],
  }
  const board = summarize(
    [
      // run 1: 1 of 2 valid without; with-mcp valid, first draft not
      result({ caseId: 'b', issues: [{ kind: 'hard-coded-color', line: 1, message: '' }] }),
      result({ caseId: 'a', valid: true }),
      result({
        caseId: 'a',
        variant: 'with-mcp',
        valid: true,
        toolCalls: 4,
        selfChecks: 2,
        firstDraft: draft,
      }),
      result({ caseId: 'b', variant: 'with-mcp', error: '500', costUsd: 0.002 }),
      result({ caseId: 'a', variant: 'docs-mcp', toolCalls: 3 }),
      // run 2: 0 of 2 valid without
      result({ run: 2, caseId: 'a' }),
      result({ run: 2, caseId: 'b' }),
    ],
    meta,
    ['a', 'b'],
  )

  it('averages graded screens over every run and leaves API failures out', () => {
    expect(board.variants['without-mcp']).toMatchObject({
      screens: 4,
      failed: 0,
      runs: 2,
      validPercent: 25,
      renderedPercent: 100,
      issuesPerScreen: 0.25,
      tokensPerScreen: 1500,
      costUsd: 0.002,
      totalCostUsd: 0.004,
    })
    expect(board.variants['with-mcp']).toMatchObject({ screens: 1, failed: 1, validPercent: 100 })
    expect(board.variants['docs-mcp']).toMatchObject({ screens: 1, toolCallsPerScreen: 3 })
    expect(board.totalCostUsd).toBeCloseTo(0.009)
  })

  it('reports the spread between runs', () => {
    // run 1: 50%, run 2: 0% → sample standard deviation 35.4
    expect(board.variants['without-mcp'].stdDev.validPercent).toBe(35.4)
    expect(board.variants['docs-mcp'].stdDev.validPercent).toBe(0)
    expect(stdDev([1, 2, 3])).toBe(1)
  })

  it('grades the first draft of the full server separately', () => {
    expect(board.variants['with-mcp'].firstDraft).toMatchObject({ validPercent: 0, issuesPerScreen: 1 })
    expect(board.variants['with-mcp'].selfChecksPerScreen).toBe(2)
    expect(board.variants['without-mcp'].firstDraft).toBeUndefined()
  })

  it('orders results by run, case, then variant', () => {
    expect(board.results.map((r) => `${r.run}:${r.caseId}:${r.variant}`)).toEqual([
      '1:a:without-mcp',
      '1:a:docs-mcp',
      '1:a:with-mcp',
      '1:b:without-mcp',
      '1:b:with-mcp',
      '2:a:without-mcp',
      '2:b:without-mcp',
    ])
  })

  it('writes the Markdown table with the three variants, the first draft and the stand-in warning', () => {
    const md = toMarkdown(board)
    expect(md).toContain('`claude-haiku-5-5`')
    expect(md).toContain('| Valid screens | 25% ± 35.4% | 0% ± 0% | 0% ± 0% | 100% ± 0% |')
    expect(md).toContain('stand-ins built from the component manifest')
    expect(md).toContain('hard-coded-color 1')
    expect(md).toContain('API failures left out: 0 without, 0 lookups only, 1 full server')
  })
})

describe('prompts', () => {
  it('share the system prompt and add the server instructions only with the server', () => {
    expect(prompts.systemWithMcp('Use the tools.')).toContain(prompts.system)
    expect(prompts.systemWithMcp('Use the tools.')).toContain('Use the tools.')
    expect(prompts.system).not.toContain('MCP')
    expect(prompts.user('Build it')).toBe('Build it')
    expect(prompts.version).toMatch(/^[0-9a-f]{8}$/)
  })
})
