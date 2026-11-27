# @leonfpontes/atlas-ui

The 22 Atlas components: shadcn/ui (Radix + Tailwind CSS v4) themed with
[`@leonfpontes/atlas-tokens`](https://www.npmjs.com/package/@leonfpontes/atlas-tokens).
Alert, Badge, Breadcrumb, Button, Card, Checkbox, Collapsible, Command, Dialog, Hover Card, Input, Progress, Scroll Area, Select,
Sheet, Skeleton, Sonner (toast), Table, Tabs, Textarea, Toggle Group and Tooltip.

```css
/* your global CSS */
@import '@leonfpontes/atlas-ui/styles.css';
```

```tsx
import { Badge, Button } from '@leonfpontes/atlas-ui'

<Button>Save order</Button>
<Badge variant="success">Paid</Badge>
```

Following the shadcn model, apps can also copy the files to `@/components/ui/<file>`; that is the
import path the MCP server teaches. Controls are 40 px tall (44 px on touch), and status variants
(`success`, `warning`, `info`, `destructive`) pair color with an icon and text.

React 19. Docs and Storybook: [github.com/leonfpontes/atlas-ds-mcp](https://github.com/leonfpontes/atlas-ds-mcp). MIT.
