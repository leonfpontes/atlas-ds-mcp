import { useState } from "react"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Toaster } from "@/components/ui/sonner"

const CATEGORIES = ["Produce", "Bakery", "Dairy", "Pantry"]

const EMPTY_FORM = {
  name: "",
  price: "",
  category: "",
  stock: "",
  description: "",
}

export default function AddProductPage() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = "Enter a product name."
    const price = Number(form.price)
    if (form.price === "" || Number.isNaN(price) || price < 0) next.price = "Enter a price of 0 or more."
    if (!form.category) next.category = "Choose a category."
    const stock = Number(form.stock)
    if (form.stock === "" || !Number.isInteger(stock) || stock < 0) next.stock = "Enter a whole number, 0 or more."
    return next
  }

  const handleSave = (event) => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      toast.error("Fix the highlighted fields to save the product.")
      return
    }
    toast.success(`${form.name.trim()} was added to the catalog.`)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM)
    setErrors({})
  }

  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add product</CardTitle>
          <CardDescription>Add an item to the Fernhill Market catalog.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSave} noValidate>
          <CardContent className="grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="product-name" className="text-sm font-medium text-foreground">
                Product name
              </label>
              <Input
                id="product-name"
                placeholder="e.g. Organic sourdough loaf"
                value={form.name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "product-name-error" : undefined}
                onChange={(e) => setField("name", e.target.value)}
              />
              {errors.name && (
                <p id="product-name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="product-price" className="text-sm font-medium text-foreground">
                  Price (USD)
                </label>
                <Input
                  id="product-price"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  aria-invalid={Boolean(errors.price)}
                  aria-describedby={errors.price ? "product-price-error" : undefined}
                  onChange={(e) => setField("price", e.target.value)}
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
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={form.stock}
                  aria-invalid={Boolean(errors.stock)}
                  aria-describedby={errors.stock ? "product-stock-error" : undefined}
                  onChange={(e) => setField("stock", e.target.value)}
                />
                {errors.stock && (
                  <p id="product-stock-error" className="text-sm text-destructive">
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="product-category" className="text-sm font-medium text-foreground">
                Category
              </label>
              <Select value={form.category} onValueChange={(value) => setField("category", value)}>
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
              <label htmlFor="product-description" className="text-sm font-medium text-foreground">
                Short description
              </label>
              <textarea
                id="product-description"
                rows={3}
                maxLength={200}
                placeholder="One or two sentences shoppers will see."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-text-subtle focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
              />
              <p className="text-sm text-muted-foreground">{form.description.length}/200 characters</p>
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2">
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
