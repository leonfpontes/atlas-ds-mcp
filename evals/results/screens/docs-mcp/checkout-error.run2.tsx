import { useState, type FormEvent } from "react"
import { ArrowLeft, CircleAlert, CircleCheck, CreditCard, Lock, X } from "lucide-react"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"
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

type OrderLine = {
  id: string
  name: string
  detail: string
  quantity: number
  unitPrice: number
}

type CardFields = {
  name: string
  number: string
  expiry: string
  cvc: string
}

type FieldErrors = Partial<Record<keyof CardFields, string>>

const ORDER_LINES: OrderLine[] = [
  {
    id: "line-1",
    name: "Heirloom tomatoes",
    detail: "1 kg, local farm",
    quantity: 2,
    unitPrice: 6.5,
  },
  {
    id: "line-2",
    name: "Sourdough loaf",
    detail: "Baked this morning",
    quantity: 1,
    unitPrice: 7.2,
  },
  {
    id: "line-3",
    name: "Free-range eggs",
    detail: "Dozen, medium",
    quantity: 1,
    unitPrice: 5.9,
  },
  {
    id: "line-4",
    name: "Oat milk",
    detail: "1 L, unsweetened",
    quantity: 3,
    unitPrice: 2.4,
  },
]

const DELIVERY_FEE = 4.99
const TAX_RATE = 0.08
const DECLINED_CARD_LAST4 = "4242"
const DECLINE_REASON = "Your bank declined this card."

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function validateCard(fields: CardFields): FieldErrors {
  const errors: FieldErrors = {}
  const digits = fields.number.replace(/\s/g, "")

  if (fields.name.trim().length < 2) {
    errors.name = "Enter the name as it appears on the card."
  }
  if (!/^\d{13,19}$/.test(digits)) {
    errors.number = "Enter a valid card number, 13 to 19 digits."
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fields.expiry.trim())) {
    errors.expiry = "Use the format MM/YY."
  }
  if (!/^\d{3,4}$/.test(fields.cvc.trim())) {
    errors.cvc = "Enter the 3 or 4 digit security code."
  }

  return errors
}

export default function CheckoutPaymentDeclined() {
  const [declineVisible, setDeclineVisible] = useState(true)
  const [fields, setFields] = useState<CardFields>({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const subtotal = ORDER_LINES.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0
  )
  const tax = subtotal * TAX_RATE
  const total = subtotal + DELIVERY_FEE + tax

  function updateField(key: keyof CardFields, value: string) {
    setFields((current) => ({ ...current, [key]: value }))
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateCard(fields)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = event.currentTarget.querySelector<HTMLInputElement>(
        "[aria-invalid='true']"
      )
      firstInvalid?.focus()
      return
    }

    setSubmitting(true)
    // Stand-in for the payment request. Replace with the real authorization call.
    window.setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setDeclineVisible(false)
    }, 1000)
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Fernhill Market</p>
        <h1 className="text-2xl font-semibold text-foreground">Payment</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Step 2 of 3: Pay for your order
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="payment-heading" className="flex flex-col gap-6">
          {submitted ? (
            <Alert variant="success">
              <CircleCheck />
              <AlertTitle>Payment accepted</AlertTitle>
              <AlertDescription>
                Your card was approved. We are preparing your order now.
              </AlertDescription>
            </Alert>
          ) : null}

          {declineVisible && !submitted ? (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Your card was declined</AlertTitle>
              <AlertDescription>
                <p>
                  {DECLINE_REASON} The card ending in {DECLINED_CARD_LAST4} was not
                  charged. Check the card details, or try another card. Your
                  order is saved.
                </p>
              </AlertDescription>
              <AlertAction>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Dismiss"
                  onClick={() => setDeclineVisible(false)}
                >
                  <X />
                </Button>
              </AlertAction>
            </Alert>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle id="payment-heading">Try another card</CardTitle>
              <CardDescription>
                We accept Visa, Mastercard and American Express.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <label htmlFor="card-name" className="text-sm font-medium text-foreground">
                    Name on card
                  </label>
                  <Input
                    id="card-name"
                    name="name"
                    autoComplete="cc-name"
                    placeholder="Full name"
                    value={fields.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "card-name-error" : undefined}
                  />
                  {errors.name ? (
                    <p id="card-name-error" className="text-sm text-destructive">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2 sm:col-span-2">
                  <label htmlFor="card-number" className="text-sm font-medium text-foreground">
                    Card number
                  </label>
                  <Input
                    id="card-number"
                    name="number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={fields.number}
                    onChange={(event) => updateField("number", event.target.value)}
                    aria-invalid={Boolean(errors.number)}
                    aria-describedby={errors.number ? "card-number-error" : undefined}
                  />
                  {errors.number ? (
                    <p id="card-number-error" className="text-sm text-destructive">
                      {errors.number}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="card-expiry" className="text-sm font-medium text-foreground">
                    Expiry date
                  </label>
                  <Input
                    id="card-expiry"
                    name="expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={fields.expiry}
                    onChange={(event) => updateField("expiry", event.target.value)}
                    aria-invalid={Boolean(errors.expiry)}
                    aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
                  />
                  {errors.expiry ? (
                    <p id="card-expiry-error" className="text-sm text-destructive">
                      {errors.expiry}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <label htmlFor="card-cvc" className="text-sm font-medium text-foreground">
                    Security code
                  </label>
                  <Input
                    id="card-cvc"
                    name="cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="CVC"
                    value={fields.cvc}
                    onChange={(event) => updateField("cvc", event.target.value)}
                    aria-invalid={Boolean(errors.cvc)}
                    aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
                  />
                  {errors.cvc ? (
                    <p id="card-cvc-error" className="text-sm text-destructive">
                      {errors.cvc}
                    </p>
                  ) : null}
                </div>

                <p className="flex items-center gap-2 text-sm text-muted-foreground sm:col-span-2">
                  <Lock className="size-4" aria-hidden="true" />
                  Your card details are encrypted and sent to your bank.
                </p>
              </CardContent>

              <CardFooter className="flex flex-col-reverse gap-3 border-t border-border sm:flex-row sm:justify-between">
                <Button variant="outline" asChild>
                  <a href="#cart">
                    <ArrowLeft />
                    Back to cart
                  </a>
                </Button>
                <Button type="submit" disabled={submitting}>
                  <CreditCard />
                  {submitting ? "Processing payment" : `Pay ${currency.format(total)}`}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </section>

        <aside aria-labelledby="summary-heading">
          <Card>
            <CardHeader>
              <CardTitle id="summary-heading">Order summary</CardTitle>
              <CardDescription>4 items from Fernhill Market</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-3">
                {ORDER_LINES.map((line) => (
                  <li key={line.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{line.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {line.detail} × {line.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-foreground tabular-nums">
                      {currency.format(line.unitPrice * line.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums text-foreground">{currency.format(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular-nums text-foreground">
                    {currency.format(DELIVERY_FEE)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax (8%)</dt>
                  <dd className="tabular-nums text-foreground">{currency.format(tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <dt className="text-foreground">Total</dt>
                  <dd className="tabular-nums text-foreground">{currency.format(total)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
