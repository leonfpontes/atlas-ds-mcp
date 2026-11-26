import { useState } from "react"
import {
  Award,
  CalendarDays,
  CircleCheck,
  CircleX,
  Crown,
  Mail,
  MapPin,
  Medal,
  Package,
  Phone,
  RotateCcw,
  Truck,
} from "lucide-react"
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
import { Toaster } from "@/components/ui/sonner"

type OrderStatus = "delivered" | "shipped" | "packing" | "cancelled" | "refunded"

type Order = {
  id: string
  date: string
  items: number
  status: OrderStatus
  total: string
}

type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum"

const CUSTOMER = {
  name: "Ana Lindqvist",
  customerId: "FM-204817",
  email: "ana.lindqvist@example.com",
  phone: "+1 (555) 014-2290",
  address: "18 Birch Lane, Portland, OR 97205",
  memberSince: "March 2019",
  preferredStore: "Fernhill Market, Hawthorne",
  tier: "Gold" as LoyaltyTier,
  points: 6240,
  pointsToNextTier: 1760,
  nextTier: "Platinum",
}

const INITIAL_NOTE =
  "Prefers email over phone. Allergic to tree nuts: flag any substitutions on packing slips. Last delivery was late once in March; offered a 10% credit then."

const ORDERS: Order[] = [
  { id: "#1048", date: "Jun 18, 2025", items: 12, status: "packing", total: "$96.40" },
  { id: "#1042", date: "Jun 14, 2025", items: 7, status: "shipped", total: "$58.15" },
  { id: "#1037", date: "Jun 09, 2025", items: 15, status: "delivered", total: "$121.90" },
  { id: "#1031", date: "Jun 02, 2025", items: 4, status: "delivered", total: "$34.25" },
  { id: "#1026", date: "May 27, 2025", items: 9, status: "refunded", total: "$72.80" },
  { id: "#1019", date: "May 20, 2025", items: 11, status: "delivered", total: "$88.60" },
  { id: "#1014", date: "May 13, 2025", items: 6, status: "cancelled", total: "$41.00" },
  { id: "#1008", date: "May 05, 2025", items: 13, status: "delivered", total: "$104.35" },
  { id: "#1003", date: "Apr 28, 2025", items: 8, status: "delivered", total: "$67.10" },
  { id: "#997", date: "Apr 21, 2025", items: 5, status: "delivered", total: "$29.95" },
]

const ORDER_STATUS: Record<
  OrderStatus,
  {
    label: string
    variant: "success" | "warning" | "info" | "destructive" | "secondary"
    icon: typeof CircleCheck
  }
> = {
  delivered: { label: "Delivered", variant: "success", icon: CircleCheck },
  shipped: { label: "Shipped", variant: "info", icon: Truck },
  packing: { label: "Packing", variant: "warning", icon: Package },
  cancelled: { label: "Cancelled", variant: "destructive", icon: CircleX },
  refunded: { label: "Refunded", variant: "secondary", icon: RotateCcw },
}

const TIER_STYLE: Record<
  LoyaltyTier,
  { variant: "outline" | "secondary" | "info" | "default"; icon: typeof Medal }
> = {
  Bronze: { variant: "outline", icon: Medal },
  Silver: { variant: "secondary", icon: Award },
  Gold: { variant: "info", icon: Award },
  Platinum: { variant: "default", icon: Crown },
}

export default function CustomerProfilePage() {
  const [note, setNote] = useState(INITIAL_NOTE)
  const [savedNote, setSavedNote] = useState(INITIAL_NOTE)

  const isDirty = note !== savedNote
  const tierTotal = CUSTOMER.points + CUSTOMER.pointsToNextTier
  const tierProgress = Math.round((CUSTOMER.points / tierTotal) * 100)
  const TierIcon = TIER_STYLE[CUSTOMER.tier].icon

  function saveNote() {
    setSavedNote(note)
    toast.success(`Note saved to ${CUSTOMER.name}'s profile`)
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Customers / {CUSTOMER.customerId}</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{CUSTOMER.name}</h1>
            <Badge variant={TIER_STYLE[CUSTOMER.tier].variant}>
              <TierIcon aria-hidden="true" />
              {CUSTOMER.tier} member
            </Badge>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>Customer since {CUSTOMER.memberSince}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
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
                <div className="flex flex-col gap-1">
                  <dt className="text-sm text-muted-foreground">Delivery address</dt>
                  <dd className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
                    {CUSTOMER.address}
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-sm text-muted-foreground">Preferred store</dt>
                  <dd className="flex items-center gap-2 text-sm font-medium">
                    <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
                    {CUSTOMER.preferredStore}
                  </dd>
                </div>
              </dl>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline">Edit contact</Button>
              <Button variant="ghost">Copy email</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loyalty</CardTitle>
              <CardDescription>
                {CUSTOMER.pointsToNextTier.toLocaleString("en-US")} points to {CUSTOMER.nextTier}
              </CardDescription>
              <CardAction>
                <Badge variant={TIER_STYLE[CUSTOMER.tier].variant}>
                  <TierIcon aria-hidden="true" />
                  {CUSTOMER.tier}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-3xl font-semibold tracking-tight">
                {CUSTOMER.points.toLocaleString("en-US")}
                <span className="ml-2 text-sm font-normal text-muted-foreground">points</span>
              </p>
              <div
                className="h-2 w-full overflow-hidden rounded-sm bg-muted"
                role="progressbar"
                aria-label={`Progress to ${CUSTOMER.nextTier}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={tierProgress}
              >
                <div className="h-full bg-primary" style={{ width: `${tierProgress}%` }} />
              </div>
              <p className="text-sm text-muted-foreground">{tierProgress}% of the way to {CUSTOMER.nextTier}</p>
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
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORDERS.map((order) => {
                  const status = ORDER_STATUS[order.status]
                  const StatusIcon = status.icon
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell className="text-muted-foreground">{order.date}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          <StatusIcon aria-hidden="true" />
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

        <Card>
          <CardHeader>
            <CardTitle>Internal note</CardTitle>
            <CardDescription>Visible to the support team only. The customer never sees this.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <label htmlFor="internal-note" className="text-sm font-medium">
              Note for the support team
            </label>
            <textarea
              id="internal-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={5}
              placeholder="For example: prefers morning delivery slots"
              className="min-h-28 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-text-subtle focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </CardContent>
          <CardFooter className="justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </p>
            <Button onClick={saveNote}>Save note</Button>
          </CardFooter>
        </Card>
      </div>
      <Toaster position="bottom-right" />
    </main>
  )
}
