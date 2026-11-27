import type { Meta, StoryObj } from '@storybook/react-vite'
import { useId, useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'

const meta = {
  title: 'Components/Checkbox',
  excludeStories: ['TypeFilters', 'Labelled', 'CheckboxStates', 'NOTE_TYPES'],
  component: Checkbox,
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** Note types of an example vault, with how many notes each has. Example data. */
export const NOTE_TYPES = [
  ['Person', 42],
  ['Project', 9],
  ['Decision', 18],
  ['Meeting', 31],
  ['Customer', 12],
  ['Document', 27],
] as const

/** One checkbox and its text in one label: the text names it and toggles it. */
export function Labelled({ children, ...props }: React.ComponentProps<typeof Checkbox>) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm pointer-coarse:min-h-11">
      <Checkbox {...props} />
      {children}
    </label>
  )
}

/** The filter list of an explorer: a row per type, the whole row is the target, counts in mono. */
export function TypeFilters() {
  const [on, setOn] = useState<string[]>(['Person', 'Project', 'Decision'])
  const all = on.length === NOTE_TYPES.length ? true : on.length === 0 ? false : 'indeterminate'
  const toggle = (name: string, value: boolean) =>
    setOn((cur) => (value ? [...cur, name] : cur.filter((n) => n !== name)))
  return (
    <fieldset className="m-0 grid w-64 max-w-full gap-0.5 border-0 p-0">
      <legend className="mb-2 text-sm font-medium">Note types</legend>
      <label className="-mx-2 flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm hover:bg-accent pointer-coarse:min-h-11">
        <Checkbox
          checked={all}
          onCheckedChange={(v) => setOn(v === true ? NOTE_TYPES.map(([n]) => n) : [])}
        />
        All types
      </label>
      {NOTE_TYPES.map(([name, count]) => (
        <label
          key={name}
          className="-mx-2 flex min-h-10 cursor-pointer items-center gap-3 rounded-md px-2 text-sm hover:bg-accent pointer-coarse:min-h-11"
        >
          <Checkbox checked={on.includes(name)} onCheckedChange={(v) => toggle(name, v === true)} />
          {name}
          <span className="ml-auto font-mono text-[13px] text-muted-foreground tabular-nums">{count}</span>
        </label>
      ))}
    </fieldset>
  )
}

export function CheckboxStates() {
  const error = useId()
  return (
    <div className="grid gap-1">
      <Labelled>Unchecked</Labelled>
      <Labelled defaultChecked>Checked</Labelled>
      <Labelled checked="indeterminate">Some of a group</Labelled>
      <Labelled disabled>Disabled</Labelled>
      <Labelled aria-invalid aria-describedby={error}>
        Accept the terms
      </Labelled>
      <p id={error} className="m-0 text-[13px] text-destructive">
        Accept the terms to continue.
      </p>
    </div>
  )
}

export const Default: Story = { render: () => <Labelled defaultChecked>Show superseded notes</Labelled> }

export const Filters: Story = { render: () => <TypeFilters /> }

export const States: Story = { render: () => <CheckboxStates /> }
