import { useState } from "react"
import { CreditCard, MapPin, Package, Printer, RotateCcw } from "lucide-react"
import { toast } from "sonner"
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
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type PaymentStatus = "paid" | "refunded" | "failed"

const ORDER = {
  id: "FM-20417",
  placedAt: "2025-03-14T10:32:00Z",
  fulfilmentStatus: "Delivered",
  customer: {
    name: "Elena Marsh",
    email: "elena.marsh@example.com",
    phone: "+1 555 0142",
  },
  address: {
    line1: "28 Birch Lane",
    line2: "Apt 4B",
    city: "Portland",
    region: "OR",
    postalCode: "97205",
    country: "United States",
  },
  payment: {
    method: "Visa ending 4242",
    status: "paid" as PaymentStatus,
    transactionId: "pi_3OxQ8a2eZvKYlo2C",
  },
  items: [
    { id: "itm-1", name: "Heirloom tomatoes", sku: "PRD-1021", quantity: 3, unitPriceCents: 450 },
    { id: "itm-2", name: "Sourdough loaf", sku: "PRD-2044", quantity: 2, unitPriceCents: 650 },
    { id: "itm-3", name: "Oat milk, 1 L", sku: "PRD-3307", quantity: 4, unitPriceCents: 325 },
    { id: "itm-4", name: "Wildflower honey", sku: "PRD-4190", quantity: 1, unitPriceCents: 900 },
    { id: "itm-5", name: "Free-range eggs (12)", sku: "PRD-5012", quantity: 2, unitPriceCents: 575 },
  ],
  deliveryFeeCents: 599,
  taxCents: 480,
}

const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

const paymentBadge: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  paid: { label: "Paid", variant: "default" },
  refunded: { label: "Refunded", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
}

export default function OrderDetailPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(ORDER.payment.status)

  const subtotalCents = ORDER.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceCents,
    0,
  )
  const totalCents = subtotalCents + ORDER.deliveryFeeCents + ORDER.taxCents
  const badge = paymentBadge[paymentStatus]
  const canRefund = paymentStatus === "paid"

  const handleRefund = () => {
    if (!canRefund) return
    setPaymentStatus("refunded")
    toast.success(`Refunded ${formatMoney(totalCents)} to ${ORDER.payment.method}`)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
          <h1 className="text-2xl font-semibold tracking-tight">Order {ORDER.id}</h1>
          <p className="text-sm text-muted-foreground">Placed {formatDate(ORDER.placedAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{ORDER.fulfilmentStatus}</Badge>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-4" aria-hidden="true" />
                Items
              </CardTitle>
              <CardDescription>{ORDER.items.length} products in this order</CardDescription>
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
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.sku}</div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{item.quantity}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(item.unitPriceCents)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatMoney(item.quantity * item.unitPriceCents)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <dl className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatMoney(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular-nums">{formatMoney(ORDER.deliveryFeeCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd className="tabular-nums">{formatMoney(ORDER.taxCents)}</dd>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatMoney(totalCents)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <aside className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-4" aria-hidden="true" />
                Delivery address
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="font-medium">{ORDER.customer.name}</p>
              <p>{ORDER.address.line1}</p>
              {ORDER.address.line2 && <p>{ORDER.address.line2}</p>}
              <p>
                {ORDER.address.city}, {ORDER.address.region} {ORDER.address.postalCode}
              </p>
              <p>{ORDER.address.country}</p>
              <Separator className="my-2" />
              <p className="text-muted-foreground">{ORDER.customer.email}</p>
              <p className="text-muted-foreground">{ORDER.customer.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-4" aria-hidden="true" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Method</span>
                <span>{ORDER.payment.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="tabular-nums">{formatMoney(totalCents)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="break-all font-mono text-xs">{ORDER.payment.transactionId}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleRefund}
                disabled={!canRefund}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                {paymentStatus === "refunded" ? "Already refunded" : "Refund order"}
              </Button>
              <Button variant="outline" className="w-full" onClick={handlePrint}>
                <Printer className="size-4" aria-hidden="true" />
                Print receipt
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </main>
  )
}
