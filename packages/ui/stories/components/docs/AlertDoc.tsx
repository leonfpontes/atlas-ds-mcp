import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert, X } from 'lucide-react'

import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { ComponentDoc } from '../../blocks/ComponentDoc'

const Dismiss = () => (
  <AlertAction>
    <Button variant="ghost" size="icon" aria-label="Dismiss">
      <X aria-hidden />
    </Button>
  </AlertAction>
)

const tone = (variant: 'default' | 'destructive' | 'success' | 'warning' | 'info', label: string) => {
  const Icon = {
    default: Info,
    destructive: OctagonX,
    success: CircleCheck,
    warning: TriangleAlert,
    info: Info,
  }[variant]
  return (
    <Alert variant={variant} className="py-2">
      <Icon aria-hidden />
      <AlertTitle>{label}</AlertTitle>
    </Alert>
  )
}

export function AlertDoc() {
  return (
    <ComponentDoc
      name="Alert"
      lead="Explains something about the screen that the person has to read or act on. It stays until the cause goes away."
      shadcn="https://ui.shadcn.com/docs/components/alert"
      stories={4}
      canvas={{
        rows: [
          {
            label: 'tones',
            children: (
              <div className="grid w-full max-w-[560px] gap-3">
                <Alert>
                  <Info aria-hidden />
                  <AlertTitle>Orders sync every 5 minutes</AlertTitle>
                  <AlertDescription>The last sync finished at 10:42.</AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <OctagonX aria-hidden />
                  <AlertTitle>Payment failed</AlertTitle>
                  <AlertDescription>
                    Order #1041 wasn't charged. Ask the customer for another card.
                  </AlertDescription>
                </Alert>
                <Alert variant="success">
                  <CircleCheck aria-hidden />
                  <AlertTitle>Order shipped</AlertTitle>
                  <AlertDescription>Tracking was sent to the customer.</AlertDescription>
                </Alert>
              </div>
            ),
          },
        ],
        snippet:
          '<Alert variant="destructive">\n  <OctagonX />\n  <AlertTitle>Payment failed</AlertTitle>\n</Alert>',
        source: `import { OctagonX } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PaymentFailed() {
  return (
    <Alert variant="destructive">
      <OctagonX />
      <AlertTitle>Payment failed</AlertTitle>
      <AlertDescription>
        Order #1041 wasn't charged. Ask the customer for another card.
      </AlertDescription>
    </Alert>
  )
}`,
      }}
      variants={[
        {
          node: tone('default', 'Default'),
          text: 'Neutral information, or a task in progress with a spinner.',
        },
        {
          node: tone('destructive', 'Destructive'),
          text: 'Something failed. Say what happened and what to do next.',
        },
        {
          node: tone('success', 'Success'),
          text: 'A result the person should keep in view. For a quick confirmation, use a Toast.',
        },
        { node: tone('warning', 'Warning'), text: 'A risk ahead: low stock, an expiring key.' },
        { node: tone('info', 'Info'), text: 'Context about the current view: filters, sync time.' },
      ]}
      extra={[
        {
          id: 'states',
          label: 'States',
          node: (
            <div className="grid gap-3">
              <Alert>
                <LoaderCircle className="animate-spin" aria-hidden />
                <AlertTitle>Syncing orders…</AlertTitle>
                <AlertDescription>Takes a few seconds.</AlertDescription>
              </Alert>
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
              <Alert variant="warning">
                <TriangleAlert aria-hidden />
                <AlertTitle>Low stock</AlertTitle>
                <AlertDescription>3 items left.</AlertDescription>
                <Dismiss />
              </Alert>
            </div>
          ),
        },
      ]}
      doExample={{
        node: (
          <Alert variant="destructive" className="max-w-xs bg-background">
            <OctagonX aria-hidden />
            <AlertTitle>Payment failed</AlertTitle>
            <AlertDescription>Ask the customer for another card.</AlertDescription>
          </Alert>
        ),
        text: 'Icon, title and the next step. The color is never the only signal.',
      }}
      dontExample={{
        node: (
          <Alert variant="destructive" className="max-w-xs bg-background">
            <AlertTitle>Error 402</AlertTitle>
          </Alert>
        ),
        text: 'A code with no icon and no way forward. The person has to guess.',
      }}
      a11y={[
        <>
          Destructive alerts use <code>role="alert"</code> and are read at once; the other tones use{' '}
          <code>role="status"</code>.
        </>,
        'Each tone has its own icon shape: circle "i", circle with a check, triangle, octagon.',
        'The dismiss button is 40 × 40 px (44 on touch) and has the label "Dismiss".',
        'Title and description contrast pass AA on every tone, light and dark.',
      ]}
    />
  )
}
