import { useState } from "react"
import {
  CalendarDays,
  CircleCheck,
  CircleX,
  Crown,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  TriangleAlert,
} from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

type OrderStatus = "Delivered" | "Shipped" | "Packing" | "Cancelled"

type Order = {
  id: string
  date: string
  items: number
  total: string
  status: OrderStatus
}

const CUSTOMER = {
  name: "Hannah Brooks",
  customerId: "FM-20418",
  email: "hannah.brooks@example.com",
  phone: "+1 (555) 014-2290",
  address: "218 Alder Street, Apt 4B, Portland, OR 97209",
  memberSince: "March 2021",
  tier: "Gold",
  points: 1240,
  nextTier: "Platinum",
  pointsToNextTier: 760,
  pointsForNextTier: 2000,
}

const ORDERS: Order[] = [
  { id: "#1048", date: "14 May 2025", items: 6, total: "$84.20", status: "Shipped" },
  { id: "#1041", date: "02 May 2025", items: 3, total: "$29.75", status: "Delivered" },
  { id: "#1036", date: "24 Apr 2025", items: 11, total: "$142.10", status: "Delivered" },
  { id: "#1029", date: "11 Apr 2025", items: 2, total: "$18.40", status: "Cancelled" },
  { id: "#1022", date: "29 Mar 2025", items: 8, total: "$96.00", status: "Delivered" },
  { id: "#1017", date: "15 Mar 2025", items: 4, total: "$51.35", status: "Delivered" },
  { id: "#1011", date: "03 Mar 2025", items: 9, total: "$117.80", status: "Delivered" },
  { id: "#1006", date: "18 Feb 2025", items: 5, total: "$63.25", status: "Delivered" },
  { id: "#999", date: "04 Feb 2025", items: 7, total: "$88.90", status: "Delivered" },
  { id: "#993", date: "21 Jan 2025", items: 1, total: "$12.60", status: "Delivered" },
]

const STATUS_BADGE: Record<
  OrderStatus,
  { variant: "success" | "warning" | "info" | "destructive"; label: string; icon: React.ReactNode }
> = {
  Delivered: { variant: "success", label: "Delivered", icon: <CircleCheck /> },
  Shipped: { variant: "info", label: "Shipped", icon: <Truck /> },
  Packing: { variant: "warning", label: "Packing", icon: <Package /> },
  Cancelled: { variant: "destructive", label: "Cancelled", icon: <CircleX /> },
}

const INITIAL_NOTE = "Prefers email over phone. Asked about a delivery delay on order #1029 in April."

export default function CustomerProfilePage() {
  const [note, setNote] = useState(INITIAL_NOTE)

  const progress = Math.round(
    (CUSTOMER.points / CUSTOMER.pointsForNextTier) * 100
  )

  function handleSaveNote() {
    toast.success("Note saved to customer profile")
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <Toaster />

      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Example data</AlertTitle>
        <AlertDescription>
          These customer records are placeholders. Connect the profile to live data before use.
        </AlertDescription>
      </Alert>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Customer {CUSTOMER.customerId}</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold">{CUSTOMER.name}</h1>
            <Badge variant="info">
              <Crown />
              {CUSTOMER.tier} tier
            </Badge>
          </div>
        </div>
        <Button variant="outline">
          <Mail />
          Email customer
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
            <CardDescription>Member since {CUSTOMER.memberSince}</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="flex flex-col gap-4 text-sm">
              <div className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="flex flex-col">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="break-all">{CUSTOMER.email}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="flex flex-col">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="tabular-nums">{CUSTOMER.phone}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="flex flex-col">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd>{CUSTOMER.address}</dd>
                </div>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Loyalty</CardTitle>
            <CardDescription>
              {CUSTOMER.pointsToNextTier} points to {CUSTOMER.nextTier}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tabular-nums">
                {CUSTOMER.points.toLocaleString("en-US")}
              </span>
              <span className="text-sm text-muted-foreground">points</span>
            </div>
            <div
              role="progressbar"
              aria-label={`Progress to ${CUSTOMER.nextTier}`}
              aria-valuemin={0}
              aria-valuemax={CUSTOMER.pointsForNextTier}
              aria-valuenow={CUSTOMER.points}
              className="h-2 w-full overflow-hidden rounded-md bg-muted"
            >
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-muted-foreground">
              {CUSTOMER.points.toLocaleString("en-US")} of{" "}
              {CUSTOMER.pointsForNextTier.toLocaleString("en-US")} points toward{" "}
              {CUSTOMER.nextTier}.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last 10 orders</CardTitle>
          <CardDescription>Most recent first</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>
                  <CalendarDays className="mr-1 inline size-4" aria-hidden="true" />
                  Date
                </TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ORDERS.map((order) => {
                const status = STATUS_BADGE[order.status]
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium tabular-nums">{order.id}</TableCell>
                    <TableCell className="tabular-nums">{order.date}</TableCell>
                    <TableCell className="text-right tabular-nums">{order.items}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        {status.icon}
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{order.total}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Internal note</CardTitle>
          <CardDescription>Visible to the support team only. Not shared with the customer.</CardDescription>
        </CardHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSaveNote()
          }}
        >
          <CardContent className="flex flex-col gap-2">
            <label htmlFor="internal-note" className="text-sm font-medium">
              Note
            </label>
            <textarea
              id="internal-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              placeholder="Add context for the next agent"
              className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-subtle outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit">Save note</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
