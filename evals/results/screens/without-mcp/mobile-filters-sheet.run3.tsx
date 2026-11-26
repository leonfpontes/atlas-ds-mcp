import { useMemo, useState } from "react"
import { PackageSearch, SlidersHorizontal, X } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type Product = {
  id: string
  name: string
  category: string
  price: number
  inStock: boolean
  tint: string
}

type Filters = {
  categories: string[]
  priceRange: [number, number]
  inStockOnly: boolean
}

const PRICE_MIN = 0
const PRICE_MAX = 200
const PRICE_STEP = 5

const PRODUCTS: Product[] = [
  { id: "p1", name: "Stone-ground oats", category: "Pantry", price: 6.5, inStock: true, tint: "bg-amber-100 text-amber-800" },
  { id: "p2", name: "Wildflower honey", category: "Pantry", price: 14, inStock: true, tint: "bg-yellow-100 text-yellow-800" },
  { id: "p3", name: "Heirloom tomatoes", category: "Produce", price: 4.25, inStock: true, tint: "bg-red-100 text-red-800" },
  { id: "p4", name: "Baby spinach", category: "Produce", price: 3.9, inStock: false, tint: "bg-green-100 text-green-800" },
  { id: "p5", name: "Sourdough loaf", category: "Bakery", price: 7, inStock: true, tint: "bg-orange-100 text-orange-800" },
  { id: "p6", name: "Cardamom buns", category: "Bakery", price: 9.5, inStock: false, tint: "bg-stone-200 text-stone-800" },
  { id: "p7", name: "Cold brew concentrate", category: "Beverages", price: 18, inStock: true, tint: "bg-zinc-200 text-zinc-800" },
  { id: "p8", name: "Sparkling yuzu water", category: "Beverages", price: 2.75, inStock: true, tint: "bg-sky-100 text-sky-800" },
  { id: "p9", name: "Bamboo dish brush", category: "Household", price: 5.99, inStock: true, tint: "bg-lime-100 text-lime-800" },
  { id: "p10", name: "Beeswax food wraps", category: "Household", price: 22, inStock: false, tint: "bg-violet-100 text-violet-800" },
  { id: "p11", name: "Single-origin olive oil", category: "Pantry", price: 38, inStock: true, tint: "bg-emerald-100 text-emerald-800" },
  { id: "p12", name: "Kale bunch", category: "Produce", price: 2.5, inStock: true, tint: "bg-teal-100 text-teal-800" },
]

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()

const DEFAULT_FILTERS: Filters = {
  categories: [],
  priceRange: [PRICE_MIN, PRICE_MAX],
  inStockOnly: false,
}

function filterProducts(products: Product[], filters: Filters): Product[] {
  return products.filter((p) => {
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false
    if (filters.inStockOnly && !p.inStock) return false
    return true
  })
}

function countActiveGroups(filters: Filters): number {
  let count = 0
  if (filters.categories.length > 0) count++
  if (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX) count++
  if (filters.inStockOnly) count++
  return count
}

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`
}

export default function ProductListScreen() {
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [open, setOpen] = useState(false)

  const visibleProducts = useMemo(
    () => filterProducts(PRODUCTS, appliedFilters),
    [appliedFilters]
  )

  const draftResultCount = useMemo(
    () => filterProducts(PRODUCTS, draftFilters).length,
    [draftFilters]
  )

  const activeCount = countActiveGroups(appliedFilters)

  function handleOpenChange(next: boolean) {
    if (next) setDraftFilters(appliedFilters)
    setOpen(next)
  }

  function toggleCategory(category: string, checked: boolean) {
    setDraftFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
    }))
  }

  function applyFilters() {
    setAppliedFilters(draftFilters)
    setOpen(false)
    toast.success(
      draftResultCount === 1
        ? "Showing 1 product"
        : `Showing ${draftResultCount} products`
    )
  }

  function clearAllFilters() {
    setAppliedFilters(DEFAULT_FILTERS)
    setDraftFilters(DEFAULT_FILTERS)
    toast("Filters cleared")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">
            {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="relative shrink-0">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <Badge className="ml-1 h-5 min-w-5 justify-center px-1.5">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
            <SheetHeader className="border-b px-4 py-4">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Narrow down the products you see.</SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
              <section className="space-y-3">
                <h2 className="text-sm font-medium">Category</h2>
                <div className="space-y-3">
                  {CATEGORIES.map((category) => {
                    const id = `category-${category.toLowerCase()}`
                    return (
                      <div key={category} className="flex items-center gap-3">
                        <Checkbox
                          id={id}
                          checked={draftFilters.categories.includes(category)}
                          onCheckedChange={(checked) =>
                            toggleCategory(category, checked === true)
                          }
                        />
                        <Label htmlFor={id} className="font-normal">
                          {category}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </section>

              <Separator />

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium">Price range</h2>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {formatPrice(draftFilters.priceRange[0])} – {formatPrice(draftFilters.priceRange[1])}
                  </span>
                </div>
                <Slider
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={PRICE_STEP}
                  value={draftFilters.priceRange}
                  aria-label="Price range"
                  onValueChange={(value) =>
                    setDraftFilters((prev) => ({
                      ...prev,
                      priceRange: [value[0], value[1]] as [number, number],
                    }))
                  }
                />
              </section>

              <Separator />

              <section className="flex items-center justify-between gap-3">
                <Label htmlFor="in-stock-only" className="text-sm font-medium">
                  In stock only
                </Label>
                <Checkbox
                  id="in-stock-only"
                  checked={draftFilters.inStockOnly}
                  onCheckedChange={(checked) =>
                    setDraftFilters((prev) => ({ ...prev, inStockOnly: checked === true }))
                  }
                />
              </section>
            </div>

            <SheetFooter className="border-t bg-background px-4 py-4">
              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDraftFilters(DEFAULT_FILTERS)}
                >
                  Reset
                </Button>
                <Button className="flex-1" onClick={applyFilters}>
                  Show {draftResultCount} {draftResultCount === 1 ? "product" : "products"}
                </Button>
              </div>
              <SheetClose asChild>
                <span className="sr-only">Close filters</span>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </header>

      {activeCount > 0 && (
        <div className="flex items-center justify-between gap-2 border-b px-4 py-2">
          <p className="text-sm text-muted-foreground">
            {activeCount} {activeCount === 1 ? "filter" : "filters"} active
          </p>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="size-4" aria-hidden="true" />
            Clear all
          </Button>
        </div>
      )}

      <main className="flex-1 p-4">
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <PackageSearch className="size-10 text-muted-foreground" aria-hidden="true" />
            <div className="space-y-1">
              <p className="font-medium">No products match these filters</p>
              <p className="text-sm text-muted-foreground">Try widening the price range or clearing a category.</p>
            </div>
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {visibleProducts.map((product) => (
              <li key={product.id} className="flex flex-col overflow-hidden rounded-xl border bg-card">
                <div
                  className={`flex aspect-square items-center justify-center text-3xl font-semibold ${product.tint}`}
                  aria-hidden="true"
                >
                  {product.name.charAt(0)}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <p className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <span className="text-sm font-semibold tabular-nums">{formatPrice(product.price)}</span>
                    {!product.inStock && (
                      <Badge variant="secondary" className="text-[10px]">
                        Out of stock
                      </Badge>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
