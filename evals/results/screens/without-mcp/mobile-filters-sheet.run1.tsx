import { useMemo, useState } from "react"
import { PackageOpen, SlidersHorizontal, X } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type Product = {
  id: string
  name: string
  category: string
  price: number
  inStock: boolean
}

type Filters = {
  categories: string[]
  priceRange: [number, number]
  inStockOnly: boolean
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Wildflower Honey, 12 oz", category: "Pantry", price: 9.5, inStock: true },
  { id: "p2", name: "Stoneground Oat Flour", category: "Pantry", price: 6.25, inStock: true },
  { id: "p3", name: "Heirloom Tomato Seeds", category: "Garden", price: 4.0, inStock: false },
  { id: "p4", name: "Cedar Raised Bed Kit", category: "Garden", price: 74.0, inStock: true },
  { id: "p5", name: "Organic Cold Brew Blend", category: "Beverages", price: 15.75, inStock: true },
  { id: "p6", name: "Sparkling Elderflower Soda", category: "Beverages", price: 3.5, inStock: false },
  { id: "p7", name: "Merino Wool Throw", category: "Home", price: 58.0, inStock: true },
  { id: "p8", name: "Beeswax Taper Candles", category: "Home", price: 22.0, inStock: true },
]

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category)))
const PRICE_MIN = 0
const PRICE_MAX = 80

const DEFAULT_FILTERS: Filters = {
  categories: [],
  priceRange: [PRICE_MIN, PRICE_MAX],
  inStockOnly: false,
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function filterProducts(filters: Filters): Product[] {
  const [min, max] = filters.priceRange
  return PRODUCTS.filter(
    (p) =>
      (filters.categories.length === 0 || filters.categories.includes(p.category)) &&
      p.price >= min &&
      p.price <= max &&
      (!filters.inStockOnly || p.inStock)
  )
}

function countActiveFilters(filters: Filters): number {
  const priceChanged =
    filters.priceRange[0] !== PRICE_MIN || filters.priceRange[1] !== PRICE_MAX
  return (
    (filters.categories.length > 0 ? 1 : 0) +
    (priceChanged ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)
  )
}

export default function ProductListScreen() {
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS)
  const [draft, setDraft] = useState<Filters>(DEFAULT_FILTERS)
  const [open, setOpen] = useState(false)

  const visibleProducts = useMemo(() => filterProducts(applied), [applied])
  const activeCount = countActiveFilters(applied)
  const draftResultCount = filterProducts(draft).length

  function openPanel() {
    setDraft(applied)
    setOpen(true)
  }

  function handleOpenChange(next: boolean) {
    // Closing without applying discards draft changes.
    if (!next) setOpen(false)
    else setOpen(true)
  }

  function toggleCategory(category: string, checked: boolean) {
    setDraft((d) => ({
      ...d,
      categories: checked
        ? [...d.categories, category]
        : d.categories.filter((c) => c !== category),
    }))
  }

  function applyFilters() {
    const count = filterProducts(draft).length
    setApplied(draft)
    setOpen(false)
    toast.success(`Showing ${count} ${count === 1 ? "product" : "products"}`)
  }

  function clearAll() {
    setApplied(DEFAULT_FILTERS)
    setDraft(DEFAULT_FILTERS)
    toast("Filters cleared")
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
        <div>
          <h1 className="text-lg font-semibold">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">
            {visibleProducts.length} of {PRODUCTS.length} products
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={openPanel} className="relative">
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 && (
            <Badge className="ml-1 h-5 min-w-5 justify-center rounded-full px-1.5">
              {activeCount}
            </Badge>
          )}
        </Button>
      </header>

      {activeCount > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto px-4 pt-3">
          {applied.categories.map((category) => (
            <Badge key={category} variant="secondary" className="shrink-0 gap-1">
              {category}
            </Badge>
          ))}
          {(applied.priceRange[0] !== PRICE_MIN || applied.priceRange[1] !== PRICE_MAX) && (
            <Badge variant="secondary" className="shrink-0">
              {currency.format(applied.priceRange[0])} – {currency.format(applied.priceRange[1])}
            </Badge>
          )}
          {applied.inStockOnly && (
            <Badge variant="secondary" className="shrink-0">
              In stock
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearAll} className="shrink-0">
            <X className="size-4" />
            Clear
          </Button>
        </div>
      )}

      <main className="flex-1 p-4">
        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <PackageOpen className="size-10 text-muted-foreground" />
            <p className="font-medium">No products match these filters</p>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear filters
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3">
            {visibleProducts.map((product) => (
              <li
                key={product.id}
                className="flex flex-col gap-2 rounded-xl border bg-card p-3 text-card-foreground"
              >
                <div className="flex aspect-square items-center justify-center rounded-lg bg-muted">
                  <PackageOpen className="size-8 text-muted-foreground" />
                </div>
                <p className="line-clamp-2 text-sm font-medium">{product.name}</p>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{currency.format(product.price)}</span>
                  {product.inStock ? (
                    <Badge variant="outline">In stock</Badge>
                  ) : (
                    <Badge variant="secondary">Sold out</Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="border-b p-4">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow down the products you see.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            <section className="space-y-3">
              <h2 className="text-sm font-medium">Category</h2>
              <div className="space-y-3">
                {CATEGORIES.map((category) => {
                  const id = `category-${category.toLowerCase()}`
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <Checkbox
                        id={id}
                        checked={draft.categories.includes(category)}
                        onCheckedChange={(checked) => toggleCategory(category, checked === true)}
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
                <span className="text-sm text-muted-foreground">
                  {currency.format(draft.priceRange[0])} – {currency.format(draft.priceRange[1])}
                </span>
              </div>
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={1}
                value={draft.priceRange}
                aria-label="Price range"
                onValueChange={(values) =>
                  setDraft((d) => ({
                    ...d,
                    priceRange: [values[0] ?? PRICE_MIN, values[1] ?? PRICE_MAX],
                  }))
                }
              />
            </section>

            <Separator />

            <section className="flex items-center justify-between gap-4">
              <Label htmlFor="in-stock-only" className="font-medium">
                In stock only
              </Label>
              <Switch
                id="in-stock-only"
                checked={draft.inStockOnly}
                onCheckedChange={(checked) =>
                  setDraft((d) => ({ ...d, inStockOnly: checked }))
                }
              />
            </section>
          </div>

          <SheetFooter className="flex-row gap-2 border-t p-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setDraft(DEFAULT_FILTERS)}
            >
              Reset
            </Button>
            <Button className="flex-1" onClick={applyFilters}>
              Show {draftResultCount} {draftResultCount === 1 ? "product" : "products"}
            </Button>
          </SheetFooter>

          <SheetClose className="sr-only">Close</SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  )
}
