# 0003 · validate_screen parses the file and owns four public rule ids

- **Date:** 2026-11-25 · **Status:** accepted

## Context

`validate_screen` grades every screen of the evaluation and is the step agents loop on until
0 issues, so a false positive costs a wrong score and a wasted round. The design proposed four
rule names on the "validate_screen rules" page. The components it checks come from a manifest
that the component story (F1) produces after this story.

## Decision

- Parse JSX and TSX with `@babel/parser` (no regular expressions over the file): order numbers
  like `#1042` in text are never colors, and a component the file defines is never "unknown".
- Rule ids, final: `hard-coded-color`, `unknown-component`, `invalid-prop`, `internal-import`
  (the names on the design page). The evaluation's `ISSUE_KINDS` follows them.
- `invalid-prop` checks only literal values of enum props listed in the manifest. Unknown prop
  names are not reported: Atlas components accept their element's HTML attributes.
- The manifest format is fixed now, with a provisional manifest of the 13 components; F1 keeps
  the file equal to the real components. The MCP build copies it into `mcp/data/`.

## Alternatives discarded

- The TypeScript compiler API: exact types, but a ~20 MB dependency for an `npx` package.
- Regular expressions: fast to write, wrong on real files (strings, comments, local components).
- Waiting for F1 before B2: the tools, the evaluation and the site all depend on this contract.

## Consequences

- `@babel/parser` is a runtime dependency of the server (about 2 MB, no transitive deps).
- A rule id rename breaks the evaluation and the docs: it needs a new ADR and a major version.
- If F1 changes a component, it updates the manifest in the same PR; the manifest tests fail otherwise.
