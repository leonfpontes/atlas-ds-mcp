import { useMemo, useState, type ReactNode } from "react"
import { CircleCheck, Package, Truck, RotateCcw, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"

type OrderStatus = "paid" | "packing" | "shipped" | "refunded"

type Order = {
  id: string
  number: string
  customer: string
  items: number
  total: number
  status: OrderStatus
}

const ORDERS: Order[] = [
  { id: "1", number: "#FM-1042", customer: "Ada Lovelace", items: 3, total: 84.0, status: "paid" },
  { id: "2", number: "#FM-1043", customer: "Grace Hopper", items: 1, total: 12.5, status: "packing" },
  { id: "3", number: "#FM-1044", customer: "Alan Turing", items: 5, total: 136.75, status: "shipped" },
  { id: "4", number: "#FM-1045", customer: "Katherine Johnson", items: 2, total: 41.2, status: "refunded" },
  { id: "5", number: "#FM-1046", customer: "Linus Pauling", items: 4, total: 67.9, status: "paid" },
  { id: "6", number: "#FM-1047", customer: "Rosalind Franklin", items: 2, total: 29.0, status: "packing" },
]

const STATUS_BADGE: Record<OrderStatus, { label: string; variant: "success" | "warning" | "info" | "destructive"; icon: ReactNode }> = {
  paid: { label: "Paid", variant: "success", icon: <CircleCheck className="size-3" aria-hidden="true" /> },
  packing: { label: "Packing", variant: "warning", icon: <Package className="size-3" aria-hidden="true" /> },
  shipped: { label: "Shipped", variant: "info", icon: <Truck className="size-3" aria-hidden="true" /> },
  refunded: { label: "Refunded", variant: "destructive", icon: <RotateCcw className="size-3" aria-hidden="true" /> },
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default function OrdersPage() {
  const [query, setQuery] = useState("")

  const visibleOrders = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ORDERS
    return ORDERS.filter(
      (order) =>
        order.number.toLowerCase().includes(q) || order.customer.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">Fernhill Market, today</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's orders</CardTitle>
          <CardDescription>
            {visibleOrders.length} of {ORDERS.length} orders shown
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex max-w-sm flex-col gap-2">
            <label htmlFor="order-search" className="text-sm font-medium text-foreground">
              Search orders
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
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
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.number}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="gap-1">
                          {status.icon}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{currency.format(order.total)}</TableCell>
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
