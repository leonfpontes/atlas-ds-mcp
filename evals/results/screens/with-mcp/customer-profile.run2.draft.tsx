import { useState } from "react"
import { Mail, Phone, MapPin, Award, CircleCheck, Clock, Truck, CircleX, TriangleAlert, Package } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table"

const CUSTOMER = {
  name: "Helen Marsh",
  id: "FM-20417",
  email: "helen.marsh@example.com",
  phone: "+44 7700 900412",
  address: "14 Orchard Lane, Bristol BS8 1QT",
  memberSince: "March 2019",
  tier: "Gold",
  points: 4280,
  nextTier: "Platinum",
  pointsToNextTier: 720,
}

type OrderStatus = "delivered" | "in-transit" | "packing" | "cancelled"

const ORDERS: { id: string; date: string; items: number; total: string; status: OrderStatus }[] = [
  { id: "#1048", date: "12 May 2025", items: 6, total: "£84.00", status: "delivered" },
  { id: "#1041", date: "02 May 2025", items: 3, total: "£23.50", status: "in-transit" },
  { id: "#1036", date: "27 Apr 2025", items: 11, total: "£142.75", status: "delivered" },
  { id: "#1029", date: "18 Apr 2025", items: 2, total: "£9.80", status: "cancelled" },
  { id: "#1022", date: "09 Apr 2025", items: 5, total: "£61.20", status: "delivered" },
  { id: "#1017", date: "31 Mar 2025", items: 4, total: "£37.40", status: "delivered" },
  { id: "#1011", date: "22 Mar 2025", items: 8, total: "£118.00", status: "delivered" },
  { id: "#1006", date: "14 Mar 2025", items: 1, total: "£6.25", status: "delivered" },
  { id: "#0998", date: "05 Mar 2025", items: 7, total: "£72.90", status: "delivered" },
  { id: "#0991", date: "26 Feb 2025", items: 4, total: "£45.60", status: "delivered" },
]

const INITIAL_NOTE = "Prefers contact by email. Allergy flag on dairy products; check substitutions before packing."

const STATUS_BADGE: Record<OrderStatus, { label: string; variant: "success" | "info" | "warning" | "destructive"; icon: React.ReactNode }> = {
  delivered: { label: "Delivered", variant: "success", icon: <CircleCheck /> },
  "in-transit": { label: "In transit", variant: "info", icon: <Truck /> },
  packing: { label: "Packing", variant: "warning", icon: <Package /> },
  cancelled: { label: "Cancelled", variant: "destructive", icon: <CircleX /> },
}

export default function CustomerProfilePage() {
  const [note, setNote] = useState(INITIAL_NOTE)

  const handleSaveNote = () => {
    toast.success("Note saved")
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 bg-background p-6 text-foreground">
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Example data</AlertTitle>
        <AlertDescription>This profile uses sample values. Connect the customer service to show live records.</AlertDescription>
      </Alert>

      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Customer {CUSTOMER.id}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{CUSTOMER.name}</h1>
          <Badge variant="info">
            <Award />
            {CUSTOMER.tier} member
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Fernhill Market customer since {CUSTOMER.memberSince}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>Use these to reach the customer.</CardDescription>
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
                    <dd>{CUSTOMER.phone}</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div className="flex flex-col">
                    <dt className="text-muted-foreground">Delivery address</dt>
                    <dd>{CUSTOMER.address}</dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loyalty tier</CardTitle>
              <CardDescription>Points and progress to the next tier.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Current tier</span>
                <span className="font-medium">{CUSTOMER.tier}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">Points balance</span>
                <span className="font-medium tabular-nums">{CUSTOMER.points.toLocaleString("en-GB")}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-muted-foreground">To {CUSTOMER.nextTier}</span>
                <span className="font-medium tabular-nums">{CUSTOMER.pointsToNextTier} points</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internal note</CardTitle>
              <CardDescription>Visible to the support team only.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <label htmlFor="internal-note" className="text-sm font-medium">
                Note for the team
              </label>
              <textarea
                id="internal-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={5}
                placeholder="Add a note about this customer"
                className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-subtle focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              />
            </CardContent>
            <CardFooter className="justify-end">
              <Button onClick={handleSaveNote}>Save note</Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Last 10 orders</CardTitle>
            <CardDescription>Most recent first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Orders for {CUSTOMER.name}, most recent first.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORDERS.map((order) => {
                  const status = STATUS_BADGE[order.status]
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
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
      </div>
    </main>
  )
}
