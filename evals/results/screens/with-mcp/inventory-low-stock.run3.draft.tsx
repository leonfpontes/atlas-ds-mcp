import { useMemo, useState } from "react"
import { CircleCheck, TriangleAlert } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table"

type Product = {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  reorderPoint: number
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Oat milk, 1 L", sku: "DRY-1001", category: "Dairy & chilled", stock: 42, reorderPoint: 20 },
  { id: "p2", name: "Sourdough loaf", sku: "BAK-2003", category: "Bakery", stock: 6, reorderPoint: 10 },
  { id: "p3", name: "Free-range eggs, 12", sku: "DRY-1184", category: "Dairy & chilled", stock: 9, reorderPoint: 15 },
  { id: "p4", name: "Olive oil, extra virgin 500 ml", sku: "PAN-3310", category: "Pantry", stock: 28, reorderPoint: 12 },
  { id: "p5", name: "Bananas, per kg", sku: "PRD-4022", category: "Produce", stock: 4, reorderPoint: 12 },
  { id: "p6", name: "Basmati rice, 2 kg", sku: "PAN-3377", category: "Pantry", stock: 17, reorderPoint: 8 },
  { id: "p7", name: "Cheddar, mature 250 g", sku: "DRY-1229", category: "Dairy & chilled", stock: 11, reorderPoint: 10 },
  { id: "p8", name: "Baby spinach, 200 g", sku: "PRD-4051", category: "Produce", stock: 14, reorderPoint: 10 },
  { id: "p9", name: "Croissant, butter", sku: "BAK-2011", category: "Bakery", stock: 24, reorderPoint: 12 },
  { id: "p10", name: "Dish soap, lemon 750 ml", sku: "HOU-5102", category: "Household", stock: 3, reorderPoint: 6 },
]

const CATEGORIES: string[] = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()

const ALL = "all"

export default function InventoryScreen() {
  const [category, setCategory] = useState<string>(ALL)

  const visible = useMemo(
    () => PRODUCTS.filter((p) => category === ALL || p.category === category),
    [category]
  )

  const lowStock = useMemo(() => PRODUCTS.filter((p) => p.stock < p.reorderPoint), [])

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">Fernhill Market stock levels across all categories.</p>
      </header>

      {lowStock.length > 0 && (
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>
            {lowStock.length} {lowStock.length === 1 ? "item is" : "items are"} below reorder point
          </AlertTitle>
          <AlertDescription>
            Reorder these before the next delivery window. Items marked Low stock are listed in the table.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Showing {visible.length} of {PRODUCTS.length} products.</CardDescription>
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
                <SelectItem value={ALL}>All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableCaption>Stock levels for each product. Low stock means stock is below the reorder point.</TableCaption>
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
                const low = p.stock < p.reorderPoint
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
