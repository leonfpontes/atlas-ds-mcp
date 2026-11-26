import { useCallback, useEffect, useState } from "react"
import { CircleCheck, Clock, Minus, Plus, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

type Product = { id: string; name: string; price: number }
type SaleStatus = "pending" | "synced"
type Sale = { id: string; time: string; items: number; total: number; status: SaleStatus }

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sourdough loaf", price: 6.25 },
  { id: "p2", name: "Oat milk 1 L", price: 2.4 },
  { id: "p3", name: "Free-range eggs x12", price: 5.8 },
  { id: "p4", name: "Apples 1 kg", price: 3.2 },
  { id: "p5", name: "Dark chocolate 100 g", price: 3.9 },
  { id: "p6", name: "Coffee beans 250 g", price: 11.5 },
  { id: "p7", name: "Olive oil 500 ml", price: 9.75 },
  { id: "p8", name: "Clover honey 340 g", price: 7.2 },
]

const INITIAL_SALES: Sale[] = [
  { id: "S-1043", time: "13:02", items: 3, total: 18.5, status: "synced" },
  { id: "S-1044", time: "13:09", items: 2, total: 6.4, status: "synced" },
]

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

export default function PosOfflineScreen() {
  const [online, setOnline] = useState(true)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES)

  const lines = PRODUCTS.filter((p) => (cart[p.id] ?? 0) > 0).map((p) => ({
    ...p,
    qty: cart[p.id],
  }))
  const cartCount = lines.reduce((n, l) => n + l.qty, 0)
  const cartTotal = lines.reduce((sum, l) => sum + l.qty * l.price, 0)
  const pendingCount = sales.filter((s) => s.status === "pending").length

  const syncPending = useCallback(() => {
    if (pendingCount === 0) return
    setSales((prev) =>
      prev.map((s) => (s.status === "pending" ? { ...s, status: "synced" } : s))
    )
    toast.success(`${pendingCount} ${pendingCount === 1 ? "sale" : "sales"} synced`)
  }, [pendingCount])

  // When the connection returns, pending sales sync on their own.
  useEffect(() => {
    if (!online || pendingCount === 0) return
    const timer = window.setTimeout(syncPending, 1200)
    return () => window.clearTimeout(timer)
  }, [online, pendingCount, syncPending])

  function toggleConnection() {
    const next = !online
    setOnline(next)
    if (next) toast.success("Connection restored")
  }

  function changeQty(id: string, delta: number) {
    setCart((prev) => {
      const next = { ...prev }
      const q = (prev[id] ?? 0) + delta
      if (q > 0) next[id] = q
      else delete next[id]
      return next
    })
  }

  function charge() {
    if (cartCount === 0) return
    const sale: Sale = {
      id: `S-${1043 + sales.length}`,
      time: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      items: cartCount,
      total: cartTotal,
      status: online ? "synced" : "pending",
    }
    setSales((prev) => [sale, ...prev])
    setCart({})
    if (online) {
      toast.success(`Sale ${sale.id} charged`)
    } else {
      toast.success(`Sale ${sale.id} saved on this till. It will sync when you're back online.`)
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-6">
      <Toaster />
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Fernhill Market</h1>
            <p className="text-sm text-muted-foreground">Till 2 · Point of sale</p>
          </div>
          <div className="flex items-center gap-2">
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
            <Button variant="outline" onClick={toggleConnection}>
              {online ? "Simulate outage" : "Restore connection"}
            </Button>
          </div>
        </header>

        {!online && (
          <Alert variant="warning">
            <WifiOff />
            <AlertTitle>You are offline. Sales still work.</AlertTitle>
            <AlertDescription>
              Each sale is kept on this till and syncs automatically when the connection returns.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Tap a product to add it to the sale</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRODUCTS.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  className="h-auto flex-col items-start gap-1 p-3 text-left"
                  onClick={() => changeQty(p.id, 1)}
                >
                  <span className="font-medium whitespace-normal">{p.name}</span>
                  <span className="text-muted-foreground tabular-nums">{money(p.price)}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current sale</CardTitle>
              <CardDescription>{cartCount} {cartCount === 1 ? "item" : "items"}</CardDescription>
            </CardHeader>
            <CardContent>
              {lines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items yet. Tap a product to start.</p>
              ) : (
                <ul className="space-y-2">
                  {lines.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-2 text-sm">
                      <span className="min-w-0 flex-1 truncate">{l.name}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove one ${l.name}`}
                          onClick={() => changeQty(l.id, -1)}
                        >
                          <Minus />
                        </Button>
                        <span className="w-6 text-center tabular-nums">{l.qty}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Add one ${l.name}`}
                          onClick={() => changeQty(l.id, 1)}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <span className="w-20 text-right tabular-nums">{money(l.qty * l.price)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <div className="flex w-full items-center justify-between font-medium">
                <span>Total</span>
                <span className="tabular-nums">{money(cartTotal)}</span>
              </div>
              <Button size="lg" className="w-full" disabled={cartCount === 0} onClick={charge}>
                {online ? "Charge sale" : "Save sale offline"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales on this till</CardTitle>
            <CardDescription>
              {pendingCount === 0
                ? "Everything is synced."
                : `${pendingCount} waiting to sync. ${
                    online ? "Syncing now." : "Sync resumes when the connection returns."
                  }`}
            </CardDescription>
            <CardAction>
              <Button
                variant="outline"
                disabled={!online || pendingCount === 0}
                onClick={syncPending}
              >
                <RefreshCw />
                Sync now
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No sales yet today.
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.id}</TableCell>
                      <TableCell className="tabular-nums">{s.time}</TableCell>
                      <TableCell className="text-right tabular-nums">{s.items}</TableCell>
                      <TableCell className="text-right tabular-nums">{money(s.total)}</TableCell>
                      <TableCell>
                        {s.status === "synced" ? (
                          <Badge variant="success">
                            <CircleCheck />
                            Synced
                          </Badge>
                        ) : (
                          <Badge variant="info">
                            <Clock />
                            Pending sync
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
