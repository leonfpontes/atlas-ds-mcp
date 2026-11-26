import { useState } from "react"
import { CircleCheck, CreditCard, MapPin, Printer, Undo2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

const ORDER = {
  number: "1042",
  placedAt: "14 May 2025, 10:24",
  paymentMethod: "Visa ending 4242",
  deliveryFeeCents: 300,
  taxCents: 196,
}

const ITEMS = [
  { id: "item-1", name: "Fernhill oat milk, 1 L", quantity: 2, unitPriceCents: 349 },
  { id: "item-2", name: "Country sourdough loaf", quantity: 1, unitPriceCents: 650 },
  { id: "item-3", name: "Free-range eggs, 12 pack", quantity: 1, unitPriceCents: 425 },
  { id: "item-4", name: "Honeycrisp apples, 1 kg", quantity: 3, unitPriceCents: 280 },
]

const DELIVERY_ADDRESS = {
  name: "Maya Thompson",
  line1: "24 Alder Lane",
  line2: "Apartment 3B",
  city: "Portland, OR 97209",
  phone: "+1 503 555 0148",
}

const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100)

export default function OrderDetailPage() {
  const [isPaid, setIsPaid] = useState(true)
  const [isRefundOpen, setIsRefundOpen] = useState(false)

  const subtotalCents = ITEMS.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0)
  const totalCents = subtotalCents + ORDER.deliveryFeeCents + ORDER.taxCents

  const handleRefund = () => {
    setIsPaid(false)
    setIsRefundOpen(false)
    toast.success(`Refund of ${formatMoney(totalCents)} sent to the customer`)
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Order #{ORDER.number}</h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market · Placed {ORDER.placedAt}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer />
            Print receipt
          </Button>
          <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
            <Button
              variant="destructive"
              disabled={!isPaid}
              onClick={() => setIsRefundOpen(true)}
            >
              <Undo2 />
              Refund order
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Refund order #{ORDER.number}?</DialogTitle>
                <DialogDescription>
                  The customer gets {formatMoney(totalCents)} back to {ORDER.paymentMethod}. This can't be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Keep order</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleRefund}>
                  Refund {formatMoney(totalCents)}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>{ITEMS.length} products in this order</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Line total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ITEMS.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatMoney(item.unitPriceCents)}</TableCell>
                    <TableCell className="text-right">
                      {formatMoney(item.quantity * item.unitPriceCents)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Subtotal</TableCell>
                  <TableCell className="text-right">{formatMoney(subtotalCents)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Delivery</TableCell>
                  <TableCell className="text-right">{formatMoney(ORDER.deliveryFeeCents)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Tax</TableCell>
                  <TableCell className="text-right">{formatMoney(ORDER.taxCents)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="font-semibold">Total</TableCell>
                  <TableCell className="text-right font-semibold">{formatMoney(totalCents)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>{ORDER.paymentMethod}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {isPaid ? (
                <Badge variant="success">
                  <CircleCheck />
                  Paid
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Undo2 />
                  Refunded
                </Badge>
              )}
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="size-4" />
                {formatMoney(totalCents)} charged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery address</CardTitle>
              <CardDescription>{DELIVERY_ADDRESS.phone}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <address className="flex flex-col not-italic">
                <span className="font-medium">{DELIVERY_ADDRESS.name}</span>
                <span>{DELIVERY_ADDRESS.line1}</span>
                <span>{DELIVERY_ADDRESS.line2}</span>
                <span>{DELIVERY_ADDRESS.city}</span>
              </address>
            </CardContent>
          </Card>
        </div>
      </div>

      <Toaster />
    </main>
  )
}
