import { useState } from "react"
import {
  CircleCheck,
  Clock,
  CloudUpload,
  Minus,
  Plus,
  RefreshCw,
  Wifi,
  WifiOff,
  X,
} from "lucide-react"
import { toast } from "sonner"
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert"
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
import { Toaster } from "@/components/ui/sonner"

type Product = {
  id: string
  name: string
  sku: string
  price: number
}

type CartLine = {
  product: Product
  qty: number
}

type SaleStatus = "pending" | "synced"

type Sale = {
  id: string
  time: string
  items: number
  total: number
  status: SaleStatus
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sourdough loaf", sku: "BK-101", price: 6.5 },
  { id: "p2", name: "Free-range eggs, 12 pack", sku: "DA-220", price: 5.2 },
  { id: "p3", name: "Oat milk, 1 L", sku: "DA-245", price: 3.1 },
  { id: "p4", name: "Local honey, 340 g", sku: "PA-310", price: 8.9 },
  { id: "p5", name: "Apples, 1 kg", sku: "PR-018", price: 4.4 },
  { id: "p6", name: "Coffee beans, 250 g", sku: "GR-402", price: 11.75 },
]

const INITIAL_SALES: Sale[] = [
  { id: "#1041", time: "09:12", items: 3, total: 18.6, status: "synced" },
  { id: "#1040", time: "08:47", items: 1, total: 6.5, status: "synced" },
]

const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

function SyncBadge({ status, syncing }: { status: SaleStatus; syncing: boolean }) {
  if (status === "synced") {
    return (
      <Badge variant="success">
        <CircleCheck />
        Synced
      </Badge>
    )
  }
  if (syncing) {
    return (
      <Badge variant="info">
        <RefreshCw className="animate-spin" />
        Syncing
      </Badge>
    )
  }
  return (
    <Badge variant="warning">
      <Clock />
      Waiting to sync
    </Badge>
  )
}

export default function PosScreen() {
  const [online, setOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [query, setQuery] = useState("")
  const [cart, setCart] = useState<CartLine[]>([])
  const [sales, setSales] = useState<Sale[]>(INITIAL_SALES)
  const [nextNumber, setNextNumber] = useState(1042)

  const pendingCount = sales.filter((sale) => sale.status === "pending").length
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0)
  const cartTotal = cart.reduce((sum, line) => sum + line.qty * line.product.price, 0)

  const term = query.trim().toLowerCase()
  const visibleProducts = PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term)
  )

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((line) => line.product.id === product.id)
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id ? { ...line, qty: line.qty + 1 } : line
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  function changeQty(productId: string, delta: number) {
    setCart((prev) =>
      prev.flatMap((line) => {
        if (line.product.id !== productId) return [line]
        const qty = line.qty + delta
        return qty <= 0 ? [] : [{ ...line, qty }]
      })
    )
  }

  function clearSale() {
    setCart([])
  }

  function chargeSale() {
    if (cart.length === 0) return

    const id = `#${nextNumber}`
    const sale: Sale = {
      id,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      items: cartCount,
      total: cartTotal,
      status: online ? "synced" : "pending",
    }

    setSales((prev) => [sale, ...prev])
    setNextNumber((n) => n + 1)
    setCart([])

    if (online) {
      toast.success(`Sale ${id} paid`)
    } else {
      toast.success(`Sale ${id} saved on this register`, {
        description: "It will sync when the connection returns.",
      })
    }
  }

  function syncPending() {
    const waiting = pendingCount
    if (waiting === 0) return

    setSyncing(true)
    window.setTimeout(() => {
      setSales((prev) =>
        prev.map((sale) =>
          sale.status === "pending" ? { ...sale, status: "synced" } : sale
        )
      )
      setSyncing(false)
      toast.success(`${waiting} ${waiting === 1 ? "sale" : "sales"} synced`)
    }, 1500)
  }

  function toggleConnection() {
    if (online) {
      setOnline(false)
      return
    }
    setOnline(true)
    syncPending()
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-semibold">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">Register 2 · Front counter</p>
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
          <Button variant="outline" onClick={toggleConnection}>
            {online ? <WifiOff /> : <Wifi />}
            {online ? "Simulate connection drop" : "Restore connection"}
          </Button>
        </div>
      </header>

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          {!online && (
            <Alert variant="warning">
              <WifiOff />
              <AlertTitle>You are offline. Sales still work.</AlertTitle>
              <AlertDescription>
                Sales are saved on this register and sync when the connection returns.
                {pendingCount === 1
                  ? " 1 sale is waiting to sync."
                  : ` ${pendingCount} sales are waiting to sync.`}
              </AlertDescription>
            </Alert>
          )}

          {online && syncing && (
            <Alert variant="info">
              <RefreshCw className="animate-spin" />
              <AlertTitle>Back online. Syncing sales.</AlertTitle>
              <AlertDescription>
                {pendingCount === 1
                  ? "1 sale is being sent to Fernhill's server."
                  : `${pendingCount} sales are being sent to Fernhill's server.`}
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Add items to the current sale.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="product-search" className="text-sm font-medium">
                  Search products
                </label>
                <Input
                  id="product-search"
                  type="search"
                  placeholder="Name or SKU"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                      <TableCell className="text-right">{money(product.price)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="default"
                          aria-label={`Add ${product.name} to sale`}
                          onClick={() => addToCart(product)}
                        >
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {visibleProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">No product matches “{query}”.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales on this register</CardTitle>
              <CardDescription>
                {pendingCount === 0
                  ? "Everything is synced."
                  : `${pendingCount} waiting to sync. They stay on this register until they are sent.`}
              </CardDescription>
              {online && pendingCount > 0 && !syncing && (
                <CardAction>
                  <Button variant="outline" onClick={syncPending}>
                    <CloudUpload />
                    Sync now
                  </Button>
                </CardAction>
              )}
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
                      <TableCell>{sale.id}</TableCell>
                      <TableCell>{sale.time}</TableCell>
                      <TableCell className="text-right">{sale.items}</TableCell>
                      <TableCell className="text-right">{money(sale.total)}</TableCell>
                      <TableCell>
                        <SyncBadge status={sale.status} syncing={syncing} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <aside>
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle>Current sale</CardTitle>
              <CardDescription>
                {cartCount === 0 ? "No items yet" : `${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              </CardDescription>
              {cart.length > 0 && (
                <CardAction>
                  <Button variant="ghost" size="icon" aria-label="Clear sale" onClick={clearSale}>
                    <X />
                  </Button>
                </CardAction>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Add products from the list to start a sale.
                </p>
              ) : (
                <ul className="space-y-3">
                  {cart.map((line) => (
                    <li key={line.product.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{line.product.name}</p>
                        <p className="text-sm text-muted-foreground">{money(line.product.price)} each</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Decrease ${line.product.name}`}
                          onClick={() => changeQty(line.product.id, -1)}
                        >
                          <Minus />
                        </Button>
                        <span className="w-6 text-center text-sm">{line.qty}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Increase ${line.product.name}`}
                          onClick={() => changeQty(line.product.id, 1)}
                        >
                          <Plus />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-semibold">{money(cartTotal)}</span>
              </div>
              <Button size="lg" className="w-full" disabled={cart.length === 0} onClick={chargeSale}>
                {online ? `Charge ${money(cartTotal)}` : `Save offline sale ${money(cartTotal)}`}
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>

      <Toaster />
    </main>
  )
}
