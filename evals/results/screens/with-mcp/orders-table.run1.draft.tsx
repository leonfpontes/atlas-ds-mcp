import { useMemo, useState } from "react"
import { CircleCheck, Package, Search, Truck, Undo2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type OrderStatus = "paid" | "packing" | "shipped" | "refunded"

type Order = {
  number: string
  customer: string
  items: string
  total: number
  status: OrderStatus
}

const ORDERS: Order[] = [
  { number: "#1042", customer: "Maya Lindqvist", items: "Sourdough loaf, Oat milk (2)", total: 14.5, status: "paid" },
  { number: "#1043", customer: "Tomás Herrera", items: "Free-range eggs (12), Butter", total: 9.8, status: "packing" },
  { number: "#1044", customer: "Priya Raman", items: "Heirloom tomatoes (1 kg), Basil", total: 22.3, status: "shipped" },
  { number: "#1045", customer: "Oliver Brandt", items: "Espresso beans, Almond croissant (4)", total: 31.0, status: "refunded" },
  { number: "#1046", customer: "Aisha Bello", items: "Greek yogurt, Honey, Granola", total: 18.75, status: "packing" },
  { number: "#1047", customer: "Jonas Keller", items: "Apple juice (6), Cheddar wedge", total: 16.4, status: "paid" },
  { number: "#1048", customer: "Sofia Marchetti", items: "Salmon fillet (2), Lemons (3)", total: 42.9, status: "shipped" },
]

const STATUS_BADGE: Record<OrderStatus, { label: string; variant: "success" | "warning" | "info" | "secondary"; icon: React.ReactNode }> = {
  paid: { label: "Paid", variant: "success", icon: <CircleCheck /> },
  packing: { label: "Packing", variant: "warning", icon: <Package /> },
  shipped: { label: "Shipped", variant: "info", icon: <Truck /> },
  refunded: { label: "Refunded", variant: "secondary", icon: <Undo2 /> },
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
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 bg-background p-6 text-foreground">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">Fernhill Market, today</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s orders</CardTitle>
          <CardDescription>
            {visibleOrders.length} of {ORDERS.length} orders shown
          </CardDescription>
          <CardAction>
            <Badge variant="warning">Example data</Badge>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex max-w-sm flex-col gap-2">
            <label htmlFor="order-search" className="text-sm font-medium">
              Search orders
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
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
                    No orders match “{query.trim()}”.
                  </TableCell>
                </TableRow>
              ) : (
                visibleOrders.map((order) => {
                  const status = STATUS_BADGE[order.status]
                  return (
                    <TableRow key={order.number}>
                      <TableCell className="font-medium">{order.number}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="text-muted-foreground">{order.items}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          {status.icon}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{currency.format(order.total)}</TableCell>
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
