import { Banknote, Receipt, ShoppingBag, TriangleAlert, Undo2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Period = "today" | "week" | "month"

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
]

const SUMMARY: Record<
  Period,
  { revenue: string; orders: string; basket: string; returns: string; returnsShare: string }
> = {
  today: { revenue: "$3,412.50", orders: "146", basket: "$23.37", returns: "4", returnsShare: "2.7% of orders" },
  week: { revenue: "$21,870.00", orders: "958", basket: "$22.83", returns: "19", returnsShare: "2.0% of orders" },
  month: { revenue: "$92,460.75", orders: "4,102", basket: "$22.54", returns: "81", returnsShare: "2.0% of orders" },
}

const TOP_PRODUCTS: Record<
  Period,
  { id: string; name: string; units: number; revenue: string; share: string }[]
> = {
  today: [
    { id: "p1", name: "Fernhill sourdough loaf", units: 38, revenue: "$304.00", share: "8.9%" },
    { id: "p2", name: "Oat milk, 1 L", units: 52, revenue: "$208.00", share: "6.1%" },
    { id: "p3", name: "Free-range eggs, 12 pack", units: 27, revenue: "$189.00", share: "5.5%" },
    { id: "p4", name: "Cold-pressed apple juice", units: 31, revenue: "$155.00", share: "4.5%" },
    { id: "p5", name: "Bananas, per kg", units: 44, revenue: "$132.00", share: "3.9%" },
  ],
  week: [
    { id: "p1", name: "Fernhill sourdough loaf", units: 262, revenue: "$2,096.00", share: "9.6%" },
    { id: "p2", name: "Oat milk, 1 L", units: 344, revenue: "$1,376.00", share: "6.3%" },
    { id: "p3", name: "Free-range eggs, 12 pack", units: 181, revenue: "$1,267.00", share: "5.8%" },
    { id: "p4", name: "Cold-pressed apple juice", units: 205, revenue: "$1,025.00", share: "4.7%" },
    { id: "p5", name: "Bananas, per kg", units: 290, revenue: "$870.00", share: "4.0%" },
  ],
  month: [
    { id: "p1", name: "Fernhill sourdough loaf", units: 1148, revenue: "$9,184.00", share: "9.9%" },
    { id: "p2", name: "Oat milk, 1 L", units: 1462, revenue: "$5,848.00", share: "6.3%" },
    { id: "p3", name: "Free-range eggs, 12 pack", units: 779, revenue: "$5,453.00", share: "5.9%" },
    { id: "p4", name: "Cold-pressed apple juice", units: 861, revenue: "$4,305.00", share: "4.7%" },
    { id: "p5", name: "Bananas, per kg", units: 1217, revenue: "$3,651.00", share: "3.9%" },
  ],
}

function SummaryCards({ period }: { period: Period }) {
  const s = SUMMARY[period]
  const cards = [
    { label: "Revenue", value: s.revenue, detail: "Gross sales, incl. tax", icon: Banknote },
    { label: "Orders", value: s.orders, detail: "Completed transactions", icon: ShoppingBag },
    { label: "Average basket", value: s.basket, detail: "Revenue per order", icon: Receipt },
    { label: "Returns", value: s.returns, detail: s.returnsShare, icon: Undo2 },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.label}>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <Icon className="size-4" aria-hidden="true" />
                {card.label}
              </CardDescription>
              <CardTitle className="text-2xl tabular-nums">{card.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.detail}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function TopProductsTable({ period }: { period: Period }) {
  const rows = TOP_PRODUCTS[period]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 products</CardTitle>
        <CardDescription>Ranked by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Top 5 products by revenue for the selected period</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Units</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell className="tabular-nums text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-right tabular-nums">{row.units}</TableCell>
                <TableCell className="text-right tabular-nums">{row.revenue}</TableCell>
                <TableCell className="text-right tabular-nums">{row.share}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function SalesDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold">Fernhill Market</h1>
            <p className="text-sm text-muted-foreground">Sales dashboard</p>
          </div>
          <Badge variant="warning">
            <TriangleAlert aria-hidden="true" />
            Example data
          </Badge>
        </header>

        <Tabs defaultValue="today" className="flex flex-col gap-6">
          <TabsList>
            {PERIODS.map((p) => (
              <TabsTrigger key={p.value} value={p.value}>
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {PERIODS.map((p) => (
            <TabsContent key={p.value} value={p.value} className="flex flex-col gap-6">
              <SummaryCards period={p.value} />
              <TopProductsTable period={p.value} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
