import { CalendarClock, CircleCheck, History, Plus, Tag } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

type PromotionStatus = "active" | "scheduled" | "ended"

type Promotion = {
  id: string
  name: string
  code: string
  discount: string
  startDate: string
  endDate: string
  status: PromotionStatus
  redemptions: number
}

const PROMOTIONS: Promotion[] = [
  {
    id: "PR-2041",
    name: "Spring produce sale",
    code: "SPRING15",
    discount: "15% off",
    startDate: "Mar 3, 2025",
    endDate: "Mar 30, 2025",
    status: "active",
    redemptions: 1284,
  },
  {
    id: "PR-2044",
    name: "Bakery bundle",
    code: "BAKE3",
    discount: "$3 off bundles",
    startDate: "Mar 10, 2025",
    endDate: "Apr 6, 2025",
    status: "active",
    redemptions: 462,
  },
  {
    id: "PR-2050",
    name: "Easter weekend",
    code: "EASTER20",
    discount: "20% off",
    startDate: "Apr 17, 2025",
    endDate: "Apr 21, 2025",
    status: "scheduled",
    redemptions: 0,
  },
  {
    id: "PR-2052",
    name: "Coffee loyalty week",
    code: "BREW2X",
    discount: "2x points",
    startDate: "May 5, 2025",
    endDate: "May 11, 2025",
    status: "scheduled",
    redemptions: 0,
  },
  {
    id: "PR-2029",
    name: "Winter pantry clear-out",
    code: "PANTRY10",
    discount: "10% off",
    startDate: "Feb 1, 2025",
    endDate: "Feb 28, 2025",
    status: "ended",
    redemptions: 903,
  },
  {
    id: "PR-2033",
    name: "New year fresh start",
    code: "NEWYEAR25",
    discount: "$5 off $40",
    startDate: "Jan 2, 2025",
    endDate: "Jan 15, 2025",
    status: "ended",
    redemptions: 1571,
  },
]

const STATUS_META: Record<
  PromotionStatus,
  { label: string; variant: "success" | "info" | "secondary"; icon: typeof CircleCheck }
> = {
  active: { label: "Active", variant: "success", icon: CircleCheck },
  scheduled: { label: "Scheduled", variant: "info", icon: CalendarClock },
  ended: { label: "Ended", variant: "secondary", icon: History },
}

const TAB_ORDER: PromotionStatus[] = ["active", "scheduled", "ended"]

const TAB_DESCRIPTIONS: Record<PromotionStatus, string> = {
  active: "Running now and visible to customers.",
  scheduled: "Approved and waiting for their start date.",
  ended: "Finished. Kept for reporting.",
}

function StatusBadge({ status }: { status: PromotionStatus }) {
  const meta = STATUS_META[status]
  const Icon = meta.icon
  return (
    <Badge variant={meta.variant}>
      <Icon />
      {meta.label}
    </Badge>
  )
}

function PromotionTable({ items, emptyText }: { items: Promotion[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="px-6 py-10 text-center text-sm text-muted-foreground">{emptyText}</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Promotion</TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Redemptions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((promotion) => (
          <TableRow key={promotion.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{promotion.name}</span>
                <span className="text-xs text-muted-foreground">{promotion.id}</span>
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm">{promotion.code}</TableCell>
            <TableCell>{promotion.discount}</TableCell>
            <TableCell className="text-muted-foreground">
              {promotion.startDate} – {promotion.endDate}
            </TableCell>
            <TableCell>
              <StatusBadge status={promotion.status} />
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {promotion.redemptions.toLocaleString("en-US")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function PromotionsPage() {
  const countFor = (status: PromotionStatus) =>
    PROMOTIONS.filter((promotion) => promotion.status === status).length

  const handleCreate = () => {
    toast.success("New promotion started", {
      description: "Add a name, discount and dates to save it.",
    })
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="size-4" />
            <span className="text-sm">Fernhill Market</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            Discounts, their dates and how often customers have used them.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus />
          New promotion
        </Button>
      </header>

      <Tabs defaultValue="active">
        <TabsList>
          {TAB_ORDER.map((status) => (
            <TabsTrigger key={status} value={status}>
              {STATUS_META[status].label}
              <span className="ml-1 tabular-nums text-muted-foreground">({countFor(status)})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_ORDER.map((status) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle>{STATUS_META[status].label} promotions</CardTitle>
                <CardDescription>{TAB_DESCRIPTIONS[status]}</CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <PromotionTable
                  items={PROMOTIONS.filter((promotion) => promotion.status === status)}
                  emptyText={`No ${STATUS_META[status].label.toLowerCase()} promotions.`}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Toaster />
    </main>
  )
}
