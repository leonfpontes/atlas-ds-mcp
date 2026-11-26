import { useState, type ComponentType } from "react"
import {
  CircleAlert,
  CircleCheck,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Printer,
  Undo2,
  type LucideIcon,
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
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

type PaymentStatus = "paid" | "pending" | "refunded" | "failed"

type OrderItem = {
  id: string
  name: string
  sku: string
  quantity: number
  unitPriceCents: number
}

type Order = {
  number: string
  placedAt: string
  customer: string
  items: OrderItem[]
  shippingCents: number
  taxCents: number
  paymentStatus: PaymentStatus
  paymentMethod: string
  paidAt: string
  address: {
    name: string
    line1: string
    line2?: string
    city: string
    postcode: string
    country: string
    phone: string
  }
}

const PAYMENT_STATUS: Record<
  PaymentStatus,
  {
    label: string
    variant: "success" | "warning" | "info" | "destructive"
    icon: LucideIcon
  }
> = {
  paid: { label: "Paid", variant: "success", icon: CircleCheck },
  pending: { label: "Payment pending", variant: "warning", icon: Clock },
  refunded: { label: "Refunded", variant: "info", icon: Undo2 },
  failed: { label: "Payment failed", variant: "destructive", icon: CircleAlert },
}

const ORDER: Order = {
  number: "1042",
  placedAt: "14 May 2025, 10:32",
  customer: "Amara Okafor",
  items: [
    {
      id: "item-1",
      name: "Organic whole milk, 2 L",
      sku: "DAI-0021",
      quantity: 2,
      unitPriceCents: 389,
    },
    {
      id: "item-2",
      name: "Sourdough loaf, sliced",
      sku: "BAK-0104",
      quantity: 1,
      unitPriceCents: 525,
    },
    {
      id: "item-3",
      name: "Free-range eggs, dozen",
      sku: "DAI-0310",
      quantity: 1,
      unitPriceCents: 672,
    },
    {
      id: "item-4",
      name: "Fernhill house coffee, 250 g",
      sku: "GRO-0458",
      quantity: 3,
      unitPriceCents: 1199,
    },
  ],
  shippingCents: 499,
  taxCents: 472,
  paymentStatus: "paid",
  paymentMethod: "Visa ending in 4242",
  paidAt: "14 May 2025, 10:33",
  address: {
    name: "Amara Okafor",
    line1: "18 Birch Lane",
    line2: "Flat 3",
    city: "Bristol",
    postcode: "BS8 1QT",
    country: "United Kingdom",
    phone: "+44 117 496 0182",
  },
}

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

function formatMoney(cents: number) {
  return currency.format(cents / 100)
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const config = PAYMENT_STATUS[status]
  const Icon: ComponentType<{ className?: string }> = config.icon
  return (
    <Badge variant={config.variant}>
      <Icon className="size-3.5" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}

export default function OrderDetailPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    ORDER.paymentStatus,
  )
  const [refundOpen, setRefundOpen] = useState(false)

  const subtotalCents = ORDER.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceCents,
    0,
  )
  const totalCents = subtotalCents + ORDER.shippingCents + ORDER.taxCents
  const canRefund = paymentStatus === "paid"

  function handleRefund() {
    setPaymentStatus("refunded")
    setRefundOpen(false)
    toast.success(`Refund of ${formatMoney(totalCents)} issued`)
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
          <h1 className="text-2xl font-semibold text-foreground">
            Order #{ORDER.number}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed {ORDER.placedAt} by {ORDER.customer}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer aria-hidden="true" />
              Print receipt
            </Button>
            <Button
              variant="destructive"
              onClick={() => setRefundOpen(true)}
              disabled={!canRefund}
            >
              <Undo2 aria-hidden="true" />
              Refund order
            </Button>
          </div>
          {!canRefund && (
            <p className="text-sm text-muted-foreground">
              Only paid orders can be refunded.
            </p>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardDescription>
                {ORDER.items.length} products in this order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {item.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          SKU {item.sku}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMoney(item.unitPriceCents)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatMoney(item.quantity * item.unitPriceCents)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <dl className="ml-auto max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="text-foreground">
                    {formatMoney(subtotalCents)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="text-foreground">
                    {formatMoney(ORDER.shippingCents)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">VAT</dt>
                  <dd className="text-foreground">
                    {formatMoney(ORDER.taxCents)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-semibold">
                  <dt className="text-foreground">Total</dt>
                  <dd className="text-foreground">
                    {formatMoney(totalCents)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <CreditCard className="size-4" aria-hidden="true" />
                Payment
              </CardTitle>
              <CardDescription>{ORDER.paymentMethod}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={paymentStatus} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Amount</span>
                <span className="text-foreground">
                  {formatMoney(totalCents)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Paid at</span>
                <span className="text-foreground">{ORDER.paidAt}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <MapPin className="size-4" aria-hidden="true" />
                Delivery address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium text-foreground">
                {ORDER.address.name}
              </p>
              <p className="text-muted-foreground">{ORDER.address.line1}</p>
              {ORDER.address.line2 && (
                <p className="text-muted-foreground">{ORDER.address.line2}</p>
              )}
              <p className="text-muted-foreground">
                {ORDER.address.city} {ORDER.address.postcode}
              </p>
              <p className="text-muted-foreground">
                {ORDER.address.country}
              </p>
              <p className="pt-2 text-muted-foreground">
                {ORDER.address.phone}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Package className="size-4" aria-hidden="true" />
                Fulfilment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {ORDER.items.reduce((sum, item) => sum + item.quantity, 0)} items
              will be packed and sent to the address above.
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund order #{ORDER.number}?</DialogTitle>
            <DialogDescription>
              The customer gets {formatMoney(totalCents)} back to{" "}
              {ORDER.paymentMethod}. This can't be undone.
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
    </main>
  )
}
