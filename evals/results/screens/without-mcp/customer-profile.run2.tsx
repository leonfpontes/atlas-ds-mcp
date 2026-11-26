import { useMemo, useState } from "react"
import { Mail, Phone, MapPin, Award, Package, StickyNote, Save, CalendarDays } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type OrderStatus = "delivered" | "shipped" | "processing" | "refunded"

type Order = {
  id: string
  placedAt: string
  items: number
  total: number
  status: OrderStatus
}

type LoyaltyTier = {
  name: "Bronze" | "Silver" | "Gold" | "Platinum"
  minPoints: number
}

const LOYALTY_TIERS: LoyaltyTier[] = [
  { name: "Bronze", minPoints: 0 },
  { name: "Silver", minPoints: 1000 },
  { name: "Gold", minPoints: 2000 },
  { name: "Platinum", minPoints: 3000 },
]

const CUSTOMER = {
  id: "FM-048213",
  firstName: "Maya",
  lastName: "Okafor",
  email: "maya.okafor@example.com",
  phone: "+1 (555) 014-2290",
  address: {
    line1: "418 Alder Street, Apt 3B",
    city: "Portland",
    region: "OR",
    postalCode: "97209",
  },
  memberSince: "2019-03-14",
  loyaltyPoints: 2340,
  initialNote:
    "Prefers email over phone. Asked about the bulk coffee subscription on the last call.",
}

const ORDERS: Order[] = [
  { id: "FM-88214", placedAt: "2025-05-28", items: 6, total: 84.5, status: "processing" },
  { id: "FM-88107", placedAt: "2025-05-19", items: 3, total: 42.1, status: "shipped" },
  { id: "FM-87992", placedAt: "2025-05-07", items: 11, total: 156.75, status: "delivered" },
  { id: "FM-87811", placedAt: "2025-04-29", items: 2, total: 18.0, status: "delivered" },
  { id: "FM-87650", placedAt: "2025-04-16", items: 5, total: 63.4, status: "refunded" },
  { id: "FM-87522", placedAt: "2025-04-02", items: 8, total: 97.25, status: "delivered" },
  { id: "FM-87403", placedAt: "2025-03-21", items: 4, total: 51.9, status: "delivered" },
  { id: "FM-87260", placedAt: "2025-03-08", items: 7, total: 120.0, status: "delivered" },
  { id: "FM-87119", placedAt: "2025-02-22", items: 1, total: 9.99, status: "delivered" },
  { id: "FM-86970", placedAt: "2025-02-10", items: 9, total: 134.6, status: "delivered" },
]

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })

const STATUS_BADGE: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  delivered: { label: "Delivered", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default" },
  processing: { label: "Processing", variant: "outline" },
  refunded: { label: "Refunded", variant: "destructive" },
}

function getTierInfo(points: number) {
  const currentIndex = LOYALTY_TIERS.reduce(
    (acc, tier, index) => (points >= tier.minPoints ? index : acc),
    0,
  )
  const current = LOYALTY_TIERS[currentIndex]
  const next = LOYALTY_TIERS[currentIndex + 1]
  const progress = next
    ? Math.min(
        100,
        Math.round(((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100),
      )
    : 100
  return { current, next, progress }
}

export default function CustomerProfilePage() {
  const [note, setNote] = useState(CUSTOMER.initialNote)
  const [savedNote, setSavedNote] = useState(CUSTOMER.initialNote)
  const [isSaving, setIsSaving] = useState(false)

  const fullName = `${CUSTOMER.firstName} ${CUSTOMER.lastName}`
  const initials = `${CUSTOMER.firstName[0]}${CUSTOMER.lastName[0]}`
  const hasNoteChanges = note.trim() !== savedNote.trim()

  const tier = useMemo(() => getTierInfo(CUSTOMER.loyaltyPoints), [])

  const lifetimeSpend = useMemo(
    () =>
      ORDERS.filter((order) => order.status !== "refunded").reduce(
        (sum, order) => sum + order.total,
        0,
      ),
    [],
  )

  const handleSaveNote = async () => {
    if (!hasNoteChanges) return
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      setSavedNote(note.trim())
      toast.success("Internal note saved", {
        description: `Added to ${fullName}'s support record.`,
      })
    } catch {
      toast.error("Could not save note", {
        description: "Please try again in a moment.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
              <Badge variant="outline">{tier.current.name} member</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Customer ID {CUSTOMER.id} · Member since {dateFmt.format(new Date(CUSTOMER.memberSince))}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`mailto:${CUSTOMER.email}`}>
              <Mail />
              Email customer
            </a>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>Verified across orders and account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium break-all">{CUSTOMER.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{CUSTOMER.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Delivery address</p>
                  <p className="font-medium">{CUSTOMER.address.line1}</p>
                  <p className="font-medium">
                    {CUSTOMER.address.city}, {CUSTOMER.address.region} {CUSTOMER.address.postalCode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="size-4" />
                Loyalty tier
              </CardTitle>
              <CardDescription>
                {CUSTOMER.loyaltyPoints.toLocaleString()} points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{tier.current.name}</span>
                <span className="text-muted-foreground">
                  {tier.next
                    ? `${(tier.next.minPoints - CUSTOMER.loyaltyPoints).toLocaleString()} pts to ${tier.next.name}`
                    : "Highest tier reached"}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={tier.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${tier.progress}%` }}
                />
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                Lifetime spend (excluding refunds):{" "}
                <span className="font-medium text-foreground">{currency.format(lifetimeSpend)}</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="size-4" />
                Internal note
              </CardTitle>
              <CardDescription>Visible to support staff only.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add context for the next agent who picks up this customer..."
                rows={5}
                maxLength={1000}
                aria-label="Internal note"
              />
              <p className="mt-2 text-right text-xs text-muted-foreground">
                {note.length}/1000
              </p>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button
                variant="ghost"
                disabled={!hasNoteChanges || isSaving}
                onClick={() => setNote(savedNote)}
              >
                Discard
              </Button>
              <Button onClick={handleSaveNote} disabled={!hasNoteChanges || isSaving}>
                <Save />
                {isSaving ? "Saving..." : "Save note"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-4" />
              Recent orders
            </CardTitle>
            <CardDescription>Last {ORDERS.length} orders, most recent first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      Placed
                    </span>
                  </TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ORDERS.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{dateFmt.format(new Date(order.placedAt))}</TableCell>
                    <TableCell className="text-right tabular-nums">{order.items}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currency.format(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_BADGE[order.status].variant}>
                        {STATUS_BADGE[order.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
