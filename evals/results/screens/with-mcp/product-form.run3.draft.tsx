import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

const CATEGORIES = ["Produce", "Bakery", "Dairy", "Pantry"] as const
type Category = (typeof CATEGORIES)[number]

const DESCRIPTION_MAX = 160

type FormState = {
  name: string
  price: string
  category: Category | ""
  stock: string
  description: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const EMPTY_FORM: FormState = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}

  if (!form.name.trim()) {
    errors.name = "Enter a product name."
  }

  const price = Number(form.price)
  if (form.price.trim() === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0."
  }

  if (!form.category) {
    errors.category = "Choose a category."
  }

  const stock = Number(form.stock)
  if (
    form.stock.trim() === "" ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    errors.stock = "Enter a whole number, 0 or more."
  }

  if (form.description.length > DESCRIPTION_MAX) {
    errors.description = `Keep the description to ${DESCRIPTION_MAX} characters or fewer.`
  }

  return errors
}

export default function AddProductPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      toast.error("Fix the highlighted fields to save the product.")
      return
    }
    toast.success(`${form.name.trim()} was added to the catalogue.`)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function handleCancel() {
    setForm(EMPTY_FORM)
    setErrors({})
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Add product</CardTitle>
            <CardDescription>
              Fernhill Market. The product appears in the catalogue once saved.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="product-name" className="text-sm font-medium text-foreground">
                Product name
              </label>
              <Input
                id="product-name"
                name="name"
                type="text"
                autoComplete="off"
                placeholder="e.g. Sourdough loaf"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "product-name-error" : undefined}
              />
              {errors.name && (
                <p id="product-name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="product-category" className="text-sm font-medium text-foreground">
                Category
              </label>
              <Select
                value={form.category}
                onValueChange={(value) => update("category", value as Category)}
              >
                <SelectTrigger
                  id="product-category"
                  className="w-full"
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? "product-category-error" : undefined}
                >
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p id="product-category-error" className="text-sm text-destructive">
                  {errors.category}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="product-price" className="text-sm font-medium text-foreground">
                Price (USD)
              </label>
              <Input
                id="product-price"
                name="price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                aria-invalid={!!errors.price}
                aria-describedby={errors.price ? "product-price-error" : undefined}
              />
              {errors.price && (
                <p id="product-price-error" className="text-sm text-destructive">
                  {errors.price}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="product-stock" className="text-sm font-medium text-foreground">
                Stock quantity
              </label>
              <Input
                id="product-stock"
                name="stock"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                placeholder="0"
                value={form.stock}
                onChange={(e) => update("stock", e.target.value)}
                aria-invalid={!!errors.stock}
                aria-describedby={errors.stock ? "product-stock-error" : undefined}
              />
              {errors.stock && (
                <p id="product-stock-error" className="text-sm text-destructive">
                  {errors.stock}
                </p>
              )}
            </div>

            <div className="grid gap-2 sm:col-span-2">
              <label htmlFor="product-description" className="text-sm font-medium text-foreground">
                Short description
              </label>
              <textarea
                id="product-description"
                name="description"
                rows={3}
                placeholder="One or two lines shoppers will see."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description
                    ? "product-description-hint product-description-error"
                    : "product-description-hint"
                }
                className="min-h-20 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-xs outline-none placeholder:text-text-subtle focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive md:text-sm"
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  {errors.description ? (
                    <p id="product-description-error" className="text-sm text-destructive">
                      {errors.description}
                    </p>
                  ) : null}
                </div>
                <p
                  id="product-description-hint"
                  className="shrink-0 text-sm text-muted-foreground"
                >
                  {form.description.length}/{DESCRIPTION_MAX}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Save product</Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  )
}
