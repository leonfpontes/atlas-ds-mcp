import { useId, useState, type FormEvent } from "react"
import { AlertCircle, Building2, CheckCircle2, Loader2, Mail, Send } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SUPPLIER_CATEGORIES = [
  { id: "fresh-produce", label: "Fresh produce" },
  { id: "bakery", label: "Bakery" },
  { id: "dairy-eggs", label: "Dairy & eggs" },
  { id: "meat-fish", label: "Meat & fish" },
  { id: "grocery", label: "Pantry & grocery" },
  { id: "beverages", label: "Beverages" },
  { id: "frozen", label: "Frozen" },
  { id: "household", label: "Household" },
] as const

const RECENT_INVITES = [
  { id: "inv-1", company: "Hollow Oak Farm", email: "orders@hollowoak.example", categories: ["Fresh produce"], status: "Pending" },
  { id: "inv-2", company: "Northgate Creamery", email: "hello@northgate.example", categories: ["Dairy & eggs"], status: "Accepted" },
] as const

type CategoryId = (typeof SUPPLIER_CATEGORIES)[number]["id"]

type FormValues = {
  email: string
  companyName: string
  categories: CategoryId[]
}

type FormErrors = Partial<Record<keyof FormValues, string>>

type SubmitStatus = "idle" | "sending" | "sent"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.email.trim()) {
    errors.email = "Enter the supplier's email address."
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address, such as orders@supplier.com."
  }

  if (!values.companyName.trim()) {
    errors.companyName = "Enter the supplier's company name."
  } else if (values.companyName.trim().length < 2) {
    errors.companyName = "Company name must be at least 2 characters."
  }

  if (values.categories.length === 0) {
    errors.categories = "Select at least one category this supplier provides."
  }

  return errors
}

function sendInvitation(values: FormValues): Promise<void> {
  // Replace with the real API call (for example, POST /api/supplier-invitations).
  return new Promise((resolve) => {
    setTimeout(resolve, 900)
  })
}

export default function InviteSupplierScreen() {
  const ids = {
    email: useId(),
    companyName: useId(),
    emailError: useId(),
    companyNameError: useId(),
    categoriesError: useId(),
  }

  const [email, setEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [categories, setCategories] = useState<CategoryId[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const [sentTo, setSentTo] = useState("")
  const [sentCompany, setSentCompany] = useState("")

  const isSending = status === "sending"

  function toggleCategory(id: CategoryId, checked: boolean) {
    setCategories((current) =>
      checked ? [...current, id] : current.filter((value) => value !== id),
    )
    if (errors.categories) {
      setErrors((current) => ({ ...current, categories: undefined }))
    }
  }

  function clearFieldError(field: keyof FormValues) {
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSending) return

    const values: FormValues = { email: email.trim(), companyName: companyName.trim(), categories }
    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = (Object.keys(nextErrors) as (keyof FormValues)[])[0]
      document.getElementById(ids[firstInvalid === "categories" ? "categoriesError" : firstInvalid])?.scrollIntoView?.({ block: "center" })
      return
    }

    setStatus("sending")
    try {
      await sendInvitation(values)
      setSentTo(values.email)
      setSentCompany(values.companyName)
      setStatus("sent")
      toast.success("Invitation sent", {
        description: `${values.companyName} will receive an email at ${values.email}.`,
      })
    } catch {
      setStatus("idle")
      toast.error("The invitation could not be sent", {
        description: "Check your connection and try again.",
      })
    }
  }

  function resetForm() {
    setEmail("")
    setCompanyName("")
    setCategories([])
    setErrors({})
    setSentTo("")
    setSentCompany("")
    setStatus("idle")
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Fernhill Market · Suppliers</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Invite a supplier</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Send an invitation to a supplier. They will get a link to create an account and confirm the
          product categories they can deliver.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card>
          {status === "sent" ? (
            <>
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="size-6 text-primary" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-foreground">Invitation sent</h2>
                  <p role="status" className="text-sm text-muted-foreground">
                    We emailed <span className="font-medium text-foreground">{sentTo}</span> an invitation
                    for <span className="font-medium text-foreground">{sentCompany}</span>. The link expires
                    in 7 days.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-center gap-2">
                <Button variant="outline" onClick={resetForm}>
                  Invite another supplier
                </Button>
              </CardFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <CardHeader>
                <CardTitle>Supplier details</CardTitle>
                <CardDescription>
                  The supplier uses the email address below to accept the invitation.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor={ids.email}>Email address</Label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={ids.email}
                      type="email"
                      inputMode="email"
                      autoComplete="off"
                      placeholder="orders@supplier.com"
                      className="pl-9"
                      value={email}
                      disabled={isSending}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? ids.emailError : undefined}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        clearFieldError("email")
                      }}
                    />
                  </div>
                  {errors.email && (
                    <FieldError id={ids.emailError}>{errors.email}</FieldError>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={ids.companyName}>Company name</Label>
                  <div className="relative">
                    <Building2
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id={ids.companyName}
                      autoComplete="organization"
                      placeholder="Hollow Oak Farm"
                      className="pl-9"
                      value={companyName}
                      disabled={isSending}
                      aria-invalid={Boolean(errors.companyName)}
                      aria-describedby={errors.companyName ? ids.companyNameError : undefined}
                      onChange={(event) => {
                        setCompanyName(event.target.value)
                        clearFieldError("companyName")
                      }}
                    />
                  </div>
                  {errors.companyName && (
                    <FieldError id={ids.companyNameError}>{errors.companyName}</FieldError>
                  )}
                </div>

                <fieldset className="grid gap-3" aria-describedby={errors.categories ? ids.categoriesError : undefined}>
                  <div className="flex items-center justify-between gap-2">
                    <legend className="text-sm font-medium text-foreground">Categories they supply</legend>
                    <Badge variant="secondary">{categories.length} selected</Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SUPPLIER_CATEGORIES.map((category) => {
                      const checkboxId = `${ids.categoriesError}-${category.id}`
                      const checked = categories.includes(category.id)
                      return (
                        <label
                          key={category.id}
                          htmlFor={checkboxId}
                          className={[
                            "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors",
                            checked ? "border-primary bg-primary/5" : "border-input hover:bg-accent",
                            isSending ? "pointer-events-none opacity-60" : "",
                          ].join(" ")}
                        >
                          <Checkbox
                            id={checkboxId}
                            checked={checked}
                            disabled={isSending}
                            onCheckedChange={(value) => toggleCategory(category.id, value === true)}
                          />
                          <span className="text-foreground">{category.label}</span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.categories && (
                    <FieldError id={ids.categoriesError}>{errors.categories}</FieldError>
                  )}
                </fieldset>
              </CardContent>

              <CardFooter className="justify-between gap-3 border-t pt-6">
                <p className="text-xs text-muted-foreground">
                  Invitations expire after 7 days.
                </p>
                <Button type="submit" disabled={isSending}>
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
              </CardFooter>
            </form>
          )}
        </Card>

        <aside className="flex flex-col gap-4">
          <h2 className="text-sm font-medium text-foreground">Recent invitations</h2>
          <ul className="flex flex-col gap-3">
            {RECENT_INVITES.map((invite) => (
              <li key={invite.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{invite.company}</p>
                  <Badge variant={invite.status === "Accepted" ? "default" : "outline"}>
                    {invite.status}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{invite.email}</p>
                <p className="mt-2 text-xs text-muted-foreground">{invite.categories.join(", ")}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  )
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="flex items-center gap-1.5 text-sm text-destructive">
      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  )
}
