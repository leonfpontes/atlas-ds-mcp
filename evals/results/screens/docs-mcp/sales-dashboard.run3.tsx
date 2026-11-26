import { useState } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type Period = "today" | "week" | "month"

interface Product {
  name: string
  units: number
  revenue: number
  share: number
}

interface Metric {
  value: number
  change: number
}

interface PeriodData {
  compareLabel: string
  revenue: Metric
  orders: Metric
  basket: Metric
  returns: Metric
  returnRate: number
  topProducts: Product[]
}

const PERIOD_TABS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
]

const SALES: Record<Period, PeriodData> = {
  today: {
    compareLabel: "vs yesterday",
    revenue: { value: 4820.5, change: 8.2 },
    orders: { value: 146, change: 5.1 },
    basket: { value: 33.01, change: 2.9 },
    returns: { value: 4, change: -33.3 },
    returnRate: 2.7,
    topProducts: [
      { name: "Sourdough loaf", units: 61, revenue: 428.0, share: 8.9 },
      { name: "Oat milk 1 L", units: 118, revenue: 354.0, share: 7.3 },
      { name: "Free-range eggs x12", units: 52, revenue: 312.6, share: 6.5 },
      { name: "Bananas 1 kg", units: 149, revenue: 268.4, share: 5.6 },
      { name: "Dark chocolate 85 g", units: 161, revenue: 241.8, share: 5.0 },
    ],
  },
  week: {
    compareLabel: "vs last week",
    revenue: { value: 31240.75, change: 4.6 },
    orders: { value: 952, change: 3.8 },
    basket: { value: 32.81, change: 0.7 },
    returns: { value: 27, change: 12.5 },
    returnRate: 2.8,
    topProducts: [
      { name: "Sourdough loaf", units: 398, revenue: 2710.4, share: 8.7 },
      { name: "Oat milk 1 L", units: 771, revenue: 2262.0, share: 7.2 },
      { name: "Free-range eggs x12", units: 337, revenue: 2015.2, share: 6.5 },
      { name: "Bananas 1 kg", units: 970, revenue: 1748.9, share: 5.6 },
      { name: "Dark chocolate 85 g", units: 1040, revenue: 1560.6, share: 5.0 },
    ],
  },
  month: {
    compareLabel: "vs last month",
    revenue: { value: 128904.2, change: -1.9 },
    orders: { value: 3921, change: -0.8 },
    basket: { value: 32.88, change: -1.1 },
    returns: { value: 109, change: -6.0 },
    returnRate: 2.8,
    topProducts: [
      { name: "Sourdough loaf", units: 1632, revenue: 11184.0, share: 8.7 },
      { name: "Oat milk 1 L", units: 3187, revenue: 9350.5, share: 7.3 },
      { name: "Free-range eggs x12", units: 1392, revenue: 8320.75, share: 6.5 },
      { name: "Bananas 1 kg", units: 4010, revenue: 7215.0, share: 5.6 },
      { name: "Dark chocolate 85 g", units: 4296, revenue: 6448.2, share: 5.0 },
    ],
  },
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const integer = new Intl.NumberFormat("en-US")

function formatChange(change: number) {
  const sign = change > 0 ? "+" : ""
  return `${sign}${change.toFixed(1)}%`
}

function MetricCard({
  label,
  display,
  change,
  invertGood = false,
  note,
  compareLabel,
}: {
  label: string
  display: string
  change: number
  invertGood?: boolean
  note: string
  compareLabel: string
}) {
  const isGood = invertGood ? change <= 0 : change >= 0
  const ChangeIcon = change >= 0 ? TrendingUp : TrendingDown

  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{display}</CardTitle>
        <CardAction>
          <Badge variant={isGood ? "success" : "destructive"}>
            <ChangeIcon />
            {formatChange(change)}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-sm">
        <p className="text-muted-foreground">{note}</p>
        <p className="text-muted-foreground">{compareLabel}</p>
      </CardContent>
    </Card>
  )
}

function PeriodPanel({ data }: { data: PeriodData }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Revenue"
          display={currency.format(data.revenue.value)}
          change={data.revenue.change}
          note="Gross sales across all tills"
          compareLabel={data.compareLabel}
        />
        <MetricCard
          label="Orders"
          display={integer.format(data.orders.value)}
          change={data.orders.change}
          note="Completed transactions"
          compareLabel={data.compareLabel}
        />
        <MetricCard
          label="Average basket"
          display={currency.format(data.basket.value)}
          change={data.basket.change}
          note="Revenue per order"
          compareLabel={data.compareLabel}
        />
        <MetricCard
          label="Returns"
          display={integer.format(data.returns.value)}
          change={data.returns.change}
          invertGood
          note={`${data.returnRate.toFixed(1)}% of orders`}
          compareLabel={data.compareLabel}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 products</CardTitle>
          <CardDescription>Ranked by revenue for this period</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topProducts.map((product, index) => (
                <TableRow key={product.name}>
                  <TableCell className="text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {integer.format(product.units)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {currency.format(product.revenue)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.share.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SalesDashboard() {
  const [period, setPeriod] = useState<Period>("today")

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Fernhill Market</p>
        <h1 className="text-2xl font-semibold text-foreground">Sales overview</h1>
      </header>

      <Tabs
        value={period}
        onValueChange={(value) => setPeriod(value as Period)}
        className="flex flex-col gap-6"
      >
        <TabsList>
          {PERIOD_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PERIOD_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <PeriodPanel data={SALES[tab.value]} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
