import { useState } from "react"
import {
  CircleCheck,
  CloudOff,
  Minus,
  Plus,
  RefreshCw,
  ShoppingCart,
  TriangleAlert,
  Wifi,
  WifiOff,
} from "lucide-react"
import { toast } from "sonner"

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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

type Product = {
  id: string
  name: string
  price: number
}

type SaleStatus = "queued" | "syncing" | "synced"

type Sale = {
  id: string
  time: string
  items: number
  total: number
  status: SaleStatus
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sourdough loaf", price: 6.5 },
  { id: "p2", name: "Oat milk 1 L", price: 2.4 },
  { id: "p3", name: "Free-range eggs (6)", price: 4.2 },
  { id: "p4", name: "Honeycrisp apples (1 kg)", price: 5.8 },
  { id: "p5", name: "Dark roast coffee 250 g", price: 9.9 },
  { id: "p6", name: "Greek yoghurt 500 g", price: 3.6 },
]

const INITIAL_SALES: Sale[] = [
  { id: "FM-0412", time: "09:14", items: 3, total: 18.5, status: "synced" },
  { id: "FM-0413", time: "09:31", items: 1, total: 4.25, status: "synced" },
  { id: "FM-0414", time: "09:47", items: 4, total: 27.3, status: "queued" },
  { id: "FM-0415", time: "09:52", items: 2, total: 12.1, status: "queued" },
]

const STATUS_META: Record<
  SaleStatus,
  {
    label: string
    variant: "warning" | "info" | "success"
    Icon: typeof CloudOff
  }
> = {
  queued: { label: "Waiting to sync", variant: "warning", Icon: CloudOff },
  syncing: { label: "Syncing", variant: "info", Icon: RefreshCw },
  synced: { label: "Synced", variant: "success", Icon: CircleCheck },
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export default function PosOfflineSyncScreen() {
  const [online, setOnline] = useState(false)
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [nextNo, setNextNo] = useState(416)

  const cartLines = PRODUCTS.filter((p) => (cart[p.id] ?? 0) > 0).map((p) => ({
    ...p,
    qty: cart[p.id],
  }))
  const itemCount = cartLines.reduce((sum, l) => sum + l.qty, 0)
  const cartTotal = cartLines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const pendingCount = sales.filter((s) => s.status !== "synced").length
  const queuedCount = sales.filter((s) => s.status === "queued").length

  function addToCart(id: string) {
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  }

  function changeQty(id: string, delta: number) {
    setCart((c) => {
      const next = (c[id] ?? 0) + delta
      const copy = { ...c }
      if (next <= 0) delete copy[id]
      else copy[id] = next
      return copy
    })
  }

  function completeSale() {
    if (itemCount === 0) return
    const sale: Sale = {
      id: `FM-${nextNo}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: itemCount,
      total: cartTotal,
      status: online ? "synced" : "queued",
    }
    setSales((prev) => [sale, ...prev])
    setCart({})
    setNextNo((n) => n + 1)

    if (online) {
      toast.success(`Sale ${sale.id} completed`)
    } else {
      toast.success(`Sale ${sale.id} saved on this register`, {
        description: "It will sync when the connection is back.",
      })
    }
  }

  function syncPending() {
    if (queuedCount === 0) return
    setSales((prev) =>
      prev.map((s) => (s.status === "queued" ? { ...s, status: "syncing" } : s))
    )
    window.setTimeout(() => {
      setSales((prev) =>
        prev.map((s) => (s.status === "syncing" ? { ...s, status: "synced" } : s))
      )
      toast.success(
        queuedCount === 1 ? "1 sale synced" : `${queuedCount} sales synced`
      )
    }, 1200)
  }

  function toggleConnection() {
    const next = !online
    setOnline(next)
    if (next) {
      toast.success("Connection restored")
      syncPending()
    } else {
      toast.warning("Connection lost", {
        description: "Sales keep working and will sync later.",
      })
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Toaster position="bottom-right" />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Fernhill Market</h1>
            <p className="text-sm text-muted-foreground">Register 2 · Front counter</p>
          </div>
          <div className="flex items-center gap-3">
            {online ? (
              <Badge variant="success">
                <Wifi aria-hidden="true" />
                Online
              </Badge>
            ) : (
              <Badge variant="warning">
                <WifiOff aria-hidden="true" />
                Offline
              </Badge>
            )}
            <Button variant="outline" onClick={toggleConnection}>
              {online ? <WifiOff /> : <Wifi />}
              {online ? "Simulate connection loss" : "Restore connection"}
            </Button>
          </div>
        </header>

        {!online && (
          <Alert variant="warning">
            <TriangleAlert />
            <AlertTitle>You're offline. Sales still work.</AlertTitle>
            <AlertDescription>
              Each sale is saved on this register and syncs automatically when the
              connection returns. Nothing needs to be re-entered.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Tap an item to add it to the sale</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {PRODUCTS.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  size="lg"
                  className="h-auto justify-between px-4 py-3 text-left"
                  onClick={() => addToCart(p.id)}
                >
                  <span>{p.name}</span>
                  <span className="text-muted-foreground">{money.format(p.price)}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current sale</CardTitle>
              <CardDescription>
                {itemCount === 0
                  ? "No items yet"
                  : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {cartLines.length === 0 ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingCart className="size-4" aria-hidden="true" />
                  Add products to start a sale.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {cartLines.map((l) => (
                    <li key={l.id} className="flex items-center justify-between gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm">{l.name}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove one ${l.name}`}
                          onClick={() => changeQty(l.id, -1)}
                        >
                          <Minus />
                        </Button>
                        <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Add one ${l.name}`}
                          onClick={() => changeQty(l.id, 1)}
                        >
                          <Plus />
                        </Button>
                      </div>
                      <span className="w-20 text-right text-sm tabular-nums">
                        {money.format(l.price * l.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t pt-4">
              <div className="flex w-full items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{money.format(cartTotal)}</span>
              </div>
              <Button size="lg" className="w-full" disabled={itemCount === 0} onClick={completeSale}>
                {online ? "Complete sale" : "Complete sale offline"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales on this register</CardTitle>
            <CardDescription>
              {pendingCount === 0
                ? "Everything is synced to the back office."
                : `${pendingCount} ${pendingCount === 1 ? "sale" : "sales"} not yet synced`}
            </CardDescription>
            <CardAction>
              <div className="flex flex-col items-end gap-1">
                <Button
                  variant="outline"
                  disabled={!online || queuedCount === 0}
                  onClick={syncPending}
                >
                  <RefreshCw aria-hidden="true" />
                  Sync now
                </Button>
                {!online && (
                  <span className="text-xs text-muted-foreground">
                    Available when the connection is back
                  </span>
                )}
              </div>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Sync status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((s) => {
                  const meta = STATUS_META[s.status]
                  const Icon = meta.Icon
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.id}</TableCell>
                      <TableCell>{s.time}</TableCell>
                      <TableCell>{s.items}</TableCell>
                      <TableCell>
                        <Badge variant={meta.variant}>
                          <Icon
                            aria-hidden="true"
                            className={s.status === "syncing" ? "motion-safe:animate-spin" : undefined}
                          />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {money.format(s.total)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
