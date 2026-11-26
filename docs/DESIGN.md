# Atlas · design direction

Atlas is a neutral design system built **on top of shadcn/ui** (Radix primitives + Tailwind). Atlas does not redraw components: it ships a theme (shadcn CSS variables), a few token extensions (success, warning, info) and usage rules that the MCP server teaches to coding agents.

The goal of the look is simple: it must not look like something an AI agent generated. Type, grid and real content do the work; effects don't.

## Style

**Primary: Minimalism. Secondary: Flat. Dark Mode is a theme, not a style.** No third style.

Why, for this audience: recruiters and hiring managers scan the README and the page in two minutes, and developers want to copy a command. Both need hierarchy from type and grid, and the real artifact (code, diff, table) as the main image. Minimalism gives the space and the type scale; Flat removes depth so the content carries the page; Dark Mode matters because developers read docs in dark editors and GitHub serves the cover in both themes.

| Style | What comes in | What stays out |
|---|---|---|
| Minimalism | One type family (Plex) with 2–3 weights, one accent color, a rigid 12-column grid, hierarchy by size and weight, a lot of white space | The empty generic hero: a big centered sentence with no proof. Every first fold shows code, a diff or a number. |
| Flat | No shadows on surfaces, 1 px neutral borders, solid fills, 2 px line icons (lucide), radius ≤ 8.4 px | Weak affordance: buttons always filled or outlined, links underlined, focus ring always visible. |
| Dark Mode (theme) | `.dark` tokens: #11151C background, surfaces one step lighter, desaturated accents, every pair AA; follows `prefers-color-scheme` with a manual toggle | Pure black and pure white; saturated colors that vibrate. |

**Not used:** Bento (the tools section is a table, there is no feature grid; it would only come in if a future feature section needs blocks of different sizes and real content), Glass and Liquid Glass (no floating layer over variable media; if one appears, glass only on that layer, with an opaque fallback and `prefers-reduced-transparency`), Aurora (rule of the team: never in a product for developers or recruiters), Material, Neobrutalism, Claymorphism.

**Tokens that define the style:** `--radius` 0.375rem; shadow none on surfaces, `--shadow-overlay` only on Dialog, Sheet, Popover and Toast; border 1 px `--border`; type scale 13 · 14 · 16 · 17 · 20 · 28 · 36 · 44; space on a 4 px base. Shown in Storybook under Foundations → Style.

## References

Opened on **2026-11-25** in a Chromium browser (viewport 1710 px wide, dark color scheme, so sites with a theme switch rendered dark). Values were measured on the page with `getComputedStyle` and `getBoundingClientRect`, not taken from memory. We copy the principle, never the brand. Screenshots stay outside the repo.

