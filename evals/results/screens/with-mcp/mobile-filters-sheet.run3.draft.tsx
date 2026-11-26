import { useMemo, useState } from "react"
import { Check, Package, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  priceRange: string
  inStockOnly: boolean
}

const PRODUCTS: Product[] = [
  { id: "p1", name: "Wildflower honey, 500 g", category: "Pantry", price: 8.5, inStock: true },
  { id: "p2", name: "Sourdough loaf", category: "Bakery", price: 6.0, inStock: true },
  { id: "p3", name: "Oat milk, 1 L", category: "Dairy", price: 2.75, inStock: false },
  { id: "p4", name: "Heirloom tomatoes, 1 kg", category: "Produce", price: 9.2, inStock: true },
  { id: "p5", name: "Cold-pressed apple juice", category: "Beverages", price: 4.4, inStock: true },
  { id: "p6", name: "Aged cheddar, 250 g", category: "Dairy", price: 11.9, inStock: false },
  { id: "p7", name: "Stone-ground flour, 2 kg", category: "Pantry", price: 14.5, inStock: true },
  { id: "p8", name: "Single-origin coffee beans", category: "Beverages", price: 22.0, inStock: true },
]

const CATEGORIES = ["Produce", "Pantry", "Dairy", "Bakery", "Beverages"]

const PRICE_RANGES = [
  { value: "any", label: "Any price", min: 0, max: Infinity },
  { value: "under-10", label: "Under $10", min: 0, max: 10 },
  { value: "10-25", label: "$10 to $25", min: 10, max: 25 },
  { value: "over-25", label: "Over $25", min: 25, max: Infinity },
]

const DEFAULT_FILTERS: Filters = {
  category: "all",
  priceRange: "any",
  inStockOnly: false,
}

function filterProducts(products: Product[], filters: Filters): Product[] {
  const range =
    PRICE_RANGES.find((r) => r.value === filters.priceRange) ?? PRICE_RANGES[0]

  return products.filter(
    (p) =>
      (filters.category === "all" || p.category === filters.category) &&
      p.price >= range.min &&
      p.price < range.max &&
      (!filters.inStockOnly || p.inStock)
  )
}

export default function FernhillProductList() {
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS)
  const [draft, setDraft] = useState<Filters>(DEFAULT_FILTERS)
  const [open, setOpen] = useState(false)

  const visible = useMemo(() => filterProducts(PRODUCTS, applied), [applied])
  const draftCount = filterProducts(PRODUCTS, draft).length

  const activeCount = [
    applied.category !== "all",
    applied.priceRange !== "any",
    applied.inStockOnly,
  ].filter(Boolean).length

  function handleOpenChange(next: boolean) {
    if (next) setDraft(applied)
    setOpen(next)
  }

  function applyFilters() {
    setApplied(draft)
    setOpen(false)
    toast(
      `Showing ${draftCount} ${draftCount === 1 ? "product" : "products"}`
    )
  }

  function clearAll() {
    setApplied(DEFAULT_FILTERS)
    toast("Filters cleared")
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 bg-background p-4 text-foreground">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">
            {visible.length} of {PRODUCTS.length} products
          </p>
        </div>

        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal />
              Filters
              {activeCount > 0 && (
                <Badge variant="info">{activeCount} active</Badge>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex w-full flex-col gap-0 sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Filter products</SheetTitle>
              <SheetDescription>
                Choose what to show, then apply.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-2">
              <div className="grid gap-2">
                <label htmlFor="filter-category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={draft.category}
                  onValueChange={(value) =>
                    setDraft((d) => ({ ...d, category: value }))
                  }
                >
                  <SelectTrigger id="filter-category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="filter-price" className="text-sm font-medium">
                  Price range
                </label>
                <Select
                  value={draft.priceRange}
                  onValueChange={(value) =>
                    setDraft((d) => ({ ...d, priceRange: value }))
                  }
                >
                  <SelectTrigger id="filter-price" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICE_RANGES.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <span className="text-sm font-medium">Availability</span>
                <Button
                  type="button"
                  variant="outline"
                  aria-pressed={draft.inStockOnly}
                  className={`justify-start ${
                    draft.inStockOnly ? "border-primary text-primary" : ""
                  }`}
                  onClick={() =>
                    setDraft((d) => ({ ...d, inStockOnly: !d.inStockOnly }))
                  }
                >
                  {draft.inStockOnly && <Check />}
                  In stock only
                </Button>
              </div>
            </div>

            <SheetFooter className="grid grid-cols-2 gap-2 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setDraft(DEFAULT_FILTERS)}
              >
                Reset
              </Button>
              <Button onClick={applyFilters}>
                Show {draftCount} {draftCount === 1 ? "product" : "products"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          {activeCount > 0 && (
            <CardAction>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear filters
              </Button>
            </CardAction>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-6 text-center">
              <Package className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No products match these filters.
              </p>
              <Button variant="outline" onClick={clearAll}>
                Clear filters
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.inStock ? (
                      <Badge variant="success">
                        <Check />
                        In stock
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Sold out</Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Toaster />
    </main>
  )
}
