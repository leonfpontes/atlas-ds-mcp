# @leonfpontes/atlas-tokens

The Atlas design tokens in the W3C Design Tokens format (DTCG), light and dark, and the
shadcn/ui and Tailwind CSS v4 theme built from them.

```css
@import 'tailwindcss';
@import '@leonfpontes/atlas-tokens/theme.css'; /* @theme: fonts, type scale, spacing, radius */
@import '@leonfpontes/atlas-tokens/tokens.css'; /* :root and .dark: the shadcn/ui variables */
```

| Export                                  | What it is                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `@leonfpontes/atlas-tokens/tokens.json` | The source: colors, type, space, radius, size, motion and shadow           |
| `@leonfpontes/atlas-tokens/tokens.css`  | CSS variables, light in `:root`, dark in `.dark` (oklch)                   |
| `@leonfpontes/atlas-tokens/theme.css`   | The Tailwind v4 `@theme`, so `bg-primary` and `text-muted-foreground` work |
| `@leonfpontes/atlas-tokens`             | `flattenTokens`, `resolveTokens` and `themeColors` to read the JSON        |

Every text and background pair passes WCAG AA in both themes.
Project: [github.com/leonfpontes/atlas-ds-mcp](https://github.com/leonfpontes/atlas-ds-mcp). MIT.
