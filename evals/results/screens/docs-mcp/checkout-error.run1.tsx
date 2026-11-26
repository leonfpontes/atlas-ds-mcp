import { useState, type FormEvent, type ReactNode } from "react"
import { ArrowLeft, CircleAlert, CreditCard, Lock } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
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
import { Toaster } from "@/components/ui/sonner"

type OrderItem = {
  id: string
  name: string
  detail: string
  quantity: number
  unitPriceCents: number
}

const DECLINED_CARD = {
  brand: "Visa",
  last4: "4242",
}

const ORDER_ITEMS: OrderItem[] = [
  {
    id: "sourdough",
    name: "Sourdough loaf",
    detail: "Fernhill Bakery",
    quantity: 1,
    unitPriceCents: 650,
  },
  {
    id: "oat-milk",
    name: "Oat milk, 1 L",
    detail: "Fernhill Dairy Alternatives",
    quantity: 2,
    unitPriceCents: 249,
  },
  {
    id: "apples",
    name: "Honeycrisp apples, 1 kg",
    detail: "Local orchard",
    quantity: 1,
    unitPriceCents: 575,
  },
  {
    id: "coffee",
    name: "Dark roast beans, 250 g",
    detail: "Roasted in Fernhill",
    quantity: 1,
    unitPriceCents: 1120,
  },
]

const TAX_CENTS = 227
const SHIPPING_CENTS = 499

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

const formatMoney = (cents: number) => currency.format(cents / 100)

type PaymentFields = {
  cardholder: string
  number: string
  expiry: string
  cvc: string
}

type PaymentErrors = Partial<Record<keyof PaymentFields, string>>

const EMPTY_FIELDS: PaymentFields = {
  cardholder: "",
  number: "",
  expiry: "",
  cvc: "",
}

function validatePayment(fields: PaymentFields): PaymentErrors {
  const errors: PaymentErrors = {}
  const digits = fields.number.replace(/\s/g, "")

  if (fields.cardholder.trim() === "") {
    errors.cardholder = "Enter the name as it appears on the card."
  }
  if (!/^\d{13,19}$/.test(digits)) {
    errors.number = "Enter the card number. It has 13 to 19 digits."
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fields.expiry)) {
    errors.expiry = "Enter the expiry date as MM/YY."
  }
  if (!/^\d{3,4}$/.test(fields.cvc)) {
    errors.cvc = "Enter the 3 or 4 digit security code."
  }

  return errors
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

type FormFieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

function FormField({ id, label, error, hint, children }: FormFieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {describedBy ? <span className="sr-only">{describedBy}</span> : null}
    </div>
  )
}

export default function CheckoutPaymentDeclined() {
  const [fields, setFields] = useState<PaymentFields>(EMPTY_FIELDS)
  const [errors, setErrors] = useState<PaymentErrors>({})
  const [isPaying, setIsPaying] = useState(false)

  const subtotalCents = ORDER_ITEMS.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0
  )
  const totalCents = subtotalCents + TAX_CENTS + SHIPPING_CENTS
  const itemCount = ORDER_ITEMS.reduce((sum, item) => sum + item.quantity, 0)

  const updateField = (key: keyof PaymentFields, value: string) => {
    setFields((current) => ({ ...current, [key]: value }))
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: undefined }))
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validatePayment(fields)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = document.querySelector<HTMLInputElement>(
        '[aria-invalid="true"]'
      )
      firstInvalid?.focus()
      return
    }

    setIsPaying(true)
    window.setTimeout(() => {
      setIsPaying(false)
      toast.success(`Payment of ${formatMoney(totalCents)} approved`)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Step 2 of 3</p>
          <h1 className="text-2xl font-semibold">Payment</h1>
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="flex flex-col gap-6">
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Your card was declined</AlertTitle>
              <AlertDescription>
                {DECLINED_CARD.brand} ending {DECLINED_CARD.last4} was not
                approved by your bank. No money was taken from your account.
                Try another card below, or check that the details match the
                card exactly.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Try another card</CardTitle>
                <CardDescription>
                  Enter the details of a different card to pay for this order.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit} noValidate>
                <CardContent className="flex flex-col gap-4">
                  <FormField
                    id="cardholder"
                    label="Name on card"
                    error={errors.cardholder}
                  >
                    <Input
                      id="cardholder"
                      name="cardholder"
                      autoComplete="cc-name"
                      value={fields.cardholder}
                      onChange={(event) =>
                        updateField("cardholder", event.target.value)
                      }
                      aria-invalid={Boolean(errors.cardholder)}
                      aria-describedby={
                        errors.cardholder ? "cardholder-error" : undefined
                      }
                    />
                  </FormField>

                  <FormField
                    id="card-number"
                    label="Card number"
                    error={errors.number}
                    hint="Digits only. Spaces are added for you."
                  >
                    <div className="relative">
                      <CreditCard className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="card-number"
                        name="cardNumber"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 5678 9012 3456"
                        className="pl-9"
                        value={fields.number}
                        onChange={(event) =>
                          updateField(
                            "number",
                            formatCardNumber(event.target.value)
                          )
                        }
                        aria-invalid={Boolean(errors.number)}
                        aria-describedby={
                          errors.number ? "card-number-error" : "card-number-hint"
                        }
                      />
                    </div>
                  </FormField>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      id="expiry"
                      label="Expiry date"
                      error={errors.expiry}
                      hint="MM/YY"
                    >
                      <Input
                        id="expiry"
                        name="expiry"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/YY"
                        value={fields.expiry}
                        onChange={(event) =>
                          updateField("expiry", formatExpiry(event.target.value))
                        }
                        aria-invalid={Boolean(errors.expiry)}
                        aria-describedby={
                          errors.expiry ? "expiry-error" : "expiry-hint"
                        }
                      />
                    </FormField>

                    <FormField
                      id="cvc"
                      label="Security code"
                      error={errors.cvc}
                      hint="3 or 4 digits on the card"
                    >
                      <Input
                        id="cvc"
                        name="cvc"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        maxLength={4}
                        value={fields.cvc}
                        onChange={(event) =>
                          updateField(
                            "cvc",
                            event.target.value.replace(/\D/g, "").slice(0, 4)
                          )
                        }
                        aria-invalid={Boolean(errors.cvc)}
                        aria-describedby={errors.cvc ? "cvc-error" : "cvc-hint"}
                      />
                    </FormField>
                  </div>

                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="size-4" aria-hidden="true" />
                    Card details are sent encrypted to your bank.
                  </p>
                </CardContent>

                <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button variant="outline" size="lg" asChild>
                    <a href="/cart">
                      <ArrowLeft />
                      Back to cart
                    </a>
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPaying}
                    aria-busy={isPaying}
                  >
                    {isPaying
                      ? "Paying…"
                      : `Pay ${formatMoney(totalCents)}`}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
              <CardDescription>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-3">
                {ORDER_ITEMS.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {item.name}
                        {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {item.detail}
                      </span>
                    </div>
                    <span className="text-sm tabular-nums">
                      {formatMoney(item.unitPriceCents * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatMoney(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular-nums">{formatMoney(SHIPPING_CENTS)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd className="tabular-nums">{formatMoney(TAX_CENTS)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatMoney(totalCents)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </main>

      <Toaster />
    </div>
  )
}
