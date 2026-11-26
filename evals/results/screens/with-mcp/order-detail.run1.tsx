import { useState } from "react"
import { CircleCheck, MapPin, Package, Printer, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell } from "@/components/ui/table"

type PaymentStatus = "paid" | "refunded"

const ORDER = {
  id: "1042",
  placedAt: "14 March 2025, 10:42",
  customer: "Maya Lindqvist",
  paymentMethod: "Visa ending 4821",
  paymentStatus: "paid" as PaymentStatus,
  deliveryAddress: {
    line1: "18 Orchard Lane",
    line2: "Flat 3B",
    city: "Bristol",
    postcode: "BS1 4DJ",
    country: "United Kingdom",
  },
  items: [
    { id: "i1", name: "Organic whole milk, 2 L", sku: "DAI-0021", quantity: 2, unitPriceCents: 189 },
    { id: "i2", name: "Sourdough loaf, sliced", sku: "BKY-0107", quantity: 1, unitPriceCents: 445 },
    { id: "i3", name: "Free-range eggs, box of 12", sku: "EGG-0012", quantity: 1, unitPriceCents: 362 },
    { id: "i4", name: "Cold-pressed apple juice, 1 L", sku: "DRK-0433", quantity: 3, unitPriceCents: 240 },
  ],
  deliveryFeeCents: 399,
  taxCents: 0,
}

const currency = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" })

function formatMoney(cents: number) {
  return currency.format(cents / 100)
}

export default function OrderDetailPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(ORDER.paymentStatus)
  const [refundOpen, setRefundOpen] = useState(false)

  const subtotalCents = ORDER.items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0)
  const totalCents = subtotalCents + ORDER.deliveryFeeCents + ORDER.taxCents

  function handleRefund() {
    setPaymentStatus("refunded")
    setRefundOpen(false)
    toast.success(`Refund of ${formatMoney(totalCents)} sent for order #${ORDER.id}`)
  }

  function handlePrint() {
    window.print()
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <Toaster />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">Order #{ORDER.id}</h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market · Placed {ORDER.placedAt} · {ORDER.customer}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer />
            Print receipt
          </Button>

          <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={paymentStatus === "refunded"}>
                <RotateCcw />
                Refund order
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Refund order #{ORDER.id}?</DialogTitle>
                <DialogDescription>
                  {ORDER.customer} gets {formatMoney(totalCents)} back to {ORDER.paymentMethod}. This can't be undone.
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>
              {ORDER.items.length} products in this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Line total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORDER.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground">SKU {item.sku}</span>
                      </div>
                    </TableCell>
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
              {paymentStatus === "paid" ? (
                <Badge variant="success">
                  <CircleCheck />
                  Paid
                </Badge>
              ) : (
                <Badge variant="info">
                  <RotateCcw />
                  Refunded
                </Badge>
              )}
              <p className="text-sm text-muted-foreground">
                {paymentStatus === "paid"
                  ? `${formatMoney(totalCents)} received. You can refund the full amount.`
                  : `${formatMoney(totalCents)} returned to the customer's card.`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery address</CardTitle>
              <CardDescription>{ORDER.customer}</CardDescription>
            </CardHeader>
            <CardContent>
              <address className="flex items-start gap-3 text-sm not-italic text-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="flex flex-col">
                  <span>{ORDER.deliveryAddress.line1}</span>
                  <span>{ORDER.deliveryAddress.line2}</span>
                  <span>{ORDER.deliveryAddress.city}</span>
                  <span>{ORDER.deliveryAddress.postcode}</span>
                  <span>{ORDER.deliveryAddress.country}</span>
                </span>
              </address>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Packing</CardTitle>
              <CardDescription>
                {ORDER.items.reduce((sum, item) => sum + item.quantity, 0)} units in {ORDER.items.length} products
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3 text-sm text-muted-foreground">
              <Package className="size-4 shrink-0" />
              Packed and ready for the courier.
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
