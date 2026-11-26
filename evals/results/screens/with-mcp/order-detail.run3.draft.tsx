import { useState } from "react"
import {
  CircleCheck,
  CreditCard,
  MapPin,
  Package,
  Printer,
  TriangleAlert,
  Undo2,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
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
  id: "1042",
  placedAt: "12 May 2025, 14:32",
  customer: "Maria Lopez",
  deliveryFee: 4.5,
  taxRate: 0.08,
}

const ITEMS = [
  { id: "item-1", name: "Organic whole milk, 1 L", sku: "DAI-1001", quantity: 2, unitPrice: 1.85 },
  { id: "item-2", name: "Sourdough loaf, sliced", sku: "BKY-2208", quantity: 1, unitPrice: 4.2 },
  { id: "item-3", name: "Free-range eggs, 12 pack", sku: "DAI-1140", quantity: 1, unitPrice: 3.9 },
  { id: "item-4", name: "Cherry tomatoes, 500 g", sku: "PRD-3317", quantity: 3, unitPrice: 2.4 },
  { id: "item-5", name: "Dark chocolate bar, 85%", sku: "GRO-4456", quantity: 2, unitPrice: 2.75 },
]

const ADDRESS = {
  name: "Maria Lopez",
  line1: "18 Fernhill Road",
  line2: "Flat 3B",
  city: "Portland",
  region: "OR",
  postcode: "97205",
  country: "United States",
  instructions: "Leave with the concierge if no one answers.",
}

const PAYMENT = {
  method: "Visa ending in 4242",
  status: "paid" as "paid" | "refunded",
  amountPaid: 0,
  refundedAmount: 0,
}

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default function OrderDetailPage() {
  const [refunded, setRefunded] = useState(PAYMENT.status === "refunded")
  const [refundOpen, setRefundOpen] = useState(false)

  const subtotal = ITEMS.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * ORDER.taxRate
  const total = subtotal + tax + ORDER.deliveryFee
  const paidAmount = total
  const refundAmount = refunded ? total : PAYMENT.refundedAmount

  const handleRefund = () => {
    setRefunded(true)
    setRefundOpen(false)
    toast.success(`Refund of ${money.format(total)} sent for order #${ORDER.id}`)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-foreground">Order #{ORDER.id}</h1>
            {refunded ? (
              <Badge variant="info">
                <Undo2 />
                Refunded
              </Badge>
            ) : (
              <Badge variant="success">
                <CircleCheck />
                Paid
              </Badge>
            )}
            <Badge variant="warning">
              <TriangleAlert />
              Example data
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Fernhill Market · Placed {ORDER.placedAt} · Customer {ORDER.customer}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
            <Button
              variant="outline"
              disabled={refunded}
              onClick={() => setRefundOpen(true)}
            >
              <Undo2 />
              {refunded ? "Already refunded" : "Refund order"}
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Refund order #{ORDER.id}?</DialogTitle>
                <DialogDescription>
                  The customer gets {money.format(total)} back to {PAYMENT.method}. This can't be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setRefundOpen(false)}>
                  Keep order
                </Button>
                <Button variant="destructive" onClick={handleRefund}>
                  Refund {money.format(total)}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={handlePrint}>
            <Printer />
            Print receipt
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>{ITEMS.length} products in this order</CardDescription>
            <CardAction>
              <Package className="text-muted-foreground" aria-hidden="true" />
            </CardAction>
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
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground">SKU {item.sku}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{money.format(item.unitPrice)}</TableCell>
                    <TableCell className="text-right">
                      {money.format(item.quantity * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Subtotal</TableCell>
                  <TableCell className="text-right">{money.format(subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Tax (8%)</TableCell>
                  <TableCell className="text-right">{money.format(tax)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3}>Delivery</TableCell>
                  <TableCell className="text-right">{money.format(ORDER.deliveryFee)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="font-semibold text-foreground">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {money.format(total)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery address</CardTitle>
              <CardAction>
                <MapPin className="text-muted-foreground" aria-hidden="true" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-foreground">{ADDRESS.name}</span>
              <span className="text-muted-foreground">{ADDRESS.line1}</span>
              <span className="text-muted-foreground">{ADDRESS.line2}</span>
              <span className="text-muted-foreground">
                {ADDRESS.city}, {ADDRESS.region} {ADDRESS.postcode}
              </span>
              <span className="text-muted-foreground">{ADDRESS.country}</span>
              <span className="mt-3 text-muted-foreground">Instructions: {ADDRESS.instructions}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardAction>
                <CreditCard className="text-muted-foreground" aria-hidden="true" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {refunded ? (
                  <Badge variant="info">
                    <Undo2 />
                    Refunded
                  </Badge>
                ) : (
                  <Badge variant="success">
                    <CircleCheck />
                    Paid
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="text-foreground">{PAYMENT.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount paid</span>
                <span className="text-foreground">{money.format(paidAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Refunded</span>
                <span className="text-foreground">{money.format(refundAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </main>
  )
}
