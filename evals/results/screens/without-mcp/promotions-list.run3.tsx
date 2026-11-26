import { useMemo } from "react"
import { CalendarDays, Pencil, Pause, Percent, Plus, Tag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type PromotionStatus = "active" | "scheduled" | "ended"

type Promotion = {
  id: string
  name: string
  code: string
  discountType: "percent" | "fixed"
  discountValue: number
  scope: string
  startsOn: string
  endsOn: string
  status: PromotionStatus
  redemptions: number
}

const PROMOTIONS: Promotion[] = [
  {
    id: "promo-101",
    name: "Spring Produce Sale",
    code: "SPRING15",
    discountType: "percent",
    discountValue: 15,
    scope: "Fresh produce",
    startsOn: "2025-03-01",
    endsOn: "2025-05-31",
    status: "active",
    redemptions: 1842,
  },
  {
    id: "promo-102",
    name: "Loyalty Member Weekend",
    code: "MEMBER5",
    discountType: "fixed",
    discountValue: 5,
    scope: "Orders over $40",
    startsOn: "2025-04-18",
    endsOn: "2025-04-20",
    status: "active",
    redemptions: 627,
  },
  {
    id: "promo-103",
    name: "Bakery Bundle",
    code: "BAKE20",
    discountType: "percent",
    discountValue: 20,
    scope: "Bakery counter",
    startsOn: "2025-06-02",
    endsOn: "2025-06-15",
    status: "scheduled",
    redemptions: 0,
  },
  {
    id: "promo-104",
    name: "Summer Grill Event",
    code: "GRILL10",
    discountType: "percent",
    discountValue: 10,
    scope: "Meat and seafood",
    startsOn: "2025-06-21",
    endsOn: "2025-07-06",
    status: "scheduled",
    redemptions: 0,
  },
  {
    id: "promo-105",
    name: "Winter Pantry Clearance",
    code: "PANTRY3",
    discountType: "fixed",
    discountValue: 3,
    scope: "Dry goods aisle",
    startsOn: "2024-12-26",
    endsOn: "2025-01-31",
    status: "ended",
    redemptions: 2290,
  },
  {
    id: "promo-106",
    name: "Back to School Snacks",
    code: "SNACK25",
    discountType: "percent",
    discountValue: 25,
    scope: "Snacks and drinks",
    startsOn: "2024-08-20",
    endsOn: "2024-09-10",
    status: "ended",
    redemptions: 913,
  },
]

const STATUS_STYLES: Record<PromotionStatus, string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  scheduled: "border-sky-200 bg-sky-50 text-sky-700",
  ended: "border-zinc-200 bg-zinc-100 text-zinc-600",
}

const STATUS_LABELS: Record<PromotionStatus, string> = {
  active: "Active",
  scheduled: "Scheduled",
  ended: "Ended",
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

const numberFormatter = new Intl.NumberFormat("en-US")

function formatDate(iso: string) {
  return dateFormatter.format(new Date(`${iso}T00:00:00`))
}

function formatDiscount(promo: Promotion) {
  return promo.discountType === "percent"
    ? `${promo.discountValue}% off`
    : `$${promo.discountValue.toFixed(2)} off`
}

function StatusBadge({ status }: { status: PromotionStatus }) {
  return (
    <Badge variant="outline" className={STATUS_STYLES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}

function PromotionsTable({
  promotions,
  emptyMessage,
}: {
  promotions: Promotion[]
  emptyMessage: string
}) {
  if (promotions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Promotion</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Redemptions</TableHead>
            <TableHead className="w-24 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow key={promo.id}>
              <TableCell>
                <div className="font-medium text-foreground">{promo.name}</div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Tag className="size-3" aria-hidden="true" />
                  <span className="font-mono">{promo.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{promo.scope}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 font-medium">
                  {promo.discountType === "percent" ? (
                    <Percent className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <Tag className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  )}
                  {formatDiscount(promo)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm">
                  <CalendarDays className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <span>
                    {formatDate(promo.startsOn)} – {formatDate(promo.endsOn)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={promo.status} />
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {numberFormatter.format(promo.redemptions)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${promo.name}`}
                    onClick={() => toast.info(`Editing "${promo.name}"`)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  {promo.status === "active" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Pause ${promo.name}`}
                      onClick={() => toast.success(`"${promo.name}" paused`)}
                    >
                      <Pause className="size-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function PromotionsPage() {
  const counts = useMemo(() => {
    const result: Record<PromotionStatus, number> = { active: 0, scheduled: 0, ended: 0 }
    for (const promo of PROMOTIONS) result[promo.status] += 1
    return result
  }, [])

  const activeRedemptions = useMemo(
    () =>
      PROMOTIONS.filter((p) => p.status === "active").reduce(
        (sum, p) => sum + p.redemptions,
        0,
      ),
    [],
  )

  const byStatus = useMemo(
    () => ({
      active: PROMOTIONS.filter((p) => p.status === "active"),
      scheduled: PROMOTIONS.filter((p) => p.status === "scheduled"),
      ended: PROMOTIONS.filter((p) => p.status === "ended"),
    }),
    [],
  )

  const summary = [
    { label: "Active", value: counts.active },
    { label: "Scheduled", value: counts.scheduled },
    { label: "Ended", value: counts.ended },
    { label: "Active redemptions", value: numberFormatter.format(activeRedemptions) },
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            Manage discounts across Fernhill Market stores.
          </p>
        </div>
        <Button
          onClick={() => toast.success("New promotion draft created")}
        >
          <Plus className="size-4" />
          New promotion
        </Button>
      </header>

      <section aria-label="Promotion summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="gap-2 py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs defaultValue="active" className="gap-4">
        <TabsList>
          <TabsTrigger value="active">Active ({counts.active})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({counts.scheduled})</TabsTrigger>
          <TabsTrigger value="ended">Ended ({counts.ended})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <PromotionsTable
            promotions={byStatus.active}
            emptyMessage="No promotions are running right now."
          />
        </TabsContent>
        <TabsContent value="scheduled">
          <PromotionsTable
            promotions={byStatus.scheduled}
            emptyMessage="No promotions are scheduled yet."
          />
        </TabsContent>
        <TabsContent value="ended">
          <PromotionsTable
            promotions={byStatus.ended}
            emptyMessage="No promotions have ended."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
