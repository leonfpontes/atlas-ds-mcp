import { useRef, useState, type FormEvent } from "react"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react"
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
  quantity: number
  unitPrice: number
}

type DeclinedCard = {
  brand: string
  last4: string
  declineCode: keyof typeof DECLINE_MESSAGES
}

type FormState = {
  name: string
  number: string
  expiry: string
  cvc: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

type Status = "idle" | "processing" | "approved"

const ORDER_ITEMS: OrderItem[] = [
  {
    id: "sku-1",
    name: "Stoneware pour-over set",
    variant: "Sage",
    quantity: 1,
    unitPrice: 48.0,
  },
  {
    id: "sku-2",
    name: "Heirloom tomato seeds",
    variant: "Mixed pack",
    quantity: 3,
    unitPrice: 4.5,
  },
  {
    id: "sku-3",
    name: "Cedar seedling tray",
    variant: "24 cell",
    quantity: 2,
    unitPrice: 12.25,
  },
]

const SHIPPING = 6.95
const TAX_RATE = 0.0825

const DECLINED_CARD: DeclinedCard = {
  brand: "Visa",
  last4: "4242",
  declineCode: "insufficient_funds",
}

const DECLINE_MESSAGES = {
  insufficient_funds: {
    title: "Your bank declined this payment",
    description:
      "The card doesn't have enough available credit for this order. Try another card or choose a different payment method.",
  },
  expired_card: {
    title: "This card has expired",
    description:
      "Check the expiry date on your card, or use a different card.",
  },
  do_not_honor: {
    title: "Your bank declined this payment",
    description:
      "Your bank didn't approve the charge. Call the number on the back of your card, or try another card.",
  },
} as const

const EMPTY_FORM: FormState = { name: "", number: "", expiry: "", cvc: "" }

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  const digits = form.number.replace(/\D/g, "")

  if (!form.name.trim()) {
    errors.name = "Enter the name as it appears on the card."
  }

  if (digits.length < 13) {
    errors.number = "Enter a valid card number."
  } else if (digits.slice(-4) === DECLINED_CARD.last4) {
    errors.number =
      "This is the card that was just declined. Use a different card."
  }

  const expiryMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(form.expiry)
  if (!expiryMatch) {
    errors.expiry = "Use the format MM/YY."
  } else {
    const now = new Date()
    const month = Number(expiryMatch[1])
    const year = 2000 + Number(expiryMatch[2])
    const isPast =
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1)
    if (isPast) errors.expiry = "This card has expired."
  }

  if (!/^\d{3,4}$/.test(form.cvc)) {
    errors.cvc = "Enter the 3 or 4 digit security code."
  }

  return errors
}

export default function CheckoutPaymentDeclined() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>("idle")
  const [showDecline, setShowDecline] = useState(true)
  const numberRef = useRef<HTMLInputElement>(null)

  const subtotal = ORDER_ITEMS.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  )
  const tax = subtotal * TAX_RATE
  const total = subtotal + SHIPPING + tax
  const decline = DECLINE_MESSAGES[DECLINED_CARD.declineCode]

  function updateField(field: keyof FormState, value: string) {
    const formatted =
      field === "number"
        ? formatCardNumber(value)
        : field === "expiry"
          ? formatExpiry(value)
          : field === "cvc"
            ? value.replace(/\D/g, "").slice(0, 4)
            : value
    setForm((prev) => ({ ...prev, [field]: formatted }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  function useDifferentCard() {
    setForm(EMPTY_FORM)
    setErrors({})
    setShowDecline(false)
    numberRef.current?.focus()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "processing") return

    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = Object.keys(nextErrors)[0]
      document.getElementById(`checkout-${firstInvalid}`)?.focus()
      return
    }

    setStatus("processing")
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setStatus("approved")
    setShowDecline(false)
    toast.success("Payment approved", {
      description: `${currency.format(total)} charged. Confirmation is on its way.`,
    })
  }

  if (status === "approved") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <CheckCircle2 className="size-12 text-emerald-600" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">Payment approved</h1>
        <p className="text-muted-foreground">
          Thanks for shopping at Fernhill Market. We have sent your receipt by
          email.
        </p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <header className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Back to cart">
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Button>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Fernhill Market
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="flex flex-col gap-6">
          {showDecline && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="size-4" aria-hidden="true" />
              <AlertTitle>{decline.title}</AlertTitle>
              <AlertDescription>
                <p>{decline.description}</p>
                <p className="mt-2 text-xs">
                  {DECLINED_CARD.brand} ending in {DECLINED_CARD.last4} was not
                  charged. Your order is still reserved for 15 minutes.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" aria-hidden="true" />
                Payment method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                noValidate
                onSubmit={handleSubmit}
                className="grid gap-4 sm:grid-cols-2"
              >
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="checkout-name">Name on card</Label>
                  <Input
                    id="checkout-name"
                    autoComplete="cc-name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "checkout-name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="checkout-name-error" className="text-sm text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="checkout-number">Card number</Label>
                  <Input
                    ref={numberRef}
                    id="checkout-number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={form.number}
                    onChange={(e) => updateField("number", e.target.value)}
                    aria-invalid={Boolean(errors.number)}
                    aria-describedby={errors.number ? "checkout-number-error" : undefined}
                  />
                  {errors.number && (
                    <p id="checkout-number-error" className="text-sm text-destructive">
                      {errors.number}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="checkout-expiry">Expiry</Label>
                  <Input
                    id="checkout-expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) => updateField("expiry", e.target.value)}
                    aria-invalid={Boolean(errors.expiry)}
                    aria-describedby={errors.expiry ? "checkout-expiry-error" : undefined}
                  />
                  {errors.expiry && (
                    <p id="checkout-expiry-error" className="text-sm text-destructive">
                      {errors.expiry}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="checkout-cvc">Security code</Label>
                  <Input
                    id="checkout-cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="CVC"
                    value={form.cvc}
                    onChange={(e) => updateField("cvc", e.target.value)}
                    aria-invalid={Boolean(errors.cvc)}
                    aria-describedby={errors.cvc ? "checkout-cvc-error" : undefined}
                  />
                  {errors.cvc && (
                    <p id="checkout-cvc-error" className="text-sm text-destructive">
                      {errors.cvc}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="size-4" aria-hidden="true" />
                    Your payment details are encrypted.
                  </p>
                  <Button type="submit" disabled={status === "processing"}>
                    {status === "processing" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        Processing
                      </>
                    ) : (
                      `Pay ${currency.format(total)}`
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="justify-between gap-4 border-t text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4" aria-hidden="true" />
                Secure checkout
              </span>
              {!showDecline && (
                <Button variant="link" className="h-auto p-0" onClick={useDifferentCard}>
                  Use a different card
                </Button>
              )}
            </CardFooter>
          </Card>
        </section>

        <aside aria-labelledby="order-summary-title">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle id="order-summary-title">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-3">
                {ORDER_ITEMS.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        {item.variant} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 tabular-nums">
                      {currency.format(item.unitPrice * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <Separator />

              <dl className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{currency.format(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="tabular-nums">{currency.format(SHIPPING)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Estimated tax</dt>
                  <dd className="tabular-nums">{currency.format(tax)}</dd>
                </div>
              </dl>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-medium">Total</span>
                <span className="text-lg font-semibold tabular-nums">
                  {currency.format(total)}
                </span>
              </div>

              {showDecline && (
                <Badge variant="outline" className="w-fit">
                  Not charged
                </Badge>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
