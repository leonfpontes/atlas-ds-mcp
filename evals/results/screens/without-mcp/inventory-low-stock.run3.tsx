import { useMemo, useState } from "react"
import { AlertTriangle, Package } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Product = {
  id: string
  name: string
  sku: string
  category: string
  unit: string
  stock: number
  reorderPoint: number
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Organic whole milk", sku: "DAI-1001", category: "Dairy", unit: "1 L", stock: 42, reorderPoint: 20 },
  { id: "p2", name: "Free-range eggs (12)", sku: "DAI-1002", category: "Dairy", unit: "pack", stock: 6, reorderPoint: 15 },
  { id: "p3", name: "Sourdough loaf", sku: "BAK-2001", category: "Bakery", unit: "loaf", stock: 18, reorderPoint: 10 },
  { id: "p4", name: "Croissant (butter)", sku: "BAK-2002", category: "Bakery", unit: "each", stock: 0, reorderPoint: 12 },
  { id: "p5", name: "Gala apples", sku: "PRD-3001", category: "Produce", unit: "kg", stock: 55, reorderPoint: 25 },
  { id: "p6", name: "Baby spinach", sku: "PRD-3002", category: "Produce", unit: "bag", stock: 9, reorderPoint: 10 },
  { id: "p7", name: "Dark roast coffee beans", sku: "PAN-4001", category: "Pantry", unit: "500 g", stock: 31, reorderPoint: 12 },
  { id: "p8", name: "Basmati rice", sku: "PAN-4002", category: "Pantry", unit: "2 kg", stock: 14, reorderPoint: 8 },
  { id: "p9", name: "Sparkling water", sku: "BEV-5001", category: "Beverages", unit: "6 pack", stock: 3, reorderPoint: 10 },
  { id: "p10", name: "Cold-pressed orange juice", sku: "BEV-5002", category: "Beverages", unit: "1 L", stock: 22, reorderPoint: 8 },
]

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()

function isLow(p: Product) {
  return p.stock <= p.reorderPoint
}

export default function InventoryScreen() {
  const [category, setCategory] = useState<string>("all")

  const visibleProducts = useMemo(
    () =>
      category === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category),
    [category]
  )

  const lowStockCount = visibleProducts.filter(isLow).length

  function handleReorder(product: Product) {
    toast.success(`Reorder request created for ${product.name}`)
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market stock levels across all categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Category</span>
          <Select value={category} onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="w-44" aria-label="Filter by category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Package className="size-4" aria-hidden="true" />
        <span>
          {visibleProducts.length} products
          {lowStockCount > 0 && (
            <>
              {" · "}
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {lowStockCount} below reorder point
              </span>
            </>
          )}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Reorder point</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No products in this category.
                </TableCell>
              </TableRow>
            )}

            {visibleProducts.map((product) => {
              const low = isLow(product)
              const outOfStock = product.stock === 0

              return (
                <TableRow
                  key={product.id}
                  className={low ? "bg-amber-50/60 dark:bg-amber-950/20" : undefined}
                >
                  <TableCell className="font-medium text-foreground">
                    {product.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {product.sku}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {product.stock} {product.unit}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {product.reorderPoint}
                  </TableCell>
                  <TableCell>
                    {outOfStock ? (
                      <Badge variant="destructive">
                        <AlertTriangle className="size-3" aria-hidden="true" />
                        Out of stock
                      </Badge>
                    ) : low ? (
                      <Badge
                        variant="outline"
                        className="border-amber-500 text-amber-700 dark:text-amber-400"
                      >
                        <AlertTriangle className="size-3" aria-hidden="true" />
                        Below reorder point
                      </Badge>
                    ) : (
                      <Badge variant="secondary">In stock</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {low && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReorder(product)}
                      >
                        Reorder
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
