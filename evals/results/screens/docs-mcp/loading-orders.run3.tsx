import { useEffect, useState } from "react"
import { CircleCheck, CircleX, Download, Package, Truck, TriangleAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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

type OrderStatus = "paid" | "packing" | "shipped" | "cancelled"

type Order = {
  id: string
  customer: string
  date: string
  items: number
  status: OrderStatus
  total: number
}

const LOAD_DELAY_MS = 1500

const ORDERS: Order[] = [
  { id: "#1042", customer: "Maya Lindqvist", date: "12 May 2025", items: 3, status: "paid", total: 84.0 },
  { id: "#1041", customer: "Owen Carter", date: "12 May 2025", items: 1, status: "packing", total: 23.5 },
  { id: "#1040", customer: "Priya Raman", date: "11 May 2025", items: 6, status: "shipped", total: 156.2 },
  { id: "#1039", customer: "Tomás Herrera", date: "11 May 2025", items: 2, status: "cancelled", total: 41.0 },
  { id: "#1038", customer: "Ada Whitfield", date: "10 May 2025", items: 4, status: "paid", total: 92.75 },
  { id: "#1037", customer: "Kenji Mori", date: "10 May 2025", items: 2, status: "packing", total: 37.9 },
]

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string
    variant: "success" | "warning" | "info" | "destructive"
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  paid: { label: "Paid", variant: "success", icon: CircleCheck },
  packing: { label: "Packing", variant: "warning", icon: Package },
  shipped: { label: "Shipped", variant: "info", icon: Truck },
  cancelled: { label: "Cancelled", variant: "destructive", icon: CircleX },
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const SKELETON_ROWS = 5

function OrdersSkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }, (_, row) => (
        <TableRow key={row} aria-hidden="true">
          <TableCell>
            <div className="h-4 w-16 animate-pulse rounded-sm bg-muted" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-36 animate-pulse rounded-sm bg-muted" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-24 animate-pulse rounded-sm bg-muted" />
          </TableCell>
          <TableCell>
            <div className="h-5 w-20 animate-pulse rounded-sm bg-muted" />
          </TableCell>
          <TableCell>
            <div className="h-4 w-10 animate-pulse rounded-sm bg-muted" />
          </TableCell>
          <TableCell className="text-right">
            <div className="ml-auto h-4 w-16 animate-pulse rounded-sm bg-muted" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), LOAD_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background p-6 text-foreground md:p-10">
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Fernhill Market · Last 30 days</CardDescription>
            <CardAction>
              <Button variant="outline">
                <Download />
                Export orders
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <div aria-busy={isLoading} aria-live="polite">
              {isLoading && <span className="sr-only">Loading orders</span>}

              {!isLoading && (
                <div className="mb-4 flex items-center gap-2">
                  <Badge variant="warning">
                    <TriangleAlert />
                    Example data
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {ORDERS.length} orders shown
                  </span>
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <OrdersSkeletonRows />
                  ) : (
                    ORDERS.map((order) => {
                      const status = STATUS_CONFIG[order.status]
                      const StatusIcon = status.icon
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="text-muted-foreground">{order.date}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              <StatusIcon />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {currency.format(order.total)}
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
      </div>
    </main>
  )
}
