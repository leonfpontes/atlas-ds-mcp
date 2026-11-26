import { useState, type FormEvent } from "react"
import { Check, CircleCheck, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Mount <Toaster /> from "@/components/ui/sonner" once at the app root.

const CATEGORIES = [
  "Produce",
  "Dairy",
  "Bakery",
  "Meat and fish",
  "Frozen",
  "Beverages",
  "Household",
  "Dry goods",
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormErrors = {
  email?: string
  company?: string
  categories?: string
}

// Stand-in for the real invitation request.
function sendInvitation(payload: { email: string; company: string; categories: string[] }) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 800)
  })
}

export default function InviteSupplierPage() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<{ email: string; company: string } | null>(null)

  function toggleCategory(category: string) {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    )
    if (errors.categories) {
      setErrors((current) => ({ ...current, categories: undefined }))
    }
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    const trimmedEmail = email.trim()
    const trimmedCompany = company.trim()

    if (!trimmedEmail) {
      next.email = "Enter the supplier's work email."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Enter an email like name@company.com."
    }

    if (!trimmedCompany) {
      next.company = "Enter the company name."
    }

    if (categories.length === 0) {
      next.categories = "Choose at least one category they supply."
    }

    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      email: email.trim(),
      company: company.trim(),
      categories,
    }

    setSending(true)
    try {
      await sendInvitation(payload)
      setSent({ email: payload.email, company: payload.company })
      toast.success(`Invitation sent to ${payload.email}`)
    } finally {
      setSending(false)
    }
  }

  function inviteAnother() {
    setEmail("")
    setCompany("")
    setCategories([])
    setErrors({})
    setSent(null)
  }

  if (sent) {
    return (
      <main className="mx-auto w-full max-w-xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Invitation sent</CardTitle>
            <CardDescription>
              We emailed {sent.email}. The invitation stays open for 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                When {sent.company} accepts, its catalogue and categories appear in
                your supplier list.
              </span>
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={inviteAnother}>
              Invite another supplier
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite a supplier</CardTitle>
          <CardDescription>
            Send an invitation to a supplier for Fernhill Market. They will create an
            account and add their products.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="supplier-email" className="text-sm font-medium">
                Work email
              </label>
              <Input
                id="supplier-email"
                type="email"
                autoComplete="email"
                placeholder="name@supplier.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (errors.email) setErrors((current) => ({ ...current, email: undefined }))
                }}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "supplier-email-error" : undefined}
              />
              {errors.email && (
                <p id="supplier-email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="supplier-company" className="text-sm font-medium">
                Company name
              </label>
              <Input
                id="supplier-company"
                autoComplete="organization"
                placeholder="Harrow Dairy Co."
                value={company}
                onChange={(event) => {
                  setCompany(event.target.value)
                  if (errors.company) setErrors((current) => ({ ...current, company: undefined }))
                }}
                aria-invalid={Boolean(errors.company)}
                aria-describedby={errors.company ? "supplier-company-error" : undefined}
              />
              {errors.company && (
                <p id="supplier-company-error" className="text-sm text-destructive">
                  {errors.company}
                </p>
              )}
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium">Categories they supply</legend>
              <p className="text-sm text-muted-foreground">Select all that apply.</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => {
                  const pressed = categories.includes(category)
                  return (
                    <Button
                      key={category}
                      type="button"
                      variant={pressed ? "secondary" : "outline"}
                      aria-pressed={pressed}
                      onClick={() => toggleCategory(category)}
                    >
                      {pressed && <Check aria-hidden="true" />}
                      {category}
                    </Button>
                  )
                })}
              </div>
              {errors.categories && (
                <p id="supplier-categories-error" className="text-sm text-destructive">
                  {errors.categories}
                </p>
              )}
            </fieldset>
          </CardContent>

          <CardFooter className="justify-end">
            <Button type="submit" disabled={sending}>
              <Send aria-hidden="true" />
              {sending ? "Sending invitation…" : "Send invitation"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
