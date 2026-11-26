import { useState } from "react"
import { CircleCheck, CircleX, PackageSearch, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Toaster } from "@/components/ui/sonner"

type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
}

type Filters = {
  category: string
  minPrice: string
  maxPrice: string
  inStockOnly: boolean
}

const ALL_CATEGORIES = "all"

const EMPTY_FILTERS: Filters = {
  category: ALL_CATEGORIES,
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Cast-iron skillet, 26 cm", category: "Kitchen", price: 42, stock: 12 },
  { id: "p2", name: "Stoneware mixing bowl set", category: "Kitchen", price: 58, stock: 0 },
  { id: "p3", name: "Galvanized watering can", category: "Garden", price: 24, stock: 7 },
  { id: "p4", name: "Raised bed planter, oak", category: "Garden", price: 135, stock: 3 },
  { id: "p5", name: "Wildflower seed mix, 500 g", category: "Garden", price: 9, stock: 0 },
  { id: "p6", name: "Stone-ground wholemeal flour", category: "Pantry", price: 6, stock: 40 },
  { id: "p7", name: "Single-origin honey, 350 g", category: "Pantry", price: 14, stock: 18 },
  { id: "p8", name: "Linen table runner", category: "Home", price: 36, stock: 5 },
]

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function parsePrice(value: string): number | null {
  if (value.trim() === "") return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function getPriceError(filters: Filters): string | null {
  const min = parsePrice(filters.minPrice)
  const max = parsePrice(filters.maxPrice)
  if (min !== null && min < 0) return "Minimum price can't be negative."
  if (max !== null && max < 0) return "Maximum price can't be negative."
  if (min !== null && max !== null && min > max) {
    return "Minimum price is higher than maximum price."
  }
  return null
}

function filterProducts(products: Product[], filters: Filters): Product[] {
  const min = parsePrice(filters.minPrice)
  const max = parsePrice(filters.maxPrice)
  return products.filter(
    (p) =>
      (filters.category === ALL_CATEGORIES || p.category === filters.category) &&
      (min === null || p.price >= min) &&
      (max === null || p.price <= max) &&
      (!filters.inStockOnly || p.stock > 0)
  )
}

function countActiveFilters(filters: Filters): number {
  let count = 0
  if (filters.category !== ALL_CATEGORIES) count++
  if (filters.minPrice.trim() !== "" || filters.maxPrice.trim() !== "") count++
  if (filters.inStockOnly) count++
  return count
}

export default function ProductListScreen() {
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS)
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS)

  const visibleProducts = filterProducts(PRODUCTS, applied)
  const activeCount = countActiveFilters(applied)
  const draftCount = filterProducts(PRODUCTS, draft).length
  const priceError = getPriceError(draft)

  function handleOpenChange(next: boolean) {
    if (next) setDraft(applied)
    setOpen(next)
  }

  function handleApply() {
    if (priceError) return
    setApplied(draft)
    setOpen(false)
    const count = filterProducts(PRODUCTS, draft).length
    toast.success(
      count === 1 ? "Showing 1 product" : `Showing ${count} products`
    )
  }

  function handleReset() {
    setDraft(EMPTY_FILTERS)
  }

  function handleClearApplied() {
    setApplied(EMPTY_FILTERS)
    setDraft(EMPTY_FILTERS)
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-4 bg-background p-4 text-foreground">
      <header className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {visibleProducts.length === 1
              ? "1 product"
              : `${visibleProducts.length} products`}
          </p>
        </div>

        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <Badge variant="info" aria-label={`${activeCount} filters active`}>
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle>Filter products</SheetTitle>
              <SheetDescription>
                Choose what to show, then apply the filters.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="filter-category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={draft.category}
                  onValueChange={(value) =>
                    setDraft((d) => ({ ...d, category: value }))
                  }
                >
                  <SelectTrigger id="filter-category" className="min-h-11 w-full">
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
                <legend className="mb-2 text-sm font-medium">Price range (USD)</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="filter-min-price" className="text-sm text-muted-foreground">
                      Minimum
                    </label>
                    <Input
                      id="filter-min-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      placeholder="0"
                      className="min-h-11"
                      value={draft.minPrice}
                      aria-invalid={priceError !== null}
                      aria-describedby={priceError ? "filter-price-error" : undefined}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, minPrice: e.target.value }))
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
                      min={0}
                      placeholder="No limit"
                      className="min-h-11"
                      value={draft.maxPrice}
                      aria-invalid={priceError !== null}
                      aria-describedby={priceError ? "filter-price-error" : undefined}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, maxPrice: e.target.value }))
                      }
                    />
                  </div>
                </div>
                {priceError && (
                  <p id="filter-price-error" role="alert" className="text-sm text-destructive">
                    {priceError}
                  </p>
                )}
              </fieldset>

              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <label
                  htmlFor="filter-in-stock"
                  className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium"
                >
                  <input
                    id="filter-in-stock"
                    type="checkbox"
                    className="size-5 accent-primary"
                    checked={draft.inStockOnly}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, inStockOnly: e.target.checked }))
                    }
                  />
                  In stock only
                </label>
              </div>
            </div>

            <SheetFooter className="flex-row gap-3 border-t border-border p-4">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                Reset filters
              </Button>
              <Button
                className="flex-1"
                onClick={handleApply}
                disabled={priceError !== null}
              >
                {`Show ${draftCount} ${draftCount === 1 ? "product" : "products"}`}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </header>

      {visibleProducts.length === 0 ? (
        <Card className="items-center gap-3 p-8 text-center">
          <PackageSearch className="size-8 text-muted-foreground" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <h2 className="font-medium">No products match these filters</h2>
            <p className="text-sm text-muted-foreground">
              Widen the price range or clear the filters to see more products.
            </p>
          </div>
          <Button variant="outline" onClick={handleClearApplied}>
            Clear filters
          </Button>
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visibleProducts.map((product) => {
            const inStock = product.stock > 0
            return (
              <li key={product.id}>
                <Card className="h-full">
                  <CardContent className="flex flex-col gap-3 p-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{currency.format(product.price)}</span>
                      {inStock ? (
                        <Badge variant="success">
                          <CircleCheck aria-hidden="true" />
                          In stock ({product.stock})
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <CircleX aria-hidden="true" />
                          Out of stock
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <Toaster />
    </main>
  )
}
