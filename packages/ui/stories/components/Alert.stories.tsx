import type { Meta, StoryObj } from '@storybook/react-vite'
import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert, X } from 'lucide-react'

import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  decorators: [(Story) => <div className="grid w-[560px] max-w-[calc(100vw-32px)] gap-3">{Story()}</div>],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

const Dismiss = () => (
  <AlertAction>
    <Button variant="ghost" size="icon" aria-label="Dismiss">
      <X aria-hidden />
    </Button>
  </AlertAction>
)

export const Tones: Story = {
  render: () => (
    <>
      <Alert>
        <Info aria-hidden />
        <AlertTitle>Orders sync every 5 minutes</AlertTitle>
        <AlertDescription>The last sync finished at 10:42.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <OctagonX aria-hidden />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Order #1041 wasn't charged. Ask the customer for another card.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheck aria-hidden />
        <AlertTitle>Order shipped</AlertTitle>
        <AlertDescription>Tracking was sent to the customer.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert aria-hidden />
        <AlertTitle>Low stock</AlertTitle>
        <AlertDescription>3 items left.</AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info aria-hidden />
        <AlertTitle>No filters applied</AlertTitle>
        <AlertDescription>You're seeing all orders.</AlertDescription>
      </Alert>
    </>
  ),
}

export const Loading: Story = {
  render: () => (
    <Alert>
      <LoaderCircle className="animate-spin" aria-hidden />
      <AlertTitle>Syncing orders…</AlertTitle>
      <AlertDescription>Takes a few seconds.</AlertDescription>
    </Alert>
  ),
}

export const WithDismiss: Story = {
  name: 'With dismiss',
  render: () => (
    <Alert variant="destructive">
      <OctagonX aria-hidden />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        <p>
          Order #1041 wasn't charged. <a href="#retry">Retry payment</a>
        </p>
      </AlertDescription>
      <Dismiss />
    </Alert>
  ),
}
