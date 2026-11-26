import { useEffect, useState } from "react"
import { CircleAlert, CircleCheck, Clock, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"

type OrderStatus = "paid" | "packing" | "shipped" | "refunded"

type Order = {
  id: string
  customer: string
  date: string
  status: OrderStatus
  items: number
  total: number
}

const ORDERS: Order[] = [
  { id: "#1048", customer: "Maya Lindqvist", date: "12 May 2025", status: "paid", items: 4, total: 84.0 },
  { id: "#1047", customer: "Owen Carter", date: "12 May 2025", status: "packing", items: 2, total: 31.5 },
  { id: "#1046", customer: "Priya Natarajan", date: "11 May 2025", status: "shipped", items: 7, total: 162.25 },
  { id: "#1045", customer: "Tomás Herrera", date: "11 May 2025", status: "paid", items: 1, total: 12.9 },
  { id: "#1044", customer: "Hannah Specht", date: "10 May 2025", status: "refunded", items: 3, total: 47.8 },
]

const SKELETON_ROWS = 5
const LOAD_DELAY_MS = 1200

const STATUS_BADGE: Record<OrderStatus, { label: string; variant: "success" | "warning" | "info" | "destructive"; icon: typeof CircleCheck }> = {
  paid: { label: "Paid", variant: "success", icon: CircleCheck },
  packing: { label: "Packing", variant: "warning", icon: Clock },
  shipped: { label: "Shipped", variant: "info", icon: Truck },
  refunded: { label: "Refunded", variant: "destructive", icon: CircleAlert },
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

function OrdersSkeletonRows() {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <TableRow key={index}>
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
          <TableCell className="text-right">
            <div className="ml-auto h-4 w-12 animate-pulse rounded-sm bg-muted" />
          </TableCell>
          <TableCell className="text-right">
            <div className="ml-auto h-4 w-16 animate-pulse rounded-sm bg-muted" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export default function FernhillOrdersPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrders(ORDERS)
      setIsLoading(false)
    }, LOAD_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Fernhill Market, latest orders</CardDescription>
          <CardAction>
            <Badge variant="warning">
              <CircleAlert />
              Example data
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div aria-busy={isLoading} aria-live="polite">
            {isLoading && <span className="sr-only">Loading orders</span>}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <OrdersSkeletonRows />
                ) : (
                  orders.map((order) => {
                    const status = STATUS_BADGE[order.status]
                    const StatusIcon = status.icon
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>
                            <StatusIcon />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{order.items}</TableCell>
                        <TableCell className="text-right tabular-nums">{currency.format(order.total)}</TableCell>
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
