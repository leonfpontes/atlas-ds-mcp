# 0004 · The evaluation calls the Claude API with fetch, not the SDK

- **Date:** 2026-11-25 · **Status:** accepted

## Context

`pnpm eval` sends each case to Claude Haiku 5.5 through `POST /v1/messages`, with tools in the
MCP variants. The harness (story T1) shipped a small client on `fetch` (`evals/src/anthropic.ts`)
instead of `@anthropic-ai/sdk`, while the lockfile was still moving. With the lockfile stable, the
tech lead review had to decide whether it stays.

## Decision

It stays. The client covers what the harness uses: one endpoint, typed request and response,
retries on 408, 409, 429, 5xx and network errors with `retry-after` and jittered backoff,
no retry on 4xx that would fail again, a timeout per request, and the key only from
`ANTHROPIC_API_KEY`. Its behavior is tested with a fake `fetch`.

## Alternatives discarded

- `@anthropic-ai/sdk`: the reference client, with the same retries built in, but one more
  dependency tree for a private package that calls one endpoint. Readers of a public repo also
  see exactly what goes over the wire.

## Consequences

- Moving to the SDK becomes worth it when the harness needs streaming, the Batch API, or
  files; then this ADR is superseded.
- API changes (headers, new stop reasons) are ours to follow: `API_VERSION` is pinned in one place.
