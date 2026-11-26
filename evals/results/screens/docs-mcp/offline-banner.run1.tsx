import { useEffect, useMemo, useRef, useState } from "react"
import {
  Banknote,
  CircleCheck,
  CloudOff,
  CreditCard,
  Minus,
  Plus,
  Receipt,
  RefreshCw,
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
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Toaster } from "@/components/ui/sonner"

type Product = {
  id: string
  name: string
  price: number
}

type SyncStatus = "saved" | "syncing" | "synced"

type Sale = {
  id: string
  time: string
  items: number
  total: number
  method: "Card" | "Cash"
  status: SyncStatus
}

const PRODUCTS: Product[] = [
  { id: "p-1", name: "Sourdough loaf", price: 6.5 },
  { id: "p-2", name: "Oat milk 1 L", price: 3.2 },
  { id: "p-3", name: "Wildflower honey 340 g", price: 7.9 },
  { id: "p-4", name: "Free-range eggs, 12", price: 5.4 },
  { id: "p-5", name: "Apples, 1 kg", price: 4.1 },
  { id: "p-6", name: "Coffee beans 250 g", price: 11.75 },
]

const INITIAL_SALES: Sale[] = [
  { id: "S-1040", time: "09:12", items: 3, total: 14.5, method: "Card", status: "synced" },
  { id: "S-1041", time: "09:31", items: 1, total: 6.25, method: "Cash", status: "synced" },
  { id: "S-1042", time: "09:47", items: 4, total: 27.8, method: "Card", status: "saved" },
  { id: "S-1043", time: "09:52", items: 2, total: 9.4, method: "Cash", status: "saved" },
]

const SYNC_DELAY_MS = 1500

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

const nowLabel = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

function SyncBadge({ status }: { status: SyncStatus }) {
  if (status === "saved") {
    return (
      <Badge variant="warning">
        <CloudOff />
        Saved offline
      </Badge>
    )
  }
  if (status === "syncing") {
    return (
      <Badge variant="info">
        <RefreshCw className="animate-spin" />
        Syncing
      </Badge>
    )
  }
  return (
    <Badge variant="success">
      <CircleCheck />
      Synced
    </Badge>
  )
}

