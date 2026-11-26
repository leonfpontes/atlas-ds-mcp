# 0002 · Package names, layout and toolchain

- **Date:** 2026-11-25 · **Status:** accepted

## Context

The monorepo has five parts. Three are meant for npm (tokens, components, MCP server); two
only live in the repository (evaluation, site). Names show up in every import line the MCP
server teaches to agents, so they have to be short, stable and clearly one family.

## Decision

| Folder            | Package                                                    | Published      |
| ----------------- | ---------------------------------------------------------- | -------------- |
| `packages/tokens` | `@leonfpontes/atlas-tokens`                                | yes            |
| `packages/ui`     | `@leonfpontes/atlas-ui`                                    | yes            |
| `mcp`             | `@leonfpontes/design-system-mcp` (bin `design-system-mcp`) | yes            |
| `evals`           | `atlas-evals`                                              | no (`private`) |
| `site`            | `atlas-site`                                               | no (`private`) |

- A personal scope (`@leonfpontes/`) instead of an `@atlas/` scope, which belongs to someone else
  on npm. The design system prefix `atlas-` keeps the family visible; the server keeps the name
  of the repository, which is what people search for.
- `mcp`, `evals` and `site` sit at the root, not under `packages/`, because they are the three
  things a reader of the README opens.
- Libraries build with plain `tsc` (ESM, `NodeNext`, `.d.ts`); the site builds with Vite.
- **TypeScript 6.0**, not 7.0: `typescript-eslint` 8 supports up to `<6.1`. Move when it supports 7.
- **Node 22** for development (Vitest 5 needs 22.12+); the published MCP server runs on Node 20.19+.

## Alternatives discarded

- `@atlas/*`: the scope is not ours.
- Unscoped `atlas-*` names: short, but taken or close to taken, and easy to typosquat.
- tsup for library builds: one more tool; `tsc` alone already emits ESM and types.

## Consequences

- Publishing needs the `@leonfpontes` npm scope (the owner's npm user) at release time. ⚠️ Not checked yet.
- Imports in the docs and in the MCP answers use these names; a rename means a new major version.
