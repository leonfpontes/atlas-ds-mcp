import { useState, type FormEvent } from "react"
import { CalendarClock, CircleCheck, CircleX, Plus, Tag } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

type Status = "active" | "scheduled" | "ended"
type DiscountType = "percent" | "amount"

type Promotion = {
  id: string
  name: string
  code: string
  discount: string
  start: string
  end: string
  status: Status
}

type PromotionForm = {
  name: string
  code: string
  discountType: DiscountType
  discountValue: string
  start: string
  end: string
}

const STATUS_META: Record<
  Status,
  {
    label: string
    variant: "success" | "info" | "secondary"
    icon: typeof CircleCheck
  }
> = {
  active: { label: "Active", variant: "success", icon: CircleCheck },
  scheduled: { label: "Scheduled", variant: "info", icon: CalendarClock },
  ended: { label: "Ended", variant: "secondary", icon: CircleX },
}

const TAB_ORDER: Status[] = ["active", "scheduled", "ended"]

const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: "promo-1",
    name: "Spring produce week",
    code: "SPRING15",
    discount: "15% off",
    start: "2025-03-03",
    end: "2025-03-16",
    status: "active",
  },
  {
    id: "promo-2",
    name: "Loyalty members bakery",
    code: "BAKE10",
    discount: "10% off",
    start: "2025-02-20",
    end: "2025-04-30",
    status: "active",
  },
  {
    id: "promo-3",
    name: "Easter basket bundle",
    code: "EASTER5",
    discount: "$5 off",
    start: "2025-04-10",
    end: "2025-04-21",
    status: "scheduled",
  },
  {
    id: "promo-4",
    name: "Coffee beans tasting",
    code: "BEANS20",
    discount: "20% off",
    start: "2025-05-02",
    end: "2025-05-11",
    status: "scheduled",
  },
  {
    id: "promo-5",
    name: "Winter soup sale",
    code: "SOUP25",
    discount: "25% off",
    start: "2025-01-06",
    end: "2025-02-09",
    status: "ended",
  },
  {
    id: "promo-6",
    name: "New year pantry",
    code: "PANTRY8",
    discount: "$8 off",
    start: "2024-12-26",
    end: "2025-01-05",
    status: "ended",
  },
]

const EMPTY_FORM: PromotionForm = {
  name: "",
  code: "",
  discountType: "percent",
  discountValue: "",
  start: "",
  end: "",
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function statusFor(start: string, end: string): Status {
  const today = todayIso()
  if (start > today) return "scheduled"
  if (end < today) return "ended"
  return "active"
}

function StatusBadge({ status }: { status: Status }) {
  const meta = STATUS_META[status]
  const Icon = meta.icon
  return (
    <Badge variant={meta.variant}>
      <Icon aria-hidden="true" className="size-3.5" />
      {meta.label}
    </Badge>
  )
}

function PromotionTable({ items }: { items: Promotion[] }) {
  if (items.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-sm text-muted-foreground">
        No promotions here yet.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Promotion</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((promo) => (
          <TableRow key={promo.id}>
            <TableCell>
              <div className="font-medium text-foreground">{promo.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Tag aria-hidden="true" className="size-3" />
                {promo.code}
              </div>
            </TableCell>
            <TableCell className="font-medium">{promo.discount}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(promo.start)} – {formatDate(promo.end)}
            </TableCell>
            <TableCell>
              <StatusBadge status={promo.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<PromotionForm>(EMPTY_FORM)

  const dateOrderInvalid =
    form.start !== "" && form.end !== "" && form.end < form.start

  const updateField = <K extends keyof PromotionForm>(
    key: K,
    value: PromotionForm[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (dateOrderInvalid) return

    const value = form.discountValue.trim()
    const discount =
      form.discountType === "percent" ? `${value}% off` : `$${value} off`

    const promo: Promotion = {
      id: `promo-${Date.now()}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      discount,
      start: form.start,
      end: form.end,
      status: statusFor(form.start, form.end),
    }

    setPromotions((prev) => [promo, ...prev])
    setForm(EMPTY_FORM)
    setOpen(false)
    toast.success(`${promo.name} created`)
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market discounts, from running offers to past ones.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus aria-hidden="true" />
              New promotion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a promotion</DialogTitle>
              <DialogDescription>
                Set the discount and the dates. A promotion that starts later
                is scheduled automatically.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="promo-name" className="text-sm font-medium">
                  Promotion name
                </label>
                <Input
                  id="promo-name"
                  required
                  placeholder="Summer berry sale"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="promo-code" className="text-sm font-medium">
                  Promo code
                </label>
                <Input
                  id="promo-code"
                  required
                  placeholder="BERRY10"
                  value={form.code}
                  onChange={(e) => updateField("code", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium" id="promo-type-label">
                    Discount type
                  </span>
                  <Select
                    value={form.discountType}
                    onValueChange={(value) =>
                      updateField("discountType", value as DiscountType)
                    }
                  >
                    <SelectTrigger aria-labelledby="promo-type-label">
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
                    {form.discountType === "percent"
                      ? "Percent (1–100)"
                      : "Amount in dollars"}
                  </label>
                  <Input
                    id="promo-value"
                    type="number"
                    required
                    min={1}
                    max={form.discountType === "percent" ? 100 : undefined}
                    step={form.discountType === "percent" ? 1 : 0.01}
                    placeholder={form.discountType === "percent" ? "15" : "5.00"}
                    value={form.discountValue}
                    onChange={(e) => updateField("discountValue", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="promo-start" className="text-sm font-medium">
                    Start date
                  </label>
                  <Input
                    id="promo-start"
                    type="date"
                    required
                    value={form.start}
                    onChange={(e) => updateField("start", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="promo-end" className="text-sm font-medium">
                    End date
                  </label>
                  <Input
                    id="promo-end"
                    type="date"
                    required
                    aria-invalid={dateOrderInvalid}
                    value={form.end}
                    onChange={(e) => updateField("end", e.target.value)}
                  />
                </div>
              </div>

              {dateOrderInvalid ? (
                <p role="alert" className="text-sm text-destructive">
                  The end date is before the start date. Pick an end date on or
                  after {formatDate(form.start)}.
                </p>
              ) : null}

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Create promotion</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <Card>
        <Tabs defaultValue="active">
          <CardHeader>
            <CardTitle>All promotions</CardTitle>
            <CardDescription>
              Filter by where each promotion stands today.
            </CardDescription>
            <CardAction>
              <TabsList>
                {TAB_ORDER.map((status) => {
                  const count = promotions.filter(
                    (p) => p.status === status
                  ).length
                  return (
                    <TabsTrigger key={status} value={status}>
                      {STATUS_META[status].label}
                      <span className="text-muted-foreground">{count}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </CardAction>
          </CardHeader>

          <CardContent className="px-0">
            {TAB_ORDER.map((status) => (
              <TabsContent key={status} value={status}>
                <PromotionTable
                  items={promotions.filter((p) => p.status === status)}
                />
              </TabsContent>
            ))}
          </CardContent>
        </Tabs>
      </Card>

      <Toaster position="bottom-right" />
    </main>
  )
}
