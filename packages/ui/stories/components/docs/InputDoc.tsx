import { Input } from '@/components/ui/input'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { Field } from '../../blocks/fixtures'

export function InputDoc() {
  return (
    <ComponentDoc
      name="Input"
      lead="A one-line text field. Always with a visible label; messages sit under it."
      shadcn="https://ui.shadcn.com/docs/components/input"
      stories={3}
      canvas={{
        rows: [
          {
            label: 'states',
            children: (
              <div className="grid w-full gap-6 sm:grid-cols-2">
                <Field
                  label="Customer email"
                  type="email"
                  placeholder="name@example.com"
                  hint="We send the receipt here."
                />
                <Field
                  label="Customer email"
                  type="email"
                  defaultValue="ana@example"
                  state="error"
                  hint="Add the domain, e.g. ana@example.com"
                />
              </div>
            ),
          },
        ],
        snippet:
          '<label htmlFor="email">Customer email</label>\n<Input id="email" type="email" aria-describedby="email-hint" />',
        source: `import { Input } from "@/components/ui/input"

export function CustomerEmail({ error }: { error?: string }) {
  return (
    <div className="grid gap-2">
      <label htmlFor="email" className="text-sm font-medium">
        Customer email
      </label>
      <Input
        id="email"
        type="email"
        placeholder="name@example.com"
        aria-invalid={Boolean(error)}
        aria-describedby="email-hint"
      />
      <p id="email-hint" className={error ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
        {error ?? "We send the receipt here."}
      </p>
    </div>
  )
}`,
      }}
      extra={[
        {
          id: 'states',
          label: 'States',
          node: (
            <div className="grid gap-6 rounded-lg border p-5 sm:grid-cols-2">
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
        },
      ]}
      doExample={{
        node: <Field label="Customer email" placeholder="name@example.com" className="w-60" />,
        text: 'A label above the field. The placeholder is only an example.',
      }}
      dontExample={{
        node: <Input aria-label="Email" placeholder="Email" className="w-60" />,
        text: 'The placeholder as the label. It disappears when the person types.',
      }}
      a11y={[
        <>
          Every field has a <code>{'<label>'}</code>; hints and errors are linked with{' '}
          <code>aria-describedby</code>.
        </>,
        <>
          Errors set <code>aria-invalid</code>, turn the border to <code>--destructive</code> and add an icon
          and a sentence.
        </>,
        <>
          Border <code>--input</code> is 3.1 : 1 against the page (non-text contrast).
        </>,
        "40 px tall, 44 px on touch; 16 px text on phones so iOS doesn't zoom.",
      ]}
    />
  )
}
