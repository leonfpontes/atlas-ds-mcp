import { useState, type FormEvent } from "react"
import { Toaster } from "@/components/ui/sonner"
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
import { toast } from "sonner"

const CATEGORIES = ["Produce", "Bakery", "Dairy", "Pantry"] as const
const DESCRIPTION_MAX = 120

type Category = (typeof CATEGORIES)[number]

type ProductForm = {
  name: string
  price: string
  category: Category | ""
  stock: string
  description: string
}

type ProductErrors = Partial<Record<keyof ProductForm, string>>

const EMPTY_FORM: ProductForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
}

function validate(form: ProductForm): ProductErrors {
  const errors: ProductErrors = {}

  if (!form.name.trim()) {
    errors.name = "Enter a product name."
  }

  const price = Number(form.price)
  if (form.price.trim() === "" || Number.isNaN(price) || price < 0) {
    errors.price = "Enter a price of 0 or more."
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
    errors.stock = "Enter a whole number of 0 or more."
  }

  if (form.description.length > DESCRIPTION_MAX) {
    errors.description = `Keep the description to ${DESCRIPTION_MAX} characters or fewer.`
  }

  return errors
}

export default function AddProductPage() {
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<ProductErrors>({})

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

    toast.success(`${form.name.trim()} added to products`)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  function handleCancel() {
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const descriptionCount = form.description.length

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
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="product-name" className="text-sm font-medium text-foreground">
                Product name
              </label>
              <Input
                id="product-name"
                name="name"
                placeholder="for example, Organic rolled oats"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "product-name-error" : undefined}
                autoComplete="off"
              />
              {errors.name && (
                <p id="product-name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="product-price" className="text-sm font-medium text-foreground">
                  Price
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
                  onChange={(e) => updateField("price", e.target.value)}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? "product-price-error" : undefined}
                />
                {errors.price && (
                  <p id="product-price-error" className="text-sm text-destructive">
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
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
                  onChange={(e) => updateField("stock", e.target.value)}
                  aria-invalid={Boolean(errors.stock)}
                  aria-describedby={errors.stock ? "product-stock-error" : undefined}
                />
                {errors.stock && (
                  <p id="product-stock-error" className="text-sm text-destructive">
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="product-category" className="text-sm font-medium text-foreground">
                Category
              </label>
              <Select
                value={form.category || undefined}
                onValueChange={(value) => updateField("category", value as Category)}
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

            <div className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor="product-description" className="text-sm font-medium text-foreground">
                  Short description
                </label>
                <span className="text-xs text-muted-foreground">
                  {descriptionCount}/{DESCRIPTION_MAX}
                </span>
              </div>
              <Input
                id="product-description"
                name="description"
                placeholder="One line shown to shoppers"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "product-description-error" : "product-description-hint"
                }
                maxLength={DESCRIPTION_MAX + 20}
              />
              {errors.description ? (
                <p id="product-description-error" className="text-sm text-destructive">
                  {errors.description}
                </p>
              ) : (
                <p id="product-description-hint" className="text-sm text-muted-foreground">
                  Up to {DESCRIPTION_MAX} characters.
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
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
