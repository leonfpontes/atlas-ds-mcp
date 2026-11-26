import { useRef, useState, type FormEvent } from "react"
import { Check, CircleCheck, Send, TriangleAlert } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

const CATEGORIES = [
  "Produce",
  "Dairy",
  "Bakery",
  "Meat and fish",
  "Frozen",
  "Dry goods",
  "Beverages",
  "Household",
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FormErrors = {
  email?: string
  company?: string
  categories?: string
}

export default function InviteSupplierPage() {
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [selected, setSelected] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [sentTo, setSentTo] = useState<string | null>(null)

  const emailRef = useRef<HTMLInputElement>(null)
  const companyRef = useRef<HTMLInputElement>(null)
  const firstCategoryRef = useRef<HTMLButtonElement>(null)

  function validate(): FormErrors {
    const next: FormErrors = {}
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      next.email = "Enter the supplier's work email address."
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = "Enter an email address like name@company.com."
    }

    if (!company.trim()) {
      next.company = "Enter the supplier's company name."
    }

    if (selected.length === 0) {
      next.categories = "Choose at least one category they supply."
    }

    return next
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validate()
    setErrors(next)

    if (next.email) {
      emailRef.current?.focus()
      return
    }
    if (next.company) {
      companyRef.current?.focus()
      return
    }
    if (next.categories) {
      firstCategoryRef.current?.focus()
      return
    }

    const address = email.trim()
    setSentTo(address)
    toast.success(`Invitation sent to ${address}`)
  }

  function toggleCategory(category: string) {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    )
    setErrors((prev) => ({ ...prev, categories: undefined }))
  }

  function resetForm() {
    setEmail("")
    setCompany("")
    setSelected([])
    setErrors({})
    setSentTo(null)
  }

  return (
    <>
      <Toaster />
      <main className="mx-auto w-full max-w-xl p-4 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Invite a supplier</CardTitle>
            <CardDescription>
              They get an email with a link to set up their Fernhill Market supplier account.
            </CardDescription>
          </CardHeader>

          {sentTo === null ? (
            <form noValidate onSubmit={handleSubmit}>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="invite-email" className="text-sm font-medium text-foreground">
                    Work email
                  </label>
                  <Input
                    id="invite-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="off"
                    placeholder="name@company.com"
                    value={email}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "invite-email-error" : "invite-email-hint"}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                  />
                  {errors.email ? (
                    <p id="invite-email-error" className="flex items-center gap-1.5 text-sm text-destructive">
                      <TriangleAlert aria-hidden className="size-4 shrink-0" />
                      {errors.email}
                    </p>
                  ) : (
                    <p id="invite-email-hint" className="text-sm text-muted-foreground">
                      The address they sign in with.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="invite-company" className="text-sm font-medium text-foreground">
                    Company name
                  </label>
                  <Input
                    id="invite-company"
                    ref={companyRef}
                    type="text"
                    autoComplete="organization"
                    placeholder="Company legal or trading name"
                    value={company}
                    aria-invalid={errors.company ? true : undefined}
                    aria-describedby={errors.company ? "invite-company-error" : undefined}
                    onChange={(e) => {
                      setCompany(e.target.value)
                      setErrors((prev) => ({ ...prev, company: undefined }))
                    }}
                  />
                  {errors.company && (
                    <p id="invite-company-error" className="flex items-center gap-1.5 text-sm text-destructive">
                      <TriangleAlert aria-hidden className="size-4 shrink-0" />
                      {errors.company}
                    </p>
                  )}
                </div>

                <fieldset
                  className="flex flex-col gap-2"
                  aria-describedby={errors.categories ? "invite-categories-error" : "invite-categories-hint"}
                >
                  <legend className="mb-2 text-sm font-medium text-foreground">
                    Categories they supply
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category, index) => {
                      const isOn = selected.includes(category)
                      return (
                        <Button
                          key={category}
                          ref={index === 0 ? firstCategoryRef : undefined}
                          type="button"
                          variant="outline"
                          aria-pressed={isOn}
                          onClick={() => toggleCategory(category)}
                          className={
                            isOn
                              ? "border-primary bg-info-subtle text-primary hover:bg-info-subtle"
                              : undefined
                          }
                        >
                          {isOn && <Check aria-hidden />}
                          {category}
                        </Button>
                      )
                    })}
                  </div>
                  {errors.categories ? (
                    <p id="invite-categories-error" className="flex items-center gap-1.5 text-sm text-destructive">
                      <TriangleAlert aria-hidden className="size-4 shrink-0" />
                      {errors.categories}
                    </p>
                  ) : (
                    <p id="invite-categories-hint" className="text-sm text-muted-foreground">
                      Pick every category that applies. You can change them later.
                    </p>
                  )}
                </fieldset>
              </CardContent>

              <CardFooter className="justify-end">
                <Button type="submit">
                  <Send aria-hidden />
                  Send invitation
                </Button>
              </CardFooter>
            </form>
          ) : (
            <>
              <CardContent>
                <div role="status" className="flex flex-col gap-2">
                  <p className="flex items-center gap-2 font-medium text-success">
                    <CircleCheck aria-hidden className="size-5" />
                    Invitation sent
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We emailed {sentTo} an invitation to join Fernhill Market for {company.trim()}.
                    They can accept it from the link in that email.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Invite another supplier
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </main>
    </>
  )
}
