# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions: [SemVer](https://semver.org/).

## [Unreleased]

### Added

- Public repository: [github.com/leonfpontes/atlas-ds-mcp](https://github.com/leonfpontes/atlas-ds-mcp); the site and the read-only MCP endpoint run on Vercel.
- Repository skeleton: README, agent rules, CI, secret scanning, Dependabot and ADR 0001.
- pnpm monorepo with `@leonfpontes/atlas-tokens`, `@leonfpontes/atlas-ui`, `@leonfpontes/design-system-mcp`, `atlas-evals` and `atlas-site` (ADR 0002).
- MCP server with five read-only tools (`list_components`, `get_component`, `list_tokens`, `search_usage`, `validate_screen`) over stdio and HTTP, and the component manifest contract (docs/API.md, ADR 0003).
- Atlas tokens in `tokens.json` (DTCG, light and dark) with a build that writes the shadcn/ui theme (`tokens.css`) and the Tailwind v4 theme (`theme.css`), checked for AA contrast in both themes.
- The 13 shadcn/ui components with the Atlas theme in `@leonfpontes/atlas-ui` (40 px controls, 44 px on touch; `success`, `warning` and `info` on Alert and Badge), with component and axe tests, the manifest kept equal to the exports, and the Storybook (`pnpm storybook`): Atlas manager theme, Welcome, Foundations, Components, Patterns and MCP pages.
- The How it works site (`site/`): hero with the canonical diff, the five tools, the request flow, the scoreboard read from `evals/results/latest.json` (empty and error states included), before and after, quickstart for Claude Code, Claude Desktop and Cursor, a 404 page that searches the docs, favicons, and the OG and social preview images made by `pnpm --filter atlas-site share-images`. The build ships the Storybook under `/storybook/`.
- README with the light and dark cover, the demo GIF, a 1-minute captioned video (`docs/media/`, recorded by `pnpm --filter atlas-site record-demo`) and the scoreboard block written from `evals/results/latest.json` by `pnpm readme` (a test fails when it is out of date).
- 20 evaluation cases for a fictitious grocery store in `evals/cases.json`.
- `pnpm eval`: Claude Haiku 5.5 builds each case without the MCP server, with its four lookup tools and with all five, three runs each, graded by `validate_screen` and a sandboxed render test with the real Atlas components (first draft of the full server graded too), with a $3 limit per command; writes `evals/results/latest.json` and `latest.md`.
- QA suite: `tests/mcp-built.test.ts` runs the built server over stdio and HTTP (same five tools, the four `validate_screen` rules, read-only HTTP, 256 KB limit with and without chunks, `--check`, `--version`, a taken port), and Playwright tests in `e2e/` cover the site, the 404 and the Storybook at 375, 1024 and 1440 px in light and dark, the keyboard, the scoreboard against `latest.json` and the social cards against `share.html`. `pnpm qa` runs everything.

### Fixed

- QA round 1 (front end): the OG image, the social preview and the demo video show the final scoreboard, and a test fails when the video is older than `latest.json`; the site builds and its tests run without `latest.json`; the docs Theme button keeps the keyboard focus; tab panels show the focus ring; the quickstart shows what `claude mcp list` prints and asks for Node 20.19.
- MCP server: invalid arguments come back as one short message with the path, never echoing the value (a 100,001-character file used to come back three times).
- MCP over HTTP checks `Origin`: local pages and allowed origins only, as the MCP spec asks (ADR 0005).
- One version, 0.1.0, in every package and in `--version`; each published package has a README and no test files.
- `docs/DESIGN.md`, `AGENTS.md` and `docs/ARCHITECTURE.md` no longer name the private team or depend on the design prototype folder.
- The Tooltip example in the component manifest wraps the tooltip in `TooltipProvider` (it threw without it), and a test renders every manifest example with the real components.
- `@leonfpontes/atlas-ui` declares what `styles.css` imports (`@leonfpontes/atlas-tokens`, `tw-animate-css`, and `tailwindcss` as a peer), so it installs outside this repository.
- Social cards: the site build takes the origin from `SITE_URL` or Vercel's production domain, and a production deploy without one fails.
