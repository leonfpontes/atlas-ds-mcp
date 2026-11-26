import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Toaster } from "sonner"
import {
  CheckCircle2,
  Clock,
  Minus,
  Plus,
  Receipt,
  RefreshCw,
  ShoppingCart,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Product = { id: string; name: string; price: number }
type CartLine = { productId: string; qty: number }
type SaleLine = { name: string; qty: number; unitPrice: number }
type Sale = {
  id: string
  lines: SaleLine[]
  total: number
  createdAt: string
  remoteRef?: string
}

const STORE_NAME = "Fernhill Market"
const TERMINAL_ID = "POS-03"
const TAX_RATE = 0.08

const PRODUCTS: Product[] = [
  { id: "p1", name: "Oat milk 1L", price: 3.49 },
  { id: "p2", name: "Sourdough loaf", price: 6.5 },
  { id: "p3", name: "Free-range eggs (12)", price: 5.99 },
  { id: "p4", name: "Apples, 1 kg", price: 4.25 },
  { id: "p5", name: "Dark roast coffee", price: 11.0 },
  { id: "p6", name: "Dish soap", price: 2.75 },
  { id: "p7", name: "Greek yogurt", price: 4.8 },
  { id: "p8", name: "Dark chocolate bar", price: 3.2 },
]

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const round = (n: number) => Math.round(n * 100) / 100

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

const remoteRefFor = (saleId: string) => `FM-${saleId.replace("#", "")}`

export default function PosScreen() {
  const [online, setOnline] = useState(true)
  const [cart, setCart] = useState<CartLine[]>([])
  const [queue, setQueue] = useState<Sale[]>([])
  const [synced, setSynced] = useState<Sale[]>([])
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [nextNo, setNextNo] = useState(1042)

  const cartLines = cart
    .map((line) => {
      const product = PRODUCTS.find((p) => p.id === line.productId)
      return product ? { ...product, qty: line.qty } : null
    })
    .filter((l): l is Product & { qty: number } => l !== null)

  const subtotal = round(cartLines.reduce((s, l) => s + l.price * l.qty, 0))
  const tax = round(subtotal * TAX_RATE)
  const total = round(subtotal + tax)

  // Background sync: while online, push the oldest queued sale, one at a time.
  // Cleanup cancels the in-flight request if the connection drops or the queue changes.
  useEffect(() => {
    if (!online || queue.length === 0) return

    const sale = queue[0]
    setSyncingId(sale.id)

    const timer = setTimeout(() => {
      setQueue((q) => q.filter((s) => s.id !== sale.id))
      setSynced((s) => [{ ...sale, remoteRef: remoteRefFor(sale.id) }, ...s])
      setSyncingId(null)
      toast.success(`Synced ${sale.id} to Fernhill HQ`)
    }, 900)

    return () => {
      clearTimeout(timer)
      setSyncingId(null)
    }
  }, [online, queue])

  function addToCart(productId: string) {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + 1 } : l
        )
      }
      return [...prev, { productId, qty: 1 }]
    })
  }

  function changeQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + delta } : l
        )
        .filter((l) => l.qty > 0)
    )
  }

  function removeLine(productId: string) {
    setCart((prev) => prev.filter((l) => l.productId !== productId))
  }

  function charge() {
    if (cartLines.length === 0) return

    const sale: Sale = {
      id: `#${nextNo}`,
      lines: cartLines.map((l) => ({
        name: l.name,
        qty: l.qty,
        unitPrice: l.price,
      })),
      total,
      createdAt: timeNow(),
    }
    setNextNo((n) => n + 1)
    setCart([])

    if (online) {
      setSynced((s) => [{ ...sale, remoteRef: remoteRefFor(sale.id) }, ...s])
      toast.success(`Sale ${sale.id} completed — ${money.format(total)}`)
    } else {
      setQueue((q) => [...q, sale])
      toast(`Saved offline. ${sale.id} will sync when connected.`)
    }
  }

  function toggleConnection() {
    const next = !online
    setOnline(next)
    if (next) {
      toast.success(
        queue.length > 0
          ? `Back online. Syncing ${queue.length} queued sale${queue.length > 1 ? "s" : ""}…`
          : "Back online."
      )
    } else {
      toast.warning("Connection lost. Sales will be saved on this terminal.")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-right" />

      <header className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">{STORE_NAME}</h1>
          <p className="text-sm text-muted-foreground">Terminal {TERMINAL_ID}</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className={
              online
                ? "gap-1.5 border-emerald-600/40 text-emerald-700 dark:text-emerald-400"
                : "gap-1.5 border-amber-600/40 text-amber-700 dark:text-amber-400"
            }
          >
            {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
            {online ? "Online" : "Offline"}
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleConnection}>
            {online ? (
              <>
                <WifiOff className="size-4" />
                Simulate connection drop
              </>
            ) : (
              <>
                <Wifi className="size-4" />
                Restore connection
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="grid gap-6 p-6 lg:grid-cols-[1fr_380px]">
        <section className="flex flex-col gap-6">
          {!online && (
            <Alert className="border-amber-500/50 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              <WifiOff />
              <AlertTitle>Offline mode</AlertTitle>
              <AlertDescription>
                Sales are still open. Completed sales are stored on this terminal
                and sync automatically when the connection returns.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Tap an item to add it to the sale.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {PRODUCTS.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addToCart(product.id)}
                  className="flex flex-col items-start gap-2 rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="text-sm font-medium leading-snug">{product.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {money.format(product.price)}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-4 text-amber-600" />
                  Waiting to sync
                  <Badge variant="secondary" className="ml-auto">
                    {queue.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Stored on this terminal until the connection is back.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {queue.length === 0 && (
                  <p className="text-sm text-muted-foreground">No sales waiting.</p>
                )}
                {queue.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between rounded-md border p-3 text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {sale.id} · {money.format(sale.total)}
                      </span>
                      <span className="text-muted-foreground">
                        {sale.createdAt} · {sale.lines.length} item
                        {sale.lines.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    {syncingId === sale.id ? (
                      <Badge variant="outline" className="gap-1.5">
                        <RefreshCw className="size-3 animate-spin" />
                        Syncing
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1.5 text-amber-700 dark:text-amber-400">
                        <Clock className="size-3" />
                        Pending
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Synced today
                  <Badge variant="secondary" className="ml-auto">
                    {synced.length}
                  </Badge>
                </CardTitle>
                <CardDescription>Confirmed by Fernhill HQ.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {synced.length === 0 && (
                  <p className="text-sm text-muted-foreground">No sales yet.</p>
                )}
                {synced.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between rounded-md border p-3 text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {sale.id} · {money.format(sale.total)}
                      </span>
                      <span className="text-muted-foreground">
                        {sale.createdAt} · ref {sale.remoteRef}
                      </span>
                    </div>
                    <Badge variant="outline" className="gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      Synced
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <aside>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-4" />
                Current sale
              </CardTitle>
              <CardDescription>Sale {`#${nextNo}`}</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {cartLines.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Add items to start a sale.
                </p>
              )}

              {cartLines.map((line) => (
                <div key={line.id} className="flex items-center gap-3">
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-medium">{line.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {money.format(line.price)} each
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      aria-label={`Decrease ${line.name}`}
                      onClick={() => changeQty(line.id, -1)}
                    >
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-6 text-center text-sm tabular-nums">{line.qty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      aria-label={`Increase ${line.name}`}
                      onClick={() => changeQty(line.id, 1)}
                    >
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => removeLine(line.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}

              {cartLines.length > 0 && (
                <div className="flex flex-col gap-1.5 border-t pt-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{money.format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span className="tabular-nums">{money.format(tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">{money.format(total)}</span>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                size="lg"
                disabled={cartLines.length === 0}
                onClick={charge}
              >
                <Receipt className="size-4" />
                {online ? `Charge ${money.format(total)}` : `Save offline · ${money.format(total)}`}
              </Button>
              {!online && (
                <p className="text-center text-xs text-muted-foreground">
                  Saved on this terminal. Will sync automatically.
                </p>
              )}
            </CardFooter>
          </Card>
        </aside>
      </main>
    </div>
  )
}
