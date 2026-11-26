import type { ReactNode } from "react"
import { CalendarClock, CircleCheck, CircleSlash, Percent, Plus } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"

type PromotionStatus = "active" | "scheduled" | "ended"

type Promotion = {
  id: string
  name: string
  discount: string
  appliesTo: string
  startDate: string
  endDate: string
  status: PromotionStatus
}

const PROMOTIONS: Promotion[] = [
  { id: "PR-1042", name: "Spring produce sale", discount: "20% off", appliesTo: "Fresh produce", startDate: "Mar 1, 2025", endDate: "Mar 31, 2025", status: "active" },
  { id: "PR-1048", name: "Bakery bundle", discount: "$3.00 off", appliesTo: "Bakery, 2 or more items", startDate: "Mar 10, 2025", endDate: "Apr 10, 2025", status: "active" },
  { id: "PR-1051", name: "Member weekend", discount: "15% off", appliesTo: "Whole store", startDate: "Apr 4, 2025", endDate: "Apr 6, 2025", status: "scheduled" },
  { id: "PR-1055", name: "Coffee and tea", discount: "Buy 2, get 1 free", appliesTo: "Coffee and tea", startDate: "Apr 15, 2025", endDate: "May 15, 2025", status: "scheduled" },
  { id: "PR-1017", name: "Winter pantry", discount: "10% off", appliesTo: "Dry goods", startDate: "Jan 5, 2025", endDate: "Feb 28, 2025", status: "ended" },
  { id: "PR-1029", name: "Valentine chocolate", discount: "$5.00 off", appliesTo: "Chocolate, $25 minimum", startDate: "Feb 10, 2025", endDate: "Feb 14, 2025", status: "ended" },
]

const STATUS_BADGE: Record<PromotionStatus, { label: string; variant: "success" | "info" | "secondary"; icon: ReactNode }> = {
  active: { label: "Active", variant: "success", icon: <CircleCheck /> },
  scheduled: { label: "Scheduled", variant: "info", icon: <CalendarClock /> },
  ended: { label: "Ended", variant: "secondary", icon: <CircleSlash /> },
}

const TABS: { value: PromotionStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "ended", label: "Ended" },
]

function PromotionsTable({ items }: { items: Promotion[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Promotion</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Applies to</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((promo) => {
          const status = STATUS_BADGE[promo.status]
          return (
            <TableRow key={promo.id}>
              <TableCell>
                <div className="font-medium text-foreground">{promo.name}</div>
                <div className="text-xs text-muted-foreground">{promo.id}</div>
              </TableCell>
              <TableCell>{promo.discount}</TableCell>
              <TableCell className="text-muted-foreground">{promo.appliesTo}</TableCell>
              <TableCell>
                {promo.startDate} – {promo.endDate}
              </TableCell>
              <TableCell>
                <Badge variant={status.variant}>
                  {status.icon}
                  {status.label}
                </Badge>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default function PromotionsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Promotions</h1>
          <p className="text-sm text-muted-foreground">Fernhill Market · discounts across the store</p>
        </div>
        <Button onClick={() => toast.success("New promotion started")}>
          <Plus />
          Create promotion
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>All promotions</CardTitle>
          <CardDescription>Discounts grouped by when they run</CardDescription>
          <CardAction>
            <Percent className="text-muted-foreground" aria-hidden="true" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              {TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label} ({PROMOTIONS.filter((p) => p.status === tab.value).length})
                </TabsTrigger>
              ))}
            </TabsList>
            {TABS.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                <PromotionsTable items={PROMOTIONS.filter((p) => p.status === tab.value)} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Toaster />
    </main>
  )
}
