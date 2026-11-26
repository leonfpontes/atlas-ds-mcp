import { useState } from "react"
import { CircleCheck, CircleX, SlidersHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  category: string
  price: number
  inStock: boolean
}

type Filters = {
  category: string
  minPrice: string
  maxPrice: string
  inStockOnly: boolean
}

const ALL_CATEGORIES = "all"

const CATEGORIES = ["Produce", "Bakery", "Dairy", "Pantry", "Household"]

const PRODUCTS: Product[] = [
  { id: "p1", name: "Honeycrisp apples, 1 kg", category: "Produce", price: 4.5, inStock: true },
  { id: "p2", name: "Sourdough loaf", category: "Bakery", price: 6.25, inStock: true },
  { id: "p3", name: "Whole milk, 2 L", category: "Dairy", price: 3.8, inStock: false },
  { id: "p4", name: "Rolled oats, 750 g", category: "Pantry", price: 2.9, inStock: true },
  { id: "p5", name: "Cheddar, aged 200 g", category: "Dairy", price: 5.4, inStock: true },
  { id: "p6", name: "Dish soap, lemon", category: "Household", price: 2.15, inStock: false },
  { id: "p7", name: "Baby spinach, 150 g", category: "Produce", price: 3.2, inStock: true },
  { id: "p8", name: "Cinnamon rolls, pack of 4", category: "Bakery", price: 7.9, inStock: true },
]

const DEFAULT_FILTERS: Filters = {
  category: ALL_CATEGORIES,
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
}

function filterProducts(products: Product[], filters: Filters): Product[] {
  const min = parseFloat(filters.minPrice)
  const max = parseFloat(filters.maxPrice)

  return products.filter((product) => {
    if (filters.category !== ALL_CATEGORIES && product.category !== filters.category) {
      return false
    }
    if (!Number.isNaN(min) && product.price < min) {
      return false
    }
    if (!Number.isNaN(max) && product.price > max) {
      return false
    }
    if (filters.inStockOnly && !product.inStock) {
      return false
    }
    return true
  })
}

function countActiveFilters(filters: Filters): number {
  let count = 0
  if (filters.category !== ALL_CATEGORIES) count++
  if (filters.minPrice !== "") count++
  if (filters.maxPrice !== "") count++
  if (filters.inStockOnly) count++
  return count
}

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`
}

export default function ProductListPage() {
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sheetOpen, setSheetOpen] = useState(false)

  const visibleProducts = filterProducts(PRODUCTS, appliedFilters)
  const draftCount = filterProducts(PRODUCTS, draftFilters).length
  const activeCount = countActiveFilters(appliedFilters)

  function handleSheetOpenChange(next: boolean) {
    if (next) {
      setDraftFilters(appliedFilters)
    }
    setSheetOpen(next)
  }

  function applyFilters() {
    setAppliedFilters(draftFilters)
    setSheetOpen(false)
  }

  function resetFilters() {
    setDraftFilters(DEFAULT_FILTERS)
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 bg-background p-4 text-foreground">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">Products</p>
        </div>

        <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal />
              Filters
              {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle>Filter products</SheetTitle>
              <SheetDescription>Choose what to show in the list.</SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="filter-category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={draftFilters.category}
                  onValueChange={(value) =>
                    setDraftFilters((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger id="filter-category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_CATEGORIES}>All categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className="text-sm font-medium">Price range (USD)</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="filter-min-price" className="text-sm text-muted-foreground">
                      Minimum
                    </label>
                    <Input
                      id="filter-min-price"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={draftFilters.minPrice}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({ ...prev, minPrice: event.target.value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="filter-max-price" className="text-sm text-muted-foreground">
                      Maximum
                    </label>
                    <Input
                      id="filter-max-price"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      placeholder="10.00"
                      value={draftFilters.maxPrice}
                      onChange={(event) =>
                        setDraftFilters((prev) => ({ ...prev, maxPrice: event.target.value }))
                      }
                    />
                  </div>
                </div>
              </fieldset>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Availability</span>
                <Button
                  variant={draftFilters.inStockOnly ? "secondary" : "outline"}
                  aria-pressed={draftFilters.inStockOnly}
                  className="w-full justify-start"
                  onClick={() =>
                    setDraftFilters((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))
                  }
                >
                  {draftFilters.inStockOnly ? <CircleCheck /> : null}
                  In stock only
                </Button>
              </div>
            </div>

            <SheetFooter className="flex-row gap-3 border-t border-border p-4">
              <Button variant="outline" className="flex-1" onClick={resetFilters}>
                Reset filters
              </Button>
              <Button className="flex-1" onClick={applyFilters}>
                Show {draftCount} {draftCount === 1 ? "product" : "products"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All products</CardTitle>
          <CardDescription>
            Showing {visibleProducts.length} of {PRODUCTS.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                    No products match these filters.
                  </TableCell>
                </TableRow>
              ) : (
                visibleProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <Badge variant="success">
                          <CircleCheck />
                          In stock
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <CircleX />
                          Out of stock
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
