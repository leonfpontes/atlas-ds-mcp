import { useMemo, useState } from "react"
import { CalendarDays, Plus, Tag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

type PromotionStatus = "active" | "scheduled" | "ended"

type Promotion = {
  id: string
  name: string
  code: string
  discountPercent: number
  scope: string
  startsOn: string
  endsOn: string
  status: PromotionStatus
}

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: "promo-1",
    name: "Spring Produce Week",
    code: "SPRINGPRODUCE",
    discountPercent: 15,
    scope: "Fresh produce",
    startsOn: "2025-03-10",
    endsOn: "2025-03-23",
    status: "active",
  },
  {
    id: "promo-2",
    name: "Loyalty Members Double Savings",
    code: "FERNMEMBER",
    discountPercent: 10,
    scope: "Whole store",
    startsOn: "2025-03-01",
    endsOn: "2025-04-30",
    status: "active",
  },
  {
    id: "promo-3",
    name: "Easter Bakery Bundle",
    code: "EASTERBAKE",
    discountPercent: 20,
    scope: "Bakery",
    startsOn: "2025-04-14",
    endsOn: "2025-04-21",
    status: "scheduled",
  },
  {
    id: "promo-4",
    name: "Summer BBQ Event",
    code: "GRILLSEASON",
    discountPercent: 25,
    scope: "Meat & seafood",
    startsOn: "2025-05-24",
    endsOn: "2025-05-31",
    status: "scheduled",
  },
  {
    id: "promo-5",
    name: "Winter Soup Season",
    code: "SOUPWEEK",
    discountPercent: 12,
    scope: "Canned & dry goods",
    startsOn: "2025-01-06",
    endsOn: "2025-02-02",
    status: "ended",
  },
  {
    id: "promo-6",
    name: "New Year Organic Sale",
    code: "ORGANIC25",
    discountPercent: 18,
    scope: "Organic range",
    startsOn: "2024-12-26",
    endsOn: "2025-01-05",
    status: "ended",
  },
]

const STATUS_META: Record<
  PromotionStatus,
  { label: string; badgeClassName: string }
> = {
  active: {
    label: "Active",
    badgeClassName:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  scheduled: {
    label: "Scheduled",
    badgeClassName:
      "bg-sky-100 text-sky-800 hover:bg-sky-100 dark:bg-sky-900/40 dark:text-sky-300",
  },
  ended: {
    label: "Ended",
    badgeClassName:
      "bg-muted text-muted-foreground hover:bg-muted",
  },
}

const TAB_ORDER: PromotionStatus[] = ["active", "scheduled", "ended"]

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00`))
}

type NewPromotionForm = {
  name: string
  code: string
  discountPercent: string
  scope: string
  startsOn: string
  endsOn: string
}

const EMPTY_FORM: NewPromotionForm = {
  name: "",
  code: "",
  discountPercent: "",
  scope: "",
  startsOn: "",
  endsOn: "",
}

function validateForm(form: NewPromotionForm): string | null {
  if (!form.name.trim()) return "Give the promotion a name."
  if (!form.code.trim()) return "Add a promo code."
  const discount = Number(form.discountPercent)
  if (!Number.isFinite(discount) || discount < 1 || discount > 100) {
    return "Discount must be between 1% and 100%."
  }
  if (!form.scope.trim()) return "Describe what the promotion applies to."
  if (!form.startsOn || !form.endsOn) return "Choose a start and end date."
  if (form.endsOn < form.startsOn) return "End date must be on or after the start date."
  return null
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
  const meta = STATUS_META[promotion.status]

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium leading-none">{promotion.name}</h3>
            <Badge className={meta.badgeClassName}>{meta.label}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Tag className="size-3.5" aria-hidden="true" />
              <span className="font-mono">{promotion.code}</span>
            </span>
            <span>{promotion.scope}</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {formatDate(promotion.startsOn)} – {formatDate(promotion.endsOn)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
          <span className="text-2xl font-semibold tabular-nums">
            {promotion.discountPercent}%
          </span>
          <span className="text-xs text-muted-foreground">off</span>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ status }: { status: PromotionStatus }) {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
      No {STATUS_META[status].label.toLowerCase()} promotions right now.
    </div>
  )
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState<NewPromotionForm>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const result: Record<PromotionStatus, Promotion[]> = {
      active: [],
      scheduled: [],
      ended: [],
    }
    for (const promotion of promotions) {
      result[promotion.status].push(promotion)
    }
    return result
  }, [promotions])

  function updateField<K extends keyof NewPromotionForm>(
    key: K,
    value: NewPromotionForm[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
    setFormError(null)
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const error = validateForm(form)
    if (error) {
      setFormError(error)
      return
    }

    const today = new Date().toISOString().slice(0, 10)
    const status: PromotionStatus = form.startsOn > today ? "scheduled" : "active"

    const created: Promotion = {
      id: `promo-${crypto.randomUUID()}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      discountPercent: Number(form.discountPercent),
      scope: form.scope.trim(),
      startsOn: form.startsOn,
      endsOn: form.endsOn,
      status,
    }

    setPromotions((current) => [created, ...current])
    setForm(EMPTY_FORM)
    setFormError(null)
    setIsCreateOpen(false)
    toast.success(`"${created.name}" created`, {
      description:
        status === "active"
          ? "The promotion is live now."
          : "The promotion is scheduled and will start on its start date.",
    })
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market discounts across active, scheduled and ended campaigns.
          </p>
        </div>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open)
            if (!open) {
              setFormError(null)
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              New promotion
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleCreate} noValidate className="space-y-4">
              <DialogHeader>
                <DialogTitle>Create promotion</DialogTitle>
                <DialogDescription>
                  Set the discount, the products it covers and when it runs.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="promo-name">Name</Label>
                  <Input
                    id="promo-name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Summer fruit sale"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promo-code">Promo code</Label>
                  <Input
                    id="promo-code"
                    value={form.code}
                    onChange={(event) => updateField("code", event.target.value)}
                    placeholder="SUMMERFRUIT"
                    className="font-mono uppercase"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promo-discount">Discount (%)</Label>
                  <Input
                    id="promo-discount"
                    type="number"
                    min={1}
                    max={100}
                    inputMode="numeric"
                    value={form.discountPercent}
                    onChange={(event) =>
                      updateField("discountPercent", event.target.value)
                    }
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="promo-scope">Applies to</Label>
                  <Input
                    id="promo-scope"
                    value={form.scope}
                    onChange={(event) => updateField("scope", event.target.value)}
                    placeholder="Fresh fruit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promo-start">Start date</Label>
                  <Input
                    id="promo-start"
                    type="date"
                    value={form.startsOn}
                    onChange={(event) => updateField("startsOn", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promo-end">End date</Label>
                  <Input
                    id="promo-end"
                    type="date"
                    value={form.endsOn}
                    onChange={(event) => updateField("endsOn", event.target.value)}
                  />
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-sm text-destructive">
                  {formError}
                </p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create promotion</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          {TAB_ORDER.map((status) => (
            <TabsTrigger key={status} value={status}>
              {STATUS_META[status].label}
              <span className="ml-1.5 text-xs tabular-nums text-muted-foreground">
                {grouped[status].length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_ORDER.map((status) => (
          <TabsContent key={status} value={status} className="mt-4 space-y-3">
            {grouped[status].length === 0 ? (
              <EmptyState status={status} />
            ) : (
              grouped[status].map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
