import { useEffect, useState } from "react"
import { CircleCheck, CircleX, Clock, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
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
  status: OrderStatus
  total: number
}

const ORDERS: Order[] = [
  { id: "#1048", customer: "Maya Okafor", date: "12 May 2025", status: "shipped", total: 84.0 },
  { id: "#1047", customer: "Tomás Reyes", date: "12 May 2025", status: "packing", total: 36.5 },
  { id: "#1046", customer: "Lena Hartmann", date: "11 May 2025", status: "paid", total: 129.9 },
  { id: "#1045", customer: "Sam Whitfield", date: "11 May 2025", status: "cancelled", total: 22.0 },
  { id: "#1044", customer: "Priya Nair", date: "10 May 2025", status: "paid", total: 57.25 },
  { id: "#1043", customer: "Jonas Berg", date: "10 May 2025", status: "shipped", total: 14.8 },
]

const LOADING_ROWS = 5

const STATUS_BADGE: Record<
  OrderStatus,
  {
    label: string
    variant: "success" | "warning" | "info" | "destructive"
    icon: typeof CircleCheck
  }
> = {
  paid: { label: "Paid", variant: "success", icon: CircleCheck },
  packing: { label: "Packing", variant: "warning", icon: Clock },
  shipped: { label: "Shipped", variant: "info", icon: Truck },
  cancelled: { label: "Cancelled", variant: "destructive", icon: CircleX },
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function SkeletonBar({ width }: { width: string }) {
  return <div className={`h-4 ${width} animate-pulse rounded-sm bg-muted`} />
}

function OrdersTableSkeleton() {
  return (
    <>
      <span className="sr-only">Loading orders</span>
      {Array.from({ length: LOADING_ROWS }, (_, index) => (
        <TableRow key={index} aria-hidden="true">
          <TableCell>
            <SkeletonBar width="w-14" />
          </TableCell>
          <TableCell>
            <SkeletonBar width="w-32" />
          </TableCell>
          <TableCell>
            <SkeletonBar width="w-24" />
          </TableCell>
          <TableCell>
            <SkeletonBar width="w-20" />
          </TableCell>
          <TableCell className="text-right">
            <div className="ml-auto h-4 w-16 animate-pulse rounded-sm bg-muted" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function OrdersTableRows() {
  return (
    <>
      {ORDERS.map((order) => {
        const status = STATUS_BADGE[order.status]
        const StatusIcon = status.icon

        return (
          <TableRow key={order.id}>
            <TableCell className="font-medium tabular-nums">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell className="text-muted-foreground">{order.date}</TableCell>
            <TableCell>
              <Badge variant={status.variant}>
                <StatusIcon className="size-3" aria-hidden="true" />
                {status.label}
              </Badge>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {currency.format(order.total)}
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}

export default function FernhillMarketOrdersScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1500)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Fernhill Market, last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div aria-busy={isLoading}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? <OrdersTableSkeleton /> : <OrdersTableRows />}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
