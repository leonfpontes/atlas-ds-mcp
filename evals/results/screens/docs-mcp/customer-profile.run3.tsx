import { useState } from "react"
import {
  CircleAlert,
  CircleCheck,
  Crown,
  Mail,
  MapPin,
  Package,
  Phone,
  StickyNote,
  Truck,
  Undo2,
} from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
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

type OrderStatus = "Paid" | "Packing" | "Shipped" | "Refunded"

const CUSTOMER = {
  name: "Maya Lindqvist",
  accountId: "FM-20418",
  memberSince: "March 2019",
  email: "maya.lindqvist@example.com",
  phone: "+1 (555) 014-2290",
  address: "482 Alder Street, Apt 3B, Portland, OR 97209",
  tier: "Gold",
  points: 1840,
  nextTier: "Platinum",
  pointsForNextTier: 2500,
  tierBenefits: "Free shipping over $40, early access to seasonal produce boxes",
}

const STATUS_BADGE: Record<
  OrderStatus,
  { variant: "success" | "warning" | "info" | "destructive"; icon: React.ReactNode; label: string }
> = {
  Paid: { variant: "success", icon: <CircleCheck />, label: "Paid" },
  Packing: { variant: "warning", icon: <Package />, label: "Packing" },
  Shipped: { variant: "info", icon: <Truck />, label: "Shipped" },
  Refunded: { variant: "destructive", icon: <Undo2 />, label: "Refunded" },
}

const RECENT_ORDERS: {
  id: string
  date: string
  items: number
  status: OrderStatus
  total: string
}[] = [
  { id: "#1058", date: "Jun 14, 2025", items: 6, status: "Shipped", total: "$86.40" },
  { id: "#1051", date: "Jun 9, 2025", items: 3, status: "Paid", total: "$34.15" },
  { id: "#1047", date: "May 30, 2025", items: 9, status: "Shipped", total: "$121.90" },
  { id: "#1042", date: "May 22, 2025", items: 4, status: "Refunded", total: "$52.00" },
  { id: "#1036", date: "May 11, 2025", items: 7, status: "Shipped", total: "$97.25" },
  { id: "#1031", date: "Apr 28, 2025", items: 2, status: "Paid", total: "$18.80" },
  { id: "#1027", date: "Apr 19, 2025", items: 5, status: "Shipped", total: "$68.45" },
  { id: "#1022", date: "Apr 6, 2025", items: 8, status: "Paid", total: "$112.60" },
  { id: "#1018", date: "Mar 27, 2025", items: 3, status: "Shipped", total: "$41.30" },
  { id: "#1013", date: "Mar 15, 2025", items: 6, status: "Paid", total: "$79.95" },
]

export default function CustomerProfilePage() {
  const [note, setNote] = useState("")

  const progress = Math.min(
    100,
    Math.round((CUSTOMER.points / CUSTOMER.pointsForNextTier) * 100)
  )
  const pointsToNext = CUSTOMER.pointsForNextTier - CUSTOMER.points

  function handleSaveNote() {
    if (note.trim().length === 0) return
    toast.success("Note saved to the customer profile")
    setNote("")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{CUSTOMER.name}</h1>
              <Badge variant="warning">
                <CircleAlert />
                Example data
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Account {CUSTOMER.accountId} · Member since {CUSTOMER.memberSince}
            </p>
          </div>
          <Button>Email customer</Button>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <aside className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact details</CardTitle>
                <CardDescription>Used for order updates and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 text-sm">
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div className="flex min-w-0 flex-col">
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
                <CardDescription>{CUSTOMER.tierBenefits}</CardDescription>
                <CardAction>
                  <Badge variant="info">
                    <Crown />
                    {CUSTOMER.tier}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">{CUSTOMER.points.toLocaleString()} points</span>
                  <span className="text-muted-foreground">
                    {pointsToNext.toLocaleString()} to {CUSTOMER.nextTier}
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
                  <div className="h-full rounded-sm bg-primary" style={{ width: `${progress}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Internal note</CardTitle>
                <CardDescription>Visible to the support team only</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <label htmlFor="internal-note" className="text-sm font-medium">
                  Add a note
                </label>
                <textarea
                  id="internal-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="For example: prefers morning delivery windows"
                  rows={4}
                  className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-text-subtle outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
                {note.trim().length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Write a note to enable saving it.
                  </p>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleSaveNote} disabled={note.trim().length === 0}>
                  <StickyNote />
                  Save note
                </Button>
              </CardFooter>
            </Card>
          </aside>

          <section className="lg:col-span-2">
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
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RECENT_ORDERS.map((order) => {
                      const status = STATUS_BADGE[order.status]
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell className="text-muted-foreground">{order.date}</TableCell>
                          <TableCell className="text-right">{order.items}</TableCell>
                          <TableCell>
                            <Badge variant={status.variant}>
                              {status.icon}
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
          </section>
        </div>
      </div>
    </main>
  )
}
