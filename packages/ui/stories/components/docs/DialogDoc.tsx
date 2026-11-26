import { Button } from '@/components/ui/button'

import { ComponentDoc } from '../../blocks/ComponentDoc'
import { ConfirmDelete } from '../Dialog.stories'

export function DialogDoc() {
  return (
    <ComponentDoc
      name="Dialog"
      lead="Asks for a decision before the screen goes on. Destructive actions always confirm here."
      shadcn="https://ui.shadcn.com/docs/components/dialog"
      primitive={{
        label: 'Radix Dialog',
        href: 'https://www.radix-ui.com/primitives/docs/components/dialog',
        pkg: '@radix-ui/react-dialog',
      }}
      stories={3}
      canvas={{
        rows: [{ label: 'confirm', children: <ConfirmDelete /> }],
        snippet:
          '<DialogTitle>Delete order #1041?</DialogTitle>\n<Button variant="destructive">Delete order</Button>',
        source: `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DeleteOrder() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete order</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete order #1041?</DialogTitle>
          <DialogDescription>The customer won't be notified. This can't be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Delete order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,
      }}
      doExample={{
        node: (
          <>
            <Button variant="outline">Cancel</Button>
            <Button variant="destructive">Delete order</Button>
          </>
        ),
        text: 'The confirm button repeats the action: "Delete order".',
      }}
      dontExample={{
        node: (
          <>
            <Button variant="outline">No</Button>
            <Button>Yes</Button>
          </>
        ),
        text: '"Yes" and "No" make the person reread the question.',
      }}
      a11y={[
        'Focus moves into the dialog and returns to the trigger when it closes.',
        <>
          <kbd>Esc</kbd> and the close button (40 × 40 px, 44 on touch) close it.
        </>,
        <>
          <code>DialogTitle</code> and <code>DialogDescription</code> are read when it opens.
        </>,
        'Fade and a 4 px rise in 180 ms; fade only with reduced motion.',
      ]}
    />
  )
}
