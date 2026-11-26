import { useState, type FormEvent } from "react"
import { Check, CircleAlert, CircleCheck, Send } from "lucide-react"
import { toast } from "sonner"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
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
  { id: "produce", label: "Produce" },
  { id: "dairy", label: "Dairy and eggs" },
  { id: "bakery", label: "Bakery" },
  { id: "meat-fish", label: "Meat and fish" },
  { id: "beverages", label: "Beverages" },
  { id: "dry-goods", label: "Dry goods" },
  { id: "frozen", label: "Frozen" },
  { id: "household", label: "Household" },
] as const

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type CategoryId = (typeof CATEGORIES)[number]["id"]

type FormValues = {
  email: string
  company: string
  categories: CategoryId[]
}

type FieldErrors = {
  email?: string
  company?: string
  categories?: string
}

type SentInvite = {
  email: string
  company: string
  categories: CategoryId[]
}

const EMPTY_FORM: FormValues = {
  email: "",
  company: "",
  categories: [],
}

function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((category) => category.id === id)?.label ?? id
}

// Stand-in for the real request to the invitations endpoint.
async function sendInvitation(values: FormValues): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  void values
}

export default function InviteSupplierScreen() {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState<SentInvite | null>(null)

  function updateField<K extends "email" | "company">(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function toggleCategory(id: CategoryId) {
    setValues((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((item) => item !== id)
        : [...prev.categories, id],
    }))
    if (errors.categories) {
      setErrors((prev) => ({ ...prev, categories: undefined }))
    }
  }

  function validate(input: FormValues): FieldErrors {
    const next: FieldErrors = {}
    const email = input.email.trim()

    if (!email) {
      next.email = "Enter the supplier's email address."
    } else if (!EMAIL_PATTERN.test(email)) {
      next.email = "Enter an email like name@supplier.com."
    }

    if (!input.company.trim()) {
      next.company = "Enter the supplier's company name."
    }

    if (input.categories.length === 0) {
      next.categories = "Choose at least one category."
    }

    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload: FormValues = {
      email: values.email.trim(),
      company: values.company.trim(),
      categories: values.categories,
    }

    setSending(true)
    try {
      await sendInvitation(payload)
      setSent({
        email: payload.email,
        company: payload.company,
        categories: payload.categories,
      })
      toast.success(`Invitation sent to ${payload.email}`)
    } catch {
      setFormError(
        "The invitation could not be sent. Check your connection and try again. Your entries are still here."
      )
    } finally {
      setSending(false)
    }
  }

  function inviteAnother() {
    setValues(EMPTY_FORM)
    setErrors({})
    setFormError(null)
    setSent(null)
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Invite a supplier
        </h1>
        <p className="text-sm text-muted-foreground">
          Send an invitation to a supplier for Fernhill Market. They will set
          up their account from the link in the email.
        </p>
      </div>

      <Card>
        {sent ? (
          <>
            <CardHeader>
              <CardTitle>Invitation sent</CardTitle>
              <CardDescription>
                You can invite another supplier at any time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="success">
                <CircleCheck />
                <AlertTitle>{sent.company} has been invited</AlertTitle>
                <AlertDescription>
                  We sent the invitation to {sent.email}. The link expires
                  in 7 days. You will see the supplier as pending until they
                  accept.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {sent.categories.map((id) => (
                    <Badge key={id} variant="secondary">
                      {categoryLabel(id)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" onClick={inviteAnother}>
                Invite another supplier
              </Button>
            </CardFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <CardHeader>
              <CardTitle>Supplier details</CardTitle>
              <CardDescription>
                All fields are required.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {formError && (
                <Alert variant="destructive">
                  <CircleAlert />
                  <AlertTitle>Invitation not sent</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="invite-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <Input
                  id="invite-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="orders@example-supplier.com"
                  value={values.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "invite-email-error" : "invite-email-hint"
                  }
                />
                {errors.email ? (
                  <p
                    id="invite-email-error"
                    className="text-sm text-destructive"
                  >
                    {errors.email}
                  </p>
                ) : (
                  <p
                    id="invite-email-hint"
                    className="text-sm text-muted-foreground"
                  >
                    The invitation is sent to this address.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="invite-company"
                  className="text-sm font-medium text-foreground"
                >
                  Company name
                </label>
                <Input
                  id="invite-company"
                  name="company"
                  autoComplete="organization"
                  placeholder="Riverside Growers Ltd"
                  value={values.company}
                  onChange={(event) =>
                    updateField("company", event.target.value)
                  }
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={
                    errors.company ? "invite-company-error" : undefined
                  }
                />
                {errors.company && (
                  <p
                    id="invite-company-error"
                    className="text-sm text-destructive"
                  >
                    {errors.company}
                  </p>
                )}
              </div>

              <fieldset
                className="space-y-2"
                aria-describedby={
                  errors.categories
                    ? "invite-categories-error"
                    : "invite-categories-hint"
                }
              >
                <legend className="text-sm font-medium text-foreground">
                  Categories they supply
                </legend>
                <p
                  id="invite-categories-hint"
                  className="text-sm text-muted-foreground"
                >
                  Choose every category that applies.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {CATEGORIES.map((category) => {
                    const selected = values.categories.includes(category.id)
                    return (
                      <Button
                        key={category.id}
                        type="button"
                        variant="outline"
                        aria-pressed={selected}
                        onClick={() => toggleCategory(category.id)}
                        className={
                          selected
                            ? "border-primary bg-info-subtle text-primary hover:bg-info-subtle"
                            : undefined
                        }
                      >
                        {selected && <Check />}
                        {category.label}
                      </Button>
                    )
                  })}
                </div>
                {errors.categories && (
                  <p
                    id="invite-categories-error"
                    className="text-sm text-destructive"
                  >
                    {errors.categories}
                  </p>
                )}
              </fieldset>
            </CardContent>

            <CardFooter className="justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setValues(EMPTY_FORM)
                  setErrors({})
                  setFormError(null)
                }}
                disabled={sending}
              >
                Clear form
              </Button>
              <Button type="submit" disabled={sending}>
                <Send />
                {sending ? "Sending invitation…" : "Send invitation"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>

      <Toaster position="bottom-right" />
    </main>
  )
}
