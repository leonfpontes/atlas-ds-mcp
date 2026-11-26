import { useEffect, useState } from "react"
import { CircleCheck, CircleX, Package, Truck, type LucideIcon } from "lucide-react"
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
  items: number
  total: number
}

const ORDERS: Order[] = [
  { id: "#1048", customer: "Elena Marsh", date: "Mar 14, 2025", status: "paid", items: 3, total: 84.0 },
  { id: "#1047", customer: "Tomás Reyes", date: "Mar 14, 2025", status: "packing", items: 6, total: 152.5 },
  { id: "#1046", customer: "Priya Nair", date: "Mar 13, 2025", status: "shipped", items: 2, total: 39.9 },
  { id: "#1045", customer: "Daniel Okafor", date: "Mar 13, 2025", status: "refunded", items: 1, total: 18.75 },
  { id: "#1044", customer: "Greta Lindqvist", date: "Mar 12, 2025", status: "paid", items: 4, total: 112.2 },
  { id: "#1043", customer: "Hiro Tanaka", date: "Mar 12, 2025", status: "shipped", items: 5, total: 96.4 },
]

const STATUS: Record<
  OrderStatus,
  { label: string; variant: "success" | "warning" | "info" | "destructive"; icon: LucideIcon }
> = {
  paid: { label: "Paid", variant: "success", icon: CircleCheck },
  packing: { label: "Packing", variant: "warning", icon: Package },
  shipped: { label: "Shipped", variant: "info", icon: Truck },
  refunded: { label: "Refunded", variant: "destructive", icon: CircleX },
}

const SKELETON_ROWS = 5
const LOAD_DELAY_MS = 1500

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

function SkeletonBar({ className }: { className: string }) {
  return <div className={`h-4 animate-pulse rounded-sm bg-muted ${className}`} />
}

export default function FernhillOrdersPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), LOAD_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Fernhill Market · Last 30 days</CardDescription>
          <CardAction>
            <Badge variant="warning">Example data</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div aria-busy={isLoading} aria-live="polite">
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
                {isLoading
                  ? Array.from({ length: SKELETON_ROWS }, (_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        <TableCell>
                          <SkeletonBar className="w-16" />
                        </TableCell>
                        <TableCell>
                          <SkeletonBar className="w-32" />
                        </TableCell>
                        <TableCell>
                          <SkeletonBar className="w-28" />
                        </TableCell>
                        <TableCell>
                          <SkeletonBar className="w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <SkeletonBar className="ml-auto w-8" />
                        </TableCell>
                        <TableCell className="text-right">
                          <SkeletonBar className="ml-auto w-16" />
                        </TableCell>
                      </TableRow>
                    ))
                  : ORDERS.map((order) => {
                      const status = STATUS[order.status]
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
                          <TableCell className="text-right">{order.items}</TableCell>
                          <TableCell className="text-right">{currency.format(order.total)}</TableCell>
                        </TableRow>
                      )
                    })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
