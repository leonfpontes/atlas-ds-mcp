// One screen, one variant: asks the model, runs its MCP tool calls (with the server) until it
// returns the file, and keeps the token count and cost of every request.

import type { CreateMessage, MessageParam, MessageRequest, Tool, ToolResultBlock } from './anthropic.js'
import type { EvalCase, Variant } from './contracts.js'
import { extractCode } from './extract.js'
import { resultText, type McpSession } from './mcp-client.js'
import { MODEL, promptTokens, requestCost, worstCaseCost } from './pricing.js'
import type { Prompts } from './prompts.js'

export const MAX_OUTPUT_TOKENS = 16_000
/** Model requests per screen with the server; the last one cannot call tools. */
export const MAX_REQUESTS = 12

export class BudgetExceeded extends Error {
  constructor(spent: number, limit: number) {
    super(`stopped at $${spent.toFixed(4)}: the next request could pass the $${limit.toFixed(2)} limit`)
    this.name = 'BudgetExceeded'
  }
}

/** Shared by every screen of a run. Checked before each request with its worst case. */
export class Budget {
  spent = 0
  constructor(readonly limitUsd: number) {}

  reserve(nextPromptTokens: number): void {
    if (this.spent + worstCaseCost(nextPromptTokens, MAX_OUTPUT_TOKENS) > this.limitUsd)
      throw new BudgetExceeded(this.spent, this.limitUsd)
  }
}

export interface Generation {
  code?: string
  /** with-mcp: the file sent to the first validate_screen call, before any self-check. */
  firstDraftCode?: string
  toolCalls: number
  selfChecks: number
  requests: number
  inputTokens: number
  outputTokens: number
  costUsd: number
  stopReason?: string
}

export interface GenerateDeps {
  createMessage: CreateMessage
  prompts: Prompts
  budget: Budget
  /** The Atlas server; required for the MCP variants. */
  mcp?: McpSession
}

export const SELF_CHECK_TOOL = 'validate_screen'

/** The tools a variant offers: none, the four lookups, or all five. */
export function toolsFor(variant: Variant, mcp: McpSession | undefined): Tool[] {
  if (variant === 'without-mcp' || !mcp) return []
  return mcp.tools
    .filter((t) => variant === 'with-mcp' || t.name !== SELF_CHECK_TOOL)
    .map((t) => ({ name: t.name, description: t.description, input_schema: t.inputSchema }))
}

/** The server instructions, minus the lines about validate_screen when the variant doesn't offer it. */
export function instructionsFor(variant: Variant, instructions: string): string {
  if (variant !== 'docs-mcp') return instructions
  return instructions
    .split('\n')
    .filter((line) => !line.includes(SELF_CHECK_TOOL))
    .join('\n')
}

/** Rough prompt size before the first answer: 4 characters per token, plus room for tools. */
const estimateTokens = (text: string) => Math.ceil(text.length / 4) + 4_000

export async function generateScreen(c: EvalCase, variant: Variant, deps: GenerateDeps): Promise<Generation> {
  const { createMessage, prompts, budget, mcp } = deps
  if (variant !== 'without-mcp' && !mcp) throw new Error(`the ${variant} variant needs the MCP server`)

  const tools = toolsFor(variant, mcp)
  const system =
    variant === 'without-mcp'
      ? prompts.system
      : prompts.systemWithMcp(instructionsFor(variant, mcp?.instructions ?? ''))
  const messages: MessageParam[] = [{ role: 'user', content: prompts.user(c.prompt) }]
  const result: Generation = {
    toolCalls: 0,
    selfChecks: 0,
    requests: 0,
    inputTokens: 0,
    outputTokens: 0,
    costUsd: 0,
  }
  let lastPrompt = estimateTokens(system + c.prompt)

  while (result.requests < MAX_REQUESTS) {
    const last = result.requests === MAX_REQUESTS - 1
    const request: MessageRequest = {
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      system,
      messages,
      output_config: { effort: 'medium' },
      cache_control: { type: 'ephemeral' },
      ...(tools.length ? { tools, tool_choice: { type: last ? 'none' : 'auto' } } : {}),
    }
    budget.reserve(lastPrompt)
    const response = await createMessage(request)
    const cost = requestCost(response.usage)
    budget.spent += cost
    result.requests++
    result.costUsd += cost
    result.inputTokens += promptTokens(response.usage)
    result.outputTokens += response.usage.output_tokens
    result.stopReason = response.stop_reason
    lastPrompt = promptTokens(response.usage) + response.usage.output_tokens

    const toolUses = response.content.filter(
      (b): b is { type: 'tool_use'; id: string; name: string; input: unknown } => b.type === 'tool_use',
    )
    if (response.stop_reason !== 'tool_use' || toolUses.length === 0 || !mcp) {
      const text = response.content
        .filter((b): b is { type: 'text'; text: string } => b.type === 'text')
        .map((b) => b.text)
        .join('\n')
      result.code = extractCode(text)
      return result
    }

    // Every tool answer goes back in one user message, in the order the model asked.
    messages.push({ role: 'assistant', content: response.content })
    const answers: ToolResultBlock[] = await Promise.all(
      toolUses.map(async (use) => {
        result.toolCalls++
        if (use.name === SELF_CHECK_TOOL) {
          result.selfChecks++
          const code = (use.input as { code?: unknown } | null)?.code
          if (result.firstDraftCode === undefined && typeof code === 'string') result.firstDraftCode = code
        }
        try {
          const answer = await mcp.callTool(use.name, use.input)
          return {
            type: 'tool_result' as const,
            tool_use_id: use.id,
            content: resultText(answer) || '(empty)',
            ...(answer.isError ? { is_error: true } : {}),
          }
        } catch (error) {
          return {
            type: 'tool_result' as const,
            tool_use_id: use.id,
            content: (error as Error).message,
            is_error: true,
          }
        }
      }),
    )
    messages.push({ role: 'user', content: answers })
    lastPrompt += estimateTokens(answers.map((a) => a.content).join(''))
  }
  return result
}
