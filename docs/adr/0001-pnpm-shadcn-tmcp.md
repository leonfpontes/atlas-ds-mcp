# 0001 · pnpm workspaces, shadcn/ui and tmcp

- **Date:** 2026-11-25 · **Status:** accepted

## Context

Atlas ships several parts that version together: tokens, React components, an MCP server,
an evaluation harness and a demo site. The owner decided that components come from shadcn/ui
themed by Atlas tokens, not drawn from scratch. The MCP server has to run locally over stdio
and publicly over HTTP on a serverless function, with tool input validated by a schema.

## Decision

- **pnpm workspaces** for the monorepo, one lockfile, strict dependency resolution.
- **shadcn/ui** (Radix primitives + Tailwind) as the component base; Atlas adds a theme
  (CSS variables) and only the variants shadcn lacks (`success`, `warning`, `info`).
- **tmcp** for the MCP server, with the Valibot schema adapter and the stdio and HTTP transports.

## Alternatives discarded

- npm or Yarn workspaces: npm hoists loosely and lets packages use undeclared dependencies;
  Yarn adds a second tool for no gain.
- Own components: more code to keep accessible, and the owner chose shadcn/ui.
- `@modelcontextprotocol/sdk`: works, but its HTTP transport is built on Node streams;
  tmcp answers a Fetch `Request` directly, which is what a serverless function receives, and
  the same server object serves stdio.

## Consequences

- Contributors need Corepack or pnpm installed.
- Component updates follow shadcn's copy-in model: the code lives in `packages/ui` and we own it.
- tmcp is younger than the official SDK: versions are pinned and the server is tested
  through real JSON-RPC calls, without Storybook running.
