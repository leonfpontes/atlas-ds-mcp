import { useState, type FormEvent } from "react"
import { CalendarClock, CircleCheck, CircleSlash, Plus, type LucideIcon } from "lucide-react"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"

type Status = "active" | "scheduled" | "ended"

type Promotion = {
  id: string
  name: string
  discount: string
  startDate: string
  endDate: string
  status: Status
}

const PROMOTIONS: Promotion[] = [
  { id: "p1", name: "Summer produce sale", discount: "20% off", startDate: "2025-06-01", endDate: "2025-06-30", status: "active" },
  { id: "p2", name: "Bakery bundle", discount: "$3 off", startDate: "2025-05-20", endDate: "2025-06-20", status: "active" },
  { id: "p3", name: "Loyalty members week", discount: "15% off", startDate: "2025-07-07", endDate: "2025-07-13", status: "scheduled" },
  { id: "p4", name: "Back to school", discount: "10% off", startDate: "2025-08-18", endDate: "2025-09-05", status: "scheduled" },
  { id: "p5", name: "Spring dairy deal", discount: "$1 off", startDate: "2025-03-10", endDate: "2025-04-10", status: "ended" },
  { id: "p6", name: "Easter baking", discount: "25% off", startDate: "2025-04-14", endDate: "2025-04-21", status: "ended" },
]

const STATUS: Record<Status, { label: string; variant: "success" | "info" | "secondary"; icon: LucideIcon }> = {
  active: { label: "Active", variant: "success", icon: CircleCheck },
  scheduled: { label: "Scheduled", variant: "info", icon: CalendarClock },
  ended: { label: "Ended", variant: "secondary", icon: CircleSlash },
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso))
}

function PromotionsTable({ rows }: { rows: Promotion[] }) {
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
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No promotions here yet.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((promo) => {
            const status = STATUS[promo.status]
            const Icon = status.icon
            return (
              <TableRow key={promo.id}>
                <TableCell className="font-medium">{promo.name}</TableCell>
                <TableCell>{promo.discount}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(promo.startDate)} – {formatDate(promo.endDate)}
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant}>
                    <Icon aria-hidden="true" />
                    {status.label}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}

export default function PromotionsPage() {
  const [createOpen, setCreateOpen] = useState(false)

  const active = PROMOTIONS.filter((p) => p.status === "active")
  const scheduled = PROMOTIONS.filter((p) => p.status === "scheduled")
  const ended = PROMOTIONS.filter((p) => p.status === "ended")

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCreateOpen(false)
    toast.success("Promotion created")
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Promotions</h1>
          <p className="text-sm text-muted-foreground">Fernhill Market discounts, by status.</p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus aria-hidden="true" />
              New promotion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Create a promotion</DialogTitle>
                <DialogDescription>Set the discount and the dates it runs for.</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2">
                <label htmlFor="promo-name" className="text-sm font-medium">
                  Promotion name
                </label>
                <Input id="promo-name" name="name" type="text" required placeholder="Weekend fruit offer" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="promo-discount" className="text-sm font-medium">
                  Discount (percent)
                </label>
                <Input id="promo-discount" name="discount" type="number" min={1} max={100} required placeholder="10" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <CardHeader>
          <CardTitle>All promotions</CardTitle>
          <CardDescription>Discounts running now, coming up, and already finished.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({scheduled.length})</TabsTrigger>
              <TabsTrigger value="ended">Ended ({ended.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              <PromotionsTable rows={active} />
            </TabsContent>
            <TabsContent value="scheduled">
              <PromotionsTable rows={scheduled} />
            </TabsContent>
            <TabsContent value="ended">
              <PromotionsTable rows={ended} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Toaster />
    </main>
  )
}
