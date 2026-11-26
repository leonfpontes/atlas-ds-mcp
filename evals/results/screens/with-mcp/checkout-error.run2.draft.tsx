import { useState, type FormEvent } from "react"
import { ArrowLeft, CircleAlert, CreditCard, Lock } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type OrderItem = {
  id: string
  name: string
  quantity: number
  unitPriceCents: number
}

const ORDER_ITEMS: OrderItem[] = [
  { id: "item-1", name: "Sourdough loaf", quantity: 2, unitPriceCents: 450 },
  { id: "item-2", name: "Oat milk, 1 L", quantity: 3, unitPriceCents: 240 },
  { id: "item-3", name: "Seasonal apples, 1 kg", quantity: 1, unitPriceCents: 580 },
  { id: "item-4", name: "Dark roast coffee beans", quantity: 1, unitPriceCents: 1295 },
]

const SHIPPING_CENTS = 499
const TAX_RATE = 0.08

const DECLINED_CARD = {
  brand: "Visa",
  last4: "4242",
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

function formatCents(cents: number) {
  return currency.format(cents / 100)
}

export default function CheckoutDeclinedPaymentPage() {
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")

  const subtotalCents = ORDER_ITEMS.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0
  )
  const taxCents = Math.round(subtotalCents * TAX_RATE)
  const totalCents = subtotalCents + SHIPPING_CENTS + taxCents
  const itemCount = ORDER_ITEMS.reduce((sum, item) => sum + item.quantity, 0)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-2">
        <Button variant="ghost" size="default" className="w-fit px-0" asChild>
          <a href="/cart">
            <ArrowLeft />
            Back to cart
          </a>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Payment</h1>
        <p className="text-sm text-muted-foreground">
          Fernhill Market checkout, step 2 of 2
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section aria-labelledby="payment-heading" className="flex flex-col gap-6">
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Your card was declined</AlertTitle>
            <AlertDescription>
              <p>
                Your bank declined the card ending in {DECLINED_CARD.last4} ({DECLINED_CARD.brand}).
                Check the card details or use a different card to finish your order.
              </p>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle id="payment-heading">Try another card</CardTitle>
              <CardDescription>
                Your order is still held. Card number and security code were cleared for your safety.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="payment-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="card-name" className="text-sm font-medium">
                    Name on card
                  </label>
                  <Input
                    id="card-name"
                    name="cardName"
                    type="text"
                    autoComplete="cc-name"
                    required
                    value={cardName}
                    onChange={(event) => setCardName(event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="card-number" className="text-sm font-medium">
                    Card number
                  </label>
                  <Input
                    id="card-number"
                    name="cardNumber"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    required
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="card-expiry" className="text-sm font-medium">
                    Expiry date
                  </label>
                  <Input
                    id="card-expiry"
                    name="cardExpiry"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    required
                    value={expiry}
                    onChange={(event) => setExpiry(event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="card-cvc" className="text-sm font-medium">
                    Security code
                  </label>
                  <Input
                    id="card-cvc"
                    name="cardCvc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="3 digits"
                    required
                    value={cvc}
                    onChange={(event) => setCvc(event.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="size-4" aria-hidden="true" />
                Payments are encrypted and processed securely.
              </p>
              <Button type="submit" form="payment-form" size="lg" className="w-full sm:w-auto">
                <CreditCard />
                Pay {formatCents(totalCents)}
              </Button>
            </CardFooter>
          </Card>
        </section>

        <aside aria-labelledby="summary-heading">
          <Card>
            <CardHeader>
              <CardTitle id="summary-heading">Order summary</CardTitle>
              <CardDescription>
                {itemCount} items from Fernhill Market
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-3">
                {ORDER_ITEMS.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-4 text-sm">
                    <span>
                      {item.name}
                      <span className="block text-muted-foreground">
                        Qty {item.quantity}
                      </span>
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatCents(item.unitPriceCents * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="flex flex-col gap-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatCents(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="tabular-nums">{formatCents(SHIPPING_CENTS)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd className="tabular-nums">{formatCents(taxCents)}</dd>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatCents(totalCents)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
