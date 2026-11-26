import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Loader2, Package, RefreshCw, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type OrderStatus = "fulfilled" | "pending" | "cancelled"

type Order = {
  id: string
  customer: string
  placedOn: string
  items: number
  total: number
  status: OrderStatus
}

const STORE_NAME = "Fernhill Market"

const ORDERS: Order[] = [
  { id: "FM-10412", customer: "Amara Okafor", placedOn: "2025-03-14", items: 4, total: 86.5, status: "fulfilled" },
  { id: "FM-10413", customer: "Liam Brennan", placedOn: "2025-03-14", items: 2, total: 24.0, status: "pending" },
  { id: "FM-10414", customer: "Sofia Marchetti", placedOn: "2025-03-13", items: 7, total: 142.25, status: "fulfilled" },
  { id: "FM-10415", customer: "Kenji Watanabe", placedOn: "2025-03-13", items: 1, total: 9.75, status: "cancelled" },
  { id: "FM-10416", customer: "Priya Raman", placedOn: "2025-03-12", items: 5, total: 63.4, status: "pending" },
  { id: "FM-10417", customer: "Tomasz Nowak", placedOn: "2025-03-12", items: 3, total: 41.9, status: "fulfilled" },
]

const SKELETON_ROWS = 5
const LOAD_DELAY_MS = 1200

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

const STATUS_BADGE: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  fulfilled: { label: "Fulfilled", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

export default function FernhillOrdersScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState("")

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setOrders(ORDERS)
      setIsLoading(false)
      if (reloadKey > 0) {
        toast.success("Orders updated")
      }
    }, LOAD_DELAY_MS)

    return () => clearTimeout(timer)
  }, [reloadKey])

  const visibleOrders = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return orders
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term)
    )
  }, [orders, query])

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-muted">
            <Package className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{STORE_NAME}</h1>
            <p className="text-sm text-muted-foreground">Manage incoming and recent orders</p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setReloadKey((key) => key + 1)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              {isLoading ? "Loading orders…" : `${visibleOrders.length} of ${orders.length} orders`}
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by order or customer"
              className="pl-8"
              disabled={isLoading}
              aria-label="Search orders"
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading &&
                Array.from({ length: SKELETON_ROWS }, (_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-36" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-8" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && visibleOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No orders match “{query}”.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                visibleOrders.map((order) => {
                  const status = STATUS_BADGE[order.status]
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {dateFormat.format(new Date(order.placedOn))}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{order.items}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {currency.format(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
