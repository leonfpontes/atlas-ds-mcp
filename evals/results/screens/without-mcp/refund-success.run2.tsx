import { useEffect } from "react"
import { toast } from "sonner"
import { CheckCircle2, CreditCard, Clock3, ArrowLeft, Wallet, Landmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type RefundMethod = "card" | "store_credit" | "bank_transfer"

const REFUND = {
  id: "rf_18342",
  orderId: "ord_20417",
  orderNumber: "FM-20417",
  customerName: "Priya Raman",
  customerEmail: "priya.raman@example.com",
  amountCents: 4850,
  currency: "USD",
  reason: "Item arrived damaged",
  method: "card" as RefundMethod,
  cardBrand: "Visa",
  cardLast4: "4242",
  processedAt: "2025-03-14T15:42:00Z",
}

const METHOD_DETAILS: Record<
  RefundMethod,
  { label: string; icon: typeof CreditCard; eta: string; etaDays: [number, number] | null }
> = {
  card: {
    label: "Original payment method",
    icon: CreditCard,
    eta: "Usually appears on the statement within 5–10 business days, depending on the bank.",
    etaDays: [5, 10],
  },
  store_credit: {
    label: "Fernhill store credit",
    icon: Wallet,
    eta: "Available immediately in the customer's account.",
    etaDays: null,
  },
  bank_transfer: {
    label: "Bank transfer",
    icon: Landmark,
    eta: "Arrives within 3–5 business days after the transfer is initiated.",
    etaDays: [3, 5],
  },
}

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency })

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from)
  let added = 0
  while (added < days) {
    result.setDate(result.getDate() + 1)
    const day = result.getDay()
    if (day !== 0 && day !== 6) added++
  }
  return result
}

export default function RefundConfirmationScreen() {
  const method = METHOD_DETAILS[REFUND.method]
  const MethodIcon = method.icon
  const processed = new Date(REFUND.processedAt)

  const arrivalWindow = method.etaDays
    ? {
        from: addBusinessDays(processed, method.etaDays[0]),
        to: addBusinessDays(processed, method.etaDays[1]),
      }
    : null

  const arrivalText = arrivalWindow
    ? `${dateFormatter.format(arrivalWindow.from).split(",")[0]} – ${dateFormatter.format(arrivalWindow.to).split(",")[0]}`
    : "Now"

  useEffect(() => {
    toast.success("Refund issued", {
      description: `${currencyFormatter(REFUND.currency).format(REFUND.amountCents / 100)} refunded for order ${REFUND.orderNumber}.`,
    })
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="size-8 text-emerald-600" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Refund issued</h1>
          <p className="text-sm text-muted-foreground">
            Refund {REFUND.id} was processed on {dateFormatter.format(processed)}.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <span>Refund summary</span>
            <Badge variant="secondary">Processed</Badge>
          </CardTitle>
          <CardDescription>
            For {REFUND.customerName} ({REFUND.customerEmail})
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Amount refunded</span>
            <span className="text-3xl font-semibold tabular-nums">
              {currencyFormatter(REFUND.currency).format(REFUND.amountCents / 100)}
            </span>
          </div>

          <Separator />

          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-muted-foreground">Method</dt>
            <dd className="flex items-center gap-2">
              <MethodIcon className="size-4 text-muted-foreground" aria-hidden="true" />
              <span>
                {method.label}
                {REFUND.method === "card" && (
                  <span className="text-muted-foreground">
                    {" "}· {REFUND.cardBrand} ending in {REFUND.cardLast4}
                  </span>
                )}
              </span>
            </dd>

            <dt className="text-muted-foreground">Reason</dt>
            <dd>{REFUND.reason}</dd>

            <dt className="text-muted-foreground">Order</dt>
            <dd>{REFUND.orderNumber}</dd>
          </dl>

          <Separator />

          <div className="flex gap-3 rounded-lg bg-muted p-4">
            <Clock3 className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="flex flex-col gap-1 text-sm">
              <p className="font-medium">
                When the customer will see it: {arrivalText}
              </p>
              <p className="text-muted-foreground">{method.eta}</p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-between gap-3">
          <Button variant="outline" asChild>
            <a href={`/admin/orders/${REFUND.orderId}`}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to order {REFUND.orderNumber}
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
