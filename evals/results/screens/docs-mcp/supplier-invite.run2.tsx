import { useId, useState, type FormEvent } from "react"
import { Check, CircleAlert, CircleCheck, Send } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
]

const EXAMPLE_INVITE = {
  email: "orders@hillsidefarm.example",
  company: "Hillside Farm Co-op",
  categories: ["Produce", "Dairy"],
}

type FormErrors = {
  email?: string
  company?: string
  categories?: string
}

type SendStatus = "idle" | "sending" | "sent" | "error"

type InvitePayload = {
  email: string
  company: string
  categories: string[]
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function sendInvitation(payload: InvitePayload): Promise<void> {
  const response = await fetch("/api/supplier-invitations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Invitation failed with status ${response.status}`)
  }
}

function validate(email: string, company: string, categories: string[]): FormErrors {
  const errors: FormErrors = {}

  const trimmedEmail = email.trim()
  if (!trimmedEmail) {
    errors.email = "Enter the supplier's email address."
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = "Enter an email like name@company.com."
  }

  if (!company.trim()) {
    errors.company = "Enter the supplier's company name."
  }

  if (categories.length === 0) {
    errors.categories = "Choose at least one category they supply."
  }

  return errors
}

export default function InviteSupplierPage() {
  const formId = useId()
  const emailId = `${formId}-email`
  const emailErrorId = `${formId}-email-error`
  const companyId = `${formId}-company`
  const companyErrorId = `${formId}-company-error`
  const categoriesErrorId = `${formId}-categories-error`

  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SendStatus>("idle")
  const [sentTo, setSentTo] = useState("")

  const isSending = status === "sending"

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

  function resetForm() {
    setEmail("")
    setCompany("")
    setCategories([])
    setErrors({})
    setSentTo("")
    setStatus("idle")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSending) return

    const nextErrors = validate(email, company, categories)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload: InvitePayload = {
      email: email.trim(),
      company: company.trim(),
      categories,
    }

    setStatus("sending")
    try {
      await sendInvitation(payload)
      setSentTo(payload.email)
      setStatus("sent")
      toast.success(`Invitation sent to ${payload.email}`)
    } catch {
      setStatus("error")
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
          <h1 className="text-2xl font-semibold tracking-tight">Invite a supplier</h1>
          <p className="text-sm text-muted-foreground">
            Send an invitation so a supplier can list their products with us.
          </p>
        </div>

        {status === "sent" ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CircleCheck aria-hidden="true" className="size-5" />
                Invitation sent
              </CardTitle>
              <CardDescription>
                We sent an invitation to {sentTo}. The supplier can set up their account
                from the link in the email.
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
              <Button variant="outline" onClick={resetForm}>
                Invite another supplier
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Supplier details</CardTitle>
              <CardDescription>
                They receive an email with a link to set up their supplier account.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="flex flex-col gap-6">
                {status === "error" && (
                  <Alert variant="destructive" role="alert">
                    <CircleAlert aria-hidden="true" />
                    <AlertTitle>The invitation was not sent</AlertTitle>
                    <AlertDescription>
                      Check your connection, then send the invitation again. Your details
                      are still filled in.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor={emailId} className="text-sm font-medium">
                    Supplier email
                  </label>
                  <Input
                    id={emailId}
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    value={email}
                    disabled={isSending}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? emailErrorId : undefined}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (errors.email) setErrors((current) => ({ ...current, email: undefined }))
                    }}
                  />
                  {errors.email && (
                    <p id={emailErrorId} className="flex items-center gap-1.5 text-sm text-destructive">
                      <CircleAlert aria-hidden="true" className="size-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor={companyId} className="text-sm font-medium">
                    Company name
                  </label>
                  <Input
                    id={companyId}
                    autoComplete="organization"
                    placeholder="Registered trading name"
                    value={company}
                    disabled={isSending}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={errors.company ? companyErrorId : undefined}
                    onChange={(event) => {
                      setCompany(event.target.value)
                      if (errors.company) setErrors((current) => ({ ...current, company: undefined }))
                    }}
                  />
                  {errors.company && (
                    <p id={companyErrorId} className="flex items-center gap-1.5 text-sm text-destructive">
                      <CircleAlert aria-hidden="true" className="size-4" />
                      {errors.company}
                    </p>
                  )}
                </div>

                <fieldset
                  className="flex flex-col gap-2"
                  aria-describedby={errors.categories ? categoriesErrorId : undefined}
                >
                  <legend className="mb-2 text-sm font-medium">Categories they supply</legend>
                  <p className="text-sm text-muted-foreground">Select every category that applies.</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => {
                      const selected = categories.includes(category)
                      return (
                        <Button
                          key={category}
                          type="button"
                          variant={selected ? "secondary" : "outline"}
                          aria-pressed={selected}
                          disabled={isSending}
                          onClick={() => toggleCategory(category)}
                          className={selected ? "border-primary text-primary" : undefined}
                        >
                          {selected && <Check aria-hidden="true" />}
                          {category}
                        </Button>
                      )
                    })}
                  </div>
                  {errors.categories && (
                    <p id={categoriesErrorId} className="flex items-center gap-1.5 text-sm text-destructive">
                      <CircleAlert aria-hidden="true" className="size-4" />
                      {errors.categories}
                    </p>
                  )}
                </fieldset>
              </CardContent>

              <CardFooter className="justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isSending}
                  onClick={resetForm}
                >
                  Clear form
                </Button>
                <Button type="submit" disabled={isSending}>
                  <Send aria-hidden="true" />
                  {isSending ? "Sending invitation…" : "Send invitation"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
      <Toaster position="bottom-right" />
    </main>
  )
}
