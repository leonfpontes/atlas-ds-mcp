import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from '@/components/ui/input'

import { Field } from '../blocks/fixtures'

const meta = {
  title: 'Components/Input',
  component: Input,
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const States: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <Field
        label="Customer email"
        type="email"
        placeholder="name@example.com"
        hint="We send the receipt here."
      />
      <Field
        label="Customer email"
        type="email"
        defaultValue="ana@example.com"
        state="loading"
        hint="Looking up the customer…"
      />
      <Field
        label="Customer email"
        type="email"
        defaultValue="ana@example"
        state="error"
        hint="Add the domain, e.g. ana@example.com"
      />
      <Field
        label="Customer email"
        type="email"
        defaultValue="ana@example.com"
        state="success"
        hint="Customer found: Ana Ruiz"
      />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Field label="Store name" defaultValue="Fernhill Market" disabled hint="Only the owner can change it." />
  ),
}
