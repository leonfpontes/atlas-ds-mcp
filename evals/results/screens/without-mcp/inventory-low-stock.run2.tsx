import { useMemo, useState } from "react"
import { AlertTriangle, Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  sku: string
  name: string
  category: string
  location: string
  onHand: number
  reorderPoint: number
  unit: string
}

const ALL_CATEGORIES = "all"

const PRODUCTS: Product[] = [
  {
    id: "p-001",
    sku: "PRD-1001",
    name: "Organic Whole Milk 1L",
    category: "Dairy",
    location: "Cooler A-1",
    onHand: 48,
    reorderPoint: 20,
    unit: "bottles",
  },
  {
    id: "p-002",
    sku: "PRD-1002",
    name: "Free-Range Eggs (12 ct)",
    category: "Dairy",
    location: "Cooler A-2",
    onHand: 9,
    reorderPoint: 15,
    unit: "cartons",
  },
  {
    id: "p-003",
    sku: "PRD-2001",
    name: "Sourdough Loaf",
    category: "Bakery",
    location: "Shelf B-3",
    onHand: 14,
    reorderPoint: 10,
    unit: "loaves",
  },
  {
    id: "p-004",
    sku: "PRD-2002",
    name: "Croissant (Butter)",
    category: "Bakery",
    location: "Shelf B-4",
    onHand: 6,
    reorderPoint: 12,
    unit: "pieces",
  },
  {
    id: "p-005",
    sku: "PRD-3001",
    name: "Gala Apples 1kg",
    category: "Produce",
    location: "Display C-1",
    onHand: 32,
    reorderPoint: 25,
    unit: "bags",
  },
  {
    id: "p-006",
    sku: "PRD-3002",
    name: "Baby Spinach 200g",
    category: "Produce",
    location: "Display C-2",
    onHand: 11,
    reorderPoint: 18,
    unit: "bags",
  },
  {
    id: "p-007",
    sku: "PRD-4001",
    name: "Sparkling Water 500ml",
    category: "Beverages",
    location: "Aisle D-5",
    onHand: 120,
    reorderPoint: 40,
    unit: "bottles",
  },
  {
    id: "p-008",
    sku: "PRD-4002",
    name: "Cold Brew Coffee 350ml",
    category: "Beverages",
    location: "Cooler A-4",
    onHand: 7,
    reorderPoint: 10,
    unit: "cans",
  },
  {
    id: "p-009",
    sku: "PRD-5001",
    name: "Olive Oil Extra Virgin 750ml",
    category: "Pantry",
    location: "Aisle E-2",
    onHand: 22,
    reorderPoint: 8,
    unit: "bottles",
  },
  {
    id: "p-010",
    sku: "PRD-5002",
    name: "Basmati Rice 2kg",
    category: "Pantry",
    location: "Aisle E-3",
    onHand: 5,
    reorderPoint: 10,
    unit: "bags",
  },
]

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()

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
    () => visibleProducts.filter((p) => p.onHand <= p.reorderPoint).length,
    [visibleProducts]
  )

  const totalUnits = useMemo(
    () => visibleProducts.reduce((sum, p) => sum + p.onHand, 0),
    [visibleProducts]
  )

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Fernhill Market stock levels across all categories.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products shown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{visibleProducts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Units on hand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalUnits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Below reorder point
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={
                lowStockCount > 0
                  ? "text-2xl font-semibold text-destructive"
                  : "text-2xl font-semibold"
              }
            >
              {lowStockCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium">Stock by product</span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm text-muted-foreground">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category-filter" className="w-[180px]">
              <SelectValue placeholder="All categories" />
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">On hand</TableHead>
              <TableHead className="text-right">Reorder point</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No products in this category.
                </TableCell>
              </TableRow>
            ) : (
              visibleProducts.map((product) => {
                const isLow = product.onHand <= product.reorderPoint
                return (
                  <TableRow key={product.id} data-state={isLow ? "low" : undefined}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {product.sku}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-muted-foreground">{product.location}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {product.onHand} {product.unit}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {product.reorderPoint}
                    </TableCell>
                    <TableCell>
                      {isLow ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="size-3" aria-hidden="true" />
                          Reorder
                        </Badge>
                      ) : (
                        <Badge variant="secondary">In stock</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
