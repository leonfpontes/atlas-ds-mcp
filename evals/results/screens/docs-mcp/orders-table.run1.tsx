import { useMemo, useState } from "react"
import { CircleCheck, Package, RotateCcw, Search, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  items: string[]
  total: number
  status: OrderStatus
}

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
  refunded: { label: "Refunded", variant: "destructive", icon: RotateCcw },
}

const ORDERS: Order[] = [
  {
    id: "ord_1042",
    orderNumber: "#1042",
    customer: "Maya Lindqvist",
    items: ["Sourdough loaf", "Oat milk 1 L", "Strawberry jam"],
    total: 84.0,
    status: "paid",
  },
  {
    id: "ord_1043",
    orderNumber: "#1043",
    customer: "Tomás Herrera",
    items: ["Organic eggs (12)", "Greek yogurt"],
    total: 31.5,
    status: "packing",
  },
  {
    id: "ord_1044",
    orderNumber: "#1044",
    customer: "Priya Raman",
    items: ["Coffee beans 500 g", "Oat milk 1 L", "Dark chocolate bar"],
    total: 52.25,
    status: "shipped",
  },
  {
    id: "ord_1045",
    orderNumber: "#1045",
    customer: "Jonas Becker",
    items: ["Cheddar 400 g"],
    total: 12.9,
    status: "refunded",
  },
  {
    id: "ord_1046",
    orderNumber: "#1046",
    customer: "Aisha Okafor",
    items: ["Mixed greens", "Cherry tomatoes", "Feta 200 g", "Olive oil 500 ml"],
    total: 67.4,
    status: "paid",
  },
  {
    id: "ord_1047",
    orderNumber: "#1047",
    customer: "Lukas Novak",
    items: ["Apple juice 2 L", "Rye crispbread"],
    total: 18.75,
    status: "packing",
  },
  {
    id: "ord_1048",
    orderNumber: "#1048",
    customer: "Sofia Bianchi",
    items: ["Pasta set", "Tomato passata", "Parmesan 250 g"],
    total: 43.1,
    status: "shipped",
  },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function OrdersPage() {
  const [query, setQuery] = useState("")

  const visibleOrders = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ORDERS
    return ORDERS.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 bg-background p-6 text-foreground">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Fernhill Market orders placed today.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s orders</CardTitle>
          <CardDescription>
            {visibleOrders.length} of {ORDERS.length} orders shown
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="order-search"
              className="text-sm font-medium text-foreground"
            >
              Search orders
            </label>
            <div className="relative max-w-sm">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="order-search"
                type="search"
                placeholder="Order number or customer"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-md border border-border">
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
                {visibleOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No orders match &ldquo;{query.trim()}&rdquo;.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleOrders.map((order) => {
                    const status = STATUS_CONFIG[order.status]
                    const StatusIcon = status.icon
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="flex flex-col gap-0.5">
                            <span>
                              {order.items.length}{" "}
                              {order.items.length === 1 ? "item" : "items"}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {order.items.join(", ")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {currency.format(order.total)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>
                            <StatusIcon aria-hidden="true" />
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
        </CardContent>
      </Card>
    </main>
  )
}
