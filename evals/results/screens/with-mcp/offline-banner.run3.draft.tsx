import { useEffect, useMemo, useState } from "react"
import {
  Banknote,
  CircleCheck,
  Clock,
  CreditCard,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Wifi,
  WifiOff,
} from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

type Product = { id: string; name: string; sku: string; price: number }
type CartLine = { productId: string; qty: number }
type PaymentMethod = "Cash" | "Card"
type Sale = {
  id: string
  time: string
  items: number
  total: number
  method: PaymentMethod
  status: "synced" | "queued"
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sourdough loaf", sku: "BRD-001", price: 6.5 },
  { id: "p2", name: "Oat milk, 1 L", sku: "DRY-014", price: 2.49 },
  { id: "p3", name: "Free-range eggs, 6 pack", sku: "DAI-022", price: 4.2 },
  { id: "p4", name: "Local honey, 340 g", sku: "PAN-310", price: 7.9 },
  { id: "p5", name: "Apples, 1 kg", sku: "PRD-088", price: 3.6 },
  { id: "p6", name: "Dark roast coffee, 250 g", sku: "COF-005", price: 11.5 },
]

const INITIAL_SALES: Sale[] = [
  { id: "S-1042", time: "09:14", items: 3, total: 14.19, method: "Card", status: "synced" },
  { id: "S-1043", time: "09:22", items: 1, total: 6.5, method: "Cash", status: "synced" },
]

