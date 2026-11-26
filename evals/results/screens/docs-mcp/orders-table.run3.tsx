import { useMemo, useState } from "react"
import { CircleCheck, Package, Search, Truck, Undo2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type OrderStatus = "paid" | "packing" | "shipped" | "refunded"

type OrderItem = {
  name: string
  quantity: number
}

type Order = {
  id: string
  number: string
  customer: string
  items: OrderItem[]
  total: number
  status: OrderStatus
}

const ORDERS: Order[] = [
  {
    id: "ord_1001",
    number: "#1048",
    customer: "Amara Okafor",
    items: [
      { name: "Sourdough loaf", quantity: 1 },
      { name: "Oat milk 1 L", quantity: 2 },
    ],
    total: 14.5,
    status: "paid",
  },
  {
    id: "ord_1002",
    number: "#1049",
    customer: "Lukas Brandt",
    items: [
      { name: "Organic eggs (12)", quantity: 1 },
      { name: "Cheddar 400 g", quantity: 1 },
      { name: "Apples 1 kg", quantity: 2 },
    ],
    total: 38.2,
    status: "packing",
  },
  {
    id: "ord_1003",
    number: "#1050",
    customer: "Priya Raman",
    items: [{ name: "Single-origin coffee 250 g", quantity: 3 }],
    total: 61.75,
    status: "shipped",
  },
  {
    id: "ord_1004",
    number: "#1051",
    customer: "Tomás Herrera",
    items: [
      { name: "Olive oil 500 ml", quantity: 1 },
      { name: "Dark chocolate 70%", quantity: 4 },
    ],
    total: 27.9,
    status: "refunded",
  },
  {
    id: "ord_1005",
    number: "#1052",
    customer: "Hannah Lindqvist",
    items: [
      { name: "Mixed salad box", quantity: 1 },
      { name: "Sparkling water 6-pack", quantity: 2 },
    ],
    total: 46.4,
    status: "paid",
  },
  {
    id: "ord_1006",
    number: "#1053",
    customer: "Diego Morales",
    items: [
      { name: "Free-range chicken 1.5 kg", quantity: 1 },
      { name: "Basmati rice 2 kg", quantity: 1 },
    ],
    total: 32.6,
    status: "packing",
  },
  {
    id: "ord_1007",
    number: "#1054",
    customer: "Ingrid Solberg",
    items: [{ name: "Seasonal fruit box", quantity: 1 }],
    total: 22.0,
    status: "shipped",
  },
]

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string
    variant: "success" | "warning" | "info" | "destructive"
    icon: typeof CircleCheck
  }
> = {
  paid: { label: "Paid", variant: "success", icon: CircleCheck },
  packing: { label: "Packing", variant: "warning", icon: Package },
  shipped: { label: "Shipped", variant: "info", icon: Truck },
  refunded: { label: "Refunded", variant: "destructive", icon: Undo2 },
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function formatItems(items: OrderItem[]): string {
  return items.map((item) => `${item.quantity} × ${item.name}`).join(", ")
}

export default function OrdersPage() {
  const [query, setQuery] = useState("")

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (normalized === "") return ORDERS

    return ORDERS.filter(
      (order) =>
        order.number.toLowerCase().includes(normalized) ||
        order.customer.toLowerCase().includes(normalized)
    )
  }, [query])

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 bg-background p-6 text-foreground">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Fernhill Market orders placed today.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:max-w-sm">
        <label htmlFor="order-search" className="text-sm font-medium">
          Search orders
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="order-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Order number or customer"
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s orders</CardTitle>
          <CardDescription>
            {filteredOrders.length} of {ORDERS.length} orders shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No orders match &ldquo;{query.trim()}&rdquo;.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const status = STATUS_CONFIG[order.status]
                  const StatusIcon = status.icon

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.number}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatItems(order.items)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {currencyFormatter.format(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          <StatusIcon aria-hidden="true" className="size-3.5" />
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
