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
  placedAt: string
}

const ORDERS: Order[] = [
  {
    id: "ord_1",
    orderNumber: "FM-10421",
    customer: "Eleanor Whitfield",
    items: [
      { name: "Organic Sourdough Loaf", quantity: 2 },
      { name: "Wild Blueberry Jam", quantity: 1 },
    ],
    totalCents: 1485,
    status: "paid",
    placedAt: "08:14",
  },
  {
    id: "ord_2",
    orderNumber: "FM-10422",
    customer: "Marcus Oyelaran",
    items: [
      { name: "Free-Range Eggs (12)", quantity: 1 },
      { name: "Oat Milk 1L", quantity: 3 },
      { name: "Heirloom Tomatoes", quantity: 2 },
    ],
    totalCents: 2360,
    status: "packing",
    placedAt: "08:52",
  },
  {
    id: "ord_3",
    orderNumber: "FM-10423",
    customer: "Priya Raman",
    items: [{ name: "Cold-Pressed Olive Oil 500ml", quantity: 1 }],
    totalCents: 1899,
    status: "shipped",
    placedAt: "09:03",
  },
  {
    id: "ord_4",
    orderNumber: "FM-10424",
    customer: "Tomasz Nowak",
    items: [
      { name: "Dry-Aged Beef Mince 500g", quantity: 2 },
      { name: "Stone-Ground Flour 2kg", quantity: 1 },
    ],
    totalCents: 4120,
    status: "refunded",
    placedAt: "09:27",
  },
  {
    id: "ord_5",
    orderNumber: "FM-10425",
    customer: "Hannah Lindqvist",
    items: [
      { name: "Seasonal Fruit Box", quantity: 1 },
      { name: "Greek Yoghurt 500g", quantity: 2 },
    ],
    totalCents: 3275,
    status: "paid",
    placedAt: "09:41",
  },
  {
    id: "ord_6",
    orderNumber: "FM-10426",
    customer: "Daniel Okafor",
    items: [
      { name: "Single-Origin Coffee Beans 250g", quantity: 2 },
      { name: "Oat Milk 1L", quantity: 1 },
    ],
    totalCents: 2640,
    status: "packing",
    placedAt: "10:05",
  },
  {
    id: "ord_7",
    orderNumber: "FM-10427",
    customer: "Sofia Marchetti",
    items: [{ name: "Wild Salmon Fillet 400g", quantity: 1 }],
    totalCents: 1350,
    status: "shipped",
    placedAt: "10:18",
  },
  {
    id: "ord_8",
    orderNumber: "FM-10428",
    customer: "Liam Brennan",
    items: [
      { name: "Organic Sourdough Loaf", quantity: 1 },
      { name: "Cheddar Block 400g", quantity: 1 },
      { name: "Apple Cider 2L", quantity: 2 },
    ],
    totalCents: 2895,
    status: "paid",
    placedAt: "10:36",
  },
]

const STATUS_BADGE: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  paid: {
    label: "Paid",
    variant: "outline",
    className: "border-sky-300 bg-sky-50 text-sky-800",
  },
  packing: {
    label: "Packing",
    variant: "outline",
    className: "border-amber-300 bg-amber-50 text-amber-800",
  },
  shipped: {
    label: "Shipped",
    variant: "outline",
    className: "border-emerald-300 bg-emerald-50 text-emerald-800",
  },
  refunded: {
    label: "Refunded",
    variant: "outline",
    className: "border-rose-300 bg-rose-50 text-rose-800",
  },
}

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

export default function OrdersPage() {
  const [query, setQuery] = useState("")

  const filteredOrders = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return ORDERS

    return ORDERS.filter((order) => {
      const itemNames = order.items.map((item) => item.name).join(" ")
      return (
        order.orderNumber.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        itemNames.toLowerCase().includes(term) ||
        STATUS_BADGE[order.status].label.toLowerCase().includes(term)
      )
    })
  }, [query])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Today&apos;s orders
        </h1>
        <p className="text-sm text-stone-500">
          {ORDERS.length} orders placed today at Fernhill Market
        </p>
      </header>

      <div className="relative max-w-sm">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400"
          aria-hidden="true"
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

      <div className="rounded-md border border-stone-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[130px]">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-stone-500">
                  No orders match &ldquo;{query}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const status = STATUS_BADGE[order.status]
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-stone-900">
                      <div className="flex flex-col">
                        <span>{order.orderNumber}</span>
                        <span className="text-xs text-stone-500">{order.placedAt}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-stone-700">{order.customer}</TableCell>
                    <TableCell>
                      <ul className="flex flex-col gap-0.5 text-sm text-stone-600">
                        {order.items.map((item) => (
                          <li key={item.name}>
                            {item.quantity} × {item.name}
                          </li>
                        ))}
                      </ul>
                      <span className="text-xs text-stone-400">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-stone-900">
                      {currency.format(order.totalCents / 100)}
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
    </div>
  )
}
