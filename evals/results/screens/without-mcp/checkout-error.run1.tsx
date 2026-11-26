import { useState, type FormEvent } from "react"
import { CircleAlert, CreditCard, Lock, ShoppingBag } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type OrderItem = {
  id: string
  name: string
  variant: string
  quantityLabel: string
  priceCents: number
}

type Decline = {
  code: string
  title: string
  message: string
  cardLast4: string
  cardBrand: string
  declinedAt: string
}

type CardFields = {
  name: string
  number: string
  expiry: string
  cvc: string
}

type FieldErrors = Partial<Record<keyof CardFields, string>>

const ORDER_ITEMS: OrderItem[] = [
  {
    id: "item-1",
    name: "Sourdough loaf",
    variant: "Country style, 800 g",
    quantityLabel: "x 2",
    priceCents: 1000,
  },
  {
    id: "item-2",
    name: "Raw wildflower honey",
    variant: "500 g jar",
    quantityLabel: "x 1",
    priceCents: 1450,
  },
  {
    id: "item-3",
    name: "Seasonal greens box",
    variant: "Weekly subscription",
    quantityLabel: "x 1",
    priceCents: 2800,
  },
]

const SHIPPING_CENTS = 595
const TAX_RATE = 0.0825

const DECLINE: Decline = {
  code: "card_declined",
  title: "Your bank declined this card",
  message:
    "Your card was declined by the issuing bank, usually because of insufficient funds or a spending limit. Try another card, or contact your bank for details.",
  cardLast4: "4242",
  cardBrand: "Visa",
  declinedAt: "Today, 10:42 AM",
}

const EMPTY_FIELDS: CardFields = {
  name: "",
  number: "",
  expiry: "",
  cvc: "",
}

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

function validate(fields: CardFields): FieldErrors {
  const errors: FieldErrors = {}
  const digits = fields.number.replace(/\s+/g, "")

  if (!fields.name.trim()) {
    errors.name = "Enter the name on the card."
  }
  if (!/^\d{12,19}$/.test(digits)) {
    errors.number = "Enter a valid card number."
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fields.expiry)) {
    errors.expiry = "Use MM/YY format."
  }
  if (!/^\d{3,4}$/.test(fields.cvc)) {
    errors.cvc = "Enter the 3 or 4 digit security code."
  }

  return errors
}

export default function CheckoutPaymentDeclined() {
  const [fields, setFields] = useState<CardFields>(EMPTY_FIELDS)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const subtotalCents = ORDER_ITEMS.reduce(
    (sum, item) => sum + item.priceCents * Number.parseInt(item.quantityLabel.replace("x ", ""), 10),
    0,
  )
  const taxCents = Math.round(subtotalCents * TAX_RATE)
  const totalCents = subtotalCents + SHIPPING_CENTS + taxCents

  function updateField(key: keyof CardFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(fields)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Check the highlighted card details.")
      return
    }

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsSubmitting(false)
    toast.success("Payment submitted. Confirming with your bank.")
  }

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-10 md:grid-cols-[1fr_360px]">
      <section className="flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">Fernhill Market</p>
          <h1 className="text-2xl font-semibold tracking-tight">Payment</h1>
        </header>

        <Alert variant="destructive" role="alert">
          <CircleAlert className="size-4" />
          <AlertTitle>{DECLINE.title}</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>{DECLINE.message}</p>
            <p className="text-xs opacity-80">
              {DECLINE.cardBrand} ending in {DECLINE.cardLast4} · {DECLINE.declinedAt} · Code{" "}
              <code className="font-mono">{DECLINE.code}</code>
            </p>
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" aria-hidden="true" />
              Try another card
            </CardTitle>
            <CardDescription>
              Your order is saved. Enter a different card to complete your purchase.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="card-name">Name on card</Label>
                <Input
                  id="card-name"
                  name="name"
                  autoComplete="cc-name"
                  value={fields.name}
                  onChange={(e) => updateField("name", e.target.value)}
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
                  name="number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={fields.number}
                  onChange={(e) => updateField("number", e.target.value)}
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
                    name="expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={fields.expiry}
                    onChange={(e) => updateField("expiry", e.target.value)}
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
                    name="cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="CVC"
                    value={fields.cvc}
                    onChange={(e) => updateField("cvc", e.target.value)}
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
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                <Lock className="size-4" aria-hidden="true" />
                {isSubmitting ? "Submitting..." : `Pay ${formatCents(totalCents)}`}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Payments are encrypted. Fernhill Market never stores your full card number.
              </p>
            </CardFooter>
          </form>
        </Card>
      </section>

      <aside>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="size-5" aria-hidden="true" />
              Order summary
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3">
              {ORDER_ITEMS.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.variant}</span>
                    <span className="text-muted-foreground">{item.quantityLabel}</span>
                  </div>
                  <span className="tabular-nums">{formatCents(item.priceCents)}</span>
                </li>
              ))}
            </ul>

            <Separator />

            <dl className="grid grid-cols-[1fr_auto] gap-y-2 text-sm">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="text-right tabular-nums">{formatCents(subtotalCents)}</dd>
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-right tabular-nums">{formatCents(SHIPPING_CENTS)}</dd>
              <dt className="text-muted-foreground">Tax</dt>
              <dd className="text-right tabular-nums">{formatCents(taxCents)}</dd>
            </dl>

            <Separator />

            <div className="flex items-baseline justify-between">
              <span className="font-medium">Total</span>
              <span className="text-lg font-semibold tabular-nums">{formatCents(totalCents)}</span>
            </div>
          </CardContent>
        </Card>
      </aside>
    </main>
  )
}
