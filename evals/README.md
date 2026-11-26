# Atlas evaluation

Does the MCP server make a coding model write screens that follow the design system, and is
the gain from the documentation or from the model checking its own screen? The same model gets
the same 20 requests in three variants, three times each.

| Variant       | Tools                                                                               |
| ------------- | ----------------------------------------------------------------------------------- |
| `without-mcp` | None: the model alone                                                               |
| `docs-mcp`    | The four lookups: `list_components`, `get_component`, `list_tokens`, `search_usage` |
| `with-mcp`    | All five: the lookups plus `validate_screen`, the same check that grades the screen |

For `with-mcp` the scoreboard also grades the **first draft**: the file the model sent to its
first `validate_screen` call, before any self-check (its final file when it never called it).
Lookups only vs first draft vs final separates what the docs give from what the self-check adds.

```bash
ANTHROPIC_API_KEY=… pnpm eval                  # 20 cases × 3 variants × 3 runs, up to $3 in total
pnpm eval --runs 1 --limit 2 --budget 0.2      # a quick check
pnpm eval --cases orders-table,checkout-error
```

## Method

| Step    | What happens                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cases   | [`cases.json`](cases.json): 20 screens of a fictitious grocery store. No personal or client data reaches the model.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Model   | `claude-haiku-5-5`, effort `medium`, up to 16,000 output tokens per request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Prompts | [`prompts/`](prompts): the same system prompt and request for every variant. With the server the model also gets the server's instructions (for `docs-mcp`, without the line about `validate_screen`) and the variant's tools, the way an MCP client passes them on, with up to 12 requests per screen (the last one can't call tools). The prompt hash is the `promptVersion` in the scoreboard.                                                                                                                                                                                                         |
| Server  | The built server (`mcp/dist/cli.js`) over stdio, as Claude Code runs it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Issues  | `validate_screen` from the same server, on the final file: `hard-coded-color`, `unknown-component`, `invalid-prop`, `internal-import`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Render  | The file is compiled with TypeScript and rendered with `react-dom/server` in a separate Node process under the permission model (reads the repository only, no writes), with a 20 s limit. Atlas imports resolve to the real components built in `packages/ui/dist`, with the real `lucide-react` and `sonner` (`renderMode: "components"`), so a missing file, an undefined component, an icon that doesn't exist or a component used outside its provider fails. `--render stand-ins` swaps in one stand-in per manifest export, as the runs before the components existed did. It doesn't check looks. |
| Valid   | A tsx code block, 0 issues and the render passed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Runs    | `--runs` (default 3). Numbers are the mean over every screen of every run, ± the sample standard deviation between runs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Cost    | From each response's `usage` at the [published prices](https://platform.claude.com/docs/en/about-claude/pricing) (checked 2026-11-25). Before every request the command checks that the worst case still fits the `--budget` (default $3, for the whole command) and stops if not, writing what it has with `stoppedEarly`. Rate limits and overloads are retried up to 4 times.                                                                                                                                                                                                                          |

Outputs: [`results/latest.json`](results/latest.json) (read by the site), [`results/latest.md`](results/latest.md)
and each generated file in `results/screens/<variant>/<case>.run<n>.tsx` (first drafts as
`.draft.tsx`), kept as the model wrote it.

## Limits

- Three runs of 20 cases per variant: read the ± before comparing two numbers.
- The render is server-side: it catches what breaks a render, not what breaks on click or in the browser.
- A file that `validate_screen` can't parse counts as not valid with 0 issues.
- The final score of `with-mcp` uses the same check the model can call; the first draft and
  `docs-mcp` are the numbers that don't.
