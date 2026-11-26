import { useState } from "react"
import { CircleAlert, CreditCard, Lock } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const ORDER_ITEMS = [
  { id: "1", name: "Organic whole milk, 2 L", quantity: 2, price: 7.8 },
  { id: "2", name: "Sourdough loaf", quantity: 1, price: 6.5 },
  { id: "3", name: "Cherry tomatoes, 500 g", quantity: 3, price: 4.2 },
  { id: "4", name: "Free-range eggs, dozen", quantity: 1, price: 5.9 },
  { id: "5", name: "Dark chocolate 72%", quantity: 2, price: 3.4 },
]

const SHIPPING = 4.5
const TAX_RATE = 0.08
const DECLINED_CARD_LAST4 = "4242"

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)

export default function CheckoutDeclined() {
  const [cardholder, setCardholder] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")

  const subtotal = ORDER_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + SHIPPING + tax
  const itemCount = ORDER_ITEMS.reduce((sum, item) => sum + item.quantity, 0)

  const canSubmit =
    cardholder.trim() !== "" && cardNumber.replace(/\s/g, "").length >= 12 && expiry.trim() !== "" && cvc.trim() !== ""

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-[1fr_20rem]">
        <section aria-labelledby="payment-heading" className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Fernhill Market · Checkout</p>
            <h1 id="payment-heading" className="text-2xl font-semibold">
              Payment
            </h1>
          </div>

          <Alert variant="destructive" role="alert">
            <CircleAlert />
            <AlertTitle>Your card was declined</AlertTitle>
            <AlertDescription>
              Your bank did not approve the payment on the card ending in {DECLINED_CARD_LAST4}. No money was taken.
              Check the card details, or use a different card.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Try another card</CardTitle>
              <CardDescription>Enter the details of a card that can pay {formatMoney(total)}.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="payment-form" onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="cardholder" className="text-sm font-medium">
                    Name on card
                  </label>
                  <Input
                    id="cardholder"
                    name="cardholder"
                    autoComplete="cc-name"
                    value={cardholder}
                    onChange={(e) => setCardholder(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="card-number" className="text-sm font-medium">
                    Card number
                  </label>
                  <Input
                    id="card-number"
                    name="cardnumber"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="expiry" className="text-sm font-medium">
                    Expiry date
                  </label>
                  <Input
                    id="expiry"
                    name="expiry"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="cvc" className="text-sm font-medium">
                    Security code (CVC)
                  </label>
                  <Input
                    id="cvc"
                    name="cvc"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="3 or 4 digits"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="size-4" aria-hidden="true" />
                Card details are encrypted and sent to your bank.
              </p>
              <Button type="submit" form="payment-form" size="lg" disabled={!canSubmit} className="w-full sm:w-auto">
                <CreditCard />
                Pay {formatMoney(total)} with new card
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
                  <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <span>
                      {item.name}
                      <span className="block text-muted-foreground">Qty {item.quantity}</span>
                    </span>
                    <span className="tabular-nums">{formatMoney(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <dl className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatMoney(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular-nums">{formatMoney(SHIPPING)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd className="tabular-nums">{formatMoney(tax)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatMoney(total)}</dd>
                </div>
              </dl>

              <div>
                <Badge variant="secondary">Not charged</Badge>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
