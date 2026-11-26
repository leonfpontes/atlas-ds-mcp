import { TrendingDown, TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Period = "today" | "week" | "month"

type Summary = {
  title: string
  value: string
  change: string
  trend: "up" | "down"
}

type TopProduct = {
  name: string
  units: number
  revenue: string
  share: string
}

const PERIODS: { value: Period; label: string; scope: string }[] = [
  { value: "today", label: "Today", scope: "today" },
  { value: "week", label: "This week", scope: "this week" },
  { value: "month", label: "This month", scope: "this month" },
]

const SUMMARY: Record<Period, Summary[]> = {
  today: [
    { title: "Revenue today", value: "$4,286.50", change: "+8.2% vs same day last week", trend: "up" },
    { title: "Orders", value: "142", change: "+6.0% vs same day last week", trend: "up" },
    { title: "Average basket", value: "$30.18", change: "−1.9% vs same day last week", trend: "down" },
    { title: "Returns", value: "7", change: "+2 vs same day last week", trend: "up" },
  ],
  week: [
    { title: "Revenue this week", value: "$27,914.20", change: "+4.1% vs last week", trend: "up" },
    { title: "Orders", value: "968", change: "+3.4% vs last week", trend: "up" },
    { title: "Average basket", value: "$28.84", change: "+0.6% vs last week", trend: "up" },
    { title: "Returns", value: "41", change: "−5 vs last week", trend: "down" },
  ],
  month: [
    { title: "Revenue this month", value: "$118,406.75", change: "+2.7% vs last month", trend: "up" },
    { title: "Orders", value: "4,122", change: "+1.9% vs last month", trend: "up" },
    { title: "Average basket", value: "$28.72", change: "+0.8% vs last month", trend: "up" },
    { title: "Returns", value: "163", change: "+11 vs last month", trend: "up" },
  ],
}

const TOP_PRODUCTS: Record<Period, TopProduct[]> = {
  today: [
    { name: "Sourdough loaf", units: 38, revenue: "$190.00", share: "4.4%" },
    { name: "Free-range eggs, 12 pack", units: 29, revenue: "$139.20", share: "3.2%" },
    { name: "Bananas, 1 kg", units: 52, revenue: "$114.40", share: "2.7%" },
    { name: "Oat milk, 1 L", units: 47, revenue: "$112.80", share: "2.6%" },
    { name: "Dark roast coffee, 250 g", units: 11, revenue: "$97.90", share: "2.3%" },
  ],
  week: [
    { name: "Sourdough loaf", units: 221, revenue: "$1,105.00", share: "4.0%" },
    { name: "Free-range eggs, 12 pack", units: 176, revenue: "$844.80", share: "3.0%" },
    { name: "Bananas, 1 kg", units: 298, revenue: "$655.60", share: "2.3%" },
    { name: "Oat milk, 1 L", units: 255, revenue: "$612.00", share: "2.2%" },
    { name: "Dark roast coffee, 250 g", units: 64, revenue: "$569.60", share: "2.0%" },
  ],
  month: [
    { name: "Sourdough loaf", units: 934, revenue: "$4,670.00", share: "3.9%" },
    { name: "Free-range eggs, 12 pack", units: 702, revenue: "$3,369.60", share: "2.8%" },
    { name: "Bananas, 1 kg", units: 1186, revenue: "$2,609.20", share: "2.2%" },
    { name: "Oat milk, 1 L", units: 1012, revenue: "$2,428.80", share: "2.1%" },
    { name: "Dark roast coffee, 250 g", units: 258, revenue: "$2,296.20", share: "1.9%" },
  ],
}

export default function SalesDashboard() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Sales overview</h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market, all tills. Figures include VAT.
          </p>
        </header>

        <Tabs defaultValue="today" className="gap-6">
          <TabsList>
            {PERIODS.map((period) => (
              <TabsTrigger key={period.value} value={period.value}>
                {period.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {PERIODS.map((period) => (
            <TabsContent key={period.value} value={period.value} className="flex flex-col gap-6">
              <section
                aria-label={`Summary, ${period.scope}`}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {SUMMARY[period.value].map((metric) => {
                  const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
                  return (
                    <Card key={metric.title}>
                      <CardHeader>
                        <CardDescription>{metric.title}</CardDescription>
                        <CardTitle className="text-2xl tabular-nums">{metric.value}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendIcon className="size-4 shrink-0" aria-hidden="true" />
                        <span>{metric.change}</span>
                      </CardContent>
                    </Card>
                  )
                })}
              </section>

              <Card>
                <CardHeader>
                  <CardTitle>Top 5 products</CardTitle>
                  <CardDescription>Ranked by revenue, {period.scope}.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Units sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Share of revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TOP_PRODUCTS[period.value].map((product) => (
                        <TableRow key={product.name}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-right tabular-nums">{product.units}</TableCell>
                          <TableCell className="text-right tabular-nums">{product.revenue}</TableCell>
                          <TableCell className="text-right tabular-nums">{product.share}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}
