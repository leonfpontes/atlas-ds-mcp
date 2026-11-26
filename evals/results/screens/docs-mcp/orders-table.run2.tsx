import { useMemo, useState } from "react"
import { CircleCheck, Package, RotateCcw, Truck, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  customer: string
  items: string[]
  totalCents: number
  status: OrderStatus
}

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string
    variant: "success" | "warning" | "info" | "destructive"
    icon: LucideIcon
  }
> = {
  paid: { label: "Paid", variant: "success", icon: CircleCheck },
  packing: { label: "Packing", variant: "warning", icon: Package },
  shipped: { label: "Shipped", variant: "info", icon: Truck },
  refunded: { label: "Refunded", variant: "destructive", icon: RotateCcw },
}

const ORDERS: Order[] = [
  {
    id: "FM-1048",
    customer: "Elena Marsh",
    items: ["Sourdough loaf", "Oat milk 1 L", "Free-range eggs (12)"],
    totalCents: 3850,
    status: "packing",
  },
  {
    id: "FM-1047",
    customer: "Tomas Reyes",
    items: ["Organic apples (2 kg)", "Greek yogurt"],
    totalCents: 1720,
    status: "paid",
  },
  {
    id: "FM-1046",
    customer: "Priya Nair",
    items: ["Cold-brew coffee (4-pack)", "Dark chocolate bar"],
    totalCents: 2490,
    status: "shipped",
  },
  {
    id: "FM-1045",
    customer: "Daniel Okafor",
    items: ["Wild salmon fillet", "Lemons (6)", "Basmati rice 2 kg"],
    totalCents: 6315,
    status: "paid",
  },
  {
    id: "FM-1044",
    customer: "Hannah Lindqvist",
    items: ["Cheese board selection"],
    totalCents: 4200,
    status: "refunded",
  },
  {
    id: "FM-1043",
    customer: "Marco Rossi",
    items: ["Espresso beans 500 g", "Almond croissants (4)"],
    totalCents: 2960,
    status: "shipped",
  },
  {
    id: "FM-1042",
    customer: "Aiko Tanaka",
    items: ["Mixed greens", "Cherry tomatoes", "Feta 200 g"],
    totalCents: 1385,
    status: "packing",
  },
  {
    id: "FM-1041",
    customer: "Sam Whitfield",
    items: ["Sparkling water (12)", "Ginger beer (6)"],
    totalCents: 2275,
    status: "paid",
  },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function OrdersPage() {
  const [query, setQuery] = useState("")

  const visibleOrders = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (term === "") return ORDERS
    return ORDERS.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term)
    )
  }, [query])

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market, orders placed today.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s orders</CardTitle>
            <CardDescription>
              {visibleOrders.length} of {ORDERS.length} orders shown
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex max-w-sm flex-col gap-2">
              <label
                htmlFor="order-search"
                className="text-sm font-medium text-foreground"
              >
                Search orders
              </label>
              <Input
                id="order-search"
                type="search"
                placeholder="Order number or customer"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No orders match &quot;{query.trim()}&quot;.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleOrders.map((order) => {
                    const status = STATUS_CONFIG[order.status]
                    const StatusIcon = status.icon
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium tabular-nums">
                          {order.id}
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">
                          {order.items.join(", ")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="gap-1">
                            <StatusIcon aria-hidden="true" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {currency.format(order.totalCents / 100)}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
