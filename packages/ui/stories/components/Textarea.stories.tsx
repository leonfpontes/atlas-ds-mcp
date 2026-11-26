import type { Meta, StoryObj } from '@storybook/react-vite'
import { OctagonX } from 'lucide-react'
import { useId } from 'react'

import { Textarea } from '@/components/ui/textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  excludeStories: ['ReasonField'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/** A labelled Textarea with its hint or error under it, linked by aria-describedby. */
export function ReasonField({
  error,
  defaultValue,
  disabled,
}: {
  error?: string
  defaultValue?: string
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div className="grid w-[420px] max-w-[calc(100vw-32px)] gap-2">
      <label htmlFor={id} className="text-sm leading-none font-medium">
        Reason
      </label>
      <Textarea
        id={id}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-hint`}
        placeholder="For example: keep stock checks out of scope for now"
      />
      <p
        id={`${id}-hint`}
        className={
          error ? 'flex items-start gap-1.5 text-sm text-destructive' : 'text-sm text-muted-foreground'
        }
      >
        {error && <OctagonX className="mt-0.5 size-4 flex-none" aria-hidden />}
        {error ?? 'The agent reads this before it tries again.'}
      </p>
    </div>
  )
}

export const Default: Story = { render: () => <ReasonField /> }

export const Filled: Story = {
  render: () => <ReasonField defaultValue="Also refuse a quantity above the stock, with 409." />,
}

export const ErrorState: Story = {
  name: 'Error',
  render: () => <ReasonField defaultValue="Fix it" error="Say what to change in at least 10 characters." />,
}

export const Disabled: Story = {
  render: () => <ReasonField defaultValue="Approved by the owner." disabled />,
}
