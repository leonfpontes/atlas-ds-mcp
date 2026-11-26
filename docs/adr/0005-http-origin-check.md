# 0005 · The HTTP transport checks Origin

- **Date:** 2026-11-26 · **Status:** accepted

## Context

The MCP spec (Streamable HTTP, 2025-06-18) says servers must validate the `Origin` header, so a
web page on another site can't talk to a server on `localhost` through DNS rebinding. Atlas only
reads and `--http` listens on 127.0.0.1, so the risk is small, but the server is a reference
for how to build one.

## Decision

- A request **without** `Origin` is served: that is how Claude Code, Cursor and other non-browser
  clients call it.
- A request **with** `Origin` is served only from a local page (`localhost`, `127.0.0.1`, `[::1]`,
  any port) or from an allowed origin, compared exactly. Anything else gets `403`.
- Allowed origins come from `ATLAS_ALLOWED_ORIGINS` (comma-separated), `SITE_URL` and, on Vercel,
  the production domain. The same rule applies locally and on the public endpoint.

## Alternatives discarded

- Checking only in the local server (`--http`): the public endpoint would answer any site's
  browser JavaScript, which nothing needs today.
- Allowing every origin on the public endpoint (CORS `*`): no feature uses it, and it is easy to
  open later with `ATLAS_ALLOWED_ORIGINS`.

## Consequences

- A browser-based MCP client on another domain needs its origin in `ATLAS_ALLOWED_ORIGINS`.
- Tests cover a foreign origin, local pages, an exact match and look-alike hosts.
