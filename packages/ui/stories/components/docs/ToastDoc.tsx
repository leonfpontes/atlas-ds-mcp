import { Button } from '@/components/ui/button'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { orderCreated } from '../Toast.stories'

export function ToastDoc() {
  return (
    <ComponentDoc
      name="Sonner"
      title="Toast"
      lead="Short feedback that confirms an action and goes away on its own. Sonner, as shadcn/ui recommends."
      shadcn="https://ui.shadcn.com/docs/components/sonner"
      primitive={{ label: 'Sonner', href: 'https://sonner.emilkowal.ski', pkg: 'sonner' }}
      stories={3}
      canvas={{
        rows: [
          {
            label: 'success',
            children: (
              <Button variant="outline" onClick={orderCreated}>
                Create order
              </Button>
            ),
          },
        ],
        snippet: 'toast.success("Order #1043 created", {\n  action: { label: "Undo", onClick: undo },\n})',
        source: `import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

export function App() {
  return (
    <>
      <Button onClick={() => toast.success("Order #1043 created")}>Create order</Button>
      <Toaster />
    </>
  )
}`,
      }}
      doExample={{
        node: <p className="text-sm">"Order #1043 created" · Undo</p>,
        text: 'Confirms what happened, with a way back.',
      }}
      dontExample={{
        node: <p className="text-sm">"Payment failed" in a toast</p>,
        text: 'An error the person must act on disappears before they read it. Use an Alert.',
      }}
      a11y={[
        "Toasts are announced in a polite live region; they don't steal focus.",
        <>
          Hover or focus pauses the timer; <kbd>Alt</kbd> + <kbd>T</kbd> jumps to the toasts.
        </>,
        'Success, info, warning and error each have their own icon shape.',
      ]}
    />
  )
}
