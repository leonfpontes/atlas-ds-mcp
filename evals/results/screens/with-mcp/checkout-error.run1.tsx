import { useState, type FormEvent } from "react"
import { CircleAlert, CreditCard, Lock, ShoppingBag } from "lucide-react"
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

const ORDER_ITEMS = [
  { id: "sourdough", name: "Sourdough loaf, 800 g", quantity: 2, unitPrice: 6.5 },
  { id: "oat-milk", name: "Oat milk, 1 L", quantity: 3, unitPrice: 2.2 },
  { id: "honey", name: "Wildflower honey, 340 g", quantity: 1, unitPrice: 8.9 },
  { id: "eggs", name: "Free-range eggs, 12 pack", quantity: 1, unitPrice: 4.75 },
  { id: "apples", name: "Braeburn apples, 1 kg", quantity: 2, unitPrice: 3.4 },
]

const DELIVERY_FEE = 4.9
const TAX_RATE = 0.2

const DECLINED_PAYMENT = {
  brand: "Visa",
  last4: "4242",
  reason: "Your bank declined this payment.",
}

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
})

export default function CheckoutPaymentDeclined() {
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const subtotal = ORDER_ITEMS.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const tax = subtotal * TAX_RATE
  const total = subtotal + DELIVERY_FEE

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    window.setTimeout(() => setSubmitting(false), 1500)
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <p className="text-sm text-muted-foreground">Step 2 of 3: Payment</p>
      <h1 className="mt-1 text-2xl font-semibold text-foreground">
        Checkout
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Try another card</CardTitle>
            <CardDescription>
              Enter the details of a different card to finish your order.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <Alert variant="destructive">
              <CircleAlert />
              <AlertTitle>Payment declined</AlertTitle>
              <AlertDescription>
                {DECLINED_PAYMENT.reason} The {DECLINED_PAYMENT.brand} card
                ending in {DECLINED_PAYMENT.last4} was not charged. Use a
                different card, or contact your bank if this keeps happening.
              </AlertDescription>
            </Alert>

            <form
              id="payment-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="card-name" className="text-sm font-medium">
                  Name on card
                </label>
                <Input
                  id="card-name"
                  name="cardName"
                  autoComplete="cc-name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="card-number" className="text-sm font-medium">
                  Card number
                </label>
                <Input
                  id="card-number"
                  name="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="card-expiry" className="text-sm font-medium">
                    Expiry date
                  </label>
                  <Input
                    id="card-expiry"
                    name="cardExpiry"
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="card-cvc" className="text-sm font-medium">
                    Security code
                  </label>
                  <Input
                    id="card-cvc"
                    name="cardCvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="3 digits"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    required
                  />
                </div>
              </div>

              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="size-4" aria-hidden="true" />
                Your card details are encrypted before they leave your device.
              </p>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" type="button">
              Back to cart
            </Button>
            <Button
              type="submit"
              form="payment-form"
              size="lg"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              <CreditCard />
              {submitting ? "Paying…" : `Pay ${currency.format(total)}`}
            </Button>
          </CardFooter>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="size-4" aria-hidden="true" />
              Order summary
            </CardTitle>
            <CardDescription>
              {ORDER_ITEMS.length} items from Fernhill Market
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-3">
              {ORDER_ITEMS.map((item) => (
                <li key={item.id} className="flex justify-between gap-4 text-sm">
                  <span className="text-foreground">
                    {item.name}
                    <span className="text-muted-foreground">
                      {" "}× {item.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {currency.format(item.quantity * item.unitPrice)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">{currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="tabular-nums">
                  {currency.format(DELIVERY_FEE)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  VAT included
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {currency.format(tax)}
                </span>
              </div>
            </div>

            <div className="flex justify-between border-t border-border pt-4 text-base font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{currency.format(total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
