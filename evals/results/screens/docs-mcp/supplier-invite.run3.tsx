import { useState, type FormEvent } from "react"
import { Check, Loader2 } from "lucide-react"
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
import { Toaster } from "@/components/ui/sonner"

const CATEGORIES = [
  "Produce",
  "Dairy",
  "Bakery",
  "Meat and fish",
  "Dry goods",
  "Beverages",
  "Frozen",
  "Household",
] as const

type Category = (typeof CATEGORIES)[number]

type FormErrors = {
  email?: string
  company?: string
  categories?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function InviteSupplierPage() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [selected, setSelected] = useState<Category[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [sending, setSending] = useState(false)

  function toggleCategory(category: Category) {
    setSelected((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    )
    setErrors((current) => ({ ...current, categories: undefined }))
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    const trimmedEmail = email.trim()
    const trimmedCompany = company.trim()

    if (!trimmedEmail) {
      next.email = "Enter the supplier's email address."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Enter a full email address, like name@company.com."
    }

    if (!trimmedCompany) {
      next.company = "Enter the company name."
    }

    if (selected.length === 0) {
      next.categories = "Choose at least one category they supply."
    }

    return next
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSending(true)

    const sentTo = email.trim()
    const sentCompany = company.trim()

    window.setTimeout(() => {
      setSending(false)
      toast.success(`Invitation sent to ${sentCompany}`, {
        description: `${sentTo} will get a link to set up their supplier account.`,
      })
      setEmail("")
      setCompany("")
      setSelected([])
      setErrors({})
    }, 800)
  }

  return (
    <main className="mx-auto w-full max-w-xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Invite a supplier</CardTitle>
          <CardDescription>
            They get an email with a link to set up their Fernhill Market supplier account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="invite-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="invite-email"
                type="email"
                autoComplete="off"
                placeholder="name@company.com"
                value={email}
                disabled={sending}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "invite-email-error" : "invite-email-hint"
                }
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((current) => ({ ...current, email: undefined }))
                }}
              />
              {errors.email ? (
                <p id="invite-email-error" className="text-sm text-destructive">
                  {errors.email}
                </p>
              ) : (
                <p id="invite-email-hint" className="text-sm text-muted-foreground">
                  Use the address that receives their orders and invoices.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="invite-company" className="text-sm font-medium">
                Company name
              </label>
              <Input
                id="invite-company"
                autoComplete="organization"
                placeholder="Company legal name"
                value={company}
                disabled={sending}
                aria-invalid={Boolean(errors.company)}
                aria-describedby={errors.company ? "invite-company-error" : undefined}
                onChange={(event) => {
                  setCompany(event.target.value)
                  setErrors((current) => ({ ...current, company: undefined }))
                }}
              />
              {errors.company && (
                <p id="invite-company-error" className="text-sm text-destructive">
                  {errors.company}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span id="invite-categories-label" className="text-sm font-medium">
                Categories they supply
              </span>
              <div
                role="group"
                aria-labelledby="invite-categories-label"
                aria-describedby={
                  errors.categories
                    ? "invite-categories-error"
                    : "invite-categories-hint"
                }
                className="flex flex-wrap gap-2"
              >
                {CATEGORIES.map((category) => {
                  const pressed = selected.includes(category)
                  return (
                    <Button
                      key={category}
                      type="button"
                      variant="outline"
                      aria-pressed={pressed}
                      disabled={sending}
                      onClick={() => toggleCategory(category)}
                      className={
                        pressed
                          ? "border-primary bg-info-subtle text-primary hover:bg-info-subtle"
                          : ""
                      }
                    >
                      {pressed && <Check aria-hidden="true" />}
                      {category}
                    </Button>
                  )
                })}
              </div>
              {errors.categories ? (
                <p id="invite-categories-error" className="text-sm text-destructive">
                  {errors.categories}
                </p>
              ) : (
                <p id="invite-categories-hint" className="text-sm text-muted-foreground">
                  Select every category that applies. You can change this later.
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <Button type="submit" disabled={sending} aria-busy={sending}>
              {sending && <Loader2 className="animate-spin" aria-hidden="true" />}
              {sending ? "Sending invitation" : "Send invitation"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Toaster />
    </main>
  )
}
