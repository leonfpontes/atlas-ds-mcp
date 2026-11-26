import { useState } from "react"
import { CreditCard, MapPin, Package, Printer, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type PaymentStatus = "paid" | "pending" | "refunded"

type OrderItem = {
  id: string
  name: string
  sku: string
  quantity: number
  unitPriceCents: number
}

const ORDER = {
  id: "FM-10482",
  placedAt: "2025-03-14T10:32:00",
  customer: {
    name: "Elena Marsh",
    email: "elena.marsh@example.com",
    phone: "+44 7700 900123",
  },
  deliveryAddress: {
    line1: "14 Orchard Lane",
    line2: "Flat 2",
    city: "Bristol",
    postcode: "BS6 7QT",
    country: "United Kingdom",
  },
  payment: {
    method: "Visa ending in 4242",
    status: "paid" as PaymentStatus,
    transactionId: "txn_3NkP2aL8vQ",
  },
  shippingCents: 499,
  items: [
    {
      id: "itm_1",
      name: "Organic Free-Range Eggs (12)",
      sku: "FM-EGG-012",
      quantity: 2,
      unitPriceCents: 325,
    },
    {
      id: "itm_2",
      name: "Sourdough Loaf, Stone-Baked",
      sku: "FM-BRD-SD1",
      quantity: 1,
      unitPriceCents: 450,
    },
    {
      id: "itm_3",
      name: "Cold-Pressed Apple Juice 1L",
      sku: "FM-JCE-APL",
      quantity: 3,
      unitPriceCents: 280,
    },
    {
      id: "itm_4",
      name: "Heritage Carrots, Bunch",
      sku: "FM-VEG-CRT",
      quantity: 1,
      unitPriceCents: 195,
    },
  ] satisfies OrderItem[],
}

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

const formatCents = (cents: number) => currency.format(cents / 100)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  })

const PAYMENT_LABELS: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  paid: { label: "Paid", variant: "default" },
  pending: { label: "Payment pending", variant: "secondary" },
  refunded: { label: "Refunded", variant: "destructive" },
}

export default function OrderDetailPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    ORDER.payment.status,
  )
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [isRefunding, setIsRefunding] = useState(false)

  const subtotalCents = ORDER.items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  )
  const totalCents = subtotalCents + ORDER.shippingCents
  const itemCount = ORDER.items.reduce((sum, item) => sum + item.quantity, 0)

  const paymentInfo = PAYMENT_LABELS[paymentStatus]
  const canRefund = paymentStatus === "paid"

  const handleRefund = async () => {
    setIsRefunding(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setPaymentStatus("refunded")
      setRefundDialogOpen(false)
      toast.success(`Refund of ${formatCents(totalCents)} issued`, {
        description: `Order ${ORDER.id} has been refunded to ${ORDER.payment.method}.`,
      })
    } catch {
      toast.error("Refund failed", {
        description: "The payment provider did not accept the refund. Try again.",
      })
    } finally {
      setIsRefunding(false)
    }
  }

  const handlePrint = () => {
    window.print()
    toast.success("Receipt sent to printer")
  }

  const { deliveryAddress: address } = ORDER

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order {ORDER.id}
          </h1>
          <p className="text-sm text-muted-foreground">
            Placed {formatDate(ORDER.placedAt)} by {ORDER.customer.name}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="size-4" />
            Print receipt
          </Button>

          <AlertDialog
            open={refundDialogOpen}
            onOpenChange={(open) => {
              if (!isRefunding) setRefundDialogOpen(open)
            }}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!canRefund}>
                <RotateCcw className="size-4" />
                Refund order
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Refund order {ORDER.id}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will refund {formatCents(totalCents)} to{" "}
                  {ORDER.payment.method}. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isRefunding}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault()
                    void handleRefund()
                  }}
                  disabled={isRefunding}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  {isRefunding ? "Refunding..." : "Confirm refund"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5" />
              Items
            </CardTitle>
            <CardDescription>
              {itemCount} {itemCount === 1 ? "item" : "items"} in this order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      <div className="text-xs text-muted-foreground">
                        SKU {item.sku}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCents(item.unitPriceCents)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCents(item.unitPriceCents * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator />

            <dl className="ml-auto grid w-full max-w-xs gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatCents(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd className="tabular-nums">
                  {formatCents(ORDER.shippingCents)}
                </dd>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatCents(totalCents)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5" />
                Delivery address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{ORDER.customer.name}</p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{address.city}</p>
              <p>{address.postcode}</p>
              <p>{address.country}</p>
              <Separator className="my-3" />
              <p className="text-muted-foreground">{ORDER.customer.email}</p>
              <p className="text-muted-foreground">{ORDER.customer.phone}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={paymentInfo.variant}>{paymentInfo.label}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Method</span>
                <span>{ORDER.payment.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Transaction</span>
                <span className="font-mono text-xs">
                  {ORDER.payment.transactionId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="tabular-nums">{formatCents(totalCents)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
