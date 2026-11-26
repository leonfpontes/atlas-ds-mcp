import { useState, type FormEvent } from "react"
import { Check, CircleCheck, Send } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
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
  "Fresh produce",
  "Dairy",
  "Bakery",
  "Meat and poultry",
  "Frozen",
  "Beverages",
  "Dry goods",
  "Household",
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormErrors = {
  email?: string
  company?: string
  categories?: string
}

type SentInvite = {
  email: string
  company: string
  categories: string[]
}

export default function InviteSupplierPage() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<SentInvite | null>(null)

  function toggleCategory(category: string) {
    setCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    )
    setErrors((previous) => ({ ...previous, categories: undefined }))
  }

  function validate(): FormErrors {
    const next: FormErrors = {}
    const trimmedEmail = email.trim()
    const trimmedCompany = company.trim()

    if (!trimmedEmail) {
      next.email = "Enter the supplier's work email."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Enter an email like name@supplier.com."
    }

    if (!trimmedCompany) {
      next.company = "Enter the company name."
    }

    if (categories.length === 0) {
      next.categories = "Choose at least one category."
    }

    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSending(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSending(false)

    const invite: SentInvite = {
      email: email.trim(),
      company: company.trim(),
      categories,
    }
    setSent(invite)
    toast.success(`Invitation sent to ${invite.company}`)
  }

  function inviteAnother() {
    setEmail("")
    setCompany("")
    setCategories([])
    setErrors({})
    setSent(null)
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <Toaster />

      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Invite a supplier</h1>
        <p className="text-sm text-muted-foreground">
          Suppliers you invite can list products for Fernhill Market once they accept.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Supplier details</CardTitle>
          <CardDescription>
            They get an email with a link to create their supplier account.
          </CardDescription>
        </CardHeader>

        {sent ? (
          <>
            <CardContent>
              <Alert variant="success">
                <CircleCheck />
                <AlertTitle>Invitation sent</AlertTitle>
                <AlertDescription>
                  <p>
                    {sent.company} will receive an email at {sent.email}. The invitation
                    stays open for 14 days.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sent.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={inviteAnother}>
                Invite another supplier
              </Button>
            </CardFooter>
          </>
        ) : (
          <form noValidate onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="invite-email" className="text-sm font-medium text-foreground">
                  Work email
                </label>
                <Input
                  id="invite-email"
                  type="email"
                  autoComplete="off"
                  placeholder="name@supplier.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setErrors((previous) => ({ ...previous, email: undefined }))
                  }}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "invite-email-error" : "invite-email-hint"}
                />
                {errors.email ? (
                  <p id="invite-email-error" className="text-sm text-destructive">
                    {errors.email}
                  </p>
                ) : (
                  <p id="invite-email-hint" className="text-sm text-muted-foreground">
                    The invitation is sent to this address.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="invite-company" className="text-sm font-medium text-foreground">
                  Company name
                </label>
                <Input
                  id="invite-company"
                  autoComplete="organization"
                  placeholder="Harrow Valley Farms"
                  value={company}
                  onChange={(event) => {
                    setCompany(event.target.value)
                    setErrors((previous) => ({ ...previous, company: undefined }))
                  }}
                  aria-invalid={errors.company ? true : undefined}
                  aria-describedby={errors.company ? "invite-company-error" : undefined}
                />
                {errors.company ? (
                  <p id="invite-company-error" className="text-sm text-destructive">
                    {errors.company}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <p id="invite-categories-label" className="text-sm font-medium text-foreground">
                  Categories they supply
                </p>
                <p id="invite-categories-hint" className="text-sm text-muted-foreground">
                  Pick every category that applies. You can change this later.
                </p>
                <div
                  role="group"
                  aria-labelledby="invite-categories-label"
                  aria-describedby={
                    errors.categories
                      ? "invite-categories-error invite-categories-hint"
                      : "invite-categories-hint"
                  }
                  className="flex flex-wrap gap-2"
                >
                  {CATEGORIES.map((category) => {
                    const selected = categories.includes(category)
                    return (
                      <Button
                        key={category}
                        type="button"
                        variant={selected ? "secondary" : "outline"}
                        aria-pressed={selected}
                        onClick={() => toggleCategory(category)}
                        className={selected ? "border-primary text-primary" : undefined}
                      >
                        {selected ? <Check /> : null}
                        {category}
                      </Button>
                    )
                  })}
                </div>
                {errors.categories ? (
                  <p id="invite-categories-error" className="text-sm text-destructive">
                    {errors.categories}
                  </p>
                ) : null}
              </div>
            </CardContent>

            <CardFooter className="justify-end">
              <Button type="submit" disabled={sending}>
                <Send />
                {sending ? "Sending invitation…" : "Send invitation"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </main>
  )
}
