import { Textarea } from '@/components/ui/textarea'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { ReasonField } from '../Textarea.stories'

export function TextareaDoc() {
  return (
    <ComponentDoc
      name="Textarea"
      lead="A multi-line field for a comment or a reason. Always with a visible label; messages sit under it."
      shadcn="https://ui.shadcn.com/docs/components/textarea"
      stories={5}
      canvas={{
        rows: [
          { label: 'default', children: <ReasonField /> },
          {
            label: 'error',
            children: (
              <ReasonField defaultValue="Fix it" error="Say what to change in at least 10 characters." />
            ),
          },
        ],
        snippet:
          '<label htmlFor="reason">Reason</label>\n<Textarea id="reason" aria-describedby="reason-hint" />',
        source: `import { Textarea } from "@/components/ui/textarea"

export function GateReason({ error }: { error?: string }) {
  return (
    <div className="grid gap-2">
      <label htmlFor="reason" className="text-sm font-medium">
        Reason
      </label>
      <Textarea
        id="reason"
        aria-invalid={Boolean(error)}
        aria-describedby="reason-hint"
        placeholder="For example: keep stock checks out of scope for now"
      />
      <p id="reason-hint" className={error ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
        {error ?? "The agent reads this before it tries again."}
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
            <div className="grid gap-6 rounded-lg border p-5">
              <ReasonField />
              <ReasonField defaultValue="Also refuse a quantity above the stock, with 409." />
              <ReasonField defaultValue="Fix it" error="Say what to change in at least 10 characters." />
              <ReasonField defaultValue="Approved by the owner." disabled />
            </div>
          ),
        },
      ]}
      doExample={{
        node: <ReasonField />,
        text: 'A label above, an example in the placeholder, and a hint that says what the text is for.',
      }}
      dontExample={{
        node: <Textarea aria-label="Comment" placeholder="Comment" className="w-60" />,
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
        'Starts at 88 px and grows with the text; it resizes only vertically, so the layout never scrolls sideways.',
        "16 px text on phones so iOS doesn't zoom.",
      ]}
    />
  )
}
