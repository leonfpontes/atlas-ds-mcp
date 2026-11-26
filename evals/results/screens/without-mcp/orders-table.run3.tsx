import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type OrderStatus = "paid" | "packing" | "shipped" | "refunded"

type Order = {
  id: string
  orderNumber: string
  customer: string
  items: { name: string; quantity: number }[]
  totalCents: number
  status: OrderStatus
}

const ORDERS: Order[] = [
  {
    id: "ord_1",
    orderNumber: "FM-10421",
    customer: "Eleanor Whitfield",
    items: [
      { name: "Sourdough loaf", quantity: 2 },
      { name: "Wild honey 500g", quantity: 1 },
    ],
    totalCents: 1845,
    status: "packing",
  },
  {
    id: "ord_2",
    orderNumber: "FM-10422",
    customer: "Marcus Oyelaran",
    items: [
      { name: "Organic eggs (12)", quantity: 1 },
      { name: "Oat milk 1L", quantity: 3 },
      { name: "Bananas (bunch)", quantity: 1 },
    ],
    totalCents: 2790,
    status: "paid",
  },
  {
    id: "ord_3",
    orderNumber: "FM-10423",
    customer: "Priya Raghunathan",
    items: [{ name: "Cold-pressed olive oil 750ml", quantity: 1 }],
    totalCents: 1299,
    status: "shipped",
  },
  {
    id: "ord_4",
    orderNumber: "FM-10424",
    customer: "Tomas Lindqvist",
    items: [
      { name: "Heirloom tomatoes 1kg", quantity: 2 },
      { name: "Fresh basil", quantity: 2 },
    ],
    totalCents: 1560,
    status: "refunded",
  },
  {
    id: "ord_5",
    orderNumber: "FM-10425",
    customer: "Hannah Brooks",
    items: [
      { name: "Free-range chicken thighs 1kg", quantity: 1 },
      { name: "Sweet potatoes 1kg", quantity: 2 },
      { name: "Greek yogurt 500g", quantity: 1 },
    ],
    totalCents: 3420,
    status: "paid",
  },
  {
    id: "ord_6",
    orderNumber: "FM-10426",
    customer: "Diego Ramírez",
    items: [{ name: "Dark roast coffee beans 1kg", quantity: 1 }],
    totalCents: 2150,
    status: "packing",
  },
]

const STATUS_STYLES: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  paid: {
    label: "Paid",
    variant: "default",
    className: "",
  },
  packing: {
    label: "Packing",
    variant: "secondary",
    className: "",
  },
  shipped: {
    label: "Shipped",
    variant: "outline",
    className: "",
  },
  refunded: {
    label: "Refunded",
    variant: "destructive",
    className: "",
  },
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function OrdersPage() {
  const [query, setQuery] = useState("")

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return ORDERS

    return ORDERS.filter((order) => {
      const itemText = order.items.map((item) => item.name).join(" ")
      return (
        order.orderNumber.toLowerCase().includes(normalized) ||
        order.customer.toLowerCase().includes(normalized) ||
        itemText.toLowerCase().includes(normalized) ||
        STATUS_STYLES[order.status].label.toLowerCase().includes(normalized)
      )
    })
  }, [query])

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Today&apos;s orders</h1>
        <p className="text-sm text-muted-foreground">
          Fernhill Market · {ORDERS.length} orders
        </p>
      </header>

      <div className="relative max-w-sm">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by order, customer, item or status"
          aria-label="Search orders"
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No orders match &ldquo;{query.trim()}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const status = STATUS_STYLES[order.status]
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium tabular-nums">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="max-w-[320px]">
                      <ul className="space-y-0.5 text-sm text-muted-foreground">
                        {order.items.map((item) => (
                          <li key={item.name} className="truncate">
                            {item.quantity} × {item.name}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currencyFormatter.format(order.totalCents / 100)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
