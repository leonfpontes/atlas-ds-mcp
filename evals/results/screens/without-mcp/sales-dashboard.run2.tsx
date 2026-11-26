import { useMemo, useState } from "react";
import {
  DollarSign,
  Receipt,
  ShoppingBag,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Download,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Period = "today" | "week" | "month";

type SummaryMetric = {
  revenue: number;
  orders: number;
  averageBasket: number;
  returns: number;
  revenueChange: number;
  ordersChange: number;
  averageBasketChange: number;
  returnsChange: number;
};

type TopProduct = {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
};

const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
};

const PERIOD_DESCRIPTIONS: Record<Period, string> = {
  today: "Sales since opening at 07:00",
  week: "Monday to today",
  month: "1st of the month to today",
};

const SUMMARY_BY_PERIOD: Record<Period, SummaryMetric> = {
  today: {
    revenue: 4836.5,
    orders: 218,
    averageBasket: 22.19,
    returns: 7,
    revenueChange: 6.4,
    ordersChange: 4.1,
    averageBasketChange: 2.2,
    returnsChange: -12.5,
  },
  week: {
    revenue: 31245.8,
    orders: 1487,
    averageBasket: 21.01,
    returns: 46,
    revenueChange: 3.8,
    ordersChange: 1.9,
    averageBasketChange: 1.8,
    returnsChange: 8.2,
  },
  month: {
    revenue: 128904.25,
    orders: 6122,
    averageBasket: 21.06,
    returns: 203,
    revenueChange: -1.7,
    ordersChange: -0.6,
    averageBasketChange: -1.1,
    returnsChange: 4.9,
  },
};

const TOP_PRODUCTS_BY_PERIOD: Record<Period, TopProduct[]> = {
  today: [
    { id: "p-101", name: "Sourdough loaf", category: "Bakery", unitsSold: 64, revenue: 384.0 },
    { id: "p-204", name: "Free-range eggs (12)", category: "Dairy & eggs", unitsSold: 58, revenue: 493.0 },
    { id: "p-317", name: "Oat milk 1L", category: "Chilled", unitsSold: 51, revenue: 255.0 },
    { id: "p-422", name: "Bananas (loose, 1kg)", category: "Produce", unitsSold: 47, revenue: 164.5 },
    { id: "p-508", name: "Ground coffee 250g", category: "Grocery", unitsSold: 33, revenue: 528.0 },
  ],
  week: [
    { id: "p-204", name: "Free-range eggs (12)", category: "Dairy & eggs", unitsSold: 402, revenue: 3417.0 },
    { id: "p-101", name: "Sourdough loaf", category: "Bakery", unitsSold: 378, revenue: 2268.0 },
    { id: "p-317", name: "Oat milk 1L", category: "Chilled", unitsSold: 345, revenue: 1725.0 },
    { id: "p-508", name: "Ground coffee 250g", category: "Grocery", unitsSold: 221, revenue: 3536.0 },
    { id: "p-422", name: "Bananas (loose, 1kg)", category: "Produce", unitsSold: 310, revenue: 1085.0 },
  ],
  month: [
    { id: "p-508", name: "Ground coffee 250g", category: "Grocery", unitsSold: 1184, revenue: 18944.0 },
    { id: "p-204", name: "Free-range eggs (12)", category: "Dairy & eggs", unitsSold: 1650, revenue: 14025.0 },
    { id: "p-101", name: "Sourdough loaf", category: "Bakery", unitsSold: 1502, revenue: 9012.0 },
    { id: "p-317", name: "Oat milk 1L", category: "Chilled", unitsSold: 1391, revenue: 6955.0 },
    { id: "p-422", name: "Bananas (loose, 1kg)", category: "Produce", unitsSold: 1268, revenue: 4438.0 },
  ],
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const integer = new Intl.NumberFormat("en-US");

function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

type SummaryCardProps = {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  invertGood?: boolean;
  comparisonLabel: string;
};

function SummaryCard({
  title,
  value,
  change,
  icon,
  invertGood = false,
  comparisonLabel,
}: SummaryCardProps) {
  const isPositive = change >= 0;
  const isGood = invertGood ? !isPositive : isPositive;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendIcon
            className={
              isGood
                ? "h-3.5 w-3.5 text-emerald-600"
                : "h-3.5 w-3.5 text-red-600"
            }
            aria-hidden="true"
          />
          <span
            className={
              isGood ? "font-medium text-emerald-600" : "font-medium text-red-600"
            }
          >
            {formatChange(change)}
          </span>
          <span>{comparisonLabel}</span>
        </p>
      </CardContent>
    </Card>
  );
}

function PeriodContent({ period }: { period: Period }) {
  const summary = SUMMARY_BY_PERIOD[period];
  const products = TOP_PRODUCTS_BY_PERIOD[period];

  const totalProductRevenue = useMemo(
    () => products.reduce((sum, product) => sum + product.revenue, 0),
    [products],
  );

  const comparisonLabel =
    period === "today"
      ? "vs yesterday"
      : period === "week"
        ? "vs last week"
        : "vs last month";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Revenue"
          value={currency.format(summary.revenue)}
          change={summary.revenueChange}
          icon={<DollarSign className="h-4 w-4" aria-hidden="true" />}
          comparisonLabel={comparisonLabel}
        />
        <SummaryCard
          title="Orders"
          value={integer.format(summary.orders)}
          change={summary.ordersChange}
          icon={<ShoppingBag className="h-4 w-4" aria-hidden="true" />}
          comparisonLabel={comparisonLabel}
        />
        <SummaryCard
          title="Average basket"
          value={currency.format(summary.averageBasket)}
          change={summary.averageBasketChange}
          icon={<Receipt className="h-4 w-4" aria-hidden="true" />}
          comparisonLabel={comparisonLabel}
        />
        <SummaryCard
          title="Returns"
          value={integer.format(summary.returns)}
          change={summary.returnsChange}
          invertGood
          icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
          comparisonLabel={comparisonLabel}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 products</CardTitle>
          <CardDescription>
            Ranked by revenue, {PERIOD_DESCRIPTIONS[period].toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Units sold</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => {
                const share =
                  totalProductRevenue === 0
                    ? 0
                    : (product.revenue / totalProductRevenue) * 100;

                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {integer.format(product.unitsSold)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {currency.format(product.revenue)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {share.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("today");

  const handleExport = () => {
    toast.success(`Exported ${PERIOD_LABELS[period].toLowerCase()} sales report`);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Fernhill Market
            </h1>
            <p className="text-sm text-muted-foreground">
              Sales dashboard · {PERIOD_DESCRIPTIONS[period]}
            </p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Export
          </Button>
        </header>

        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
          className="space-y-6"
        >
          <TabsList>
            {(Object.keys(PERIOD_LABELS) as Period[]).map((key) => (
              <TabsTrigger key={key} value={key}>
                {PERIOD_LABELS[key]}
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(PERIOD_LABELS) as Period[]).map((key) => (
            <TabsContent key={key} value={key}>
              <PeriodContent period={key} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
