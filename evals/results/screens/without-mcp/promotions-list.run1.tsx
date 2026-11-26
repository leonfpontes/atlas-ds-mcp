import { useMemo, useState } from "react"
import { CalendarDays, Plus, Tag } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type PromotionStatus = "active" | "scheduled" | "ended"

type Promotion = {
  id: string
  name: string
  description: string
  discountPercent: number
  startsAt: string
  endsAt: string
  status: PromotionStatus
  redemptions: number
}

const PROMOTIONS: Promotion[] = [
  {
    id: "promo-001",
    name: "Spring Produce Week",
    description: "Discount on all seasonal fruit and vegetables.",
    discountPercent: 15,
    startsAt: "2025-03-03T00:00:00",
    endsAt: "2025-03-16T23:59:00",
    status: "active",
    redemptions: 1284,
  },
  {
    id: "promo-002",
    name: "Bakery Morning Deal",
    description: "Off fresh bread and pastries before 10 a.m.",
    discountPercent: 10,
    startsAt: "2025-03-01T00:00:00",
    endsAt: "2025-04-30T23:59:00",
    status: "active",
    redemptions: 542,
  },
  {
    id: "promo-003",
    name: "Easter Chocolate Sale",
    description: "Seasonal chocolate range at reduced prices.",
    discountPercent: 20,
    startsAt: "2025-04-14T00:00:00",
    endsAt: "2025-04-21T23:59:00",
    status: "scheduled",
    redemptions: 0,
  },
  {
    id: "promo-004",
    name: "Loyalty Member Weekend",
    description: "Extra savings for Fernhill Club members on weekends.",
    discountPercent: 5,
    startsAt: "2025-04-05T00:00:00",
    endsAt: "2025-04-06T23:59:00",
    status: "scheduled",
    redemptions: 0,
  },
  {
    id: "promo-005",
    name: "Winter Soup Kit",
    description: "Bundle discount on soup ingredient kits.",
    discountPercent: 12,
    startsAt: "2025-01-06T00:00:00",
    endsAt: "2025-02-28T23:59:00",
    status: "ended",
    redemptions: 873,
  },
  {
    id: "promo-006",
    name: "Back to School Snacks",
    description: "Lunchbox snacks and drinks at a discount.",
    discountPercent: 8,
    startsAt: "2024-09-02T00:00:00",
    endsAt: "2024-09-30T23:59:00",
    status: "ended",
    redemptions: 196,
  },
]

const STATUS_META: Record<
  PromotionStatus,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  active: { label: "Active", variant: "default" },
  scheduled: { label: "Scheduled", variant: "secondary" },
  ended: { label: "Ended", variant: "outline" },
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

const numberFormatter = new Intl.NumberFormat("en-GB")

function formatDateRange(startsAt: string, endsAt: string) {
  return `${dateFormatter.format(new Date(startsAt))} – ${dateFormatter.format(new Date(endsAt))}`
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
  const status = STATUS_META[promotion.status]

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base">{promotion.name}</CardTitle>
          <CardDescription>{promotion.description}</CardDescription>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <Tag className="size-4" aria-hidden="true" />
          {promotion.discountPercent}% off
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays className="size-4" aria-hidden="true" />
          {formatDateRange(promotion.startsAt, promotion.endsAt)}
        </span>
        {promotion.status !== "scheduled" && (
          <span>{numberFormatter.format(promotion.redemptions)} redemptions</span>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState({ status }: { status: PromotionStatus }) {
  const messages: Record<PromotionStatus, string> = {
    active: "No promotions are running right now.",
    scheduled: "No upcoming promotions are scheduled.",
    ended: "No past promotions yet.",
  }

  return (
    <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
      {messages[status]}
    </div>
  )
}

type NewPromotionForm = {
  name: string
  description: string
  discountPercent: string
  startsAt: string
  endsAt: string
}

const EMPTY_FORM: NewPromotionForm = {
  name: "",
  description: "",
  discountPercent: "",
  startsAt: "",
  endsAt: "",
}

function NewPromotionDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<NewPromotionForm>(EMPTY_FORM)

  const updateField =
    (field: keyof NewPromotionForm) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }))

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const discount = Number(form.discountPercent)
    if (!form.name.trim()) {
      toast.error("Give the promotion a name.")
      return
    }
    if (!Number.isFinite(discount) || discount <= 0 || discount > 100) {
      toast.error("Discount must be between 1 and 100 percent.")
      return
    }
    if (!form.startsAt || !form.endsAt || form.endsAt < form.startsAt) {
      toast.error("Choose a valid start and end date.")
      return
    }

    toast.success(`Promotion "${form.name.trim()}" created.`)
    setForm(EMPTY_FORM)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden="true" />
          New promotion
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create promotion</DialogTitle>
          <DialogDescription>
            Set the offer and the period it runs for. It will be scheduled or activated automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="promo-name">Name</Label>
            <Input
              id="promo-name"
              value={form.name}
              onChange={updateField("name")}
              placeholder="e.g. Summer Berry Sale"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="promo-description">Description</Label>
            <Input
              id="promo-description"
              value={form.description}
              onChange={updateField("description")}
              placeholder="Shown to customers in store and online"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="promo-discount">Discount (%)</Label>
            <Input
              id="promo-discount"
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={form.discountPercent}
              onChange={updateField("discountPercent")}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="promo-start">Starts</Label>
              <Input
                id="promo-start"
                type="date"
                value={form.startsAt}
                onChange={updateField("startsAt")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="promo-end">Ends</Label>
              <Input
                id="promo-end"
                type="date"
                value={form.endsAt}
                onChange={updateField("endsAt")}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create promotion</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function PromotionsPage() {
  const grouped = useMemo(() => {
    const byStatus: Record<PromotionStatus, Promotion[]> = {
      active: [],
      scheduled: [],
      ended: [],
    }
    for (const promotion of PROMOTIONS) {
      byStatus[promotion.status].push(promotion)
    }
    return byStatus
  }, [])

  const tabs: { value: PromotionStatus; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "scheduled", label: "Scheduled" },
    { value: "ended", label: "Ended" },
  ]

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            Manage offers across Fernhill Market stores and the online shop.
          </p>
        </div>
        <NewPromotionDialog />
      </header>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              <span className="ml-2 text-xs text-muted-foreground">
                {grouped[tab.value].length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-4">
            {grouped[tab.value].length === 0 ? (
              <EmptyState status={tab.value} />
            ) : (
              grouped[tab.value].map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
