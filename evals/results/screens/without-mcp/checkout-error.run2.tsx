import { useState, type FormEvent } from "react"
import { CheckCircle2, CircleAlert, CreditCard, Lock, ShoppingBag } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type OrderItem = {
  id: string
  name: string
  detail: string
  quantity: number
  unitPriceCents: number
}

type Decline = {
  code: string
  headline: string
  explanation: string
  suggestion: string
  cardBrand: string
  cardLast4: string
}

type FieldErrors = Partial<Record<"name" | "number" | "expiry" | "cvc", string>>

const ITEMS: OrderItem[] = [
  {
    id: "item-1",
    name: "Sourdough loaf",
    detail: "Stone-milled spelt, 800 g",
    quantity: 2,
    unitPriceCents: 650,
  },
  {
    id: "item-2",
    name: "Seasonal fruit box",
    detail: "Medium, weekly subscription",
    quantity: 1,
    unitPriceCents: 2400,
  },
  {
    id: "item-3",
    name: "Oat milk",
    detail: "1 L, pack of 6",
    quantity: 1,
    unitPriceCents: 1890,
  },
]

const SHIPPING_CENTS = 495
const TAX_RATE = 0.08

const DECLINE: Decline = {
  code: "card_declined",
  headline: "Your card was declined",
  explanation:
    "Your bank did not approve this payment. Nothing has been charged to your card and your order is still saved.",
  suggestion:
    "Check the card details, try a different card, or contact your bank if the problem continues.",
  cardBrand: "Visa",
  cardLast4: "4242",
}

const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100)

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim()

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

const validate = (fields: {
  name: string
  number: string
  expiry: string
  cvc: string
}): FieldErrors => {
  const errors: FieldErrors = {}
  const digits = fields.number.replace(/\D/g, "")

  if (!fields.name.trim()) {
    errors.name = "Enter the name as it appears on the card."
  }

  if (digits.length < 13 || digits.length > 19) {
    errors.number = "Enter a valid card number."
  }

  const expiryMatch = /^(\d{2})\/(\d{2})$/.exec(fields.expiry)
  if (!expiryMatch) {
    errors.expiry = "Use the format MM/YY."
  } else {
    const month = Number(expiryMatch[1])
    const year = 2000 + Number(expiryMatch[2])
    const now = new Date()
    const isPast =
      year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)
    if (month < 1 || month > 12) {
      errors.expiry = "Enter a valid month."
    } else if (isPast) {
      errors.expiry = "This card has expired."
    }
  }

  if (!/^\d{3,4}$/.test(fields.cvc)) {
    errors.cvc = "Enter the 3 or 4 digit security code."
  }

  return errors
}

export default function CheckoutPaymentDeclined() {
  const [status, setStatus] = useState<"declined" | "approved">("declined")
  const [submitting, setSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [number, setNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})

  const subtotalCents = ITEMS.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0)
  const taxCents = Math.round(subtotalCents * TAX_RATE)
  const totalCents = subtotalCents + SHIPPING_CENTS + taxCents

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors = validate({ name, number, expiry, cvc })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Check the highlighted card details.")
      return
    }

    setSubmitting(true)
    window.setTimeout(() => {
      setSubmitting(false)
      setStatus("approved")
      toast.success("Payment approved. Your order is confirmed.")
    }, 1200)
  }

  if (status === "approved") {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <Card>
          <CardHeader className="items-center text-center">
            <CheckCircle2 className="size-12 text-emerald-600" aria-hidden="true" />
            <CardTitle className="text-2xl">Payment approved</CardTitle>
            <CardDescription>
              Thanks for shopping at Fernhill Market. We have emailed your receipt.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Order total</span>
              <span className="font-semibold">{formatMoney(totalCents)}</span>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-6 md:grid-cols-[1fr_360px]">
      <section aria-labelledby="payment-heading" className="flex flex-col gap-6">
        <div>
          <h1 id="payment-heading" className="text-2xl font-semibold tracking-tight">
            Payment
          </h1>
          <p className="text-sm text-muted-foreground">Step 3 of 3 · Fernhill Market checkout</p>
        </div>

        <Alert variant="destructive" role="alert">
          <CircleAlert aria-hidden="true" />
          <AlertTitle>{DECLINE.headline}</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{DECLINE.explanation}</p>
            <p>{DECLINE.suggestion}</p>
            <p className="text-xs opacity-80">
              Reference: {DECLINE.code} · {DECLINE.cardBrand} ending {DECLINE.cardLast4}
            </p>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" aria-hidden="true" />
              Try another card
            </CardTitle>
            <CardDescription>Enter the details of a different card to complete your order.</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="card-name">Name on card</Label>
                <Input
                  id="card-name"
                  autoComplete="cc-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "card-name-error" : undefined}
                />
                {errors.name && (
                  <p id="card-name-error" className="text-sm text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="card-number">Card number</Label>
                <Input
                  id="card-number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={number}
                  onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                  aria-invalid={Boolean(errors.number)}
                  aria-describedby={errors.number ? "card-number-error" : undefined}
                />
                {errors.number && (
                  <p id="card-number-error" className="text-sm text-destructive">
                    {errors.number}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="card-expiry">Expiry</Label>
                  <Input
                    id="card-expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    aria-invalid={Boolean(errors.expiry)}
                    aria-describedby={errors.expiry ? "card-expiry-error" : undefined}
                  />
                  {errors.expiry && (
                    <p id="card-expiry-error" className="text-sm text-destructive">
                      {errors.expiry}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="card-cvc">Security code</Label>
                  <Input
                    id="card-cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    aria-invalid={Boolean(errors.cvc)}
                    aria-describedby={errors.cvc ? "card-cvc-error" : undefined}
                  />
                  {errors.cvc && (
                    <p id="card-cvc-error" className="text-sm text-destructive">
                      {errors.cvc}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={submitting}>
                <Lock className="size-4" aria-hidden="true" />
                {submitting ? "Processing payment…" : `Pay ${formatMoney(totalCents)}`}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Payments are encrypted. Your card details are never stored on this device.
              </p>
            </CardFooter>
          </form>
        </Card>
      </section>

      <aside aria-labelledby="summary-heading">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle id="summary-heading" className="flex items-center gap-2">
              <ShoppingBag className="size-5" aria-hidden="true" />
              Order summary
            </CardTitle>
            <CardDescription>Your cart is saved while you update payment.</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <ul className="grid gap-3">
              {ITEMS.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="grid gap-0.5">
                    <span className="font-medium">
                      {item.name} <Badge variant="secondary">× {item.quantity}</Badge>
                    </span>
                    <span className="text-muted-foreground">{item.detail}</span>
                  </div>
                  <span className="tabular-nums">{formatMoney(item.unitPriceCents * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <Separator />

            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatMoney(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="tabular-nums">{formatMoney(SHIPPING_CENTS)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax (8%)</dt>
                <dd className="tabular-nums">{formatMoney(taxCents)}</dd>
              </div>
            </dl>

            <Separator />

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatMoney(totalCents)}</span>
            </div>
          </CardContent>
        </Card>
      </aside>
    </main>
  )
}
