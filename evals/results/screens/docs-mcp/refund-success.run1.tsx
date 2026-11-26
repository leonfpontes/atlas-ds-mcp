import { useEffect, useRef } from "react"
import { ArrowLeft, CircleCheck, Clock, CreditCard } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"

const REFUND = {
  orderId: "FM-10482",
  orderHref: "/admin/orders/FM-10482",
  customerName: "Elena Marsh",
  issuedOn: "Oct 6, 2025",
  amount: "$84.00",
  currency: "USD",
  method: "Visa ending in 4242",
  methodDetail: "Returned to the card used for the original payment",
  visibleFrom: "Oct 9 – Oct 14, 2025",
  visibleNote: "Most banks post the refund within 5 to 10 business days. Timing depends on the card issuer.",
}

export default function RefundConfirmationPage() {
  const announced = useRef(false)

  useEffect(() => {
    if (announced.current) return
    announced.current = true
    toast.success(`Refund of ${REFUND.amount} issued`, {
      description: `Order #${REFUND.orderId} for ${REFUND.customerName}`,
    })
  }, [])

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 bg-background p-6 text-foreground">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Fernhill Market · Admin</p>
        <h1 className="text-2xl font-semibold tracking-tight">Refund issued</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Refund for order #{REFUND.orderId}</CardTitle>
          <CardDescription>
            Issued on {REFUND.issuedOn} to {REFUND.customerName}
          </CardDescription>
          <CardAction>
            <Badge variant="success">
              <CircleCheck />
              Refunded
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-sm text-muted-foreground">Amount refunded</dt>
              <dd className="text-2xl font-semibold tabular-nums">
                {REFUND.amount}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {REFUND.currency}
                </span>
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-sm text-muted-foreground">Refund method</dt>
              <dd className="flex items-start gap-2">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span>
                  <span className="block font-medium">{REFUND.method}</span>
                  <span className="block text-sm text-muted-foreground">{REFUND.methodDetail}</span>
                </span>
              </dd>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">When the customer sees it</dt>
              <dd className="flex items-start gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span>
                  <span className="block font-medium">Expected {REFUND.visibleFrom}</span>
                  <span className="block text-sm text-muted-foreground">{REFUND.visibleNote}</span>
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>

        <CardFooter className="justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            The customer receives an email when the refund is sent.
          </p>
          <Button asChild>
            <a href={REFUND.orderHref}>
              <ArrowLeft />
              Back to order #{REFUND.orderId}
            </a>
          </Button>
        </CardFooter>
      </Card>

      <Toaster />
    </main>
  )
}