export default function PosOfflineScreen() {
  const [online, setOnline] = useState(true)
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES)
  const [cart, setCart] = useState<Record<string, number>>({})
  const timerRef = useRef<number | null>(null)

  const cartLines = useMemo(
    () =>
      PRODUCTS.filter((p) => (cart[p.id] ?? 0) > 0).map((p) => ({
        product: p,
        qty: cart[p.id],
      })),
    [cart]
  )

  const cartItemCount = cartLines.reduce((sum, l) => sum + l.qty, 0)
  const cartTotal = cartLines.reduce((sum, l) => sum + l.qty * l.product.price, 0)

  const savedCount = sales.filter((s) => s.status === "saved").length
  const syncingCount = sales.filter((s) => s.status === "syncing").length

  const addToCart = (id: string) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))

  const removeFromCart = (id: string) =>
    setCart((prev) => {
      const next = (prev[id] ?? 0) - 1
      const copy = { ...prev }
      if (next <= 0) delete copy[id]
      else copy[id] = next
      return copy
    })

  const clearCart = () => setCart({})

  const takePayment = (method: "Card" | "Cash") => {
    if (cartItemCount === 0) return
    const sale: Sale = {
      id: `S-${1044 + sales.length - INITIAL_SALES.length}`,
      time: nowLabel(),
      items: cartItemCount,
      total: cartTotal,
      method,
      status: online ? "synced" : "saved",
    }
    setSales((prev) => [sale, ...prev])
    clearCart()

    if (online) {
      toast.success(`Sale ${sale.id} completed`)
    } else {
      toast.success(`Sale ${sale.id} saved offline. It will sync when you're back online.`)
    }
  }

  const syncPending = () => {
    const ids = sales.filter((s) => s.status === "saved").map((s) => s.id)
    if (ids.length === 0) return

    setSales((prev) =>
      prev.map((s) => (ids.includes(s.id) ? { ...s, status: "syncing" } : s))
    )

    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => {
      setSales((prev) =>
        prev.map((s) => (ids.includes(s.id) ? { ...s, status: "synced" } : s))
      )
      timerRef.current = null
      toast.success(
        `${ids.length} offline ${ids.length === 1 ? "sale" : "sales"} synced`
      )
    }, SYNC_DELAY_MS)
  }

  // When the connection returns, sync what was saved offline.
  useEffect(() => {
    if (online) syncPending()
    // Runs only when connectivity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online])

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Fernhill Market</h1>
            <p className="text-sm text-muted-foreground">Register 2 · Cashier Maya</p>
          </div>

          <div className="flex items-center gap-3">
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
            <Button variant="outline" onClick={() => setOnline((v) => !v)}>
              {online ? "Simulate connection drop" : "Restore connection"}
            </Button>
          </div>
        </header>

        {!online && (
          <Alert variant="warning">
            <WifiOff />
            <AlertTitle>Offline. Sales still work.</AlertTitle>
            <AlertDescription>
              Sales are saved on this register and sync when the connection returns.{" "}
              {savedCount} {savedCount === 1 ? "sale is" : "sales are"} waiting to sync.
            </AlertDescription>
          </Alert>
        )}

        {online && syncingCount > 0 && (
          <Alert variant="info">
            <RefreshCw />
            <AlertTitle>
              Syncing {syncingCount} {syncingCount === 1 ? "sale" : "sales"}
            </AlertTitle>
            <AlertDescription>
              Keep this register open until the sync finishes.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Tap an item to add it to the sale.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PRODUCTS.map((product) => (
                <Button
                  key={product.id}
                  variant="outline"
                  className="h-auto flex-col items-start gap-1 p-3 text-left whitespace-normal"
                  onClick={() => addToCart(product.id)}
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted-foreground">{currency.format(product.price)}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current sale</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Receipt />
                  {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
                </Badge>
              </CardAction>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {cartLines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items yet.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-border">
                  {cartLines.map(({ product, qty }) => (
                    <li key={product.id} className="flex items-center gap-2 py-2">
                      <span className="flex-1 text-sm">{product.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Decrease ${product.name}`}
                        onClick={() => removeFromCart(product.id)}
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center text-sm">{qty}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Increase ${product.name}`}
                        onClick={() => addToCart(product.id)}
                      >
                        <Plus />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-semibold">{currency.format(cartTotal)}</span>
              </div>

              <p className="text-sm text-muted-foreground">
                {online
                  ? "Payments go straight to the store system."
                  : "Offline: this sale is saved on the register and syncs later."}
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                size="lg"
                disabled={cartItemCount === 0}
                onClick={() => takePayment("Card")}
              >
                <CreditCard />
                {online ? "Charge card" : "Save card sale offline"}
              </Button>
              <div className="grid w-full grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  disabled={cartItemCount === 0}
                  onClick={() => takePayment("Cash")}
                >
                  <Banknote />
                  Take cash
                </Button>
                <Button
                  variant="ghost"
                  disabled={cartItemCount === 0}
                  onClick={clearCart}
                >
                  <Trash2 />
                  Clear sale
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales on this register</CardTitle>
            <CardDescription>
              {savedCount > 0
                ? `${savedCount} ${savedCount === 1 ? "sale" : "sales"} waiting to sync.`
                : "Everything is synced."}
            </CardDescription>
            <CardAction>
              {online ? (
                <Button
                  variant="outline"
                  disabled={savedCount === 0}
                  onClick={syncPending}
                >
                  <RefreshCw />
                  Sync now
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Sync starts when you're back online.
                </span>
              )}
            </CardAction>
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
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.time}</TableCell>
                    <TableCell>{sale.method}</TableCell>
                    <TableCell className="text-right">{sale.items}</TableCell>
                    <TableCell className="text-right">{currency.format(sale.total)}</TableCell>
                    <TableCell>
                      <SyncBadge status={sale.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
