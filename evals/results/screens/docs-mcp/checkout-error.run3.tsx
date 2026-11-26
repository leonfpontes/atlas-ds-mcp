import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { ArrowLeft, CircleAlert, CreditCard, Lock } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type OrderItem = {
  id: string
  name: string
  detail: string
  quantity: number
  unitPriceCents: number
}

type CardFields = {
  name: string
  number: string
  expiry: string
  cvc: string
}

type FieldErrors = Partial<Record<keyof CardFields, string>>

// Example data
const ORDER_ITEMS: OrderItem[] = [
  {
    id: "item-1",
    name: "Sourdough loaf",
    detail: "Country style, 800 g",
    quantity: 2,
    unitPriceCents: 540,
  },
  {
    id: "item-2",
    name: "Fernhill oat milk",
    detail: "1 L, chilled",
    quantity: 3,
    unitPriceCents: 295,
  },
  {
    id: "item-3",
    name: "Seasonal apples",
    detail: "Braeburn, 1 kg bag",
    quantity: 1,
    unitPriceCents: 430,
  },
]

const SHIPPING_CENTS = 350
const TAX_RATE = 0.08
const DECLINE_REASON = "Your bank declined this card."
const DECLINED_CARD_LAST4 = "4417"

const EMPTY_FIELDS: CardFields = {
  name: "",
  number: "",
  expiry: "",
  cvc: "",
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function formatCents(cents: number) {
  return currency.format(cents / 100)
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 19)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function validate(fields: CardFields): FieldErrors {
  const errors: FieldErrors = {}
  const digits = fields.number.replace(/\s/g, "")

  if (!fields.name.trim()) {
    errors.name = "Enter the name as it appears on the card."
  }
  if (!/^\d{13,19}$/.test(digits)) {
    errors.number = "Enter a card number with 13 to 19 digits."
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fields.expiry)) {
    errors.expiry = "Enter the expiry date as MM/YY."
  }
  if (!/^\d{3,4}$/.test(fields.cvc)) {
    errors.cvc = "Enter the 3 or 4 digit security code."
  }

  return errors
}

export default function CheckoutPaymentDeclined() {
  const [fields, setFields] = useState<CardFields>(EMPTY_FIELDS)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const subtotalCents = ORDER_ITEMS.reduce(
    (sum, item) => sum + item.quantity * item.unitPriceCents,
    0
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
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSubmitting(false)
    toast.success("Payment approved. Your order is confirmed.")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1fr_340px] md:px-6">
        <section aria-labelledby="payment-heading" className="space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Fernhill Market checkout</p>
            <h1 id="payment-heading" className="text-2xl font-semibold">
              Payment
            </h1>
          </div>

          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Your card was declined</AlertTitle>
            <AlertDescription>
              <p>
                {DECLINE_REASON} Card ending in {DECLINED_CARD_LAST4} was not
                charged. Try another card, or contact your bank if this keeps
                happening.
              </p>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Try another card</CardTitle>
              <CardDescription>
                Your order is saved. Enter a different card to pay {formatCents(totalCents)}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="payment-form"
                noValidate
                onSubmit={handleSubmit}
                className="grid gap-5"
              >
                <div className="grid gap-2">
                  <label htmlFor="card-name" className="text-sm font-medium">
                    Name on card
                  </label>
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
                  <label htmlFor="card-number" className="text-sm font-medium">
                    Card number
                  </label>
                  <Input
                    id="card-number"
                    name="number"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={fields.number}
                    onChange={(e) =>
                      updateField("number", formatCardNumber(e.target.value))
                    }
                    aria-invalid={Boolean(errors.number)}
                    aria-describedby={
                      errors.number ? "card-number-error" : undefined
                    }
                  />
                  {errors.number && (
                    <p id="card-number-error" className="text-sm text-destructive">
                      {errors.number}
                    </p>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label htmlFor="card-expiry" className="text-sm font-medium">
                      Expiry date
                    </label>
                    <Input
                      id="card-expiry"
                      name="expiry"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={fields.expiry}
                      onChange={(e) =>
                        updateField("expiry", formatExpiry(e.target.value))
                      }
                      aria-invalid={Boolean(errors.expiry)}
                      aria-describedby={
                        errors.expiry ? "card-expiry-error" : undefined
                      }
                    />
                    {errors.expiry && (
                      <p id="card-expiry-error" className="text-sm text-destructive">
                        {errors.expiry}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="card-cvc" className="text-sm font-medium">
                      Security code
                    </label>
                    <Input
                      id="card-cvc"
                      name="cvc"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="CVC"
                      value={fields.cvc}
                      onChange={(e) =>
                        updateField(
                          "cvc",
                          e.target.value.replace(/\D/g, "").slice(0, 4)
                        )
                      }
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
              </form>
            </CardContent>
            <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button variant="outline" type="button" className="sm:w-auto">
                <ArrowLeft />
                Back to cart
              </Button>
              <Button
                type="submit"
                form="payment-form"
                disabled={submitting}
                className="sm:w-auto"
              >
                <Lock />
                {submitting ? "Checking card…" : `Pay ${formatCents(totalCents)}`}
              </Button>
            </CardFooter>
          </Card>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="size-4" aria-hidden="true" />
            Card details are encrypted and sent only to your bank.
          </p>
        </section>

        <aside aria-labelledby="summary-heading" className="md:pt-16">
          <Card>
            <CardHeader>
              <CardTitle id="summary-heading">Order summary</CardTitle>
              <CardDescription>3 items from Fernhill Market</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ORDER_ITEMS.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.detail} × {item.quantity}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCents(item.quantity * item.unitPriceCents)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell>Subtotal</TableCell>
                    <TableCell className="text-right">
                      {formatCents(subtotalCents)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Shipping</TableCell>
                    <TableCell className="text-right">
                      {formatCents(SHIPPING_CENTS)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tax</TableCell>
                    <TableCell className="text-right">
                      {formatCents(taxCents)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Total</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCents(totalCents)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
