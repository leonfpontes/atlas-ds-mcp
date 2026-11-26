import { useMemo, useState } from "react"
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Printer,
  RotateCcw,
} from "lucide-react"
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

type PaymentStatus = "paid" | "refunded"

type OrderItem = {
  id: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
}

type Order = {
  id: string
  placedAt: string
  customerName: string
  customerEmail: string
  address: {
    line1: string
    line2?: string
    city: string
    postcode: string
    country: string
  }
  deliveryMethod: string
  paymentMethod: string
  paymentStatus: PaymentStatus
  shipping: number
  items: OrderItem[]
}

const ORDER: Order = {
  id: "FM-10482",
  placedAt: "2025-03-14T10:32:00",
  customerName: "Elena Marsh",
  customerEmail: "elena.marsh@example.com",
  address: {
    line1: "24 Birch Lane",
    line2: "Flat 3B",
    city: "Bristol",
    postcode: "BS1 4DJ",
    country: "United Kingdom",
  },
  deliveryMethod: "Standard delivery (2–3 working days)",
  paymentMethod: "Visa ending 4242",
  paymentStatus: "paid",
  shipping: 3.5,
  items: [
    {
      id: "itm-1",
      name: "Heritage Sourdough Loaf",
      sku: "BAK-SD-001",
      quantity: 2,
      unitPrice: 4.2,
    },
    {
      id: "itm-2",
      name: "Organic Free-Range Eggs (12)",
      sku: "DAI-EG-012",
      quantity: 1,
      unitPrice: 3.95,
    },
    {
      id: "itm-3",
      name: "Cold-Pressed Rapeseed Oil 500ml",
      sku: "PAN-OL-500",
      quantity: 1,
      unitPrice: 6.5,
    },
    {
      id: "itm-4",
      name: "Wild Garlic Pesto",
      sku: "PRE-WG-190",
      quantity: 3,
      unitPrice: 2.75,
    },
  ],
}

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

const paymentStatusLabel: Record<PaymentStatus, string> = {
  paid: "Paid",
  refunded: "Refunded",
}

export default function OrderDetailPage() {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    ORDER.paymentStatus,
  )

  const subtotal = useMemo(
    () =>
      ORDER.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
    [],
  )

  const total = subtotal + ORDER.shipping

  const placedAtLabel = new Date(ORDER.placedAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  })

  const handleRefund = () => {
    if (paymentStatus === "refunded") return
    setPaymentStatus("refunded")
    toast.success(
      `Refunded ${currency.format(total)} to ${ORDER.paymentMethod}`,
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const isRefunded = paymentStatus === "refunded"

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 w-fit text-muted-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to orders
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Order {ORDER.id}
              </h1>
              <Badge variant={isRefunded ? "secondary" : "default"}>
                {paymentStatusLabel[paymentStatus]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Placed on {placedAtLabel} by {ORDER.customerName} (
              {ORDER.customerEmail})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="size-4" />
              Print receipt
            </Button>
            <Button
              variant="destructive"
              onClick={handleRefund}
              disabled={isRefunded}
            >
              <RotateCcw className="size-4" />
              {isRefunded ? "Already refunded" : "Refund order"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5 text-muted-foreground" />
                Items
              </CardTitle>
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
                        {currency.format(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {currency.format(item.quantity * item.unitPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <dl className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{currency.format(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="tabular-nums">
                    {currency.format(ORDER.shipping)}
                  </dd>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{currency.format(total)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5 text-muted-foreground" />
                  Delivery address
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 text-sm">
                <p className="font-medium">{ORDER.customerName}</p>
                <p>{ORDER.address.line1}</p>
                {ORDER.address.line2 && <p>{ORDER.address.line2}</p>}
                <p>{ORDER.address.city}</p>
                <p>{ORDER.address.postcode}</p>
                <p>{ORDER.address.country}</p>
                <Separator className="my-3" />
                <p className="text-muted-foreground">
                  {ORDER.deliveryMethod}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="size-5 text-muted-foreground" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={isRefunded ? "secondary" : "default"}>
                    {paymentStatusLabel[paymentStatus]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span>{ORDER.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="tabular-nums">
                    {currency.format(total)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                {isRefunded
                  ? "The full amount has been returned to the original payment method."
                  : "Refunds return the full order amount to the original payment method."}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
