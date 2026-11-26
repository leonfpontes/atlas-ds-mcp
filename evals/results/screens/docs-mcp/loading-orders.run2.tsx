import { useEffect, useState } from "react"
import {
  CircleCheck,
  CircleX,
  Package,
  Truck,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

type OrderStatus = "paid" | "packing" | "shipped" | "refunded"

type Order = {
  id: string
  customer: string
  date: string
  status: OrderStatus
  total: number
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
  refunded: { label: "Refunded", variant: "destructive", icon: CircleX },
}

const ORDERS: Order[] = [
  { id: "#1048", customer: "Elena Morales", date: "Mar 14, 2025", status: "packing", total: 126.5 },
  { id: "#1047", customer: "Samuel Okafor", date: "Mar 14, 2025", status: "paid", total: 84.0 },
  { id: "#1046", customer: "Priya Raman", date: "Mar 13, 2025", status: "shipped", total: 212.35 },
  { id: "#1045", customer: "Tomas Lindqvist", date: "Mar 13, 2025", status: "paid", total: 39.9 },
  { id: "#1044", customer: "Grace Whitfield", date: "Mar 12, 2025", status: "refunded", total: 57.25 },
  { id: "#1043", customer: "Daniel Ortiz", date: "Mar 12, 2025", status: "shipped", total: 143.8 },
  { id: "#1042", customer: "Aiko Tanaka", date: "Mar 11, 2025", status: "paid", total: 96.4 },
]

const SKELETON_ROWS = [
  { id: "a", widths: ["w-16", "w-32", "w-24", "w-20", "w-14"] },
  { id: "b", widths: ["w-16", "w-28", "w-24", "w-20", "w-14"] },
  { id: "c", widths: ["w-16", "w-36", "w-24", "w-20", "w-14"] },
  { id: "d", widths: ["w-16", "w-24", "w-24", "w-20", "w-14"] },
  { id: "e", widths: ["w-16", "w-32", "w-24", "w-20", "w-14"] },
]

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function SkeletonBar({ className }: { className: string }) {
  return <div className={`h-4 rounded-sm bg-muted animate-pulse ${className}`} />
}

function OrdersTableSkeleton() {
  return (
    <Table aria-busy="true" aria-label="Loading orders">
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
        {SKELETON_ROWS.map((row) => (
          <TableRow key={row.id}>
            {row.widths.map((width, index) => (
              <TableCell
                key={index}
                className={index === 4 ? "text-right" : undefined}
              >
                <SkeletonBar
                  className={`${width} ${index === 4 ? "ml-auto" : ""}`}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function OrdersTable({ orders }: { orders: Order[] }) {
  return (
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
        {orders.map((order) => {
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
              <TableCell className="text-right tabular-nums">
                {currencyFormatter.format(order.total)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default function FernhillOrdersScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrders(ORDERS)
      setIsLoading(false)
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background p-6 text-foreground md:p-10">
      <div className="mx-auto max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>
              Fernhill Market · Last 30 days
            </CardDescription>
            <CardAction>
              <Badge variant="warning">
                <TriangleAlert />
                Example data
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {isLoading ? <OrdersTableSkeleton /> : <OrdersTable orders={orders} />}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
