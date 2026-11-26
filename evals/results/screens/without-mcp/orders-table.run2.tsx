import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OrderStatus = "paid" | "packing" | "shipped" | "refunded";

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  items: { name: string; quantity: number }[];
  totalCents: number;
  status: OrderStatus;
};

const ORDERS: Order[] = [
  {
    id: "1",
    orderNumber: "FM-10421",
    customer: "Maya Lindqvist",
    items: [
      { name: "Sourdough loaf", quantity: 1 },
      { name: "Oat milk 1L", quantity: 2 },
    ],
    totalCents: 1284,
    status: "packing",
  },
  {
    id: "2",
    orderNumber: "FM-10422",
    customer: "Jordan Reyes",
    items: [
      { name: "Heirloom tomatoes", quantity: 3 },
      { name: "Basil bunch", quantity: 1 },
      { name: "Olive oil 500ml", quantity: 1 },
    ],
    totalCents: 2396,
    status: "paid",
  },
  {
    id: "3",
    orderNumber: "FM-10423",
    customer: "Priya Natarajan",
    items: [{ name: "Free-range eggs (12)", quantity: 2 }],
    totalCents: 1098,
    status: "shipped",
  },
  {
    id: "4",
    orderNumber: "FM-10424",
    customer: "Tomasz Wiśniewski",
    items: [
      { name: "Dark roast coffee beans", quantity: 1 },
      { name: "Ceramic mug", quantity: 2 },
    ],
    totalCents: 4750,
    status: "refunded",
  },
  {
    id: "5",
    orderNumber: "FM-10425",
    customer: "Aisha Okafor",
    items: [
      { name: "Organic bananas", quantity: 1 },
      { name: "Greek yogurt 1kg", quantity: 1 },
      { name: "Granola", quantity: 1 },
    ],
    totalCents: 1862,
    status: "paid",
  },
  {
    id: "6",
    orderNumber: "FM-10426",
    customer: "Ben Halvorsen",
    items: [{ name: "Wild salmon fillet", quantity: 2 }],
    totalCents: 3198,
    status: "packing",
  },
  {
    id: "7",
    orderNumber: "FM-10427",
    customer: "Lucía Fernández",
    items: [
      { name: "Cold-pressed juice", quantity: 4 },
      { name: "Chia seeds 250g", quantity: 1 },
    ],
    totalCents: 2540,
    status: "shipped",
  },
  {
    id: "8",
    orderNumber: "FM-10428",
    customer: "Kenji Mori",
    items: [
      { name: "Matcha powder 100g", quantity: 1 },
      { name: "Bamboo whisk", quantity: 1 },
    ],
    totalCents: 3615,
    status: "paid",
  },
];

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  paid: {
    label: "Paid",
    className: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
  packing: {
    label: "Packing",
    className: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  },
  shipped: {
    label: "Shipped",
    className: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  refunded: {
    label: "Refunded",
    className: "border-transparent bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  },
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const todayLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date());

export default function OrdersPage() {
  const [query, setQuery] = useState("");

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return ORDERS;

    return ORDERS.filter((order) => {
      const itemsText = order.items.map((item) => item.name).join(" ").toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(normalized) ||
        order.customer.toLowerCase().includes(normalized) ||
        itemsText.includes(normalized)
      );
    });
  }, [query]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Today&apos;s orders
        </h1>
        <p className="text-sm text-muted-foreground">{todayLabel}</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by order, customer or item"
            aria-label="Search orders"
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {filteredOrders.length} of {ORDERS.length} orders
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No orders match &ldquo;{query.trim()}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const status = STATUS_STYLES[order.status];
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium tabular-nums">{order.orderNumber}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-foreground">
                          {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {currencyFormatter.format(order.totalCents / 100)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        {status.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
