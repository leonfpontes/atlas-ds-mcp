import { useState, type FormEvent } from "react"
import { CheckCircle2, Loader2, Mail, Building2, Send } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SUPPLIER_CATEGORIES = [
  { id: "produce", label: "Fresh produce" },
  { id: "dairy", label: "Dairy & eggs" },
  { id: "bakery", label: "Bakery" },
  { id: "meat", label: "Meat & poultry" },
  { id: "seafood", label: "Seafood" },
  { id: "grocery", label: "Dry grocery" },
  { id: "beverages", label: "Beverages" },
  { id: "frozen", label: "Frozen" },
  { id: "household", label: "Household" },
  { id: "organic", label: "Organic" },
] as const

type CategoryId = (typeof SUPPLIER_CATEGORIES)[number]["id"]
type FormErrors = Partial<Record<"email" | "company" | "categories", string>>
type Status = "idle" | "sending" | "sent"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(email: string, company: string, categories: CategoryId[]): FormErrors {
  const errors: FormErrors = {}
  if (!email.trim()) {
    errors.email = "Enter the supplier's email address."
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Enter a valid email address, such as name@company.com."
  }
  if (!company.trim()) {
    errors.company = "Enter the supplier's company name."
  }
  if (categories.length === 0) {
    errors.categories = "Select at least one category this supplier provides."
  }
  return errors
}

export default function InviteSupplierScreen() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [selected, setSelected] = useState<CategoryId[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [sentTo, setSentTo] = useState<{ email: string; company: string } | null>(null)

  const toggleCategory = (id: CategoryId) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
    setErrors((prev) => ({ ...prev, categories: undefined }))
  }

  const resetForm = () => {
    setEmail("")
    setCompany("")
    setSelected([])
    setErrors({})
    setSentTo(null)
    setStatus("idle")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(email, company, selected)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus("sending")
    try {
      // Replace with the real invitation request.
      await new Promise((resolve) => setTimeout(resolve, 800))
      const trimmedEmail = email.trim()
      const trimmedCompany = company.trim()
      setSentTo({ email: trimmedEmail, company: trimmedCompany })
      setStatus("sent")
      toast.success(`Invitation sent to ${trimmedCompany}`)
    } catch {
      setStatus("idle")
      toast.error("We couldn't send the invitation. Please try again.")
    }
  }

  if (status === "sent" && sentTo) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="size-6" aria-hidden="true" />
            </div>
            <CardTitle>Invitation sent</CardTitle>
            <CardDescription>
              {sentTo.company} will receive an email at <span className="font-medium">{sentTo.email}</span> with
              a link to join Fernhill Market as a supplier.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-sm text-muted-foreground">Categories requested</p>
            <div className="flex flex-wrap gap-2">
              {SUPPLIER_CATEGORIES.filter((c) => selected.includes(c.id)).map((c) => (
                <Badge key={c.id} variant="secondary">
                  {c.label}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-center gap-2">
            <Button variant="outline" onClick={resetForm}>
              Invite another supplier
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const isSending = status === "sending"

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Invite a supplier</h1>
        <p className="text-sm text-muted-foreground">
          Send an invitation to a supplier you want to work with at Fernhill Market. They'll complete their
          company profile after they accept.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="supplier-email">Supplier email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="supplier-email"
              type="email"
              autoComplete="email"
              placeholder="buyer@supplier.com"
              className="pl-9"
              value={email}
              disabled={isSending}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "supplier-email-error" : undefined}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: undefined }))
              }}
            />
          </div>
          {errors.email && (
            <p id="supplier-email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="supplier-company">Company name</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="supplier-company"
              autoComplete="organization"
              placeholder="Harbour Fresh Ltd"
              className="pl-9"
              value={company}
              disabled={isSending}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "supplier-company-error" : undefined}
              onChange={(e) => {
                setCompany(e.target.value)
                setErrors((prev) => ({ ...prev, company: undefined }))
              }}
            />
          </div>
          {errors.company && (
            <p id="supplier-company-error" className="text-sm text-destructive">
              {errors.company}
            </p>
          )}
        </div>

        <fieldset className="flex flex-col gap-3" disabled={isSending} aria-describedby={errors.categories ? "supplier-categories-error" : undefined}>
          <div className="flex flex-col gap-1">
            <legend className="text-sm leading-none font-medium">Categories they supply</legend>
            <p className="text-sm text-muted-foreground">Choose every category that applies.</p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SUPPLIER_CATEGORIES.map((category) => {
              const checked = selected.includes(category.id)
              return (
                <Label
                  key={category.id}
                  htmlFor={`category-${category.id}`}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 font-normal transition-colors hover:bg-accent ${
                    checked ? "border-primary bg-accent" : ""
                  }`}
                >
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={checked}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  {category.label}
                </Label>
              )
            })}
          </div>
          {errors.categories && (
            <p id="supplier-categories-error" className="text-sm text-destructive">
              {errors.categories}
            </p>
          )}
        </fieldset>

        <div className="flex items-center justify-end gap-2 border-t pt-4">
          <Button type="button" variant="ghost" onClick={resetForm} disabled={isSending}>
            Clear
          </Button>
          <Button type="submit" disabled={isSending} aria-busy={isSending}>
            {isSending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sending
              </>
            ) : (
              <>
                <Send className="size-4" aria-hidden="true" />
                Send invitation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
