import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CloudUpload,
  Loader2,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";

type Product = {
  id: string;
  name: string;
  category: string;
  priceCents: number;
};

type CartLine = {
  productId: string;
  qty: number;
};

type SaleLine = {
  name: string;
  qty: number;
  lineCents: number;
};

type PendingSale = {
  ref: string;
  createdAt: string;
  lines: SaleLine[];
  totalCents: number;
};

const STORE_NAME = "Fernhill Market";
const REGISTER_LABEL = "Register 2 · Maya R.";
const TAX_RATE = 0.08;
const INITIAL_SYNCED_COUNT = 41;
const SYNC_DURATION_MS = 1200;

const PRODUCTS: Product[] = [
  { id: "p-001", name: "Sourdough loaf", category: "Bakery", priceCents: 650 },
  { id: "p-002", name: "Oat milk 1L", category: "Dairy alt", priceCents: 389 },
  { id: "p-003", name: "Free-range eggs (12)", category: "Dairy", priceCents: 524 },
  { id: "p-004", name: "Avocado", category: "Produce", priceCents: 150 },
  { id: "p-005", name: "Cold brew 500ml", category: "Drinks", priceCents: 425 },
  { id: "p-006", name: "Dark chocolate bar", category: "Snacks", priceCents: 299 },
  { id: "p-007", name: "Olive oil 500ml", category: "Pantry", priceCents: 1189 },
  { id: "p-008", name: "Greek yogurt", category: "Dairy", priceCents: 479 },
];

const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );

