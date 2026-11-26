import { useState } from "react"
import {
  CircleCheck,
  Clock,
  CloudUpload,
  Minus,
  Plus,
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

type SyncStatus = "queued" | "syncing" | "synced"

type Product = {
  id: string
  name: string
  priceCents: number
}

type CartLine = {
  productId: string
  qty: number
}

type Sale = {
  id: string
  time: string
  items: number
  totalCents: number
  status: SyncStatus
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sourdough loaf", priceCents: 650 },
  { id: "p2", name: "Oat milk, 1 L", priceCents: 385 },
  { id: "p3", name: "Free-range eggs, 12", priceCents: 520 },
  { id: "p4", name: "Wildflower honey, 340 g", priceCents: 890 },
  { id: "p5", name: "Apples, 1 kg", priceCents: 445 },
  { id: "p6", name: "Coffee beans, 250 g", priceCents: 1250 },
]

const INITIAL_SALES: Sale[] = [
  { id: "S-1048", time: "08:42", items: 3, totalCents: 1835, status: "synced" },
  { id: "S-1049", time: "08:57", items: 1, totalCents: 1250, status: "synced" },
  { id: "S-1050", time: "09:11", items: 5, totalCents: 2680, status: "synced" },
]

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function formatMoney(cents: number) {
  return currency.format(cents / 100)
}

function SyncBadge({ status }: { status: SyncStatus }) {
  if (status === "queued") {
    return (
      <Badge variant="warning">
        <Clock />
        Queued
      </Badge>
    )
  }
  if (status === "syncing") {
    return (
      <Badge variant="info">
        <CloudUpload />
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

export default function Page() {
  const [online, setOnline] = useState(true)
  const [cart, setCart] = useState<CartLine[]>([])
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES)

  const cartDetails = cart.flatMap((line) => {
    const product = PRODUCTS.find((p) => p.id === line.productId)
    return product ? [{ ...line, product }] : []
  })
  const itemCount = cart.reduce((sum, line) => sum + line.qty, 0)
  const totalCents = cartDetails.reduce(
    (sum, line) => sum + line.product.priceCents * line.qty,
    0
  )
  const queuedCount = sales.filter((s) => s.status === "queued").length

  const setStatus = (ids: string[], status: SyncStatus) => {
    setSales((prev) =>
      prev.map((sale) => (ids.includes(sale.id) ? { ...sale, status } : sale))
    )
  }

  const syncSales = (ids: string[]) => {
    if (ids.length === 0) return
    setStatus(ids, "syncing")
    window.setTimeout(() => {
      setStatus(ids, "synced")
      toast.success(
        ids.length === 1 ? "1 sale synced" : `${ids.length} sales synced`
      )
    }, 1500)
  }

  const toggleConnection = () => {
    if (online) {
      setOnline(false)
      return
    }
    setOnline(true)
    syncSales(sales.filter((s) => s.status === "queued").map((s) => s.id))
  }

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((line) => line.productId === productId)
      if (existing) {
        return prev.map((line) =>
          line.productId === productId ? { ...line, qty: line.qty + 1 } : line
        )
      }
      return [...prev, { productId, qty: 1 }]
    })
  }

  const changeQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((line) =>
          line.productId === productId
            ? { ...line, qty: line.qty + delta }
            : line
        )
        .filter((line) => line.qty > 0)
    )
  }

  const completeSale = () => {
    if (cart.length === 0) return
    const id = `S-${Date.now().toString().slice(-4)}`
    const sale: Sale = {
      id,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: itemCount,
      totalCents,
      status: online ? "syncing" : "queued",
    }
    setSales((prev) => [sale, ...prev])
    setCart([])

    if (online) {
      syncSales([id])
    } else {
      toast.success(`Sale ${id} saved on this register`, {
        description: "It will sync when the connection is back.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />

      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">Register 2 · Front counter</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="warning">
            <TriangleAlert />
            Example data
          </Badge>
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
            {online ? (
              <>
                <WifiOff />
                Simulate connection drop
              </>
            ) : (
              <>
                <Wifi />
                Restore connection
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        {!online && (
          <Alert variant="warning">
            <WifiOff />
            <AlertTitle>Offline: sales still work</AlertTitle>
            <AlertDescription>
              Each sale is saved on this register and syncs automatically when the
              connection returns. {queuedCount}{" "}
              {queuedCount === 1 ? "sale is" : "sales are"} waiting to sync.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Tap a product to add it to the sale.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {PRODUCTS.map((product) => (
                <Button
                  key={product.id}
                  variant="outline"
                  className="h-auto flex-col items-start gap-1 whitespace-normal p-4 text-left"
                  onClick={() => addToCart(product.id)}
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted-foreground">
                    {formatMoney(product.priceCents)}
                  </span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current sale</CardTitle>
              <CardDescription>
                {itemCount === 0
                  ? "Add items to start a sale."
                  : `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cartDetails.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartDetails.map((line) => (
                      <TableRow key={line.productId}>
                        <TableCell className="whitespace-normal">
                          {line.product.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Remove one ${line.product.name}`}
                              onClick={() => changeQty(line.productId, -1)}
                            >
                              <Minus />
                            </Button>
                            <span className="w-6 text-center tabular-nums">
                              {line.qty}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Add one ${line.product.name}`}
                              onClick={() => changeQty(line.productId, 1)}
                            >
                              <Plus />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatMoney(line.product.priceCents * line.qty)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No items yet.
                </p>
              )}
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <div className="flex w-full items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatMoney(totalCents)}</span>
              </div>
              <Button
                size="lg"
                className="w-full"
                disabled={cart.length === 0}
                onClick={completeSale}
              >
                <ShoppingCart />
                {online ? "Complete sale" : "Save sale offline"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sales on this register</CardTitle>
            <CardDescription>
              {queuedCount === 0
                ? "Everything is synced to the back office."
                : `${queuedCount} ${queuedCount === 1 ? "sale" : "sales"} waiting to sync`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sale</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Sync</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell className="tabular-nums">{sale.time}</TableCell>
                    <TableCell className="text-right tabular-nums">{sale.items}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(sale.totalCents)}
                    </TableCell>
                    <TableCell>
                      <SyncBadge status={sale.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