const INITIAL_SALE_NUMBER = 1044
const SYNC_DELAY_MS = 1500

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function PosScreen() {
  const [online, setOnline] = useState(true)
  const [query, setQuery] = useState("")
  const [cart, setCart] = useState<CartLine[]>([])
  const [method, setMethod] = useState<PaymentMethod>("Card")
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES)
  const [nextSaleNumber, setNextSaleNumber] = useState(INITIAL_SALE_NUMBER)

  const pendingCount = sales.filter((s) => s.status === "queued").length

  // When the connection returns, queued sales are sent to the server.
  useEffect(() => {
    if (!online || pendingCount === 0) return
    const timer = window.setTimeout(() => {
      setSales((prev) => prev.map((s) => (s.status === "queued" ? { ...s, status: "synced" } : s)))
      toast.success(
        pendingCount === 1 ? "1 offline sale synced" : `${pendingCount} offline sales synced`
      )
    }, SYNC_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [online, pendingCount])

  const cartLines = useMemo(
    () =>
      cart.flatMap((line) => {
        const product = PRODUCTS.find((p) => p.id === line.productId)
        if (!product) return []
        return [{ ...line, product, amount: product.price * line.qty }]
      }),
    [cart]
  )
  const cartTotal = cartLines.reduce((sum, l) => sum + l.amount, 0)
  const cartItems = cart.reduce((sum, l) => sum + l.qty, 0)

  const visibleProducts = PRODUCTS.filter((p) => {
    const q = query.trim().toLowerCase()
    return q === "" || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  })

  function changeQty(productId: string, delta: number) {
    setCart((prev) => {
      const current = prev.find((l) => l.productId === productId)?.qty ?? 0
      const next = current + delta
      if (next <= 0) return prev.filter((l) => l.productId !== productId)
      if (current === 0) return [...prev, { productId, qty: next }]
      return prev.map((l) => (l.productId === productId ? { ...l, qty: next } : l))
    })
  }

  function completeSale() {
    if (cartLines.length === 0) return
    const id = `S-${nextSaleNumber}`
    const sale: Sale = {
      id,
      time: nowLabel(),
      items: cartItems,
      total: cartTotal,
      method,
      status: online ? "synced" : "queued",
    }
    setNextSaleNumber((n) => n + 1)
    setSales((prev) => [sale, ...prev])
    setCart([])

    if (online) {
      toast.success(`Sale ${id} complete`)
    } else {
      toast(`Sale ${id} saved on this till. It will sync when the connection returns.`)
    }
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">Till 2 · Cashier Ana Ruiz</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {online ? (
            <Badge variant="success">
              <Wifi />
              Online
            </Badge>
          ) : (
            <Badge variant="warning">
              <WifiOff />
              Offline
            </Badge>
          )}
          <Button variant="outline" onClick={() => setOnline((o) => !o)}>
            {online ? <WifiOff /> : <Wifi />}
            {online ? "Simulate connection drop" : "Restore connection"}
          </Button>
        </div>
      </header>

      {!online && (
        <Alert variant="warning" className="mb-6">
          <WifiOff />
          <AlertTitle>Offline. Sales still work.</AlertTitle>
          <AlertDescription>
            Each sale is saved on this till. {pendingCount} queued{" "}
            {pendingCount === 1 ? "sale" : "sales"} will sync when the connection returns.
          </AlertDescription>
        </Alert>
      )}

      {online && pendingCount > 0 && (
        <Alert variant="info" className="mb-6">
          <RefreshCw />
          <AlertTitle>Syncing {pendingCount} offline {pendingCount === 1 ? "sale" : "sales"}</AlertTitle>
          <AlertDescription>Keep the till open until the sync finishes.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Search by name or SKU, then add items to the sale.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="product-search" className="text-sm font-medium">
                Search products
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="product-search"
                  type="search"
                  placeholder="Name or SKU"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Add</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.sku}</TableCell>
                    <TableCell className="text-right tabular-nums">{money.format(p.price)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Add ${p.name}`}
                        onClick={() => changeQty(p.id, 1)}
                      >
                        <Plus />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {visibleProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No product matches “{query}”.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current sale</CardTitle>
            <CardDescription>
              {cartItems} {cartItems === 1 ? "item" : "items"}
            </CardDescription>
            <CardAction>
              {online ? (
                <Badge variant="success">
                  <CircleCheck />
                  Sends now
                </Badge>
              ) : (
                <Badge variant="warning">
                  <Clock />
                  Saves on till
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {cartLines.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items yet. Add a product to start.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {cartLines.map((l) => (
                  <li key={l.productId} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{l.product.name}</p>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        {money.format(l.product.price)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Remove one ${l.product.name}`}
                        onClick={() => changeQty(l.productId, -1)}
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center tabular-nums">{l.qty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Add one ${l.product.name}`}
                        onClick={() => changeQty(l.productId, 1)}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <span className="w-20 text-right text-sm font-medium tabular-nums">
                      {money.format(l.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex items-baseline justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-2xl font-semibold tabular-nums">{money.format(cartTotal)}</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Payment</span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={method === "Card" ? "secondary" : "outline"}
                  aria-pressed={method === "Card"}
                  onClick={() => setMethod("Card")}
                >
                  <CreditCard />
                  Card
                </Button>
                <Button
                  variant={method === "Cash" ? "secondary" : "outline"}
                  aria-pressed={method === "Cash"}
                  onClick={() => setMethod("Cash")}
                >
                  <Banknote />
                  Cash
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              disabled={cartLines.length === 0}
              onClick={completeSale}
            >
              {online ? "Complete sale" : "Save sale on this till"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sales on this till</CardTitle>
          <CardDescription>
            {pendingCount === 0
              ? "Every sale is on the server."
              : `${pendingCount} ${pendingCount === 1 ? "sale waits" : "sales wait"} to sync.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Sync</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.id}</TableCell>
                  <TableCell className="tabular-nums">{s.time}</TableCell>
                  <TableCell>{s.method}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.items}</TableCell>
                  <TableCell className="text-right tabular-nums">{money.format(s.total)}</TableCell>
                  <TableCell>
                    {s.status === "queued" ? (
                      <Badge variant="warning">
                        <Clock />
                        Queued
                      </Badge>
                    ) : (
                      <Badge variant="success">
                        <CircleCheck />
                        Synced
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Toaster />
    </main>
  )
}