| # | Reference (link) | Seen on the page | What Atlas takes | What Atlas leaves |
|---|---|---|---|---|
| 1 | [Linear](https://linear.app) | Header 73 px; nav links 13 px Inter Variable; h1 64 px, weight 510, letter-spacing −1.4 px, left-aligned at x 206; body 15 px / 24 px, −0.17 px; the first fold below the headline is the real product UI (issue board, code diff, review list), not an illustration; numbered figure captions ("Fig 0.1"). | Left-aligned headline with tight negative tracking; the product artifact (for us, the diff) as the hero image. | Near-black page (#08090A) as the only theme; 64 px headline (too loud for a docs-led page). |
| 2 | [Vercel Docs](https://vercel.com/docs) | Header 64 px; sidebar 300 px, items 14 px / 36 px tall; h1 56 px Geist, weight 600, −3.36 px; h2 24 px; body 16 px / 27 px; hero split with a terminal block (Geist Mono 16 px, bottom radius 8 px) and tabs per use case. | Terminal with the real commands beside the claim; 36 px sidebar rows; −0.02 to −0.03 em tracking on large type. | The grid of three icon cards under the hero. |
| 3 | [Stripe Docs](https://docs.stripe.com/payments/accept-a-payment) | Three columns: sidebar with 14 px / 20 px links (active link weight 700 in the accent color), content 829 px wide, "On this page" at x 1494 with 14 px links; h1 32 px weight 700; h2 24 px weight 400; body 16 px / 26 px; code in Menlo 13 px; tabs for variants of the same task. | Three columns; content column ≈ 760–830 px; active item by weight + color, not a fill. | Link-heavy paragraphs. |
| 4 | [Radix Primitives](https://www.radix-ui.com/primitives/docs/components/dialog) | Sidebar items 16 px, 36 px tall, active item a 999 px pill with a blue tint; h1 35 px weight 500; lead 18 px / 26 px; 18 "Quick nav" links on the right (14 px); demo + code; Features as a checklist; meta (version, size, source, report an issue). | Page anatomy: one-line description, demo + code, Features checklist, meta column, API reference. | The pill-shaped active item and the purple gradient behind the demo. |
| 5 | [shadcn/ui · Button](https://ui.shadcn.com/docs/components/button) and [Themes](https://ui.shadcn.com/themes) | Header 64 px; sidebar items 13 px, 30 px tall, radius 8 px; h1 30 px Geist weight 600, −0.75 px; body 15 px / 26 px; "On this page" 13 px; Preview / Code; install with package-manager tabs; "Copy Page" button 13 px / 28 px. The Themes link now opens the "New Project" builder (page title "New Project - shadcn/ui"); the theming rules we follow are on the [theming page](https://ui.shadcn.com/docs/theming). | Atlas's base: Preview / Code, install tabs, Copy page, prev / next; theme only by variables. | The default Geist + neutral theme as-is (every shadcn site looks the same). |
| 6 | [Tailwind CSS Docs](https://tailwindcss.com/docs/installation) | Sidebar links 14 px / 24 px, active link weight 600; h1 30 px Inter weight 500, −0.75 px; body 16 px / 28 px; eyebrow label above the title; numbered steps with the code panel on the right. | Numbered steps with code beside them; eyebrow above the title. | Hatched page margins. |
| 7 | [Resend](https://resend.com) | h1 96 px "domaine" serif, weight 400, −0.96 px; body 18 px / 27 px in a muted grey; one primary and one text link as actions; a 3D cube as the hero image. | Restraint: one strong headline, muted body, a docs link as the secondary action. | The 3D object and the glow. |
| 8 | [Raycast](https://www.raycast.com) | Centered hero, h1 64 px Inter weight 600; primary button 36 px, radius 8 px, light grey fill; install line under the button ("Install via Homebrew"); light streaks behind the headline. | Install line under the main action; keyboard hints in mono. | Centered hero, streaks and glow. |
| 9 | [Primer React Storybook](https://primer.style/react/storybook/) (public Storybook) | Brand shows the package and version ("@primer/react@38.47.0"); search "Find components ⌘K" with a filter button; one uppercase group label with letter-spacing; sidebar 300 px, items 14 px / 28 px, **the same folder icon on every item**; toolbar with outline tool, theme switch and full screen. | Version next to the brand, ⌘K search, theme switch in the toolbar. | The repeated icon on every item (Atlas items have none) and uppercase group labels. |

## Avoid list (anti "AI slop")

A screen fails review if it has any of these:

1. Purple-to-blue gradients, gradient text, blobs, glow, noise.
2. Grids of identical cards with an icon in a rounded square.
3. Decorative emoji, ✨, "magic" wording.
4. A generic hero: one huge centered sentence with two centered buttons.
5. Floating 3D mockups, tilted screenshots, heavy or colored shadows.
6. Generic illustrations (people, rockets, abstract shapes).
7. Too many pills and too much rounding. Atlas radius tops out at 10 px; pills are not used.
8. Vague claims ("supercharge", "seamless", "next-gen"). Every claim shows the artifact: code, diff, table, number.
9. Made-up numbers. Unmeasured numbers wear the "Example data" marker.
10. Color as the only signal. Status = color + icon shape + text.

## Foundations

**Type.** IBM Plex Sans for the interface and IBM Plex Mono for code and token names (both SIL Open Font License). Plex has an engineered, technical voice and avoids the Inter/Geist look that most generated sites share. Scale: 12 · 13 · 14 · 16 · 17 · 20 · 28 · 36 · 44. Section titles are always 28 px (24 px on phones). Body 16/1.6 on marketing pages, 14/1.5 in dense UI. Headlines weight 600, letter-spacing −0.02em from 32 px up.

**Grid.** 12 columns, 1200 px content, 24 px gutters; docs use 248 px sidebar · content up to 720 px · 200 px "On this page". Mobile: 16 px margins, one column.

**Radius.** `--radius: 0.375rem` (6 px). The shadcn scale derives from it: sm 3.6 · md 4.8 · lg 6 · xl 8.4 px.

**Elevation.** Borders, not shadows. Only overlays (Dialog, Sheet, Popover, Toast) get a shadow.

**Targets.** Controls are 40 px tall with a mouse and 44 px on touch (`@media (pointer: coarse)`). This is the one change to shadcn's sizes: `default` is `h-10` (`h-11` on coarse pointers), `icon` is `size-10` (`size-11`). Storybook sidebar items: 36 px with a mouse, 44 px on touch.

**Focus.** shadcn's ring, `ring-[3px]` in `--ring` at 50%, plus the border in `--ring`.

## shadcn/ui theme

Hex is the source; oklch is what goes into `globals.css`. Contrast ratios are text on its usual background.

| shadcn variable | Light | oklch | Dark | Note |
|---|---|---|---|---|
| `--background` | #FFFFFF | oklch(1 0 0) | #11151C | |
| `--foreground` | #161A22 | oklch(0.217 0.017 264.1) | #E8EBF1 | 17.4 : 1 |
| `--card` / `--popover` | #FFFFFF | oklch(1 0 0) | #1A1F29 | |
| `--primary` | #0B5CAD | oklch(0.478 0.147 254.3) | #6FA8F5 | 6.7 : 1 |
| `--primary-foreground` | #FFFFFF | oklch(1 0 0) | #11151C | |
| `--secondary` | #EDEFF3 | oklch(0.952 0.006 264.5) | #232937 | |
| `--muted` | #F6F7F9 | oklch(0.976 0.003 264.5) | #1A1F29 | |
| `--muted-foreground` | #4D5566 | oklch(0.449 0.030 265.3) | #9AA3B5 | 7.5 : 1 |
| `--accent` | #EDEFF3 | oklch(0.952 0.006 264.5) | #232937 | hover fill |
| `--destructive` | #B23A00 | oklch(0.518 0.165 39.3) | #FF8A5C | vermilion, 6.0 : 1 |
| `--border` | #DCE0E7 | oklch(0.906 0.010 261.8) | #2E3542 | dividers |
| `--input` | #8A93A6 | oklch(0.662 0.030 265.3) | #6B7385 | 3.1 : 1 (non-text) |
| `--ring` | #0B5CAD | oklch(0.478 0.147 254.3) | #6FA8F5 | |
| `--sidebar` | #F6F7F9 | oklch(0.976 0.003 264.5) | #1A1F29 | |
| `--sidebar-accent` | #E7F0FB | oklch(0.952 0.018 253.3) | #1F3A60 · oklch(0.347 0.075 257.2) | selected item; dark changed in round 3 so the active item stands out (1.44 : 1 against `--sidebar`, plus a 3 px `--primary` bar) |
| `--sidebar-accent-foreground` | #0B5CAD | oklch(0.478 0.147 254.3) | #E8EBF1 · oklch(0.940 0.009 264.5) | light 5.8 : 1, dark 9.6 : 1 |
| `--chart-1…5` | #0B5CAD · #00745A · #E69F00 · #B23A00 · #636B7D | | #6FA8F5 · #4CC9A0 · #F5B642 · #FF8A5C · #9AA3B5 | blue, bluish green, amber, vermilion, grey. Dark reuses the dark status hues on purpose: all ≥ 6.5 : 1 on `--card` #1A1F29, and the same order keeps a series the same hue in both themes |

**Atlas extensions** (added the way the shadcn theming page describes: under `:root` and `.dark`, then exposed in `@theme inline`):

| Variable | Light | oklch | Dark |
|---|---|---|---|
| `--success` | #00745A | oklch(0.497 0.098 170.2) | #4CC9A0 |
| `--success-subtle` | #E3F5EF | oklch(0.955 0.021 173.9) | #12302A |
| `--warning` | #8C5A00 | oklch(0.510 0.109 72.1) | #F5B642 |
| `--warning-subtle` | #FFF3D6 | oklch(0.966 0.040 88.2) | #33280F |
| `--info` | = `--primary` | | |
| `--info-subtle` | #E7F0FB | oklch(0.952 0.018 253.3) | #1B2A40 |
| `--destructive-subtle` | #FDEBE3 | oklch(0.952 0.022 45.6) | #3A1E14 |
| `--text-subtle` | #636B7D | oklch(0.527 0.030 266.4) | #9AA3B5 |

The four status hues (blue, bluish green, amber, vermilion) follow the Okabe–Ito idea: they stay apart for the common color-vision differences. Each status also has its own icon shape: circle "i", circle with check, triangle "!", octagon "×".

## Code and labels

- **Code blocks:** IBM Plex Mono 13 px / 1.7, everywhere (hero diff, tools, quickstart, Storybook). **Inline code:** 0.875 em of the surrounding text.
- **Mono is for code and commands only.** Section labels, meta lines, scales and state names use Plex Sans 13 px, weight 500–600. Mono everywhere reads as a "techy" template.
- **Every code sample is valid code** in the order of a real file: imports at the top, one shadcn file per component (`@/components/ui/badge`, `@/components/ui/card`), never comments inside JSX. Issue markers live in the gutter, next to the line number.
- **The canonical diff** (same lines and numbers on the site, the README cover, the social preview and the OG image): line 3 internal import → `@/components/ui/table`; line 7 `background: "#7c3aed"` → `<Card>`; line 8 `<DataGrid>` → `<OrdersTable>`; line 9 `variant="green"` → `variant="success"`. The cover shows the first three.
- **Amber means "example" or "warning", nothing else.** Issue markers are neutral chips; the loop box is a neutral dashed line.

## Writing

All product copy is in English, in one voice:

1. **Short sentences, active voice.** "The agent calls the tools", not "the tools are called".
2. **Say what happens, with a verb and an object.** Buttons: "Save order", "Copy command", never "OK" or "Submit".
3. **Numbers instead of adjectives.** "5 tools", "under two minutes", not "powerful" or "blazing fast".
4. **No filler words:** no "simply", "just", "easily", "seamless", "magic", "supercharge".
5. **Errors say what went wrong and what to do next,** in that order: "Atlas didn't start. Check Node: node -v should print v20 or newer."

## Mark

A 2×2 grid of tiles: three in `--foreground`, one in `--primary`. The grid is the design system; the blue tile is the token the agent picks. It replaces the "A" in a rounded square, which looked like any font in any app icon. The 16 px favicon has its own drawing (6.5 px tiles, 1 px gap). `favicon.svg` switches colors with `prefers-color-scheme`; `favicon.ico` (32 px) is the fallback; `apple-touch-icon` is 180 px. Options B (meridian) and C (layers) were rejected: both are generic icons and blur at 16 px.

## Navigation

Top nav: **How it works · Docs · Evaluation**, plus GitHub. "Docs" is the Storybook (foundations, components, patterns and MCP); there is no separate "Components" entry. Footer links: Repository → GitHub repo; Evaluation → `#eval`; Changelog → `CHANGELOG.md` on GitHub; Storybook → Introduction; Quickstart → `#quickstart`; validate_screen rules → Storybook MCP page. GitHub links 404 until the repo is public.

## Motion

Motion only confirms an action; nothing moves on its own. Tokens: `--dur-fast` 120 ms, `--dur` 180 ms, `--dur-slow` 240 ms, `--ease-out` cubic-bezier(.2, .8, .2, 1), `--ease-in` cubic-bezier(.4, 0, 1, 1).

| Interaction | What moves | Duration · easing | With `prefers-reduced-motion: reduce` |
|---|---|---|---|
| Copy button | Icon swaps to a check, label "Copied" appears, color to `--success`; back after 1.6 s | 120 ms · ease-out | Instant swap, same 1.6 s feedback |
| Tab change (Preview / Code, client tabs) | Underline color and text color | 180 ms · ease-out (underline), 120 ms (text) | Instant |
| Sheet open (Storybook sidebar on phones, detail panels) | Panel slides in from the edge, scrim fades to 50% | 240 ms · ease-out in, 180 ms · ease-in out | No slide: panel appears, scrim fades in 120 ms |
| Button hover / press | Background color | 120 ms · ease-out | Instant |
| Dialog | Fade + 4 px rise (shadcn default) | 180 ms · ease-out | Fade only |

No parallax, no scroll-triggered animation, no looping animation except the loading spinner (which stops under reduced motion and keeps the "Saving…" label).

## Components

All from shadcn/ui, themed only by variables: Button, Input, Select, Card, Badge, Alert, Table, Dialog, Tabs, Command, Sheet, Tooltip, Sonner (toast). Atlas adds variants only where shadcn has none: `Alert` and `Badge` get `success`, `warning` and `info`; `Button` gets no new variant.

## Storybook

- Manager theme from `storybook/theming` `create()`: `brandTitle` "Atlas", `brandImage` the Atlas mark, `colorPrimary`/`colorSecondary` = primary, `appBg` = sidebar, `appContentBg` = background, `appBorderColor` = border, `appBorderRadius` 6, `fontBase` IBM Plex Sans, `fontCode` IBM Plex Mono, `barSelectedColor` = primary.
- Sidebar groups, in this order: **Welcome**, **Foundations**, **Components**, **Patterns**, **MCP**. Items have no icons (the same cube on every item is a slop pattern); groups are labels with a count.
- One tab style in the docs: underline (`tabs-line`). The segmented shadcn `Tabs` stays for content inside the product.
- Every component page: description, import line and install command, preview with code, usage, props, do / don't, accessibility and "What the agent receives" (the real `get_component` answer).
- Mobile: the sidebar opens as a sheet from a top bar; "On this page" turns into a jump menu.

## Accepted deviations in the implementation (design review D2, F1, 2026-11-25)

Judged by the designer against the approved prototype. These differ from the PNGs on purpose and are the reference from now on.

1. **Storybook chrome:** sidebar, search ("Find components"), settings gear and the mobile bottom bar are Storybook's own, with the Atlas theme and CSS. The prototype's top bar + Sheet on phones is not possible without forking the manager. Accepted.
2. **Docs action bar** (Edit on GitHub · Copy page · Theme) lives at the top of each docs page, because Storybook doesn't take custom buttons in its toolbar in docs mode. Accepted.
3. **Introduction, step 2** imports the real files (`@leonfpontes/atlas-tokens/theme.css` + `tokens.css`) instead of the prototype's `shadcn.css`, which doesn't exist. Accepted: real code wins.
4. **Button sizes:** `default`, `lg`, `icon` only; shadcn's `sm`, `xs`, `icon-sm`, `icon-lg` are removed by the 40/44 px rule. Accepted, matches the prototype.
5. **"What the agent receives"** shows the full `get_component` answer in a scrolling block instead of a trimmed one. Accepted: it is the real response.
6. **Pages without a PNG** (Getting started, Changelog, Typography, Spacing & radius, Icons, Form validation, Empty states, How agents read Atlas, Tools reference) follow the approved docs layout. Accepted after review at 375, 1024 and 1440, light and dark.

## Accepted deviations in the implementation (design review D2, F2, 2026-11-25)

1. **Numbers come from `evals/results/latest.json` without manual rounding:** "Full · final" costs $0.131 and the safety net adds 41% (0.131 / 0.0928). The prototype showed $0.130 and 40%; the real number wins (decision of the PO).
2. **Diff line colors from tokens** (`--code-add` and `--code-del` mixed into `--code-bg`) instead of the prototype's hex. Same look, AA confirmed by the audit in light and dark. Accepted.
3. **The "What the agent guessed" figure** uses slightly darker pill colors (#15803d, #b91c1c) so its text passes AA. It is the only place with fixed colors on purpose (it shows what the model invented). Accepted.
4. **Claude Desktop and Cursor tabs** in the quickstart show the real steps (`claude_desktop_config.json`, `.cursor/mcp.json` with `mcpServers`); the prototype had no content for them. Accepted.

**OG image (1200 × 630):** the code panel uses 18 px code (20 px on the 1280 × 640 cover and social preview) so the longest canonical line, `import { Table } from "@/components/ui/table"`, fits. The prototype had the same cut and was fixed the same way.

## Accepted deviations in the implementation (design review D2, F3, 2026-11-25)

1. **The demo fixes an existing screen** ("Check src/OrdersPage.tsx against Atlas and fix what it finds") instead of writing one from scratch. In the real evaluation the full server's first drafts were already valid, so a from-scratch demo with errors would not be faithful. Accepted.
2. **The fixed file imports `OrdersTable` from `./OrdersTable`** (line 4), so `validate_screen` doesn't flag it as an unknown component. Accepted: the code stays valid.
3. **The README links the MP4** instead of embedding it, because GitHub doesn't play repository MP4s inline. The embedded player comes from dragging the video into the README on GitHub after the repo is public (B3). Accepted.

Checked: README covers (`docs/cover-light.png`, `docs/cover-dark.png`) read well at 830 px; the GIF and the video use the Atlas type, colors, mark and canonical diff; captions are white text on a dark box, clearly legible at 1280 × 720, and the fastest cue reads at 16.8 characters per second (cue 2, 84 characters in 5 s).
