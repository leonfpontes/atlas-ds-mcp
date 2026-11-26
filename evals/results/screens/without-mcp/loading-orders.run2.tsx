import { useCallback, useEffect, useMemo, useState } from "react"
import { Package, RefreshCw, Search } from "lucide-react"
import { Toaster, toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

type OrderStatus = "pending" | "paid" | "fulfilled" | "refunded"

type Order = {
  id: string
  customer: string
  placedAt: string
  items: number
  total: number
  status: OrderStatus
}

const STORE_NAME = "Fernhill Market"
const LOAD_DELAY_MS = 1200
const SKELETON_ROWS = 6

const ORDERS: Order[] = [
  { id: "FM-10482", customer: "Amara Okafor", placedAt: "2025-06-18", items: 4, total: 86.5, status: "fulfilled" },
  { id: "FM-10481", customer: "Lukas Brandt", placedAt: "2025-06-18", items: 1, total: 24.0, status: "paid" },
  { id: "FM-10480", customer: "Priya Raman", placedAt: "2025-06-17", items: 7, total: 142.75, status: "pending" },
  { id: "FM-10479", customer: "Sofia Mendes", placedAt: "2025-06-17", items: 2, total: 39.9, status: "fulfilled" },
  { id: "FM-10478", customer: "Jonas Keller", placedAt: "2025-06-16", items: 3, total: 61.2, status: "refunded" },
  { id: "FM-10477", customer: "Hana Yamamoto", placedAt: "2025-06-16", items: 5, total: 98.45, status: "paid" },
  { id: "FM-10476", customer: "Diego Ruiz", placedAt: "2025-06-15", items: 2, total: 27.6, status: "fulfilled" },
  { id: "FM-10475", customer: "Ingrid Solberg", placedAt: "2025-06-15", items: 9, total: 215.0, status: "pending" },
]

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  fulfilled: "Fulfilled",
  refunded: "Refunded",
}

const STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  paid: "secondary",
  fulfilled: "default",
  refunded: "destructive",
}

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function formatDate(isoDate: string) {
  return dateFormat.format(new Date(`${isoDate}T00:00:00`))
}

export default function FernhillOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")

  const fetchOrders = useCallback(() => {
    setIsLoading(true)
    return new Promise<Order[]>((resolve) => {
      window.setTimeout(() => resolve(ORDERS), LOAD_DELAY_MS)
    })
  }, [])

  useEffect(() => {
    let active = true
    fetchOrders().then((data) => {
      if (!active) return
      setOrders(data)
      setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [fetchOrders])

  const handleRefresh = async () => {
    const data = await fetchOrders()
    setOrders(data)
    setIsLoading(false)
    toast.success("Orders updated")
  }

  const visibleOrders = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return orders
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q)
    )
  }, [orders, query])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Package className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{STORE_NAME}</h1>
              <p className="text-sm text-muted-foreground">Orders</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by order or customer"
              className="pl-8"
              aria-label="Search orders"
            />
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {isLoading
              ? "Loading orders..."
              : `${visibleOrders.length} of ${orders.length} orders`}
          </p>
        </div>

        <div className="rounded-lg border bg-card">
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
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-8" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                visibleOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium tabular-nums">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.placedAt)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{order.items}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currencyFormat.format(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[order.status]}>
                        {STATUS_LABEL[order.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading && visibleOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No orders match “{query.trim()}”.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
