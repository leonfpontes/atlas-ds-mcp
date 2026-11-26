import { useState } from "react"
import { toast } from "sonner"
import {
  CircleCheck,
  CreditCard,
  MapPin,
  Package,
  Printer,
  Undo2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

type PaymentStatus = "paid" | "refunded"

const ORDER = {
  number: "1042",
  placedAt: "14 March 2025, 10:42",
  customer: "Maya Okafor",
  email: "maya.okafor@example.com",
  paymentMethod: "Visa ending in 4821",
  paymentStatus: "paid" as PaymentStatus,
  items: [
    { id: "sku-101", name: "Organic whole milk, 1 L", quantity: 2, unitPrice: 2.4 },
    { id: "sku-214", name: "Sourdough loaf, sliced", quantity: 1, unitPrice: 4.9 },
    { id: "sku-377", name: "Free-range eggs, dozen", quantity: 1, unitPrice: 5.5 },
    { id: "sku-402", name: "Fernhill apple juice, 2 L", quantity: 3, unitPrice: 3.8 },
    { id: "sku-518", name: "Aged cheddar, 250 g", quantity: 2, unitPrice: 6.2 },
  ],
  deliveryFee: 3.5,
  taxRate: 0.08,
  address: {
    line1: "24 Birch Lane, Apartment 3B",
    city: "Portland",
    region: "OR",
    postalCode: "97209",
    country: "United States",
    instructions: "Leave with the concierge if no one answers.",
  },
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const formatMoney = (value: number) => currency.format(value)

export default function OrderDetailPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    ORDER.paymentStatus
  )
  const [refundOpen, setRefundOpen] = useState(false)

  const subtotal = ORDER.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const tax = subtotal * ORDER.taxRate
  const total = subtotal + ORDER.deliveryFee + tax
  const itemCount = ORDER.items.reduce((sum, item) => sum + item.quantity, 0)
  const isRefunded = paymentStatus === "refunded"

  const handleRefund = () => {
    setPaymentStatus("refunded")
    setRefundOpen(false)
    toast.success(`Refunded ${formatMoney(total)} to ${ORDER.paymentMethod}`)
  }

  const handlePrint = () => {
    window.print()
    toast.success(`Receipt for order #${ORDER.number} sent to printer`)
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">Order #{ORDER.number}</h1>
            {isRefunded ? (
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
          <p className="text-sm text-muted-foreground">
            Placed {ORDER.placedAt} by {ORDER.customer}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer />
            Print receipt
          </Button>

          <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
            <Button
              variant="destructive"
              disabled={isRefunded}
              onClick={() => setRefundOpen(true)}
            >
              <Undo2 />
              {isRefunded ? "Already refunded" : "Refund order"}
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Refund order #{ORDER.number}?</DialogTitle>
                <DialogDescription>
                  {`${formatMoney(total)} goes back to ${ORDER.paymentMethod}. The items stay on the order, and this can't be undone.`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Keep order</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleRefund}>
                  Refund {formatMoney(total)}
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
              {itemCount} {itemCount === 1 ? "item" : "items"} in this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Line total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORDER.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatMoney(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatMoney(item.quantity * item.unitPrice)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <dl className="mt-6 ml-auto grid max-w-xs grid-cols-2 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-right">{formatMoney(subtotal)}</dd>
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-right">{formatMoney(ORDER.deliveryFee)}</dd>
              <dt className="text-muted-foreground">Tax</dt>
              <dd className="text-right">{formatMoney(tax)}</dd>
              <dt className="border-t border-border pt-2 font-semibold">Total</dt>
              <dd className="border-t border-border pt-2 text-right font-semibold">
                {formatMoney(total)}
              </dd>
            </dl>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                Delivery address
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="font-medium">{ORDER.customer}</p>
              <p>{ORDER.address.line1}</p>
              <p>
                {ORDER.address.city}, {ORDER.address.region}{" "}
                {ORDER.address.postalCode}
              </p>
              <p>{ORDER.address.country}</p>
              <p className="pt-2 text-muted-foreground">
                {ORDER.address.instructions}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-4 text-muted-foreground" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Status</span>
                {isRefunded ? (
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
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Method</span>
                <span>{ORDER.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Amount</span>
                <span>{formatMoney(total)}</span>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              <Package className="mr-2 size-3.5" />
              Contact: {ORDER.email}
            </CardFooter>
          </Card>
        </div>
      </div>

      <Toaster />
    </main>
  )
}
