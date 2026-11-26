import { useState, type FormEvent } from "react"
import { Loader2, PackagePlus } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

const EMPTY_FORM: ProductForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
}

const DESCRIPTION_MAX_LENGTH = 200

function validate(values: ProductForm): FormErrors {
  const errors: FormErrors = {}

  if (values.name.trim().length < 2) {
    errors.name = "Enter a product name with at least 2 characters."
  }

  const price = Number(values.price)
  if (values.price.trim() === "" || Number.isNaN(price) || price <= 0) {
    errors.price = "Enter a price greater than 0."
  } else if (!/^\d+(\.\d{1,2})?$/.test(values.price.trim())) {
    errors.price = "Use up to two decimal places, e.g. 3.49."
  }

  if (!values.category) {
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

  if (values.description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Keep the description under ${DESCRIPTION_MAX_LENGTH} characters.`
  }

  return errors
}

export default function AddProductPage() {
  const [values, setValues] = useState<ProductForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  const updateField = <K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCancel = () => {
    setValues(EMPTY_FORM)
    setErrors({})
    toast.message("Changes discarded")
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
      // Replace with the real API call for creating a product.
      await new Promise((resolve) => setTimeout(resolve, 600))

      toast.success(`${values.name.trim()} was added to ${STORE_NAME}.`)
      setValues(EMPTY_FORM)
    } catch {
      toast.error("The product could not be saved. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <PackagePlus className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Add product</CardTitle>
              <CardDescription>
                Add a new item to the {STORE_NAME} catalogue.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="product-name">Product name</Label>
              <Input
                id="product-name"
                name="name"
                placeholder="e.g. Organic gala apples"
                value={values.name}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "product-name-error" : undefined}
                onChange={(e) => updateField("name", e.target.value)}
                disabled={isSaving}
              />
              {errors.name && (
                <p id="product-name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="product-price">Price (USD)</Label>
                <Input
                  id="product-price"
                  name="price"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={values.price}
                  aria-invalid={!!errors.price}
                  aria-describedby={errors.price ? "product-price-error" : undefined}
                  onChange={(e) => updateField("price", e.target.value)}
                  disabled={isSaving}
                />
                {errors.price && (
                  <p id="product-price-error" className="text-sm text-destructive">
                    {errors.price}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="product-stock">Stock quantity</Label>
                <Input
                  id="product-stock"
                  name="stock"
                  inputMode="numeric"
                  placeholder="0"
                  value={values.stock}
                  aria-invalid={!!errors.stock}
                  aria-describedby={errors.stock ? "product-stock-error" : undefined}
                  onChange={(e) => updateField("stock", e.target.value)}
                  disabled={isSaving}
                />
                {errors.stock && (
                  <p id="product-stock-error" className="text-sm text-destructive">
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="product-category">Category</Label>
              <Select
                value={values.category}
                onValueChange={(value) =>
                  updateField("category", value as Category)
                }
                disabled={isSaving}
              >
                <SelectTrigger
                  id="product-category"
                  className="w-full"
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? "product-category-error" : undefined}
                >
                  <SelectValue placeholder="Select a category" />
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
              <div className="flex items-center justify-between">
                <Label htmlFor="product-description">Short description</Label>
                <span className="text-xs text-muted-foreground">
                  {values.description.length}/{DESCRIPTION_MAX_LENGTH}
                </span>
              </div>
              <Textarea
                id="product-description"
                name="description"
                rows={4}
                placeholder="A sentence or two shoppers will see on the product page."
                value={values.description}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "product-description-error" : undefined}
                onChange={(e) => updateField("description", e.target.value)}
                disabled={isSaving}
              />
              {errors.description && (
                <p id="product-description-error" className="text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isSaving ? "Saving..." : "Save product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
