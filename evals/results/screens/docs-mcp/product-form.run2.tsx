import { useState, type FormEvent } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

const CATEGORIES = ["Produce", "Bakery", "Dairy", "Pantry"] as const

const DESCRIPTION_MAX = 160

type ProductForm = {
  name: string
  price: string
  category: string
  stock: string
  description: string
}

type FormErrors = Partial<Record<keyof ProductForm, string>>

const EMPTY_FORM: ProductForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
}

function validate(form: ProductForm): FormErrors {
  const errors: FormErrors = {}

  if (!form.name.trim()) {
    errors.name = "Enter a product name."
  }

  const price = Number(form.price)
  if (form.price.trim() === "" || !Number.isFinite(price) || price <= 0) {
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

const TEXTAREA_CLASS =
  "flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-text-subtle outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

export default function AddProductPage() {
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})

  function updateField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    toast.success(`Product saved: ${form.name.trim()}`)
    setForm(EMPTY_FORM)
  }

  function handleCancel() {
    setForm(EMPTY_FORM)
    setErrors({})
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add product</CardTitle>
          <CardDescription>
            Add an item to the Fernhill Market catalogue.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="product-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="product-name"
                name="name"
                type="text"
                placeholder="for example, Organic apples"
                value={form.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "product-name-error" : undefined}
                onChange={(e) => updateField("name", e.target.value)}
              />
              {errors.name && (
                <p id="product-name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="product-price" className="text-sm font-medium">
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
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? "product-price-error" : undefined}
                  onChange={(e) => updateField("price", e.target.value)}
                />
                {errors.price && (
                  <p id="product-price-error" className="text-sm text-destructive">
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="product-stock" className="text-sm font-medium">
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
                  aria-invalid={Boolean(errors.stock)}
                  aria-describedby={errors.stock ? "product-stock-error" : undefined}
                  onChange={(e) => updateField("stock", e.target.value)}
                />
                {errors.stock && (
                  <p id="product-stock-error" className="text-sm text-destructive">
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="product-category" className="text-sm font-medium">
                Category
              </label>
              <Select
                value={form.category || undefined}
                onValueChange={(value) => updateField("category", value)}
              >
                <SelectTrigger
                  id="product-category"
                  className="w-full"
                  aria-invalid={Boolean(errors.category)}
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
              <label htmlFor="product-description" className="text-sm font-medium">
                Short description
              </label>
              <textarea
                id="product-description"
                name="description"
                rows={3}
                placeholder="One or two sentences shoppers will see."
                value={form.description}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description
                    ? "product-description-hint product-description-error"
                    : "product-description-hint"
                }
                className={TEXTAREA_CLASS}
                onChange={(e) => updateField("description", e.target.value)}
              />
              <div className="flex items-start justify-between gap-4">
                {errors.description ? (
                  <p id="product-description-error" className="text-sm text-destructive">
                    {errors.description}
                  </p>
                ) : (
                  <span />
                )}
                <p
                  id="product-description-hint"
                  className="text-sm text-muted-foreground tabular-nums"
                >
                  {form.description.length}/{DESCRIPTION_MAX}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Save product</Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </main>
  )
}
