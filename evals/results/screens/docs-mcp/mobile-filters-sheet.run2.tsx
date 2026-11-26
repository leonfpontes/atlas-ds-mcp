import { useMemo, useState } from "react"
import { CircleCheck, CircleX, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  inStock: boolean
}

type Filters = {
  category: string
  minPrice: string
  maxPrice: string
  inStockOnly: boolean
}

const ALL_CATEGORIES = "all"

const CATEGORIES = ["Produce", "Bakery", "Pantry", "Dairy", "Beverages"]

const EMPTY_FILTERS: Filters = {
  category: ALL_CATEGORIES,
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
}

const PRODUCTS: Product[] = [
  { id: "p-1", name: "Honeycrisp apples, 1 kg", category: "Produce", price: 4.5, inStock: true },
  { id: "p-2", name: "Sourdough loaf", category: "Bakery", price: 6.0, inStock: true },
  { id: "p-3", name: "Stone-ground oat flour", category: "Pantry", price: 3.25, inStock: false },
  { id: "p-4", name: "Whole milk, 1 L", category: "Dairy", price: 1.8, inStock: true },
  { id: "p-5", name: "Cold-pressed orange juice", category: "Beverages", price: 5.4, inStock: true },
  { id: "p-6", name: "Baby spinach, 200 g", category: "Produce", price: 2.9, inStock: false },
  { id: "p-7", name: "Cultured butter, 250 g", category: "Dairy", price: 4.95, inStock: true },
  { id: "p-8", name: "Almond croissant", category: "Bakery", price: 3.6, inStock: true },
  { id: "p-9", name: "Wildflower honey, 340 g", category: "Pantry", price: 8.75, inStock: true },
  { id: "p-10", name: "Sparkling mineral water, 6 pack", category: "Beverages", price: 3.9, inStock: false },
]

function filterProducts(products: Product[], filters: Filters): Product[] {
  return products.filter((product) => {
    if (filters.category !== ALL_CATEGORIES && product.category !== filters.category) {
      return false
    }
    if (filters.minPrice !== "" && product.price < Number(filters.minPrice)) {
      return false
    }
    if (filters.maxPrice !== "" && product.price > Number(filters.maxPrice)) {
      return false
    }
    if (filters.inStockOnly && !product.inStock) {
      return false
    }
    return true
  })
}

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`
}

export default function ProductListScreen() {
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS)
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS)
  const [open, setOpen] = useState(false)

  const visibleProducts = useMemo(
    () => filterProducts(PRODUCTS, applied),
    [applied],
  )

  const activeCount = [
    applied.category !== ALL_CATEGORIES,
    applied.minPrice !== "",
    applied.maxPrice !== "",
    applied.inStockOnly,
  ].filter(Boolean).length

  const priceError =
    draft.minPrice !== "" &&
    draft.maxPrice !== "" &&
    Number(draft.minPrice) > Number(draft.maxPrice)
      ? "Minimum price must be lower than maximum price."
      : null

  function handleOpenChange(next: boolean) {
    if (next) {
      setDraft(applied)
    }
    setOpen(next)
  }

  function handleApply() {
    if (priceError) return
    const count = filterProducts(PRODUCTS, draft).length
    setApplied(draft)
    setOpen(false)
    toast.success(
      count === 1 ? "Showing 1 product" : `Showing ${count} products`,
    )
  }

  function handleReset() {
    setDraft(EMPTY_FILTERS)
  }

  function handleClearAll() {
    setApplied(EMPTY_FILTERS)
    setDraft(EMPTY_FILTERS)
    toast.success("Filters cleared")
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-background p-4 text-foreground">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">
            {visibleProducts.length === 1
              ? "1 product"
              : `${visibleProducts.length} products`}
          </p>
        </div>

        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal />
              Filters
              {activeCount > 0 && (
                <Badge variant="info" aria-label={`${activeCount} filters active`}>
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-full flex-col gap-0 p-0 sm:max-w-sm"
          >
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
                    setDraft((prev) => ({ ...prev, category: value }))
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
                <legend className="text-sm font-medium">Price range</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="filter-min-price" className="text-sm text-muted-foreground">
                      Min price
                    </label>
                    <Input
                      id="filter-min-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={draft.minPrice}
                      aria-invalid={priceError !== null}
                      aria-describedby={priceError ? "filter-price-error" : undefined}
                      onChange={(event) =>
                        setDraft((prev) => ({ ...prev, minPrice: event.target.value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="filter-max-price" className="text-sm text-muted-foreground">
                      Max price
                    </label>
                    <Input
                      id="filter-max-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      placeholder="Any"
                      value={draft.maxPrice}
                      aria-invalid={priceError !== null}
                      aria-describedby={priceError ? "filter-price-error" : undefined}
                      onChange={(event) =>
                        setDraft((prev) => ({ ...prev, maxPrice: event.target.value }))
                      }
                    />
                  </div>
                </div>
                {priceError && (
                  <p id="filter-price-error" className="text-sm text-destructive">
                    {priceError}
                  </p>
                )}
              </fieldset>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Availability</span>
                <Button
                  type="button"
                  variant="outline"
                  aria-pressed={draft.inStockOnly}
                  className={
                    draft.inStockOnly
                      ? "justify-start border-primary text-primary"
                      : "justify-start"
                  }
                  onClick={() =>
                    setDraft((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))
                  }
                >
                  {draft.inStockOnly ? <CircleCheck /> : <CircleX />}
                  In stock only
                </Button>
              </div>
            </div>

            <SheetFooter className="border-t border-border p-4">
              <Button variant="outline" onClick={handleReset}>
                Reset filters
              </Button>
              <Button onClick={handleApply} disabled={priceError !== null}>
                Show products
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </header>

      {visibleProducts.length > 0 ? (
        <ul className="divide-y divide-border rounded-md border border-border">
          {visibleProducts.map((product) => (
            <li key={product.id} className="flex items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-sm font-medium">{product.name}</span>
                <span className="text-sm text-muted-foreground">{product.category}</span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                {product.inStock ? (
                  <Badge variant="success">
                    <CircleCheck />
                    In stock
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <CircleX />
                    Out of stock
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-md border border-border p-4">
          <p className="text-sm text-muted-foreground">
            No products match these filters. Try a wider price range or clear the filters.
          </p>
          <Button variant="outline" onClick={handleClearAll}>
            Clear filters
          </Button>
        </div>
      )}

      <Toaster position="bottom-center" />
    </main>
  )
}
