import { useState } from "react"
import { Award, CircleCheck, CircleX, Info, Mail, MapPin, Package, Phone, Save, Truck, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type OrderStatus = "delivered" | "shipped" | "packing" | "refunded"

const STATUS_META: Record<OrderStatus, { label: string; variant: "success" | "info" | "warning" | "destructive"; icon: typeof CircleCheck }> = {
  delivered: { label: "Delivered", variant: "success", icon: CircleCheck },
  shipped: { label: "Shipped", variant: "info", icon: Truck },
  packing: { label: "Packing", variant: "warning", icon: Package },
  refunded: { label: "Refunded", variant: "destructive", icon: CircleX },
}

const CUSTOMER = {
  name: "Helen Marsh",
  initials: "HM",
  customerId: "FM-20417",
  email: "helen.marsh@example.com",
  phone: "+1 (555) 014-2290",
  address: "18 Alder Lane, Portland, OR 97209",
  since: "March 2019",
  tier: "Gold",
  points: 4820,
  nextTier: "Platinum",
  pointsToNext: 1180,
}

const ORDERS: { id: string; date: string; items: number; status: OrderStatus; total: string }[] = [
  { id: "#1048", date: "Jun 12, 2025", items: 6, status: "packing", total: "$96.40" },
  { id: "#1041", date: "Jun 4, 2025", items: 3, status: "shipped", total: "$41.85" },
  { id: "#1036", date: "May 27, 2025", items: 9, status: "delivered", total: "$128.10" },
  { id: "#1029", date: "May 15, 2025", items: 2, status: "refunded", total: "$18.50" },
  { id: "#1022", date: "May 2, 2025", items: 5, status: "delivered", total: "$73.25" },
  { id: "#1017", date: "Apr 21, 2025", items: 4, status: "delivered", total: "$56.00" },
  { id: "#1009", date: "Apr 8, 2025", items: 7, status: "delivered", total: "$104.75" },
  { id: "#1003", date: "Mar 26, 2025", items: 1, status: "delivered", total: "$12.99" },
  { id: "#996", date: "Mar 14, 2025", items: 8, status: "delivered", total: "$88.40" },
  { id: "#988", date: "Feb 28, 2025", items: 3, status: "delivered", total: "$37.20" },
]

const INITIAL_NOTE = "Prefers email over phone. Asked about a delivery substitution policy on order #1029."

export default function CustomerProfilePage() {
  const [note, setNote] = useState(INITIAL_NOTE)

  const handleSaveNote = () => {
    toast.success("Note saved")
  }

  const progress = Math.round(
    (CUSTOMER.points / (CUSTOMER.points + CUSTOMER.pointsToNext)) * 100
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex size-14 items-center justify-center rounded-md bg-secondary text-lg font-semibold text-secondary-foreground"
            >
              {CUSTOMER.initials}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">{CUSTOMER.name}</h1>
                <Badge variant="warning">
                  <TriangleAlert />
                  Example data
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Customer {CUSTOMER.customerId} · Since {CUSTOMER.since}
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>Shared with the customer when you reply.</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
                    {CUSTOMER.email}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-sm text-muted-foreground">Phone</dt>
                  <dd className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="size-4 text-muted-foreground" aria-hidden="true" />
                    {CUSTOMER.phone}
                  </dd>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <dt className="text-sm text-muted-foreground">Delivery address</dt>
                  <dd className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
                    {CUSTOMER.address}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loyalty tier</CardTitle>
              <CardDescription>Points earned on paid orders.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="info">
                  <Award />
                  {CUSTOMER.tier}
                </Badge>
                <span className="text-sm font-medium tabular-nums">
                  {CUSTOMER.points.toLocaleString("en-US")} pts
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`Progress to ${CUSTOMER.nextTier}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-2 w-full overflow-hidden rounded-sm bg-muted"
              >
                <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-muted-foreground">
                {CUSTOMER.pointsToNext.toLocaleString("en-US")} points to {CUSTOMER.nextTier}.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Last 10 orders</CardTitle>
            <CardDescription>Most recent first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORDERS.map((order) => {
                  const meta = STATUS_META[order.status]
                  const StatusIcon = meta.icon
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="text-right tabular-nums">{order.items}</TableCell>
                      <TableCell>
                        <Badge variant={meta.variant}>
                          <StatusIcon />
                          {meta.label}
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
            <CardDescription>Visible to the support team only.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Alert variant="info">
              <Info />
              <AlertTitle>Never shown to the customer</AlertTitle>
              <AlertDescription>Record what the next agent needs to know.</AlertDescription>
            </Alert>
            <div className="flex flex-col gap-2">
              <label htmlFor="internal-note" className="text-sm font-medium">
                Note
              </label>
              <textarea
                id="internal-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                placeholder="Example: Prefers email. Refund approved for #1029."
                className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-subtle outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveNote}>
                <Save />
                Save note
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </main>
  )
}
