import { ArrowLeft, Banknote, CircleCheck, Clock, CreditCard } from "lucide-react"
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

const REFUND = {
  id: "RF-2291",
  orderId: "FM-10482",
  orderHref: "/orders/FM-10482",
  amount: 84.0,
  currency: "USD",
  method: "Visa ending in 4242",
  processedOn: "14 May 2025, 10:42",
  customerSeesBy: "23 May 2025",
  customerSeesWindow: "5 to 10 business days after the refund is issued",
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: REFUND.currency,
})

export default function RefundConfirmationPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <Badge variant="success">
          <CircleCheck />
          Refund issued
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Refund of {currencyFormatter.format(REFUND.amount)} issued
        </h1>
        <p className="text-sm text-muted-foreground">
          Refund {REFUND.id} was sent to the customer's original payment method.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Refund {REFUND.id}</CardTitle>
          <CardDescription>Order {REFUND.orderId}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border">
            <div className="flex items-start gap-3 py-3">
              <Banknote className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="text-sm text-muted-foreground">Amount</dt>
                <dd className="text-sm font-medium text-foreground">
                  {currencyFormatter.format(REFUND.amount)}
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="text-sm text-muted-foreground">Method</dt>
                <dd className="text-sm font-medium text-foreground">{REFUND.method}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="text-sm text-muted-foreground">Customer sees it by</dt>
                <dd className="flex flex-col text-sm font-medium text-foreground sm:text-right">
                  <span>{REFUND.customerSeesBy}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {REFUND.customerSeesWindow}
                  </span>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3">
              <CircleCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                <dt className="text-sm text-muted-foreground">Issued</dt>
                <dd className="text-sm font-medium text-foreground">{REFUND.processedOn}</dd>
              </div>
            </div>
          </dl>
        </CardContent>
        <CardFooter className="justify-end">
          <Button asChild>
            <a href={REFUND.orderHref}>
              <ArrowLeft />
              Back to order {REFUND.orderId}
            </a>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
