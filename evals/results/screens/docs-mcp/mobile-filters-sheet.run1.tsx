import { useMemo, useState } from "react"
import { PackageCheck, PackageX, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
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

const CATEGORIES = ["Produce", "Dairy", "Bakery", "Pantry", "Beverages"]

const PRODUCTS: Product[] = [
  { id: "p-1", name: "Honeycrisp apples, 1 kg", category: "Produce", price: 4.5, inStock: true },
  { id: "p-2", name: "Organic baby spinach", category: "Produce", price: 3.2, inStock: false },
  { id: "p-3", name: "Whole milk, 2 L", category: "Dairy", price: 2.8, inStock: true },
  { id: "p-4", name: "Aged cheddar, 400 g", category: "Dairy", price: 6.9, inStock: true },
  { id: "p-5", name: "Sourdough loaf", category: "Bakery", price: 5.25, inStock: true },
  { id: "p-6", name: "Cinnamon rolls, pack of 4", category: "Bakery", price: 7.4, inStock: false },
  { id: "p-7", name: "Basmati rice, 5 kg", category: "Pantry", price: 12.0, inStock: true },
  { id: "p-8", name: "Cold-pressed olive oil", category: "Pantry", price: 15.5, inStock: true },
  { id: "p-9", name: "Sparkling water, 12 pack", category: "Beverages", price: 8.9, inStock: true },
  { id: "p-10", name: "Cold brew coffee, 1 L", category: "Beverages", price: 9.75, inStock: false },
]

const DEFAULT_FILTERS: Filters = {
  category: ALL_CATEGORIES,
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
}

function parsePrice(value: string): { ok: boolean; value: number | null } {
  if (value.trim() === "") return { ok: true, value: null }
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? { ok: true, value: n } : { ok: false, value: null }
}

function getPriceError(filters: Filters): string | null {
  const min = parsePrice(filters.minPrice)
  const max = parsePrice(filters.maxPrice)
  if (!min.ok || !max.ok) return "Enter prices of 0 or more."
  if (min.value !== null && max.value !== null && min.value > max.value) {
    return "The minimum price is higher than the maximum."
  }
  return null
}

function matchFilters(items: Product[], filters: Filters): Product[] {
  const min = parsePrice(filters.minPrice).value
  const max = parsePrice(filters.maxPrice).value
  return items.filter(
    (p) =>
      (filters.category === ALL_CATEGORIES || p.category === filters.category) &&
      (min === null || p.price >= min) &&
      (max === null || p.price <= max) &&
      (!filters.inStockOnly || p.inStock)
  )
}

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`
}

export default function ProductListScreen() {
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS)
  const [draft, setDraft] = useState<Filters>(DEFAULT_FILTERS)

  const visibleProducts = useMemo(() => matchFilters(PRODUCTS, applied), [applied])

  const activeCount = [
    applied.category !== ALL_CATEGORIES,
    applied.minPrice.trim() !== "",
    applied.maxPrice.trim() !== "",
    applied.inStockOnly,
  ].filter(Boolean).length

  const draftPriceError = getPriceError(draft)
  const draftCount = draftPriceError ? null : matchFilters(PRODUCTS, draft).length

  function updateDraft(patch: Partial<Filters>) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  function handleOpenChange(next: boolean) {
    if (next) setDraft(applied)
    setOpen(next)
  }

  function handleApply() {
    if (draftPriceError) return
    const count = matchFilters(PRODUCTS, draft).length
    setApplied(draft)
    setOpen(false)
    toast.success(`Showing ${count} ${count === 1 ? "product" : "products"}`)
  }

  function handleClearApplied() {
    setApplied(DEFAULT_FILTERS)
    setDraft(DEFAULT_FILTERS)
    toast.success("Filters cleared")
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-4 bg-background p-4 text-foreground">
      <header className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="text-xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {visibleProducts.length} of {PRODUCTS.length}
          </p>
        </div>

        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-center gap-2">
              <SlidersHorizontal aria-hidden="true" />
              Filters
              {activeCount > 0 && (
                <Badge variant="info" aria-label={`${activeCount} filters active`}>
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col gap-0 bg-popover text-popover-foreground">
            <SheetHeader>
              <SheetTitle>Filter products</SheetTitle>
              <SheetDescription>
                Narrow the list by category, price and availability.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="filter-category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={draft.category}
                  onValueChange={(value) => updateDraft({ category: value })}
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
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      value={draft.minPrice}
                      aria-invalid={draftPriceError ? true : undefined}
                      aria-describedby={draftPriceError ? "filter-price-error" : undefined}
                      onChange={(e) => updateDraft({ minPrice: e.target.value })}
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
                      step="0.01"
                      placeholder="No limit"
                      value={draft.maxPrice}
                      aria-invalid={draftPriceError ? true : undefined}
                      aria-describedby={draftPriceError ? "filter-price-error" : undefined}
                      onChange={(e) => updateDraft({ maxPrice: e.target.value })}
                    />
                  </div>
                </div>
                {draftPriceError && (
                  <p id="filter-price-error" className="text-sm text-destructive">
                    {draftPriceError}
                  </p>
                )}
              </fieldset>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Availability</span>
                <Button
                  type="button"
                  role="switch"
                  aria-checked={draft.inStockOnly}
                  variant={draft.inStockOnly ? "secondary" : "outline"}
                  className="w-full justify-between"
                  onClick={() => updateDraft({ inStockOnly: !draft.inStockOnly })}
                >
                  <span>In stock only</span>
                  <span className="text-muted-foreground">
                    {draft.inStockOnly ? "On" : "Off"}
                  </span>
                </Button>
              </div>
            </div>

            <SheetFooter className="gap-2 border-t border-border p-4 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                className="sm:flex-1"
                onClick={() => setDraft(DEFAULT_FILTERS)}
              >
                Reset
              </Button>
              <Button
                type="button"
                className="sm:flex-1"
                disabled={draftPriceError !== null}
                onClick={handleApply}
              >
                {draftCount === null
                  ? "Fix the price range"
                  : `Show ${draftCount} ${draftCount === 1 ? "product" : "products"}`}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {activeCount > 0 && (
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">
              {activeCount} {activeCount === 1 ? "filter" : "filters"} applied
            </span>
            <Button variant="link" className="h-auto p-0" onClick={handleClearApplied}>
              Clear filters
            </Button>
          </div>
        )}
      </header>

      {visibleProducts.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-md border border-border p-4">
          <p className="font-medium">No products match these filters.</p>
          <p className="text-sm text-muted-foreground">
            Try a wider price range or turn off “In stock only”.
          </p>
          <Button variant="outline" onClick={handleClearApplied}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {visibleProducts.map((product) => (
            <li key={product.id} className="flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-medium">{product.name}</span>
                <span className="text-sm text-muted-foreground">{product.category}</span>
                {product.inStock ? (
                  <Badge variant="success" className="w-fit">
                    <PackageCheck aria-hidden="true" />
                    In stock
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="w-fit">
                    <PackageX aria-hidden="true" />
                    Out of stock
                  </Badge>
                )}
              </div>
              <span className="shrink-0 font-medium tabular-nums">
                {formatPrice(product.price)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Toaster position="bottom-center" />
    </main>
  )
}
