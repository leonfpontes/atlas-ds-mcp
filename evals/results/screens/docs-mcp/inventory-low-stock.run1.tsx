import { useState } from "react"
import { CircleCheck, CircleX, PackagePlus, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { Toaster } from "@/components/ui/sonner"

type Product = {
  id: string
  name: string
  sku: string
  category: string
  onHand: number
  reorderPoint: number
  unit: string
}

const PRODUCTS: Product[] = [
  { id: "P-1001", name: "Whole milk", sku: "SKU-1001", category: "Dairy", onHand: 42, reorderPoint: 20, unit: "1 L" },
  { id: "P-1002", name: "Greek yogurt", sku: "SKU-1002", category: "Dairy", onHand: 9, reorderPoint: 15, unit: "500 g" },
  { id: "P-1003", name: "Sourdough loaf", sku: "SKU-1003", category: "Bakery", onHand: 6, reorderPoint: 10, unit: "800 g" },
  { id: "P-1004", name: "Croissant, pack of 4", sku: "SKU-1004", category: "Bakery", onHand: 18, reorderPoint: 12, unit: "4 pcs" },
  { id: "P-1005", name: "Baby spinach", sku: "SKU-1005", category: "Produce", onHand: 0, reorderPoint: 8, unit: "200 g" },
  { id: "P-1006", name: "Hass avocado", sku: "SKU-1006", category: "Produce", onHand: 31, reorderPoint: 25, unit: "each" },
  { id: "P-1007", name: "Rolled oats", sku: "SKU-1007", category: "Pantry", onHand: 14, reorderPoint: 10, unit: "1 kg" },
  { id: "P-1008", name: "Extra virgin olive oil", sku: "SKU-1008", category: "Pantry", onHand: 4, reorderPoint: 6, unit: "750 ml" },
  { id: "P-1009", name: "Sparkling water", sku: "SKU-1009", category: "Beverages", onHand: 58, reorderPoint: 24, unit: "6 × 330 ml" },
  { id: "P-1010", name: "Cold brew coffee", sku: "SKU-1010", category: "Beverages", onHand: 5, reorderPoint: 12, unit: "500 ml" },
]

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()

type StockStatus = "in-stock" | "below-reorder" | "out-of-stock"

function getStockStatus(product: Product): StockStatus {
  if (product.onHand === 0) return "out-of-stock"
  if (product.onHand < product.reorderPoint) return "below-reorder"
  return "in-stock"
}

function StatusBadge({ status }: { status: StockStatus }) {
  if (status === "out-of-stock") {
    return (
      <Badge variant="destructive">
        <CircleX />
        Out of stock
      </Badge>
    )
  }
  if (status === "below-reorder") {
    return (
      <Badge variant="warning">
        <TriangleAlert />
        Below reorder point
      </Badge>
    )
  }
  return (
    <Badge variant="success">
      <CircleCheck />
      In stock
    </Badge>
  )
}

export default function InventoryScreen() {
  const [category, setCategory] = useState<string>("all")

  const visibleProducts =
    category === "all"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === category)

  const needsReorder = PRODUCTS.filter(
    (product) => getStockStatus(product) !== "in-stock"
  )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">Inventory</h1>
            <Badge variant="warning">
              <TriangleAlert />
              Example data
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Fernhill Market · Stock on hand against each product&apos;s reorder point
          </p>
        </header>

        {needsReorder.length > 0 && (
          <Alert variant="warning">
            <TriangleAlert />
            <AlertTitle>
              {needsReorder.length} {needsReorder.length === 1 ? "item needs" : "items need"} reordering
            </AlertTitle>
            <AlertDescription>
              Stock is at or below its reorder point. Reorder these products before the next delivery.
            </AlertDescription>
          </Alert>
        )}

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="category-filter"
                className="text-sm font-medium text-foreground"
              >
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category-filter" className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
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
                  <TableHead className="text-right">On hand</TableHead>
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
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No products in this category.
                    </TableCell>
                  </TableRow>
                )}
                {visibleProducts.map((product) => {
                  const status = getStockStatus(product)
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                        <span className="block text-xs text-muted-foreground">
                          {product.unit}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right tabular-nums">{product.onHand}</TableCell>
                      <TableCell className="text-right tabular-nums">{product.reorderPoint}</TableCell>
                      <TableCell>
                        <StatusBadge status={status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {status !== "in-stock" && (
                          <Button
                            variant="outline"
                            size="default"
                            aria-label={`Reorder ${product.name}`}
                            onClick={() =>
                              toast.success(`Reorder requested for ${product.name}`)
                            }
                          >
                            <PackagePlus />
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
        </section>
      </div>
      <Toaster />
    </div>
  )
}
