import { useEffect, useRef } from "react"
import { ArrowLeft, CircleCheck, Clock } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

type RefundMethod = "card" | "paypal" | "store_credit"

const REFUND = {
  id: "RF-2291",
  orderNumber: "FM-10482",
  orderHref: "/admin/orders/FM-10482",
  amountCents: 4250,
  currency: "USD",
  method: "card" as RefundMethod,
  methodLabel: "Visa ending in 4242",
  refundedAt: "12 June 2025, 14:05",
}

const CUSTOMER_TIMING: Record<RefundMethod, string> = {
  card: "Within 3 to 10 business days, depending on the card issuer",
  paypal: "Within 1 to 3 business days",
  store_credit: "Immediately, in the customer's Fernhill balance",
}

const METHOD_NAMES: Record<RefundMethod, string> = {
  card: "Original card",
  paypal: "PayPal",
  store_credit: "Store credit",
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: REFUND.currency,
})

export default function RefundConfirmation() {
  const notified = useRef(false)
  const amount = money.format(REFUND.amountCents / 100)

  useEffect(() => {
    if (notified.current) return
    notified.current = true
    toast.success(`Refund of ${amount} issued`, {
      description: `Refund ${REFUND.id} for order ${REFUND.orderNumber}.`,
    })
  }, [amount])

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <div>
            <Badge variant="success">
              <CircleCheck />
              Refunded
            </Badge>
          </div>
          <CardTitle className="mt-2">Refund issued</CardTitle>
          <CardDescription>
            Refund {REFUND.id} for order {REFUND.orderNumber} was sent on {REFUND.refundedAt}.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 text-sm">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-medium tabular-nums">{amount}</dd>

            <dt className="text-muted-foreground">Method</dt>
            <dd>
              <span className="font-medium">{METHOD_NAMES[REFUND.method]}</span>
              <span className="text-muted-foreground"> · {REFUND.methodLabel}</span>
            </dd>

            <dt className="text-muted-foreground">Customer sees it</dt>
            <dd className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>{CUSTOMER_TIMING[REFUND.method]}</span>
            </dd>
          </dl>
        </CardContent>

        <CardFooter>
          <Button variant="outline" asChild>
            <a href={REFUND.orderHref}>
              <ArrowLeft />
              Back to order {REFUND.orderNumber}
            </a>
          </Button>
        </CardFooter>
      </Card>

      <Toaster />
    </main>
  )
}
