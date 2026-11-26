import { useState, type FormEvent } from "react"
import { PackagePlus, Save, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const STORE_NAME = "Fernhill Market"
const CATEGORIES = ["Produce", "Bakery", "Dairy", "Pantry"] as const
const MAX_DESCRIPTION_LENGTH = 280

type Category = (typeof CATEGORIES)[number]

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

  if (!values.name.trim()) {
    errors.name = "Product name is required."
  } else if (values.name.trim().length > 80) {
    errors.name = "Product name must be 80 characters or fewer."
  }

  const price = Number(values.price)
  if (values.price.trim() === "") {
    errors.price = "Price is required."
  } else if (!Number.isFinite(price) || price < 0) {
    errors.price = "Enter a valid price of 0 or more."
  } else if (!/^\d+(\.\d{1,2})?$/.test(values.price.trim())) {
    errors.price = "Use up to two decimal places."
  }

  if (!values.category) {
    errors.category = "Choose a category."
  }

  const stock = Number(values.stock)
  if (values.stock.trim() === "") {
    errors.stock = "Stock quantity is required."
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "Enter a whole number of 0 or more."
  }

  if (values.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`
  }

  return errors
}

export default function AddProductPage() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)

  const updateField = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  const handleCancel = () => {
    setValues(EMPTY_FORM)
    setErrors({})
    toast("Changes discarded")
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      toast.error("Please fix the highlighted fields.")
      return
    }

    setIsSaving(true)

    // Simulated save; replace with the real API call.
    window.setTimeout(() => {
      setIsSaving(false)
      toast.success(`${values.name.trim()} was added to ${STORE_NAME}.`)
      setValues(EMPTY_FORM)
    }, 600)
  }

  const descriptionCount = values.description.length

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <PackagePlus className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{STORE_NAME}</p>
          <h1 className="text-2xl font-semibold tracking-tight">Add product</h1>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="product-name">Product name</Label>
            <Input
              id="product-name"
              name="name"
              placeholder="e.g. Organic gala apples"
              value={values.name}
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

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="product-category">Category</Label>
            <Select
              value={values.category}
              onValueChange={(value) => updateField("category", value as Category)}
            >
              <SelectTrigger
                id="product-category"
                className="w-full"
                aria-invalid={Boolean(errors.category)}
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

          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="product-description">Short description</Label>
              <span
                className={`text-xs ${
                  descriptionCount > MAX_DESCRIPTION_LENGTH
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {descriptionCount}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <Textarea
              id="product-description"
              name="description"
              rows={4}
              placeholder="A sentence or two shoppers will see on the product page."
              value={values.description}
              onChange={(e) => updateField("description", e.target.value)}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "product-description-error" : undefined}
            />
            {errors.description && (
              <p id="product-description-error" className="text-sm text-destructive">
                {errors.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="size-4" aria-hidden="true" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="size-4" aria-hidden="true" />
            {isSaving ? "Saving..." : "Save product"}
          </Button>
        </div>
      </form>
    </main>
  )
}
