# @leonfpontes/design-system-mcp

An MCP server that gives coding agents (Claude Code, Claude Desktop, Cursor) the tokens,
components and usage rules of the Atlas design system, and checks the screens they write.

```bash
claude mcp add atlas -- npx -y @leonfpontes/design-system-mcp
npx -y @leonfpontes/design-system-mcp --check   # Atlas MCP ready · … · 5 tools · 22 components
```

Five read-only tools: `list_components`, `get_component`, `list_tokens`, `search_usage` and
`validate_screen` (hard-coded colors, unknown components, invalid props and internal imports, each
with a line, a rule id and a fix). stdio by default; `--http` serves `http://127.0.0.1:8000/mcp`.

Node 20.19 or newer. API: [docs/API.md](https://github.com/leonfpontes/atlas-ds-mcp/blob/main/docs/API.md).
Project, evaluation and design: [github.com/leonfpontes/atlas-ds-mcp](https://github.com/leonfpontes/atlas-ds-mcp). MIT.
