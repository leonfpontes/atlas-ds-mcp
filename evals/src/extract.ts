// Pulls the screen out of the model's answer: the last closed tsx/jsx/ts/js code block.
// An unclosed block means the answer was cut off, so it counts as no code.

const FENCE = /```(?:tsx|jsx|typescript|ts|javascript|js|react)?[^\n]*\n([\s\S]*?)\n```/g

export function extractCode(text: string): string | undefined {
  let last: string | undefined
  for (const match of text.matchAll(FENCE)) last = match[1]
  const code = last?.trim()
  return code ? `${code}\n` : undefined
}
