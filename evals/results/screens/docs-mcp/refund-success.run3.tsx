import { useEffect, useRef } from "react"
import { ArrowLeft, CcircleCheck, Clock, CreditCard } from "lucide-react"
import { toast } from "sonner"

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
import { Toaster } from "@/components/ui/sonner"

const STORE_NAME = "Fernhill Market"

const REFUND = {
  orderId: "FM-10482",
  orderHref: "/admin/orders/FM-10482",
  amountCents: 8400,
  currency: "USD",
  method: "Visa ending in 4242",
  methodKind: "Original payment method",
  issuedAt: "2025-06-12T14:32:00Z",
  customerWindow: "3 to 5 business days",
  customerWindowNote: "Timing depends on the customer's bank.",
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: REFUND.currency,
})

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
})

export default function RefundConfirmationScreen() {
  const toasted = useRef(false)

  useEffect(() => {
    if (toasted.current) return
    toasted.current = true
    toast.success(`Refund of ${money.format(REFUND.amountCents / 100)} issued`)
  }, [])

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto w-full max-w-xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Refund issued</CardTitle>
              <Badge variant="success">
                <CircleCheck aria-hidden="true" />
                Refunded
              </Badge>
            </div>
            <CardDescription>
              {STORE_NAME} · Order {REFUND.orderId}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <dl className="divide-y divide-border">
              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Amount refunded</dt>
                <dd className="text-right text-base font-semibold tabular-nums">
                  {money.format(REFUND.amountCents / 100)}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Method</dt>
                <dd className="flex items-center gap-2 text-right text-sm">
                  <CreditCard aria-hidden="true" className="size-4 text-muted-foreground" />
                  <span>
                    {REFUND.method}
                    <span className="block text-xs text-muted-foreground">
                      {REFUND.methodKind}
                    </span>
                  </span>
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Issued</dt>
                <dd className="text-right text-sm">
                  <time dateTime={REFUND.issuedAt}>
                    {dateFormat.format(new Date(REFUND.issuedAt))}
                  </time>
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Customer sees it</dt>
                <dd className="flex items-start gap-2 text-right text-sm">
                  <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>
                    Within {REFUND.customerWindow}
                    <span className="block text-xs text-muted-foreground">
                      {REFUND.customerWindowNote}
                    </span>
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>

          <CardFooter className="justify-end">
            <Button asChild>
              <a href={REFUND.orderHref}>
                <ArrowLeft aria-hidden="true" />
                Back to order {REFUND.orderId}
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Toaster />
    </main>
  )
}
