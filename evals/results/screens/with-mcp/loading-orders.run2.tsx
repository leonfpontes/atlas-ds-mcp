import { useEffect, useState } from "react"
import { CircleCheck, CircleX, Clock, Truck, TriangleAlert } from "lucide-react"
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
  items: number
  status: OrderStatus
  total: string
}

const LOAD_DELAY_MS = 1200
const SKELETON_ROWS = 5

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
  refunded: { label: "Refunded", variant: "destructive", icon: CircleX },
}

const ORDERS: Order[] = [
  {
    id: "#1042",
    customer: "Maya Lindqvist",
    date: "Mar 3, 2025",
    items: 4,
    status: "paid",
    total: "$84.00",
  },
  {
    id: "#1041",
    customer: "Tomás Herrera",
    date: "Mar 3, 2025",
    items: 2,
    status: "packing",
    total: "$36.50",
  },
  {
    id: "#1040",
    customer: "Priya Raman",
    date: "Mar 2, 2025",
    items: 7,
    status: "shipped",
    total: "$142.25",
  },
  {
    id: "#1039",
    customer: "Owen Brooks",
    date: "Mar 2, 2025",
    items: 1,
    status: "refunded",
    total: "$18.00",
  },
  {
    id: "#1038",
    customer: "Ana Beltrán",
    date: "Mar 1, 2025",
    items: 3,
    status: "paid",
    total: "$57.90",
  },
]

export default function FernhillOrdersPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), LOAD_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Fernhill Market · Last 30 days</CardDescription>
          <CardAction>
            <Badge variant="warning">
              <TriangleAlert />
              Example data
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table aria-busy={isLoading}>
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
              {isLoading
                ? Array.from({ length: SKELETON_ROWS }, (_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <div className="h-4 w-14 animate-pulse rounded-sm bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-36 animate-pulse rounded-sm bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-24 animate-pulse rounded-sm bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-20 animate-pulse rounded-sm bg-muted" />
                      </TableCell>
                      <TableCell>
                        <div className="ml-auto h-4 w-16 animate-pulse rounded-sm bg-muted" />
                      </TableCell>
                    </TableRow>
                  ))
                : ORDERS.map((order) => {
                    const status = STATUS_BADGE[order.status]
                    const StatusIcon = status.icon
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {order.date}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>
                            <StatusIcon />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{order.total}</TableCell>
                      </TableRow>
                    )
                  })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
