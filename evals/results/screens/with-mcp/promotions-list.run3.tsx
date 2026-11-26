import { useState, type FormEvent } from "react"
import { CalendarClock, CircleCheck, CircleOff, Plus } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"

type PromotionStatus = "active" | "scheduled" | "ended"

type Promotion = {
  id: string
  name: string
  discount: string
  startDate: string
  endDate: string
  status: PromotionStatus
}

const PROMOTIONS: Promotion[] = [
  {
    id: "PR-101",
    name: "Spring produce sale",
    discount: "15% off",
    startDate: "3 Mar 2025",
    endDate: "30 Apr 2025",
    status: "active",
  },
  {
    id: "PR-102",
    name: "Loyalty members week",
    discount: "10% off",
    startDate: "14 Apr 2025",
    endDate: "20 Apr 2025",
    status: "active",
  },
  {
    id: "PR-103",
    name: "Summer barbecue bundle",
    discount: "$5 off",
    startDate: "1 Jun 2025",
    endDate: "30 Jun 2025",
    status: "scheduled",
  },
  {
    id: "PR-104",
    name: "Back to school snacks",
    discount: "20% off",
    startDate: "18 Aug 2025",
    endDate: "31 Aug 2025",
    status: "scheduled",
  },
  {
    id: "PR-095",
    name: "Winter baking event",
    discount: "25% off",
    startDate: "1 Dec 2024",
    endDate: "31 Dec 2024",
    status: "ended",
  },
  {
    id: "PR-096",
    name: "Coffee beans two for one",
    discount: "$4 off",
    startDate: "10 Feb 2025",
    endDate: "24 Feb 2025",
    status: "ended",
  },
]

const STATUS_BADGE = {
  active: { label: "Active", variant: "success", Icon: CircleCheck },
  scheduled: { label: "Scheduled", variant: "info", Icon: CalendarClock },
  ended: { label: "Ended", variant: "secondary", Icon: CircleOff },
} as const

const EMPTY_FORM = { name: "", discount: "", startDate: "", endDate: "" }

function StatusBadge({ status }: { status: PromotionStatus }) {
  const { label, variant, Icon } = STATUS_BADGE[status]
  return (
    <Badge variant={variant}>
      <Icon aria-hidden="true" />
      {label}
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Promotion</TableHead>
          <TableHead className="text-right">Discount</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promotions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          promotions.map((promotion) => (
            <TableRow key={promotion.id}>
              <TableCell>
                <div className="font-medium">{promotion.name}</div>
                <div className="text-sm text-muted-foreground">{promotion.id}</div>
              </TableCell>
              <TableCell className="text-right tabular-nums">{promotion.discount}</TableCell>
              <TableCell>
                {promotion.startDate} to {promotion.endDate}
              </TableCell>
              <TableCell>
                <StatusBadge status={promotion.status} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default function PromotionsPage() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const active = PROMOTIONS.filter((p) => p.status === "active")
  const scheduled = PROMOTIONS.filter((p) => p.status === "scheduled")
  const ended = PROMOTIONS.filter((p) => p.status === "ended")

  function updateField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success(`Promotion "${form.name.trim()}" created`)
    setForm(EMPTY_FORM)
    setOpen(false)
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Promotions</h1>
          <p className="text-muted-foreground">
            Discounts running at Fernhill Market, upcoming and past.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus aria-hidden="true" />
              Create promotion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-6">
              <DialogHeader>
                <DialogTitle>Create promotion</DialogTitle>
                <DialogDescription>
                  Set the discount and the dates. The promotion starts on its start date.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="promo-name" className="text-sm font-medium">
                    Promotion name
                  </label>
                  <Input
                    id="promo-name"
                    required
                    placeholder="Summer fruit sale"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="promo-discount" className="text-sm font-medium">
                    Discount (%)
                  </label>
                  <Input
                    id="promo-discount"
                    type="number"
                    min={1}
                    max={100}
                    required
                    placeholder="10"
                    value={form.discount}
                    onChange={(e) => updateField("discount", e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="promo-start" className="text-sm font-medium">
                      Start date
                    </label>
                    <Input
                      id="promo-start"
                      type="date"
                      required
                      value={form.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
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
                      value={form.endDate}
                      onChange={(e) => updateField("endDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

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

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({scheduled.length})</TabsTrigger>
          <TabsTrigger value="ended">Ended ({ended.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active promotions</CardTitle>
              <CardDescription>Discounts applied at the till right now.</CardDescription>
            </CardHeader>
            <CardContent>
              <PromotionsTable
                promotions={active}
                emptyMessage="No promotions are running right now."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled promotions</CardTitle>
              <CardDescription>Discounts that start on a future date.</CardDescription>
            </CardHeader>
            <CardContent>
              <PromotionsTable
                promotions={scheduled}
                emptyMessage="No promotions are scheduled."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ended">
          <Card>
            <CardHeader>
              <CardTitle>Ended promotions</CardTitle>
              <CardDescription>Discounts whose end date has passed.</CardDescription>
            </CardHeader>
            <CardContent>
              <PromotionsTable
                promotions={ended}
                emptyMessage="No promotions have ended yet."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </main>
  )
}
