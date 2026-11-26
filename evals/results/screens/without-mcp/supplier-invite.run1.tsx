import { useState, type FormEvent } from "react"
import { AlertCircle, Building2, CheckCircle2, Mail, Send, Tags } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const CATEGORIES = [
  { id: "produce", label: "Fresh produce" },
  { id: "dairy", label: "Dairy & eggs" },
  { id: "bakery", label: "Bakery" },
  { id: "meat-fish", label: "Meat & fish" },
  { id: "pantry", label: "Pantry & dry goods" },
  { id: "beverages", label: "Beverages" },
  { id: "frozen", label: "Frozen" },
  { id: "household", label: "Household & cleaning" },
] as const

const MARKET_NAME = "Fernhill Market"
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type CategoryId = (typeof CATEGORIES)[number]["id"]
type FieldErrors = Partial<Record<"email" | "company" | "categories", string>>
type Status = "idle" | "submitting" | "sent"

type Invitation = {
  email: string
  company: string
  categories: CategoryId[]
}

export default function InviteSupplierScreen() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [categories, setCategories] = useState<CategoryId[]>([])
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [sent, setSent] = useState<Invitation | null>(null)

  const isSubmitting = status === "submitting"

  function toggleCategory(id: CategoryId, checked: boolean) {
    setCategories((prev) =>
      checked ? [...prev, id] : prev.filter((c) => c !== id)
    )
    if (errors.categories) {
      setErrors((prev) => ({ ...prev, categories: undefined }))
    }
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    const trimmedEmail = email.trim()
    const trimmedCompany = company.trim()

    if (!trimmedEmail) {
      next.email = "Enter the supplier's work email address."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Enter a valid email address, for example name@supplier.com."
    }

    if (!trimmedCompany) {
      next.company = "Enter the supplier's company name."
    } else if (trimmedCompany.length < 2) {
      next.company = "Company name must be at least 2 characters."
    }

    if (categories.length === 0) {
      next.categories = "Select at least one category this supplier provides."
    }

    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus("submitting")
    // Replace with the real invitation request.
    await new Promise((resolve) => setTimeout(resolve, 900))

    const invitation: Invitation = {
      email: email.trim(),
      company: company.trim(),
      categories,
    }
    setSent(invitation)
    setStatus("sent")
    toast.success(`Invitation sent to ${invitation.email}`)
  }

  function inviteAnother() {
    setEmail("")
    setCompany("")
    setCategories([])
    setErrors({})
    setSent(null)
    setStatus("idle")
  }

  const categoryLabels = sent
    ? CATEGORIES.filter((c) => sent.categories.includes(c.id)).map((c) => c.label)
    : []

  return (
    <main className="mx-auto w-full max-w-xl p-6">
      <header className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">{MARKET_NAME}</p>
        <h1 className="text-2xl font-semibold tracking-tight">Invite a supplier</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Send an invitation so the supplier can register and start listing products.
        </p>
      </header>

      {status === "sent" && sent ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-green-600" aria-hidden="true" />
              Invitation sent
            </CardTitle>
            <CardDescription>
              We emailed {sent.email} with a link to join {MARKET_NAME}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle2 aria-hidden="true" />
              <AlertTitle>{sent.company} has been invited</AlertTitle>
              <AlertDescription>
                The invitation expires in 7 days. You can resend it from the suppliers list
                if it is not accepted.
              </AlertDescription>
            </Alert>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Company</dt>
              <dd className="font-medium">{sent.company}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{sent.email}</dd>
              <dt className="text-muted-foreground">Categories</dt>
              <dd className="font-medium">{categoryLabels.join(", ")}</dd>
            </dl>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={inviteAnother}>
              Invite another supplier
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <Card>
            <CardHeader>
              <CardTitle>Supplier details</CardTitle>
              <CardDescription>
                Use the contact person's work email. Fields marked with * are required.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="supplier-email">
                  <Mail className="size-4" aria-hidden="true" />
                  Email address *
                </Label>
                <Input
                  id="supplier-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@supplier.com"
                  value={email}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "supplier-email-error" : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
                  }}
                />
                {errors.email && (
                  <p id="supplier-email-error" className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="size-3.5" aria-hidden="true" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier-company">
                  <Building2 className="size-4" aria-hidden="true" />
                  Company name *
                </Label>
                <Input
                  id="supplier-company"
                  autoComplete="organization"
                  placeholder="Harbour Farms Ltd"
                  value={company}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={errors.company ? "supplier-company-error" : undefined}
                  onChange={(e) => {
                    setCompany(e.target.value)
                    if (errors.company) setErrors((p) => ({ ...p, company: undefined }))
                  }}
                />
                {errors.company && (
                  <p id="supplier-company-error" className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="size-3.5" aria-hidden="true" />
                    {errors.company}
                  </p>
                )}
              </div>

              <fieldset className="space-y-3" aria-describedby={errors.categories ? "supplier-categories-error" : undefined}>
                <legend className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Tags className="size-4" aria-hidden="true" />
                  Categories supplied *
                </legend>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {CATEGORIES.map((category) => {
                    const checked = categories.includes(category.id)
                    return (
                      <Label
                        key={category.id}
                        htmlFor={`category-${category.id}`}
                        className="flex cursor-pointer items-center gap-3 rounded-md border p-3 font-normal has-[[data-state=checked]]:border-primary"
                      >
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={checked}
                          disabled={isSubmitting}
                          onCheckedChange={(value) => toggleCategory(category.id, value === true)}
                        />
                        {category.label}
                      </Label>
                    )
                  })}
                </div>
                {errors.categories && (
                  <p id="supplier-categories-error" className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="size-3.5" aria-hidden="true" />
                    {errors.categories}
                  </p>
                )}
              </fieldset>
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={inviteAnother}
              >
                Clear
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Send className="size-4" aria-hidden="true" />
                {isSubmitting ? "Sending invitation…" : "Send invitation"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </main>
  )
}
