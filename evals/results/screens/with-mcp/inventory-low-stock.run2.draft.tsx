import { useMemo, useState } from "react"
import { TriangleAlert, CircleCheck } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
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

type Product = {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  reorderPoint: number
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Oat milk, 1 L", sku: "DR-1001", category: "Dairy", stock: 42, reorderPoint: 12 },
  { id: "p2", name: "Free-range eggs, 12 pack", sku: "DR-1014", category: "Dairy", stock: 4, reorderPoint: 10 },
  { id: "p3", name: "Sourdough loaf", sku: "BK-2007", category: "Bakery", stock: 9, reorderPoint: 8 },
  { id: "p4", name: "Croissant, butter", sku: "BK-2011", category: "Bakery", stock: 3, reorderPoint: 10 },
  { id: "p5", name: "Gala apples, 1 kg", sku: "PR-3002", category: "Produce", stock: 27, reorderPoint: 15 },
  { id: "p6", name: "Baby spinach, 200 g", sku: "PR-3019", category: "Produce", stock: 6, reorderPoint: 12 },
  { id: "p7", name: "Dark roast coffee beans, 500 g", sku: "PA-4005", category: "Pantry", stock: 18, reorderPoint: 6 },
  { id: "p8", name: "Basmati rice, 2 kg", sku: "PA-4042", category: "Pantry", stock: 2, reorderPoint: 5 },
  { id: "p9", name: "Sparkling water, 6 pack", sku: "BV-5033", category: "Beverages", stock: 30, reorderPoint: 10 },
  { id: "p10", name: "Cold brew concentrate", sku: "BV-5040", category: "Beverages", stock: 7, reorderPoint: 8 },
]

const CATEGORIES = ["All", "Bakery", "Beverages", "Dairy", "Pantry", "Produce"]

export default function InventoryScreen() {
  const [category, setCategory] = useState("All")

  const visible = useMemo(
    () => (category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category]
  )

  const lowCount = PRODUCTS.filter((p) => p.stock <= p.reorderPoint).length

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <Badge variant="warning">
            <TriangleAlert />
            Example data
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Fernhill Market stock levels by product.</p>
      </header>

      {lowCount > 0 && (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>
            {lowCount} {lowCount === 1 ? "item is" : "items are"} at or below reorder point
          </AlertTitle>
          <AlertDescription>
            Check the rows marked Low stock and reorder before the next delivery.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {visible.length} of {PRODUCTS.length} products shown
          </CardDescription>
          <div className="flex flex-col gap-1 pt-2">
            <label htmlFor="category-filter" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category-filter" className="w-full sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "All" ? "All categories" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
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
              {visible.map((p) => {
                const low = p.stock <= p.reorderPoint
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.sku}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.stock}</TableCell>
                    <TableCell className="text-right tabular-nums">{p.reorderPoint}</TableCell>
                    <TableCell>
                      {low ? (
                        <Badge variant="warning">
                          <TriangleAlert />
                          Low stock
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
    </main>
  )
}
