import { useState, type FormEvent } from "react"
import {
  CalendarClock,
  CircleCheck,
  CircleSlash,
  Plus,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

type PromotionStatus = "active" | "scheduled" | "ended"
type DiscountType = "percent" | "amount"

type Promotion = {
  id: string
  name: string
  discount: string
  scope: string
  startDate: string
  endDate: string
  status: PromotionStatus
}

const STATUS_META: Record<
  PromotionStatus,
  {
    label: string
    variant: "success" | "info" | "secondary"
    icon: typeof CircleCheck
  }
> = {
  active: { label: "Active", variant: "success", icon: CircleCheck },
  scheduled: { label: "Scheduled", variant: "info", icon: CalendarClock },
  ended: { label: "Ended", variant: "secondary", icon: CircleSlash },
}

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: "promo-spring-produce",
    name: "Spring produce sale",
    discount: "20% off",
    scope: "Fresh produce",
    startDate: "2025-03-01",
    endDate: "2025-03-31",
    status: "active",
  },
  {
    id: "promo-members-coffee",
    name: "Members coffee week",
    discount: "$2.00 off",
    scope: "Coffee and tea",
    startDate: "2025-03-10",
    endDate: "2025-03-16",
    status: "active",
  },
  {
    id: "promo-summer-bbq",
    name: "Summer BBQ bundle",
    discount: "15% off",
    scope: "Meat and charcoal",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    status: "scheduled",
  },
  {
    id: "promo-back-to-school",
    name: "Back to school snacks",
    discount: "10% off",
    scope: "Snacks and lunch boxes",
    startDate: "2024-08-15",
    endDate: "2024-09-05",
    status: "ended",
  },
  {
    id: "promo-black-friday",
    name: "Black Friday dairy",
    discount: "$1.50 off",
    scope: "Dairy and eggs",
    startDate: "2024-11-25",
    endDate: "2024-11-29",
    status: "ended",
  },
]

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function todayIso() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
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

function PromotionTable({
  promotions,
  emptyText,
}: {
  promotions: Promotion[]
  emptyText: string
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promotion</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead className="text-right">Discount</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              promotions.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell className="font-medium">{promotion.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {promotion.scope}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {promotion.discount}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatDate(promotion.startDate)} –{" "}
                    {formatDate(promotion.endDate)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={promotion.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [discountType, setDiscountType] = useState<DiscountType>("percent")
  const [formError, setFormError] = useState<string | null>(null)

  const activePromotions = promotions.filter((p) => p.status === "active")
  const scheduledPromotions = promotions.filter((p) => p.status === "scheduled")
  const endedPromotions = promotions.filter((p) => p.status === "ended")

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get("name") ?? "").trim()
    const scope = String(data.get("scope") ?? "").trim()
    const value = Number(data.get("value"))
    const startDate = String(data.get("startDate") ?? "")
    const endDate = String(data.get("endDate") ?? "")

    if (!name || !scope || !startDate || !endDate || !(value > 0)) {
      setFormError("Fill in every field with a discount above zero.")
      return
    }
    if (endDate < startDate) {
      setFormError("The end date is before the start date. Pick a later end date.")
      return
    }

    const today = todayIso()
    const status: PromotionStatus =
      startDate > today ? "scheduled" : endDate < today ? "ended" : "active"

    const discount =
      discountType === "percent"
        ? `${value}% off`
        : `$${value.toFixed(2)} off`

    const created: Promotion = {
      id: `promo-${Date.now()}`,
      name,
      discount,
      scope,
      startDate,
      endDate,
      status,
    }

    setPromotions((previous) => [created, ...previous])
    setFormError(null)
    setDiscountType("percent")
    setSheetOpen(false)
    form.reset()
    toast.success(`Promotion "${name}" created`)
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            Discounts running at Fernhill Market, with their dates and status.
          </p>
        </div>

        <Sheet
          open={sheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open)
            if (!open) setFormError(null)
          }}
        >
          <Button onClick={() => setSheetOpen(true)}>
            <Plus />
            New promotion
          </Button>

          <SheetContent side="right" className="bg-background text-foreground">
            <SheetHeader>
              <SheetTitle>New promotion</SheetTitle>
              <SheetDescription>
                Set the discount, the products it covers and the dates it runs.
              </SheetDescription>
            </SheetHeader>

            <form
              id="new-promotion-form"
              onSubmit={handleCreate}
              className="flex flex-1 flex-col gap-5 overflow-y-auto px-4"
            >
              {formError && (
                <Alert variant="destructive">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <label htmlFor="promo-name" className="text-sm font-medium">
                  Promotion name
                </label>
                <Input
                  id="promo-name"
                  name="name"
                  type="text"
                  placeholder="Weekend bakery deal"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="promo-scope" className="text-sm font-medium">
                  Products covered
                </label>
                <Input
                  id="promo-scope"
                  name="scope"
                  type="text"
                  placeholder="Bakery"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="promo-type" className="text-sm font-medium">
                    Discount type
                  </label>
                  <Select
                    value={discountType}
                    onValueChange={(value) =>
                      setDiscountType(value as DiscountType)
                    }
                  >
                    <SelectTrigger id="promo-type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percent off</SelectItem>
                      <SelectItem value="amount">Amount off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="promo-value" className="text-sm font-medium">
                    {discountType === "percent" ? "Percent" : "Amount in dollars"}
                  </label>
                  <Input
                    id="promo-value"
                    name="value"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder={discountType === "percent" ? "15" : "2.00"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="promo-start" className="text-sm font-medium">
                    Start date
                  </label>
                  <Input id="promo-start" name="startDate" type="date" required />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="promo-end" className="text-sm font-medium">
                    End date
                  </label>
                  <Input id="promo-end" name="endDate" type="date" required />
                </div>
              </div>
            </form>

            <SheetFooter className="flex-row justify-end gap-2">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit" form="new-promotion-form">
                Create promotion
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </header>

      <Tabs defaultValue="active" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="active">Active ({activePromotions.length})</TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduledPromotions.length})
          </TabsTrigger>
          <TabsTrigger value="ended">Ended ({endedPromotions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <PromotionTable
            promotions={activePromotions}
            emptyText="No promotions are running right now."
          />
        </TabsContent>

        <TabsContent value="scheduled">
          <PromotionTable
            promotions={scheduledPromotions}
            emptyText="No promotions are scheduled."
          />
        </TabsContent>

        <TabsContent value="ended">
          <PromotionTable
            promotions={endedPromotions}
            emptyText="No promotions have ended yet."
          />
        </TabsContent>
      </Tabs>

      <Toaster />
    </main>
  )
}
