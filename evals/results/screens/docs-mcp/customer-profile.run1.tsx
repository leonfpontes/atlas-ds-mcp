import { useState } from "react"
import {
  CircleCheck,
  CircleX,
  Clock,
  Crown,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  Truck,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

type OrderStatus = "delivered" | "shipped" | "packing" | "processing" | "cancelled"

interface Order {
  id: string
  date: string
  items: number
  total: string
  status: OrderStatus
}

interface Customer {
  name: string
  initials: string
  customerId: string
  email: string
  phone: string
  address: string[]
  memberSince: string
  tier: string
  points: number
  nextTierPoints: number
  nextTier: string
  internalNote: string
}

const CUSTOMER: Customer = {
  name: "Elena Marsh",
  initials: "EM",
  customerId: "FM-204817",
  email: "elena.marsh@example.com",
  phone: "+1 (555) 014-2290",
  address: ["18 Alder Lane", "Portland, OR 97209", "United States"],
  memberSince: "March 2019",
  tier: "Gold",
  points: 6420,
  nextTierPoints: 8000,
  nextTier: "Platinum",
  internalNote:
    "Prefers delivery before 10 a.m. Had a substitution complaint on FM-203911 in March; credited and resolved.",
}

const ORDERS: Order[] = [
  { id: "FM-1048", date: "Jun 14, 2025", items: 6, total: "$84.20", status: "processing" },
  { id: "FM-1041", date: "Jun 09, 2025", items: 3, total: "$41.75", status: "packing" },
  { id: "FM-1036", date: "May 30, 2025", items: 9, total: "$126.40", status: "shipped" },
  { id: "FM-1029", date: "May 22, 2025", items: 4, total: "$57.10", status: "delivered" },
  { id: "FM-1024", date: "May 11, 2025", items: 2, total: "$18.60", status: "cancelled" },
  { id: "FM-1017", date: "Apr 28, 2025", items: 7, total: "$92.35", status: "delivered" },
  { id: "FM-1011", date: "Apr 19, 2025", items: 5, total: "$63.00", status: "delivered" },
  { id: "FM-1005", date: "Apr 03, 2025", items: 8, total: "$110.85", status: "delivered" },
  { id: "FM-0998", date: "Mar 21, 2025", items: 3, total: "$29.90", status: "delivered" },
  { id: "FM-0991", date: "Mar 08, 2025", items: 6, total: "$77.45", status: "delivered" },
]

const STATUS_META: Record<
  OrderStatus,
  {
    label: string
    variant: "success" | "info" | "warning" | "destructive" | "secondary"
    icon: LucideIcon
  }
> = {
  delivered: { label: "Delivered", variant: "success", icon: CircleCheck },
  shipped: { label: "Shipped", variant: "info", icon: Truck },
  packing: { label: "Packing", variant: "warning", icon: Package },
  processing: { label: "Processing", variant: "secondary", icon: Clock },
  cancelled: { label: "Cancelled", variant: "destructive", icon: CircleX },
}

export default function CustomerProfilePage() {
  const [note, setNote] = useState(CUSTOMER.internalNote)
  const [savedNote, setSavedNote] = useState(CUSTOMER.internalNote)

  const progress = Math.min(100, Math.round((CUSTOMER.points / CUSTOMER.nextTierPoints) * 100))
  const pointsToNext = Math.max(0, CUSTOMER.nextTierPoints - CUSTOMER.points)
  const noteChanged = note.trim() !== savedNote.trim()

  function handleSaveNote() {
    const trimmed = note.trim()
    setNote(trimmed)
    setSavedNote(trimmed)
    toast.success("Note saved")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex size-14 items-center justify-center rounded-md bg-muted text-lg font-semibold text-foreground"
            >
              {CUSTOMER.initials}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">{CUSTOMER.name}</h1>
              <p className="text-sm text-muted-foreground">
                Customer ID {CUSTOMER.customerId} · Member since {CUSTOMER.memberSince}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            <Crown />
            {CUSTOMER.tier} member
          </Badge>
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
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div className="flex flex-col">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="break-all font-medium">{CUSTOMER.email}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div className="flex flex-col">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd className="font-medium">{CUSTOMER.phone}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <div className="flex flex-col">
                      <dt className="text-muted-foreground">Delivery address</dt>
                      <dd className="font-medium">
                        {CUSTOMER.address.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </dd>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loyalty tier</CardTitle>
                <CardDescription>
                  {pointsToNext.toLocaleString()} points to {CUSTOMER.nextTier}.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">{CUSTOMER.points.toLocaleString()} points</span>
                  <span className="text-muted-foreground">
                    {CUSTOMER.nextTierPoints.toLocaleString()} for {CUSTOMER.nextTier}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`Progress to ${CUSTOMER.nextTier}`}
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-2 w-full overflow-hidden rounded-sm bg-muted"
                >
                  <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
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
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Items</TableHead>
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
                          <TableCell className="text-muted-foreground">{order.date}</TableCell>
                          <TableCell>
                            <Badge variant={meta.variant}>
                              <StatusIcon />
                              {meta.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{order.items}</TableCell>
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
                <CardDescription>Visible to the support team only. Not shared with the customer.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <label htmlFor="internal-note" className="text-sm font-medium">
                  Note for the support team
                </label>
                <textarea
                  id="internal-note"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={4}
                  placeholder="Add context for the next person who contacts this customer"
                  className="min-h-24 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-text-subtle focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleSaveNote} disabled={!noteChanged}>
                  <Save />
                  Save note
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  )
}
