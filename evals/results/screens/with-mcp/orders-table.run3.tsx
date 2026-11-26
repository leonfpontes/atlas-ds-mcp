import { useMemo, useState, type ReactNode } from "react"
import { CircleCheck, Package, Search, Truck, Undo2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type OrderStatus = "paid" | "packing" | "shipped" | "refunded"

type Order = {
  number: string
  customer: string
  items: number
  total: number
  status: OrderStatus
}

const ORDERS: Order[] = [
  { number: "#1042", customer: "Ana Lindqvist", items: 3, total: 84.0, status: "paid" },
  { number: "#1043", customer: "Tomás Rivera", items: 1, total: 12.5, status: "packing" },
  { number: "#1044", customer: "Priya Nair", items: 6, total: 152.75, status: "shipped" },
  { number: "#1045", customer: "Owen Clarke", items: 2, total: 39.9, status: "refunded" },
  { number: "#1046", customer: "Mei Tanaka", items: 4, total: 67.2, status: "paid" },
  { number: "#1047", customer: "Lukas Brandt", items: 2, total: 28.4, status: "packing" },
  { number: "#1048", customer: "Sofia Mendes", items: 5, total: 119.0, status: "shipped" },
]

const STATUS_BADGE: Record<OrderStatus, { label: string; variant: "success" | "warning" | "info" | "destructive"; icon: ReactNode }> = {
  paid: { label: "Paid", variant: "success", icon: <CircleCheck className="size-3" aria-hidden="true" /> },
  packing: { label: "Packing", variant: "warning", icon: <Package className="size-3" aria-hidden="true" /> },
  shipped: { label: "Shipped", variant: "info", icon: <Truck className="size-3" aria-hidden="true" /> },
  refunded: { label: "Refunded", variant: "destructive", icon: <Undo2 className="size-3" aria-hidden="true" /> },
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default function OrdersPage() {
  const [query, setQuery] = useState("")

  const visibleOrders = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ORDERS
    return ORDERS.filter(
      (order) =>
        order.number.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <main className="flex flex-col gap-6 bg-background p-6 text-foreground">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">Fernhill Market, today</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s orders</CardTitle>
          <CardDescription>
            {visibleOrders.length} of {ORDERS.length} orders shown
          </CardDescription>
          <CardAction className="w-full sm:w-72">
            <div className="flex flex-col gap-2">
              <label htmlFor="order-search" className="text-sm font-medium">
                Search orders
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="order-search"
                  type="search"
                  placeholder="Order number or customer"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardAction>
        </CardHeader>

        <CardContent>
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
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No orders match “{query}”.
                  </TableCell>
                </TableRow>
              ) : (
                visibleOrders.map((order) => {
                  const status = STATUS_BADGE[order.status]
                  return (
                    <TableRow key={order.number}>
                      <TableCell className="font-medium">{order.number}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          {status.icon}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {currency.format(order.total)}
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
