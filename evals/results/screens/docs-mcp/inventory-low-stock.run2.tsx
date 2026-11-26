import { useMemo, useState } from "react"
import { toast } from "sonner"
import { CircleCheck, Package, TriangleAlert } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
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
  category: string
  stock: number
  reorderPoint: number
  unit: string
}

const ALL_CATEGORIES = "all"

const PRODUCTS: Product[] = [
  { id: "p1", name: "Organic whole milk, 1 L", sku: "DAI-1001", category: "Dairy", stock: 24, reorderPoint: 12, unit: "bottles" },
  { id: "p2", name: "Free-range eggs, dozen", sku: "DAI-1008", category: "Dairy", stock: 4, reorderPoint: 10, unit: "cartons" },
  { id: "p3", name: "Sourdough loaf", sku: "BAK-2003", category: "Bakery", stock: 9, reorderPoint: 8, unit: "loaves" },
  { id: "p4", name: "Rolled oats, 1 kg", sku: "PAN-3012", category: "Pantry", stock: 31, reorderPoint: 10, unit: "bags" },
  { id: "p5", name: "Cold-pressed apple juice, 750 ml", sku: "BEV-4020", category: "Beverages", stock: 3, reorderPoint: 6, unit: "bottles" },
  { id: "p6", name: "Baby spinach, 200 g", sku: "PRO-5005", category: "Produce", stock: 7, reorderPoint: 15, unit: "packs" },
  { id: "p7", name: "Hass avocados", sku: "PRO-5011", category: "Produce", stock: 42, reorderPoint: 20, unit: "pieces" },
  { id: "p8", name: "Croissant, butter", sku: "BAK-2010", category: "Bakery", stock: 14, reorderPoint: 12, unit: "pieces" },
  { id: "p9", name: "Extra virgin olive oil, 500 ml", sku: "PAN-3027", category: "Pantry", stock: 11, reorderPoint: 6, unit: "bottles" },
  { id: "p10", name: "Sparkling water, 6-pack", sku: "BEV-4033", category: "Beverages", stock: 0, reorderPoint: 8, unit: "packs" },
]

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()

function isBelowReorderPoint(product: Product) {
  return product.stock <= product.reorderPoint
}

export default function InventoryScreen() {
  const [category, setCategory] = useState<string>(ALL_CATEGORIES)

  const visibleProducts = useMemo(
    () =>
      category === ALL_CATEGORIES
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category),
    [category]
  )

  const lowStockCount = useMemo(
    () => PRODUCTS.filter(isBelowReorderPoint).length,
    []
  )

  function requestReorder(product: Product) {
    toast.success(`Reorder requested for ${product.name}`)
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground md:p-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="size-4" aria-hidden="true" />
            <span className="text-sm">Fernhill Market</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Stock levels for every product, compared with its reorder point.
          </p>
        </header>

        {lowStockCount > 0 && (
          <Alert variant="warning">
            <TriangleAlert />
            <AlertTitle>
              {lowStockCount} {lowStockCount === 1 ? "item is" : "items are"} below reorder point
            </AlertTitle>
            <AlertDescription>
              Reorder the flagged products before they run out. Stock at or below the reorder point is marked in each row.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category-filter" className="w-full sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing {visibleProducts.length} of {PRODUCTS.length} products
          </p>
        </div>

        <div className="overflow-hidden rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Reorder point</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No products in this category.
                  </TableCell>
                </TableRow>
              )}
              {visibleProducts.map((product) => {
                const low = isBelowReorderPoint(product)
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {product.stock} {product.unit}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {product.reorderPoint}
                    </TableCell>
                    <TableCell>
                      {low ? (
                        <Badge variant="warning">
                          <TriangleAlert />
                          Below reorder point
                        </Badge>
                      ) : (
                        <Badge variant="success">
                          <CircleCheck />
                          In stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {low && (
                        <Button
                          variant="outline"
                          size="default"
                          onClick={() => requestReorder(product)}
                        >
                          Reorder {product.name}
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
      <Toaster />
    </main>
  )
}
