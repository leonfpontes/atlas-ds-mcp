import { useState } from "react"
import {
  CircleAlert,
  CircleCheck,
  Clock,
  MapPin,
  Printer,
  Undo2,
  CreditCard,
  Package,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

type PaymentStatus = "paid" | "pending" | "refunded" | "failed"

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  {
    label: string
    variant: "success" | "warning" | "info" | "destructive"
    icon: typeof CircleCheck
  }
> = {
  paid: { label: "Paid", variant: "success", icon: CircleCheck },
  pending: { label: "Pending", variant: "warning", icon: Clock },
  refunded: { label: "Refunded", variant: "info", icon: Undo2 },
  failed: { label: "Failed", variant: "destructive", icon: CircleAlert },
}

const ORDER = {
  number: "1042",
  placedAt: "March 12, 2025, 10:24 AM",
  customer: {
    name: "Elena Marsh",
    email: "elena.marsh@example.com",
    phone: "+1 (555) 014-2290",
  },
  address: {
    line1: "218 Birch Hollow Road",
    line2: "Apt 4B",
    city: "Portland",
    region: "OR",
    postalCode: "97209",
    country: "United States",
    note: "Leave at the side door if no one answers.",
  },
  payment: {
    method: "Visa ending in 4242",
    status: "paid" as PaymentStatus,
    chargedAt: "March 12, 2025, 10:25 AM",
  },
  items: [
    {
      id: "itm-1",
      name: "Stone-ground whole wheat flour",
      sku: "FLR-WW-1KG",
      quantity: 2,
      unitPriceCents: 480,
    },
    {
      id: "itm-2",
      name: "Cold-pressed olive oil, 500 ml",
      sku: "OIL-OL-500",
      quantity: 1,
      unitPriceCents: 1250,
    },
    {
      id: "itm-3",
      name: "Wild blueberry jam",
      sku: "JAM-BB-340",
      quantity: 3,
      unitPriceCents: 395,
    },
    {
      id: "itm-4",
      name: "Free-range eggs, dozen",
      sku: "EGG-FR-12",
      quantity: 1,
      unitPriceCents: 575,
    },
  ],
  shippingCents: 499,
  taxCents: 268,
}

const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100
  )

export default function OrderDetailPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    ORDER.payment.status
  )
  const [refundOpen, setRefundOpen] = useState(false)

  const subtotalCents = ORDER.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceCents,
    0
  )
  const totalCents = subtotalCents + ORDER.shippingCents + ORDER.taxCents
  const itemCount = ORDER.items.reduce((sum, item) => sum + item.quantity, 0)

  const status = PAYMENT_STATUS_CONFIG[paymentStatus]
  const StatusIcon = status.icon
  const canRefund = paymentStatus === "paid"

  const handleRefund = () => {
    setPaymentStatus("refunded")
    setRefundOpen(false)
    toast.success(`Refund of ${formatMoney(totalCents)} issued`)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">Fernhill Market</p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Order #{ORDER.number}
              </h1>
              <Badge variant={status.variant}>
                <StatusIcon />
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed {ORDER.placedAt}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer />
              Print receipt
            </Button>

            <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
              <Button
                variant="destructive"
                disabled={!canRefund}
                onClick={() => setRefundOpen(true)}
              >
                <Undo2 />
                {canRefund
                  ? `Refund ${formatMoney(totalCents)}`
                  : "Already refunded"}
              </Button>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Refund order #{ORDER.number}?</DialogTitle>
                  <DialogDescription>
                    {`The customer gets ${formatMoney(
                      totalCents
                    )} back to their ${ORDER.payment.method}. This can't be undone.`}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRefundOpen(false)}>
                    Keep order
                  </Button>
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
                {itemCount} {itemCount === 1 ? "item" : "items"} in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                    <TableHead className="text-right">Line total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ORDER.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground">
                            SKU {item.sku}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(item.unitPriceCents)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(item.quantity * item.unitPriceCents)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right text-muted-foreground">
                      Subtotal
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(subtotalCents)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right text-muted-foreground">
                      Delivery
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(ORDER.shippingCents)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right text-muted-foreground">
                      Tax
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(ORDER.taxCents)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-semibold">
                      Total
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatMoney(totalCents)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
            <CardFooter className="justify-end">
              <Badge variant="warning">Example data</Badge>
            </CardFooter>
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
                <p className="font-medium">{ORDER.customer.name}</p>
                <p>{ORDER.address.line1}</p>
                <p>{ORDER.address.line2}</p>
                <p>
                  {ORDER.address.city}, {ORDER.address.region}{" "}
                  {ORDER.address.postalCode}
                </p>
                <p>{ORDER.address.country}</p>
                <p className="mt-2 text-muted-foreground">
                  {ORDER.customer.email}
                </p>
                <p className="text-muted-foreground">{ORDER.customer.phone}</p>
                <p className="mt-2 rounded-md bg-muted p-2 text-muted-foreground">
                  Note: {ORDER.address.note}
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
                  <Badge variant={status.variant}>
                    <StatusIcon />
                    {status.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Method</span>
                  <span>{ORDER.payment.method}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Charged</span>
                  <span>{ORDER.payment.chargedAt}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="tabular-nums">{formatMoney(totalCents)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
