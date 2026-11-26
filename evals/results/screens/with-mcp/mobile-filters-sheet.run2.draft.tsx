import { useMemo, useState } from "react"
import { CircleCheck, CircleX, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
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

type Filters = {
  category: string
  minPrice: string
  maxPrice: string
  inStockOnly: boolean
}

type Product = {
  id: string
  name: string
  category: string
  price: number
  inStock: boolean
}

const CATEGORIES = [
  { value: "all", label: "All categories" },
  { value: "bakery", label: "Bakery" },
  { value: "dairy", label: "Dairy" },
  { value: "produce", label: "Produce" },
  { value: "pantry", label: "Pantry" },
]

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sourdough loaf", category: "bakery", price: 6.5, inStock: true },
  { id: "p2", name: "Cinnamon rolls (4)", category: "bakery", price: 8.0, inStock: false },
  { id: "p3", name: "Fresh milk, 1 L", category: "dairy", price: 2.2, inStock: true },
  { id: "p4", name: "Aged cheddar", category: "dairy", price: 9.75, inStock: true },
  { id: "p5", name: "Heirloom tomatoes", category: "produce", price: 4.4, inStock: true },
  { id: "p6", name: "Wild blueberries", category: "produce", price: 5.9, inStock: false },
  { id: "p7", name: "Clover honey, 500 g", category: "pantry", price: 7.25, inStock: true },
  { id: "p8", name: "Stone-ground oats", category: "pantry", price: 3.6, inStock: true },
]

const EMPTY_FILTERS: Filters = {
  category: "all",
  minPrice: "",
  maxPrice: "",
  inStockOnly: false,
}

function applyFilters(products: Product[], f: Filters): Product[] {
  const min = f.minPrice === "" ? null : Number(f.minPrice)
  const max = f.maxPrice === "" ? null : Number(f.maxPrice)
  return products.filter(
    (p) =>
      (f.category === "all" || p.category === f.category) &&
      (min === null || p.price >= min) &&
      (max === null || p.price <= max) &&
      (!f.inStockOnly || p.inStock)
  )
}

function countActiveFilters(f: Filters): number {
  return (
    (f.category !== "all" ? 1 : 0) +
    (f.minPrice !== "" || f.maxPrice !== "" ? 1 : 0) +
    (f.inStockOnly ? 1 : 0)
  )
}

function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export default function ProductListPage() {
  const [applied, setApplied] = useState<Filters>(EMPTY_FILTERS)
  const [draft, setDraft] = useState<Filters>(EMPTY_FILTERS)
  const [open, setOpen] = useState(false)

  const results = useMemo(() => applyFilters(PRODUCTS, applied), [applied])
  const activeCount = countActiveFilters(applied)

  const priceError =
    draft.minPrice !== "" &&
    draft.maxPrice !== "" &&
    Number(draft.minPrice) > Number(draft.maxPrice)
      ? "Minimum price must be lower than maximum price."
      : null

  function handleOpenChange(next: boolean) {
    if (next) setDraft(applied)
    setOpen(next)
  }

  function handleApply() {
    if (priceError) return
    const count = applyFilters(PRODUCTS, draft).length
    setApplied(draft)
    setOpen(false)
    toast(`Showing ${count} ${count === 1 ? "product" : "products"}`)
  }

  function handleResetDraft() {
    setDraft(EMPTY_FILTERS)
  }

  function handleClearApplied() {
    setApplied(EMPTY_FILTERS)
    setDraft(EMPTY_FILTERS)
    toast("Filters cleared")
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {results.length} of {PRODUCTS.length} products
          </p>
        </div>

        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal aria-hidden="true" />
              Filters
              {activeCount > 0 && <Badge variant="info">{activeCount}</Badge>}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col">
            <SheetHeader>
              <SheetTitle>Filter products</SheetTitle>
              <SheetDescription>Narrow the list by category, price and stock.</SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4">
              <div className="grid gap-2">
                <label htmlFor="filter-category" className="text-sm font-medium text-foreground">
                  Category
                </label>
                <Select
                  value={draft.category}
                  onValueChange={(value) => setDraft({ ...draft, category: value })}
                >
                  <SelectTrigger id="filter-category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <fieldset className="grid gap-2">
                <legend className="mb-2 text-sm font-medium text-foreground">Price range</legend>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <label htmlFor="filter-min-price" className="text-sm text-muted-foreground">
                      Minimum ($)
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
                      onChange={(e) => setDraft({ ...draft, minPrice: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="filter-max-price" className="text-sm text-muted-foreground">
                      Maximum ($)
                    </label>
                    <Input
                      id="filter-max-price"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      placeholder="No limit"
                      value={draft.maxPrice}
                      aria-invalid={priceError !== null}
                      aria-describedby={priceError ? "filter-price-error" : undefined}
                      onChange={(e) => setDraft({ ...draft, maxPrice: e.target.value })}
                    />
                  </div>
                </div>
                {priceError && (
                  <p id="filter-price-error" className="text-sm text-destructive">
                    {priceError}
                  </p>
                )}
              </fieldset>

              <div className="grid gap-2">
                <span className="text-sm font-medium text-foreground">Availability</span>
                <Button
                  type="button"
                  variant={draft.inStockOnly ? "secondary" : "outline"}
                  aria-pressed={draft.inStockOnly}
                  className="w-full justify-start"
                  onClick={() => setDraft({ ...draft, inStockOnly: !draft.inStockOnly })}
                >
                  {draft.inStockOnly ? <CircleCheck aria-hidden="true" /> : null}
                  In stock only
                </Button>
              </div>
            </div>

            <SheetFooter className="flex-col gap-2">
              <Button className="w-full" onClick={handleApply}>
                Show {applyFilters(PRODUCTS, draft).length} products
              </Button>
              <Button variant="outline" className="w-full" onClick={handleResetDraft}>
                Reset filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </header>

      {activeCount > 0 && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {activeCount} {activeCount === 1 ? "filter" : "filters"} applied
          </span>
          <Button variant="link" onClick={handleClearApplied}>
            Clear filters
          </Button>
        </div>
      )}

      {results.length > 0 ? (
        <ul className="divide-y divide-border overflow-hidden rounded-md border border-border bg-card">
          {results.map((product) => (
            <li key={product.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{categoryLabel(product.category)}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="font-medium tabular-nums text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.inStock ? (
                  <Badge variant="success">
                    <CircleCheck aria-hidden="true" />
                    In stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <CircleX aria-hidden="true" />
                    Out of stock
                  </Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-md border border-border bg-card p-6 text-center">
          <p className="font-medium text-foreground">No products match these filters</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a wider price range or clear the filters.</p>
        </div>
      )}

      <Toaster />
    </main>
  )
}
