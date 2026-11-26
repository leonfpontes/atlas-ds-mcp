import { useState, type FormEvent } from "react"
import { toast } from "sonner"
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

const CATEGORIES = ["Produce", "Bakery", "Dairy", "Pantry"] as const
type Category = (typeof CATEGORIES)[number]

const MAX_DESCRIPTION = 200

type FormValues = {
  name: string
  price: string
  category: Category | ""
  stock: string
  description: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const EMPTY_FORM: FormValues = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.name.trim() === "") {
    errors.name = "Enter a product name."
  }

  const price = Number(values.price)
  if (values.price.trim() === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0."
  }

  if (values.category === "") {
    errors.category = "Choose a category."
  }

  const stock = Number(values.stock)
  if (
    values.stock.trim() === "" ||
    !Number.isInteger(stock) ||
    stock < 0
  ) {
    errors.stock = "Enter a whole number, 0 or more."
  }

  if (values.description.length > MAX_DESCRIPTION) {
    errors.description = `Keep the description under ${MAX_DESCRIPTION} characters.`
  }

  return errors
}

export default function AddProductPage() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    toast.success(`${values.name.trim()} saved`)
    setValues(EMPTY_FORM)
  }

  function handleCancel() {
    setValues(EMPTY_FORM)
    setErrors({})
  }

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Add product</CardTitle>
            <CardDescription>
              Add an item to the Fernhill Market catalog.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="product-name" className="text-sm font-medium">
                  Product name
                </label>
                <Input
                  id="product-name"
                  name="name"
                  placeholder="for example, Sourdough loaf"
                  value={values.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "product-name-error" : undefined}
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
                    value={values.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    aria-invalid={errors.price ? true : undefined}
                    aria-describedby={errors.price ? "product-price-error" : undefined}
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
                    value={values.stock}
                    onChange={(e) => updateField("stock", e.target.value)}
                    aria-invalid={errors.stock ? true : undefined}
                    aria-describedby={errors.stock ? "product-stock-error" : undefined}
                  />
                  {errors.stock && (
                    <p id="product-stock-error" className="text-sm text-destructive">
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <span id="product-category-label" className="text-sm font-medium">
                  Category
                </span>
                <Select
                  value={values.category || undefined}
                  onValueChange={(value) => updateField("category", value as Category)}
                >
                  <SelectTrigger
                    id="product-category"
                    aria-labelledby="product-category-label"
                    aria-invalid={errors.category ? true : undefined}
                    aria-describedby={errors.category ? "product-category-error" : undefined}
                    className="w-full"
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
                  Description
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  rows={4}
                  placeholder="One or two sentences shoppers will see"
                  value={values.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={
                    errors.description
                      ? "product-description-hint product-description-error"
                      : "product-description-hint"
                  }
                  className="min-h-24 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-xs outline-none placeholder:text-text-subtle focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm"
                />
                <div className="flex items-start justify-between gap-4 text-sm">
                  {errors.description ? (
                    <p id="product-description-error" className="text-destructive">
                      {errors.description}
                    </p>
                  ) : (
                    <p id="product-description-hint" className="text-muted-foreground">
                      Optional. Shown on the product page.
                    </p>
                  )}
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {values.description.length}/{MAX_DESCRIPTION}
                  </span>
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
      </div>
      <Toaster />
    </main>
  )
}
