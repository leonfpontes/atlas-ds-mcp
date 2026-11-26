import { ComponentDoc } from '../../blocks/ComponentDoc'
import { StatusSelect } from '../Select.stories'

export function SelectDoc() {
  return (
    <ComponentDoc
      name="Select"
      lead="Picks one option from a short list. The trigger matches the Input."
      shadcn="https://ui.shadcn.com/docs/components/select"
      primitive={{
        label: 'Radix Select',
        href: 'https://www.radix-ui.com/primitives/docs/components/select',
        pkg: '@radix-ui/react-select',
      }}
      stories={3}
      canvas={{
        rows: [{ label: 'default', children: <StatusSelect /> }],
        snippet:
          '<Select defaultValue="paid">\n  <SelectTrigger aria-label="Status">\n    <SelectValue />\n  </SelectTrigger>\n</Select>',
        source: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function StatusFilter() {
  return (
    <Select defaultValue="all">
      <SelectTrigger aria-label="Status">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All statuses</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="shipped">Shipped</SelectItem>
        <SelectItem value="failed">Failed</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
      }}
      doExample={{
        node: <StatusSelect />,
        text: 'A visible label and a default that makes sense: "All statuses".',
      }}
      dontExample={{
        node: (
          <select aria-label="Status" className="h-10 rounded-sm border px-2 pointer-coarse:h-11">
            <option>Select…</option>
          </select>
        ),
        text: 'A native select next to Atlas controls, with "Select…" as the only hint.',
      }}
      a11y={[
        <>
          Opens with <kbd>Enter</kbd>, <kbd>Space</kbd> or the arrow keys; typing jumps to an option.
        </>,
        'Trigger and options are 40 px tall (44 on touch).',
        <>
          Label the trigger with a <code>{'<label>'}</code> and <code>aria-labelledby</code>, or with{' '}
          <code>aria-label</code>.
        </>,
      ]}
    />
  )
}
