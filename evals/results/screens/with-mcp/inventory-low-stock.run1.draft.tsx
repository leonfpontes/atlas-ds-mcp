import { useMemo, useState } from "react"
import { CircleCheck, CircleX, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

type Product = {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  reorderPoint: number
}

const PRODUCTS: Product[] = [
  { id: "P-1001", name: "Whole milk 1 L", sku: "DAI-1001", category: "Dairy", stock: 42, reorderPoint: 20 },
  { id: "P-1002", name: "Greek yogurt 500 g", sku: "DAI-1002", category: "Dairy", stock: 9, reorderPoint: 12 },
  { id: "P-1003", name: "Sourdough loaf", sku: "BAK-2001", category: "Bakery", stock: 14, reorderPoint: 10 },
  { id: "P-1004", name: "Croissant pack of 4", sku: "BAK-2002", category: "Bakery", stock: 0, reorderPoint: 8 },
  { id: "P-1005", name: "Baby spinach 150 g", sku: "PRO-3001", category: "Produce", stock: 6, reorderPoint: 15 },
  { id: "P-1006", name: "Gala apples 1 kg", sku: "PRO-3002", category: "Produce", stock: 35, reorderPoint: 20 },
  { id: "P-1007", name: "Basmati rice 2 kg", sku: "PAN-4001", category: "Pantry", stock: 28, reorderPoint: 10 },
  { id: "P-1008", name: "Olive oil 750 ml", sku: "PAN-4002", category: "Pantry", stock: 4, reorderPoint: 6 },
  { id: "P-1009", name: "Sparkling water 6 pack", sku: "BEV-5001", category: "Beverages", stock: 22, reorderPoint: 12 },
  { id: "P-1010", name: "Cold brew coffee 330 ml", sku: "BEV-5002", category: "Beverages", stock: 3, reorderPoint: 10 },
]

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()

type StockStatus = "in-stock" | "low" | "out"

function getStockStatus(product: Product): StockStatus {
  if (product.stock === 0) return "out"
  if (product.stock <= product.reorderPoint) return "low"
  return "in-stock"
}

export default function InventoryPage() {
  const [category, setCategory] = useState<string>("all")

  const visibleProducts = useMemo(
    () => PRODUCTS.filter((p) => category === "all" || p.category === category),
    [category]
  )

  const lowStockCount = useMemo(
    () => PRODUCTS.filter((p) => getStockStatus(p) !== "in-stock").length,
    []
  )

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <Badge variant="warning">
            <TriangleAlert />
            Example data
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Fernhill Market stock levels by product.</p>
      </header>

      {lowStockCount > 0 && (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>
            {lowStockCount} {lowStockCount === 1 ? "item is" : "items are"} below reorder point
          </AlertTitle>
          <AlertDescription>Reorder these products before the next delivery.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            Showing {visibleProducts.length} of {PRODUCTS.length} products
          </CardDescription>
          <CardAction>
            <Button
              onClick={() =>
                toast.success(
                  `Purchase order drafted for ${lowStockCount} ${lowStockCount === 1 ? "product" : "products"}`
                )
              }
            >
              Create purchase order
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:max-w-xs">
            <label htmlFor="category-filter" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category-filter" className="w-full">
                <SelectValue />
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Reorder point</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No products in this category.
                  </TableCell>
                </TableRow>
              )}
              {visibleProducts.map((product) => {
                const status = getStockStatus(product)
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right tabular-nums">{product.stock}</TableCell>
                    <TableCell className="text-right tabular-nums">{product.reorderPoint}</TableCell>
                    <TableCell>
                      {status === "in-stock" && (
                        <Badge variant="success">
                          <CircleCheck />
                          In stock
                        </Badge>
                      )}
                      {status === "low" && (
                        <Badge variant="warning">
                          <TriangleAlert />
                          Below reorder point
                        </Badge>
                      )}
                      {status === "out" && (
                        <Badge variant="destructive">
                          <CircleX />
                          Out of stock
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Toaster />
    </main>
  )
}
