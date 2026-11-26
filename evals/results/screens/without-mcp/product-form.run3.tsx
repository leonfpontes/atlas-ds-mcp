import { useState, type FormEvent } from "react"
import { ArrowLeft, Package, Save, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const STORE_NAME = "Fernhill Market"

const CATEGORIES = ["Produce", "Bakery", "Dairy", "Pantry"] as const

type Category = (typeof CATEGORIES)[number]

type ProductForm = {
  name: string
  price: string
  category: Category | ""
  stock: string
  description: string
}

type FormErrors = Partial<Record<keyof ProductForm, string>>

const MAX_DESCRIPTION_LENGTH = 200

const EMPTY_FORM: ProductForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
}

function validate(values: ProductForm): FormErrors {
  const errors: FormErrors = {}

  if (!values.name.trim()) {
    errors.name = "Enter a product name."
  } else if (values.name.trim().length > 80) {
    errors.name = "Product name must be 80 characters or fewer."
  }

  const price = Number(values.price)
  if (values.price.trim() === "") {
    errors.price = "Enter a price."
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.price = "Price must be greater than 0."
  } else if (!/^\d+(\.\d{1,2})?$/.test(values.price.trim())) {
    errors.price = "Use up to two decimal places."
  }

  if (!values.category) {
    errors.category = "Choose a category."
  }

  const stock = Number(values.stock)
  if (values.stock.trim() === "") {
    errors.stock = "Enter a stock quantity."
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Stock must be a whole number, 0 or more."
  }

  if (values.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`
  }

  return errors
}

const selectClassName =
  "border-input bg-background text-foreground focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs aria-invalid:border-destructive aria-invalid:ring-destructive/20"

export default function AddProductPage() {
  const [values, setValues] = useState<ProductForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  const setField = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.")
      return
    }

    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      toast.success(`${values.name.trim()} was added to ${STORE_NAME}.`)
      setValues(EMPTY_FORM)
      setErrors({})
    } catch {
      toast.error("Could not save the product. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setValues(EMPTY_FORM)
    setErrors({})
    toast("Changes discarded.")
  }

  return (
    <div className="bg-muted/30 min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="-ml-3" type="button" onClick={handleCancel}>
            <ArrowLeft className="size-4" />
            Back to products
          </Button>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Package className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{STORE_NAME}</p>
              <h1 className="text-foreground text-2xl font-semibold tracking-tight">Add product</h1>
            </div>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} noValidate>
            <CardHeader>
              <CardTitle>Product details</CardTitle>
              <CardDescription>
                Enter the details shoppers will see in the store catalogue.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="product-name">Product name</Label>
                  <Input
                    id="product-name"
                    name="name"
                    placeholder="e.g. Organic Gala Apples"
                    autoComplete="off"
                    value={values.name}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "product-name-error" : undefined}
                    onChange={(e) => setField("name", e.target.value)}
                  />
                  {errors.name && (
                    <p id="product-name-error" className="text-destructive text-sm">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-price">Price (USD)</Label>
                  <Input
                    id="product-price"
                    name="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={values.price}
                    aria-invalid={!!errors.price}
                    aria-describedby={errors.price ? "product-price-error" : undefined}
                    onChange={(e) => setField("price", e.target.value)}
                  />
                  {errors.price && (
                    <p id="product-price-error" className="text-destructive text-sm">
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <select
                    id="product-category"
                    name="category"
                    className={selectClassName}
                    value={values.category}
                    aria-invalid={!!errors.category}
                    aria-describedby={errors.category ? "product-category-error" : undefined}
                    onChange={(e) => setField("category", e.target.value as Category | "")}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p id="product-category-error" className="text-destructive text-sm">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-stock">Stock quantity</Label>
                  <Input
                    id="product-stock"
                    name="stock"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={values.stock}
                    aria-invalid={!!errors.stock}
                    aria-describedby={errors.stock ? "product-stock-error" : undefined}
                    onChange={(e) => setField("stock", e.target.value)}
                  />
                  {errors.stock && (
                    <p id="product-stock-error" className="text-destructive text-sm">
                      {errors.stock}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="product-description">Short description</Label>
                    <span
                      className={`text-xs ${
                        values.description.length > MAX_DESCRIPTION_LENGTH
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {values.description.length}/{MAX_DESCRIPTION_LENGTH}
                    </span>
                  </div>
                  <Textarea
                    id="product-description"
                    name="description"
                    rows={4}
                    placeholder="A sentence or two about the product, origin or key details."
                    value={values.description}
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? "product-description-error" : undefined}
                    onChange={(e) => setField("description", e.target.value)}
                  />
                  {errors.description && (
                    <p id="product-description-error" className="text-destructive text-sm">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col-reverse gap-3 border-t sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="size-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                <Save className="size-4" />
                {isSaving ? "Saving..." : "Save product"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
