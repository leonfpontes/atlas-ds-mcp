import { useCallback, useEffect, useRef, useState } from "react"
import {
  CircleCheck,
  CloudUpload,
  Loader2,
  Minus,
  Plus,
  RefreshCw,
  ShoppingCart,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type Product = {
  id: string
  name: string
  category: string
  priceCents: number
}

type CartLine = {
  product: Product
  qty: number
}

type Sale = {
  localId: string
  createdAt: string
  lines: { name: string; qty: number }[]
  totalCents: number
  tender: "card" | "cash"
  serverId?: string
}

const STORE_NAME = "Fernhill Market"
const REGISTER_NAME = "Register 2"
const SYNC_DELAY_MS = 700

const PRODUCTS: Product[] = [
  { id: "p1", name: "Oat milk 1L", category: "Dairy", priceCents: 349 },
  { id: "p2", name: "Sourdough loaf", category: "Bakery", priceCents: 575 },
  { id: "p3", name: "Free-range eggs (12)", category: "Dairy", priceCents: 512 },
  { id: "p4", name: "Bananas (1kg)", category: "Produce", priceCents: 229 },
  { id: "p5", name: "Cold brew 330ml", category: "Drinks", priceCents: 325 },
  { id: "p6", name: "Dark chocolate 100g", category: "Snacks", priceCents: 280 },
  { id: "p7", name: "Olive oil 500ml", category: "Pantry", priceCents: 1195 },
  { id: "p8", name: "Recycled bags (20)", category: "Household", priceCents: 199 },
]

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

const formatMoney = (cents: number) => money.format(cents / 100)

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export default function PosScreen() {
  const [online, setOnline] = useState(true)
  const [cart, setCart] = useState<CartLine[]>([])
  const [pending, setPending] = useState<Sale[]>([])
  const [synced, setSynced] = useState<Sale[]>([])
  const [syncing, setSyncing] = useState(false)
  const [saleCounter, setSaleCounter] = useState(1)

  const onlineRef = useRef(online)
  const syncingRef = useRef(false)

  useEffect(() => {
    onlineRef.current = online
  }, [online])

  const flush = useCallback(async (sales: Sale[]) => {
    if (syncingRef.current || sales.length === 0) return
    syncingRef.current = true
    setSyncing(true)

    let count = 0
    for (const sale of sales) {
      if (!onlineRef.current) break
      await delay(SYNC_DELAY_MS)
      if (!onlineRef.current) break

      const serverId = `TXN-${40210 + count}`
      setPending((p) => p.filter((s) => s.localId !== sale.localId))
      setSynced((s) => [{ ...sale, serverId }, ...s].slice(0, 6))
      count++
    }

    syncingRef.current = false
    setSyncing(false)
    if (count > 0) {
      toast.success(`${count} offline sale${count === 1 ? "" : "s"} synced`, {
        description: "Server records now match this register.",
      })
    }
  }, [])

  // Reconnecting triggers an automatic flush of everything queued offline.
  useEffect(() => {
    if (online) void flush(pending)
    // Intentionally keyed on connectivity only; flush reads the queue at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online])

  const cartTotal = cart.reduce((sum, line) => sum + line.product.priceCents * line.qty, 0)
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0)
  const pendingTotal = pending.reduce((sum, sale) => sum + sale.totalCents, 0)

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id)
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id ? { ...line, qty: line.qty + 1 } : line,
        )
      }
      return [...current, { product, qty: 1 }]
    })
  }

  const changeQty = (productId: string, delta: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.product.id === productId ? { ...line, qty: line.qty + delta } : line,
        )
        .filter((line) => line.qty > 0),
    )
  }

  const checkout = (tender: "card" | "cash") => {
    if (cart.length === 0) return

    const sale: Sale = {
      localId: `LOC-${String(saleCounter).padStart(4, "0")}`,
      createdAt: new Date().toISOString(),
      lines: cart.map((line) => ({ name: line.product.name, qty: line.qty })),
      totalCents: cartTotal,
      tender,
    }
    setSaleCounter((n) => n + 1)
    setCart([])

    if (online) {
      setSynced((s) => [{ ...sale, serverId: `TXN-${40210 + s.length}` }, ...s].slice(0, 6))
      toast.success(`Sale complete · ${formatMoney(sale.totalCents)}`)
    } else {
      setPending((p) => [...p, sale])
      toast("Saved offline", {
        description: `${sale.localId} will sync when the connection returns.`,
      })
    }
  }

  const toggleConnection = () => {
    const next = !online
    setOnline(next)
    toast(next ? "Connection restored" : "Connection lost", {
      description: next
        ? "Syncing queued sales..."
        : "Keep selling. Sales are saved on this register.",
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">{STORE_NAME}</h1>
          <p className="text-sm text-muted-foreground">{REGISTER_NAME}</p>
        </div>

        <div className="flex items-center gap-3">
          {online ? (
            <Badge variant="secondary" className="gap-1.5">
              <Wifi className="size-3.5" />
              Online
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1.5">
              <WifiOff className="size-3.5" />
              Offline · {pending.length} pending
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={toggleConnection}>
            {online ? "Simulate outage" : "Restore connection"}
          </Button>
        </div>
      </header>

      {!online && (
        <div className="px-6 pt-4">
          <Alert>
            <WifiOff />
            <AlertTitle>You're offline</AlertTitle>
            <AlertDescription>
              Sales still work. Each one is saved on this register and syncs automatically when
              the connection returns.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
        <section aria-label="Products">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">Products</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {PRODUCTS.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product)}
                className="flex flex-col items-start rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <span className="text-xs text-muted-foreground">{product.category}</span>
                <span className="mt-1 font-medium">{product.name}</span>
                <span className="mt-3 text-sm tabular-nums">{formatMoney(product.priceCents)}</span>
              </button>
            ))}
          </div>
        </section>

        <aside className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-4" />
                Current sale
              </CardTitle>
              <CardDescription>
                {cartCount === 0 ? "No items yet" : `${cartCount} item${cartCount === 1 ? "" : "s"}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {cart.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {cart.map((line) => (
                    <li key={line.product.id} className="flex items-center justify-between gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm">{line.product.name}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Decrease ${line.product.name}`}
                          onClick={() => changeQty(line.product.id, -1)}
                        >
                          <Minus />
                        </Button>
                        <span className="w-6 text-center text-sm tabular-nums">{line.qty}</span>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          aria-label={`Increase ${line.product.name}`}
                          onClick={() => changeQty(line.product.id, 1)}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <span className="w-16 text-right text-sm tabular-nums">
                        {formatMoney(line.product.priceCents * line.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Separator />

              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatMoney(cartTotal)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button disabled={cart.length === 0} onClick={() => checkout("card")}>
                  Charge card
                </Button>
                <Button
                  variant="secondary"
                  disabled={cart.length === 0}
                  onClick={() => checkout("cash")}
                >
                  Take cash
                </Button>
              </div>

              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-self-start text-muted-foreground"
                  onClick={() => setCart([])}
                >
                  <Trash2 />
                  Clear sale
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CloudUpload className="size-4" />
                  Sync queue
                </span>
                <Badge variant={pending.length > 0 ? "outline" : "secondary"}>
                  {pending.length} waiting
                </Badge>
              </CardTitle>
              <CardDescription>
                {pending.length > 0
                  ? `${formatMoney(pendingTotal)} saved on this register, not yet on the server`
                  : "Everything is on the server"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {pending.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {pending.map((sale) => (
                    <li key={sale.localId} className="flex items-start justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium tabular-nums">{sale.localId}</p>
                        <p className="truncate text-muted-foreground">
                          {sale.lines.map((l) => `${l.qty}× ${l.name}`).join(", ")}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatTime(sale.createdAt)}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="tabular-nums">{formatMoney(sale.totalCents)}</span>
                        <Badge variant="outline" className="gap-1">
                          {syncing ? <Loader2 className="size-3 animate-spin" /> : null}
                          {syncing ? "Syncing" : "Queued"}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <Button
                variant="outline"
                disabled={!online || syncing || pending.length === 0}
                onClick={() => void flush(pending)}
              >
                <RefreshCw className={syncing ? "animate-spin" : undefined} />
                {syncing ? "Syncing..." : "Sync now"}
              </Button>

              {synced.length > 0 && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Recent sales</h3>
                    <ul className="flex flex-col gap-2">
                      {synced.map((sale) => (
                        <li key={sale.serverId} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <CircleCheck className="size-4 text-muted-foreground" />
                            <span className="tabular-nums">{sale.serverId}</span>
                          </span>
                          <span className="tabular-nums">{formatMoney(sale.totalCents)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  )
}