const nowLabel = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function PosOfflineScreen() {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [queue, setQueue] = useState<PendingSale[]>([]);
  const [syncing, setSyncing] = useState<PendingSale | null>(null);
  const [syncedCount, setSyncedCount] = useState<number>(INITIAL_SYNCED_COUNT);
  const [offlineSeq, setOfflineSeq] = useState<number>(1);

  // Real browser connectivity events.
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Start uploading the oldest queued sale whenever we are online and idle.
  // Going offline cancels the in-flight upload; it will be retried later.
  useEffect(() => {
    if (!online) {
      setSyncing(null);
      return;
    }
    if (!syncing && queue.length > 0) {
      setSyncing(queue[0]);
    }
  }, [online, queue, syncing]);

  // Simulated upload request for the sale currently syncing.
  useEffect(() => {
    if (!syncing) return;
    const timer = setTimeout(() => {
      setQueue((q) => q.filter((s) => s.ref !== syncing.ref));
      setSyncedCount((c) => c + 1);
      setSyncing(null);
      toast.success(`Synced ${syncing.ref}`, {
        description: formatMoney(syncing.totalCents),
      });
    }, SYNC_DURATION_MS);
    return () => clearTimeout(timer);
  }, [syncing]);

  const toggleConnection = () => {
    if (online) {
      setOnline(false);
      toast.warning("Connection lost", {
        description: "Sales will be saved on this register and synced later.",
      });
    } else {
      setOnline(true);
      toast.info("Connection restored", {
        description:
          queue.length > 0
            ? `Syncing ${queue.length} saved ${queue.length === 1 ? "sale" : "sales"}.`
            : "All systems back online.",
      });
    }
  };

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => p.name.toLowerCase().includes(term));
  }, [query]);

  const cartLines = cart.map((line) => {
    const product = PRODUCTS.find((p) => p.id === line.productId);
    return {
      productId: line.productId,
      name: product?.name ?? "Unknown item",
      unitCents: product?.priceCents ?? 0,
      qty: line.qty,
      lineCents: (product?.priceCents ?? 0) * line.qty,
    };
  });

  const subtotalCents = cartLines.reduce((sum, l) => sum + l.lineCents, 0);
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents;

  const addProduct = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [...prev, { productId, qty: 1 }];
    });
  };

  const changeQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + delta } : l,
        )
        .filter((l) => l.qty > 0),
    );
  };

  const removeLine = (productId: string) => {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  };

  const checkout = () => {
    if (cartLines.length === 0) return;

    const saleLines: SaleLine[] = cartLines.map((l) => ({
      name: l.name,
      qty: l.qty,
      lineCents: l.lineCents,
    }));

    if (online) {
      setSyncedCount((c) => c + 1);
      toast.success("Sale completed", {
        description: `${formatMoney(totalCents)} charged.`,
      });
    } else {
      const ref = `OFF-${String(offlineSeq).padStart(4, "0")}`;
      setOfflineSeq((s) => s + 1);
      setQueue((q) => [
        ...q,
        {
          ref,
          createdAt: nowLabel(),
          lines: saleLines,
          totalCents,
        },
      ]);
      toast("Sale saved offline", {
        description: `${ref} · ${formatMoney(totalCents)} will sync when connected.`,
      });
    }

    setCart([]);
  };

  const cartCount = cart.reduce((sum, l) => sum + l.qty, 0);

  return (
    <div className="min-h-screen bg-muted/40 p-6">
      <Toaster />

      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{STORE_NAME}</h1>
          <p className="text-sm text-muted-foreground">{REGISTER_LABEL}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={online ? "secondary" : "destructive"}
            className="gap-1.5 px-3 py-1"
          >
            {online ? (
              <Wifi className="h-3.5 w-3.5" />
            ) : (
              <WifiOff className="h-3.5 w-3.5" />
            )}
            {online ? "Online" : "Offline"}
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleConnection}>
            {online ? "Simulate outage" : "Restore connection"}
          </Button>
        </div>
      </header>

      {!online && (
        <Alert className="mb-6 border-amber-300 bg-amber-50 text-amber-900">
          <WifiOff className="h-4 w-4 text-amber-700" />
          <AlertTitle>Offline mode</AlertTitle>
          <AlertDescription className="text-amber-800">
            Sales are saved on this register and will sync automatically when the
            connection returns. Keep selling.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Tap an item to add it to the sale.</CardDescription>
            <div className="relative pt-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {visibleProducts.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No products match “{query}”.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {visibleProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addProduct(product.id)}
                    className="flex flex-col items-start rounded-lg border bg-background p-4 text-left transition hover:border-primary hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {product.category}
                    </span>
                    <span className="mt-1 font-medium">{product.name}</span>
                    <span className="mt-3 text-sm font-semibold">
                      {formatMoney(product.priceCents)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Current sale
                {cartCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {cartLines.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No items yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {cartLines.map((line) => (
                    <li key={line.productId} className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{line.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatMoney(line.unitCents)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => changeQty(line.productId, -1)}
                          aria-label={`Decrease ${line.name}`}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-6 text-center text-sm tabular-nums">
                          {line.qty}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => changeQty(line.productId, 1)}
                          aria-label={`Increase ${line.name}`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <span className="w-16 text-right text-sm font-medium tabular-nums">
                        {formatMoney(line.lineCents)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => removeLine(line.productId)}
                        aria-label={`Remove ${line.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <Separator />

              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatMoney(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax (8%)</dt>
                  <dd className="tabular-nums">{formatMoney(taxCents)}</dd>
                </div>
                <div className="flex justify-between pt-1 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatMoney(totalCents)}</dd>
                </div>
              </dl>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                disabled={cartLines.length === 0}
                onClick={checkout}
                variant={online ? "default" : "secondary"}
              >
                {online ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Charge {formatMoney(totalCents)}
                  </>
                ) : (
                  <>
                    <CloudUpload className="h-4 w-4" />
                    Save sale offline · {formatMoney(totalCents)}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Sync queue
                <Badge
                  variant={queue.length > 0 ? "outline" : "secondary"}
                  className="ml-auto"
                >
                  {queue.length} pending
                </Badge>
              </CardTitle>
              <CardDescription>
                {online
                  ? queue.length > 0
                    ? "Uploading saved sales to Fernhill HQ."
                    : "Every sale is uploaded."
                  : "Waiting for the connection to return."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {queue.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  No sales waiting to sync.
                </div>
              ) : (
                <ScrollArea className="max-h-64">
                  <ul className="flex flex-col gap-3 pr-3">
                    {queue.map((sale) => {
                      const isSyncing = syncing?.ref === sale.ref;
                      return (
                        <li
                          key={sale.ref}
                          className="rounded-md border bg-background p-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-sm font-medium">
                              {sale.ref}
                            </span>
                            {isSyncing ? (
                              <Badge className="gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Syncing
                              </Badge>
                            ) : (
                              <Badge variant="outline">Waiting</Badge>
                            )}
                          </div>
                          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {sale.createdAt} · {sale.lines.length}{" "}
                              {sale.lines.length === 1 ? "line" : "lines"}
                            </span>
                            <span className="font-medium tabular-nums text-foreground">
                              {formatMoney(sale.totalCents)}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              )}
            </CardContent>

            <CardFooter className="text-sm text-muted-foreground">
              Synced this shift: <span className="ml-1 font-medium text-foreground tabular-nums">{syncedCount}</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
