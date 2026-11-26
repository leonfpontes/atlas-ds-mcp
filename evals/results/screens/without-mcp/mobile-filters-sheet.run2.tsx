import { useMemo, useState } from "react"
import { SlidersHorizontal, X, PackageX } from "lucide-react"
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
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type Category = "Produce" | "Bakery" | "Dairy" | "Pantry" | "Beverages"

type Product = {
  id: string
  name: string
  category: Category
  price: number
  inStock: boolean
  emoji: string
}

type Filters = {
  categories: Category[]
  priceRange: [number, number]
  inStockOnly: boolean
}

const PRICE_MIN = 0
const PRICE_MAX = 50

const CATEGORIES: Category[] = ["Produce", "Bakery", "Dairy", "Pantry", "Beverages"]

const DEFAULT_FILTERS: Filters = {
  categories: [],
  priceRange: [PRICE_MIN, PRICE_MAX],
  inStockOnly: false,
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Organic Gala Apples", category: "Produce", price: 4.5, inStock: true, emoji: "🍎" },
  { id: "p2", name: "Baby Spinach 200g", category: "Produce", price: 3.25, inStock: true, emoji: "🥬" },
  { id: "p3", name: "Sourdough Loaf", category: "Bakery", price: 6.0, inStock: true, emoji: "🍞" },
  { id: "p4", name: "Cinnamon Rolls (4)", category: "Bakery", price: 7.75, inStock: false, emoji: "🥐" },
  { id: "p5", name: "Whole Milk 2L", category: "Dairy", price: 2.9, inStock: true, emoji: "🥛" },
  { id: "p6", name: "Aged Cheddar 250g", category: "Dairy", price: 5.4, inStock: true, emoji: "🧀" },
  { id: "p7", name: "Greek Yogurt 500g", category: "Dairy", price: 4.2, inStock: false, emoji: "🫙" },
  { id: "p8", name: "Extra Virgin Olive Oil", category: "Pantry", price: 14.9, inStock: true, emoji: "🫒" },
  { id: "p9", name: "Wildflower Honey", category: "Pantry", price: 11.5, inStock: true, emoji: "🍯" },
  { id: "p10", name: "Basmati Rice 2kg", category: "Pantry", price: 9.8, inStock: true, emoji: "🍚" },
  { id: "p11", name: "Cold Brew Coffee", category: "Beverages", price: 3.6, inStock: true, emoji: "☕" },
  { id: "p12", name: "Sparkling Lemon Water", category: "Beverages", price: 1.9, inStock: false, emoji: "🍋" },
]

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

function countActiveFilters(filters: Filters): number {
  let count = filters.categories.length
  if (filters.priceRange[0] !== PRICE_MIN || filters.priceRange[1] !== PRICE_MAX) count += 1
  if (filters.inStockOnly) count += 1
  return count
}

function applyFilters(products: Product[], filters: Filters): Product[] {
  const [min, max] = filters.priceRange
  return products.filter((p) => {
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
    if (p.price < min || p.price > max) return false
    if (filters.inStockOnly && !p.inStock) return false
    return true
  })
}

export default function ProductListScreen() {
  const [appliedFilters, setAppliedFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const visibleProducts = useMemo(
    () => applyFilters(PRODUCTS, appliedFilters),
    [appliedFilters]
  )

  const activeCount = countActiveFilters(appliedFilters)
  const draftCount = countActiveFilters(draftFilters)

  const openFilters = () => {
    setDraftFilters(appliedFilters)
    setIsFilterOpen(true)
  }

  const toggleCategory = (category: Category, checked: boolean) => {
    setDraftFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, category]
        : prev.categories.filter((c) => c !== category),
    }))
  }

  const handlePriceChange = (values: number[]) => {
    if (values.length !== 2) return
    setDraftFilters((prev) => ({
      ...prev,
      priceRange: [values[0], values[1]],
    }))
  }

  const handleApply = () => {
    const count = applyFilters(PRODUCTS, draftFilters).length
    setAppliedFilters(draftFilters)
    setIsFilterOpen(false)
    toast.success(count === 1 ? "Showing 1 product" : `Showing ${count} products`)
  }

  const handleResetDraft = () => {
    setDraftFilters(DEFAULT_FILTERS)
  }

  const handleClearAll = () => {
    setAppliedFilters(DEFAULT_FILTERS)
    setDraftFilters(DEFAULT_FILTERS)
    toast("Filters cleared")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">Fernhill Market</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={openFilters}
            aria-label={
              activeCount > 0
                ? `Open filters, ${activeCount} active`
                : "Open filters"
            }
            className="gap-2"
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filters
            {activeCount > 0 && (
              <Badge variant="default" className="ml-1 px-1.5">
                {activeCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {visibleProducts.length}{" "}
            {visibleProducts.length === 1 ? "product" : "products"}
          </p>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 gap-1 px-2 text-muted-foreground"
            >
              <X className="size-3.5" aria-hidden="true" />
              Clear all
            </Button>
          )}
        </div>

        {appliedFilters.categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {appliedFilters.categories.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1">
                {category}
              </Badge>
            ))}
          </div>
        )}

        {visibleProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <PackageX className="size-10 text-muted-foreground" aria-hidden="true" />
            <p className="font-medium">No products match these filters</p>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Clear filters
            </Button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visibleProducts.map((product) => (
              <li
                key={product.id}
                className="flex flex-col rounded-lg border bg-card p-3 text-card-foreground"
              >
                <div
                  className="flex aspect-square items-center justify-center rounded-md bg-muted text-4xl"
                  aria-hidden="true"
                >
                  {product.emoji}
                </div>
                <div className="mt-3 flex flex-1 flex-col gap-1">
                  <p className="text-sm font-medium leading-snug">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold">{currency.format(product.price)}</span>
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

      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="border-b p-4 text-left">
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Narrow down products by category, price, and availability.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            <section className="space-y-3" aria-labelledby="filter-category-heading">
              <h2 id="filter-category-heading" className="text-sm font-semibold">
                Category
              </h2>
              <div className="space-y-3">
                {CATEGORIES.map((category) => {
                  const id = `filter-category-${category.toLowerCase()}`
                  const checked = draftFilters.categories.includes(category)
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={(value) => toggleCategory(category, value === true)}
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

            <section className="space-y-4" aria-labelledby="filter-price-heading">
              <div className="flex items-center justify-between">
                <h2 id="filter-price-heading" className="text-sm font-semibold">
                  Price range
                </h2>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {currency.format(draftFilters.priceRange[0])} –{" "}
                  {currency.format(draftFilters.priceRange[1])}
                </span>
              </div>
              <Slider
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={1}
                value={draftFilters.priceRange}
                onValueChange={handlePriceChange}
                aria-label="Price range"
              />
            </section>

            <Separator />

            <section className="flex items-center justify-between gap-4">
              <Label htmlFor="filter-in-stock" className="flex flex-col items-start gap-1">
                <span className="text-sm font-semibold">In stock only</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Hide sold out products
                </span>
              </Label>
              <Switch
                id="filter-in-stock"
                checked={draftFilters.inStockOnly}
                onCheckedChange={(checked) =>
                  setDraftFilters((prev) => ({ ...prev, inStockOnly: checked }))
                }
              />
            </section>
          </div>

          <SheetFooter className="flex-row gap-2 border-t p-4">
            <Button
              variant="outline"
              onClick={handleResetDraft}
              disabled={draftCount === 0}
              className="flex-1"
            >
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
