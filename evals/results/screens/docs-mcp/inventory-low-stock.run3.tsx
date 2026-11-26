import { useMemo, useState } from "react"
import { CircleCheck, Package, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
}

const ALL_CATEGORIES = "all"

const PRODUCTS: Product[] = [
  { id: "p1", name: "Whole milk, 1 L", sku: "DAI-1001", category: "Dairy", onHand: 42, reorderPoint: 20 },
  { id: "p2", name: "Greek yogurt, 500 g", sku: "DAI-1012", category: "Dairy", onHand: 6, reorderPoint: 15 },
  { id: "p3", name: "Sourdough loaf", sku: "BAK-2003", category: "Bakery", onHand: 11, reorderPoint: 10 },
  { id: "p4", name: "Croissant, butter", sku: "BAK-2010", category: "Bakery", onHand: 4, reorderPoint: 12 },
  { id: "p5", name: "Baby spinach, 200 g", sku: "PRO-3004", category: "Produce", onHand: 18, reorderPoint: 10 },
  { id: "p6", name: "Gala apples, 1 kg", sku: "PRO-3011", category: "Produce", onHand: 3, reorderPoint: 8 },
  { id: "p7", name: "Basmati rice, 2 kg", sku: "PAN-4007", category: "Pantry", onHand: 30, reorderPoint: 12 },
  { id: "p8", name: "Olive oil, extra virgin, 750 ml", sku: "PAN-4021", category: "Pantry", onHand: 9, reorderPoint: 10 },
  { id: "p9", name: "Sparkling water, 12 pack", sku: "BEV-5002", category: "Beverages", onHand: 25, reorderPoint: 15 },
  { id: "p10", name: "Cold brew coffee, 330 ml", sku: "BEV-5017", category: "Beverages", onHand: 2, reorderPoint: 12 },
]

export default function InventoryScreen() {
  const [category, setCategory] = useState<string>(ALL_CATEGORIES)

  const categories = useMemo(
    () => Array.from(new Set(PRODUCTS.map((p) => p.category))).sort(),
    []
  )

  const visibleProducts = useMemo(
    () =>
      category === ALL_CATEGORIES
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category),
    [category]
  )

  const lowStockCount = useMemo(
    () => PRODUCTS.filter((p) => p.onHand < p.reorderPoint).length,
    []
  )

  const handleReorder = () => {
    toast.success(
      `Reorder list created for ${lowStockCount} ${lowStockCount === 1 ? "product" : "products"}`
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <Badge variant="warning">
            <TriangleAlert />
            Example data
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Stock on hand for every product at Fernhill Market.
        </p>
      </div>

      {lowStockCount > 0 && (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>
            {lowStockCount} {lowStockCount === 1 ? "product is" : "products are"} below the reorder point
          </AlertTitle>
          <AlertDescription>
            Create a reorder list before these items run out.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {visibleProducts.length} of {PRODUCTS.length} products shown
          </CardDescription>
          <CardAction className="flex items-center gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-44" aria-label="Filter by category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleReorder}>
              <Package />
              Create reorder list
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">On hand</TableHead>
                <TableHead className="text-right">Reorder point</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProducts.map((product) => {
                const isLow = product.onHand < product.reorderPoint
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right tabular-nums">{product.onHand}</TableCell>
                    <TableCell className="text-right tabular-nums">{product.reorderPoint}</TableCell>
                    <TableCell>
                      {isLow ? (
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
