// Grades one screen: validate_screen from the Atlas server (the same tool the model can call)
// and the render test. A screen is valid when it has code, 0 issues and it rendered.

import { ISSUE_KINDS, type Grade, type IssueKind } from './contracts.js'
import type { McpSession } from './mcp-client.js'
import { renderScreen, type RenderResult } from './render.js'

interface ValidateOutput {
  issues: { line: number; rule: string; message: string }[]
}

export async function gradeScreen(
  code: string | undefined,
  grader: Pick<McpSession, 'callTool'>,
  render: (code: string) => Promise<RenderResult> = renderScreen,
): Promise<Grade> {
  if (!code) return { issues: [], rendered: false, renderError: 'no tsx code block', valid: false }

  const [validation, rendering] = await Promise.all([
    grader.callTool('validate_screen', { code }),
    render(code),
  ])
  let issues: Grade['issues'] = []
  if (!validation.isError) {
    const output = validation.structuredContent as ValidateOutput
    issues = output.issues.map((i) => {
      if (!(ISSUE_KINDS as readonly string[]).includes(i.rule))
        throw new Error(`validate_screen returned an unknown rule: ${i.rule}`)
      return { kind: i.rule as IssueKind, line: i.line, message: i.message }
    })
  }
  // A file validate_screen can't parse is not valid, even with no issues listed.
  const parsed = !validation.isError
  return {
    issues,
    rendered: rendering.rendered,
    ...(rendering.error ? { renderError: rendering.error } : {}),
    valid: parsed && issues.length === 0 && rendering.rendered,
  }
}
