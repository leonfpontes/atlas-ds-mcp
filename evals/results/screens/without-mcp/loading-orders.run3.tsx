import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { RefreshCw, Search, Store } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type OrderStatus = "paid" | "pending" | "shipped" | "refunded"

type Order = {
  id: string
  customer: string
  placedAt: string
  items: number
  total: number
  status: OrderStatus
}

const STORE_NAME = "Fernhill Market"
const LOAD_DELAY_MS = 1500
const SKELETON_ROW_COUNT = 5

const ORDERS: Order[] = [
  { id: "FM-10482", customer: "Ava Thompson", placedAt: "2025-03-14", items: 3, total: 84.5, status: "shipped" },
  { id: "FM-10481", customer: "Liam Okafor", placedAt: "2025-03-14", items: 1, total: 23.0, status: "paid" },
  { id: "FM-10480", customer: "SofiaRamirez", placedAt: "2025-03-13", items: 6, total: 152.75, status: "pending" },
  { id: "FM-10479", customer: "Noah Brennan", placedAt: "2025-03-13", items: 2, total: 41.2, status: "refunded" },
  { id: "FM-10478", customer: "Mei Tanaka", placedAt: "2025-03-12", items: 4, total: 96.4, status: "shipped" },
  { id: "FM-10477", customer: "Ethan Clarke", placedAt: "2025-03-12", items: 1, total: 15.99, status: "paid" },
  { id: "FM-10476", customer: "Isabella Moore", placedAt: "2025-03-11", items: 5, total: 128.0, status: "pending" },
]

const STATUS_BADGE: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  paid: { label: "Paid", variant: "default" },
  pending: { label: "Pending", variant: "secondary" },
  shipped: { label: "Shipped", variant: "outline" },
  refunded: { label: "Refunded", variant: "destructive" },
}

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

export default function FernhillMarketOrdersScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState("")

  useEffect(() => {
    setIsLoading(true)
    const timer = window.setTimeout(() => {
      setIsLoading(false)
      toast.success(`Loaded ${ORDERS.length} orders`)
    }, LOAD_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [reloadKey])

  const visibleOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return ORDERS
    return ORDERS.filter(
      (order) =>
        order.id.toLowerCase().includes(normalized) ||
        order.customer.toLowerCase().includes(normalized)
    )
  }, [query])

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <Store className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none">{STORE_NAME}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Recent orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by order or customer"
                disabled={isLoading}
                className="w-64 pl-8"
                aria-label="Search orders"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setReloadKey((key) => key + 1)}
              disabled={isLoading}
              aria-label="Refresh orders"
            >
              <RefreshCw className={isLoading ? "animate-spin" : undefined} />
            </Button>
          </div>
        </div>

        <Table>
          <TableCaption>
            {isLoading
              ? "Loading orders…"
              : `Showing ${visibleOrders.length} of ${ORDERS.length} orders`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell className="pl-6">
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
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell className="pr-6">
                    <Skeleton className="h-5 w-20 rounded-full" />
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

            {!isLoading &&
              visibleOrders.map((order) => {
                const status = STATUS_BADGE[order.status]
                return (
                  <TableRow key={order.id}>
                    <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {dateFormat.format(new Date(order.placedAt))}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{order.items}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currencyFormat.format(order.total)}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
