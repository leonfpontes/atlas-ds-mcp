import { useState, type FormEvent } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner"

const STORE_NAME = "Fernhill Market"
const CATEGORIES = ["Produce", "Bakery", "Dairy", "Pantry"] as const
const MAX_DESCRIPTION_LENGTH = 200

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

const FIELD_CLASS = "w-full"

const TEXTAREA_CLASS =
  "min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-text-subtle focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:aria-invalid:ring-destructive/40"

const LABEL_CLASS = "text-sm font-medium text-foreground"
const ERROR_CLASS = "text-sm text-destructive"
const HINT_CLASS = "text-sm text-muted-foreground"

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.name.trim()) {
    errors.name = "Enter a product name."
  }

  const price = Number(values.price)
  if (!values.price.trim()) {
    errors.price = "Enter a price."
  } else if (!/^\d+(\.\d{1,2})?$/.test(values.price.trim()) || price <= 0) {
    errors.price = "Enter a price above 0 with up to two decimals, for example 3.50."
  }

  if (!values.category) {
    errors.category = "Choose a category."
  }

  if (!values.stock.trim()) {
    errors.stock = "Enter a stock quantity."
  } else if (!/^\d+$/.test(values.stock.trim())) {
    errors.stock = "Enter a whole number, 0 or more."
  }

  if (values.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Keep the description to ${MAX_DESCRIPTION_LENGTH} characters or fewer.`
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
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Fix the highlighted fields to save the product.")
      return
    }

    setIsSaving(true)
    window.setTimeout(() => {
      toast.success(`${values.name.trim()} was added to ${STORE_NAME}.`)
      setValues(EMPTY_FORM)
      setErrors({})
      setIsSaving(false)
    }, 400)
  }

  const handleCancel = () => {
    setValues(EMPTY_FORM)
    setErrors({})
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add product</CardTitle>
          <CardDescription>
            Add an item to the {STORE_NAME} catalogue. You can edit it later.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <label htmlFor="product-name" className={LABEL_CLASS}>
                Product name
              </label>
              <Input
                id="product-name"
                className={FIELD_CLASS}
                placeholder="Organic whole milk, 1 L"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "product-name-error" : undefined}
                onChange={(event) => updateField("name", event.target.value)}
              />
              {errors.name && (
                <p id="product-name-error" className={ERROR_CLASS}>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="product-price" className={LABEL_CLASS}>
                  Price (USD)
                </label>
                <Input
                  id="product-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  className={FIELD_CLASS}
                  placeholder="3.50"
                  value={values.price}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={
                    errors.price ? "product-price-error" : "product-price-hint"
                  }
                  onChange={(event) => updateField("price", event.target.value)}
                />
                {errors.price ? (
                  <p id="product-price-error" className={ERROR_CLASS}>
                    {errors.price}
                  </p>
                ) : (
                  <p id="product-price-hint" className={HINT_CLASS}>
                    Shown to customers, tax included.
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <label htmlFor="product-category" className={LABEL_CLASS}>
                  Category
                </label>
                <Select
                  value={values.category}
                  onValueChange={(value) =>
                    updateField("category", value as Category)
                  }
                >
                  <SelectTrigger
                    id="product-category"
                    className={FIELD_CLASS}
                    aria-invalid={Boolean(errors.category)}
                    aria-describedby={
                      errors.category ? "product-category-error" : undefined
                    }
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
                  <p id="product-category-error" className={ERROR_CLASS}>
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2 sm:max-w-[calc(50%-0.75rem)]">
              <label htmlFor="product-stock" className={LABEL_CLASS}>
                Stock quantity
              </label>
              <Input
                id="product-stock"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                className={FIELD_CLASS}
                placeholder="0"
                value={values.stock}
                aria-invalid={Boolean(errors.stock)}
                aria-describedby={errors.stock ? "product-stock-error" : undefined}
                onChange={(event) => updateField("stock", event.target.value)}
              />
              {errors.stock && (
                <p id="product-stock-error" className={ERROR_CLASS}>
                  {errors.stock}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="product-description" className={LABEL_CLASS}>
                Short description
              </label>
              <textarea
                id="product-description"
                className={TEXTAREA_CLASS}
                placeholder="Local dairy, bottled on Tuesdays."
                value={values.description}
                maxLength={MAX_DESCRIPTION_LENGTH + 50}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description
                    ? "product-description-error"
                    : "product-description-hint"
                }
                onChange={(event) => updateField("description", event.target.value)}
              />
              <div className="flex items-start justify-between gap-4">
                {errors.description ? (
                  <p id="product-description-error" className={ERROR_CLASS}>
                    {errors.description}
                  </p>
                ) : (
                  <p id="product-description-hint" className={HINT_CLASS}>
                    One or two sentences shoppers will see on the product page.
                  </p>
                )}
                <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                  {values.description.length}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving product…" : "Save product"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Toaster />
    </main>
  )
}
