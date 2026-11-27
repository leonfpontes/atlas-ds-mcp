import { ComponentDoc } from '../../blocks/ComponentDoc'
import { CheckboxStates, Labelled, TypeFilters } from '../Checkbox.stories'

export function CheckboxDoc() {
  return (
    <ComponentDoc
      name="Checkbox"
      lead="An on or off choice, alone or in a list of filters. A 16 px box inside a 40 px target; a dash when a group is partly on."
      shadcn="https://ui.shadcn.com/docs/components/checkbox"
      primitive={{
        label: 'Radix Checkbox',
        href: 'https://www.radix-ui.com/primitives/docs/components/checkbox',
        pkg: '@radix-ui/react-checkbox',
      }}
      stories={4}
      canvas={{
        rows: [
          { label: 'default', children: <Labelled defaultChecked>Show superseded notes</Labelled> },
          { label: 'filters', children: <TypeFilters /> },
        ],
        snippet:
          '<label className="flex min-h-10 items-center gap-3">\n  <Checkbox defaultChecked />\n  Person\n</label>',
        source: `import { Checkbox } from "@/components/ui/checkbox"

const TYPES = [["Person", 42], ["Decision", 18], ["Meeting", 31]] as const

export function TypeFilters({ on, onChange }: { on: string[]; onChange: (on: string[]) => void }) {
  return (
    <fieldset className="grid gap-0.5">
      <legend className="mb-2 text-sm font-medium">Note types</legend>
      {TYPES.map(([name, count]) => (
        <label key={name} className="flex min-h-10 items-center gap-3 rounded-md px-2 text-sm hover:bg-accent">
          <Checkbox
            checked={on.includes(name)}
            onCheckedChange={(v) => onChange(v === true ? [...on, name] : on.filter((n) => n !== name))}
          />
          {name}
          <span className="ml-auto font-mono text-[13px] text-muted-foreground">{count}</span>
        </label>
      ))}
    </fieldset>
  )
}`,
      }}
      variants={[
        {
          node: <Labelled>Person</Labelled>,
          text: 'unchecked: an --input border on the background.',
        },
        {
          node: <Labelled defaultChecked>Person</Labelled>,
          text: 'checked: --primary with a check in --primary-foreground.',
        },
        {
          node: <Labelled checked="indeterminate">All types</Labelled>,
          text: 'indeterminate: a dash, for "All types" when only some are on.',
        },
        { node: <Labelled disabled>Customer</Labelled>, text: 'disabled: half opacity, cannot change.' },
      ]}
      extra={[{ id: 'states', label: 'States', node: <CheckboxStates /> }]}
      doExample={{
        node: <Labelled defaultChecked>Decision</Labelled>,
        text: 'The box and its text in one label: clicking the text toggles it.',
      }}
      dontExample={{
        node: <Labelled>Delete this note</Labelled>,
        text: 'A checkbox that does something at once. An action is a Button; a checkbox only records a choice.',
      }}
      a11y={[
        <>
          A <code>checkbox</code> with <code>aria-checked</code> (<code>mixed</code> when indeterminate);
          <kbd>Space</kbd> toggles it.
        </>,
        'Named by the label around it; a group of them goes in a fieldset with a legend.',
        'The box is 16 px, the target 40 px (44 on touch), with a negative margin so the row lines up on the box.',
        'Checked is a fill and a check mark, not color alone; the --input border is 3 : 1 on the background.',
      ]}
    />
  )
}
