import { useMemo, useState } from "react"
import {
  Crown,
  Mail,
  MapPin,
  Phone,
  Save,
  StickyNote,
  Store,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum"

interface Customer {
  id: string
  name: string
  initials: string
  email: string
  phone: string
  address: string
  memberSince: string
  preferredStore: string
  loyalty: {
    tier: LoyaltyTier
    points: number
    nextTier: LoyaltyTier | null
    pointsToNextTier: number
  }
}

interface Order {
  id: string
  placedAt: string
  items: number
  total: number
  status: OrderStatus
}

interface InternalNote {
  id: string
  author: string
  body: string
  createdAt: string
}

const CUSTOMER: Customer = {
  id: "FM-204481",
  name: "Harriet Okonkwo",
  initials: "HO",
  email: "harriet.okonkwo@example.com",
  phone: "+44 7700 900418",
  address: "14 Larkspur Close, Bristol BS7 9QR",
  memberSince: "2019-03-12",
  preferredStore: "Fernhill Market – Clifton",
  loyalty: {
    tier: "Gold",
    points: 8420,
    nextTier: "Platinum",
    pointsToNextTier: 1580,
  },
}

const RECENT_ORDERS: Order[] = [
  { id: "FM-88213", placedAt: "2025-06-02", items: 14, total: 86.4, status: "processing" },
  { id: "FM-88007", placedAt: "2025-05-27", items: 6, total: 31.15, status: "shipped" },
  { id: "FM-87644", placedAt: "2025-05-19", items: 22, total: 142.8, status: "delivered" },
  { id: "FM-87390", placedAt: "2025-05-11", items: 3, total: 12.5, status: "delivered" },
  { id: "FM-87102", placedAt: "2025-05-04", items: 9, total: 58.9, status: "refunded" },
  { id: "FM-86958", placedAt: "2025-04-26", items: 11, total: 67.2, status: "delivered" },
  { id: "FM-86711", placedAt: "2025-04-18", items: 5, total: 24.75, status: "delivered" },
  { id: "FM-86530", placedAt: "2025-04-09", items: 17, total: 103.35, status: "delivered" },
  { id: "FM-86274", placedAt: "2025-03-31", items: 8, total: 45.0, status: "delivered" },
  { id: "FM-86019", placedAt: "2025-03-22", items: 4, total: 18.6, status: "delivered" },
]

const INITIAL_NOTES: InternalNote[] = [
  {
    id: "n1",
    author: "Priya S.",
    body: "Customer prefers contact by email. Flagged a missing item on FM-87102; refund issued.",
    createdAt: "2025-05-05",
  },
  {
    id: "n2",
    author: "Tom R.",
    body: "Asked about bulk delivery slots for the June community event.",
    createdAt: "2025-05-20",
  },
]

const MAX_NOTE_LENGTH = 500

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  delivered: { label: "Delivered", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default" },
  processing: { label: "Processing", variant: "outline" },
  refunded: { label: "Refunded", variant: "destructive" },
}

const tierStyles: Record<LoyaltyTier, string> = {
  Bronze: "bg-amber-700/15 text-amber-800 dark:text-amber-300",
  Silver: "bg-slate-400/20 text-slate-700 dark:text-slate-300",
  Gold: "bg-yellow-400/25 text-yellow-800 dark:text-yellow-300",
  Platinum: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
}

export default function CustomerProfilePage() {
  const [notes, setNotes] = useState<InternalNote[]>(INITIAL_NOTES)
  const [draft, setDraft] = useState("")

  const trimmedDraft = draft.trim()
  const canSaveNote = trimmedDraft.length > 0 && draft.length <= MAX_NOTE_LENGTH

  const tierProgress = useMemo(() => {
    const { points, pointsToNextTier } = CUSTOMER.loyalty
    if (!CUSTOMER.loyalty.nextTier) return 100
    const span = points + pointsToNextTier
    return Math.round((points / span) * 100)
  }, [])

  const lifetimeSpend = useMemo(
    () =>
      RECENT_ORDERS.filter((o) => o.status !== "refunded").reduce(
        (sum, o) => sum + o.total,
        0
      ),
    []
  )

  function handleSaveNote() {
    if (!canSaveNote) return

    const note: InternalNote = {
      id: `n${Date.now()}`,
      author: "You",
      body: trimmedDraft,
      createdAt: new Date().toISOString().slice(0, 10),
    }

    setNotes((prev) => [note, ...prev])
    setDraft("")
    toast.success("Internal note saved", {
      description: `Added to ${CUSTOMER.name}'s profile.`,
    })
  }

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:col-span-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-lg font-semibold">
                {CUSTOMER.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {CUSTOMER.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                Customer ID {CUSTOMER.id} · Member since{" "}
                {dateFormat.format(new Date(CUSTOMER.memberSince))}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Mail className="size-4" />
              Email customer
            </Button>
            <Button size="sm">
              <Phone className="size-4" />
              Call
            </Button>
          </div>
        </div>

        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>Verified at last account update</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 text-muted-foreground" />
                <a
                  href={`mailto:${CUSTOMER.email}`}
                  className="break-all text-foreground underline-offset-4 hover:underline"
                >
                  {CUSTOMER.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 text-muted-foreground" />
                <a
                  href={`tel:${CUSTOMER.phone.replace(/\s/g, "")}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {CUSTOMER.phone}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-muted-foreground" />
                <span className="text-foreground">{CUSTOMER.address}</span>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Store className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Preferred store
                  </p>
                  <p className="text-foreground">{CUSTOMER.preferredStore}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="size-4 text-yellow-600 dark:text-yellow-400" />
                Loyalty
              </CardTitle>
              <CardDescription>Points and tier status</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-md px-2.5 py-1 text-sm font-semibold ${tierStyles[CUSTOMER.loyalty.tier]}`}
                >
                  {CUSTOMER.loyalty.tier}
                </span>
                <span className="text-sm font-medium tabular-nums text-foreground">
                  {CUSTOMER.loyalty.points.toLocaleString("en-GB")} pts
                </span>
              </div>

              {CUSTOMER.loyalty.nextTier ? (
                <div className="flex flex-col gap-2">
                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={tierProgress}
                    aria-label={`Progress to ${CUSTOMER.loyalty.nextTier}`}
                  >
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${tierProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {CUSTOMER.loyalty.pointsToNextTier.toLocaleString("en-GB")} pts
                    until {CUSTOMER.loyalty.nextTier}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Highest tier reached.</p>
              )}

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Lifetime spend (last 10)</span>
                <span className="font-medium tabular-nums text-foreground">
                  {currency.format(lifetimeSpend)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Internal notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="size-4 text-muted-foreground" />
                Internal notes
              </CardTitle>
              <CardDescription>Visible to support staff only</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Add a note for the support team…"
                  rows={3}
                  maxLength={MAX_NOTE_LENGTH + 1}
                  aria-label="New internal note"
                  aria-invalid={draft.length > MAX_NOTE_LENGTH}
                />
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs tabular-nums ${
                      draft.length > MAX_NOTE_LENGTH
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {draft.length}/{MAX_NOTE_LENGTH}
                  </span>
                  <Button size="sm" onClick={handleSaveNote} disabled={!canSaveNote}>
                    <Save className="size-4" />
                    Save note
                  </Button>
                </div>
              </div>

              <Separator />

              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes yet.</p>
              ) : (
                <ul className="flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="rounded-md border bg-background p-3 text-sm"
                    >
                      <p className="whitespace-pre-wrap text-foreground">{note.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {note.author} ·{" "}
                        {dateFormat.format(new Date(note.createdAt))}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>Last 10 orders, most recent first</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECENT_ORDERS.map((order) => {
                  const status = statusConfig[order.status]
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {dateFormat.format(new Date(order.placedAt))}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {order.items}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {currency.format(order.total)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
