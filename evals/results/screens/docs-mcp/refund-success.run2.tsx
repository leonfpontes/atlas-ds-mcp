import { ArrowLeft, CircleCheck, Clock, CreditCard, Receipt } from "lucide-react"
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const REFUND = {
  orderId: "FM-10482",
  orderHref: "/orders/FM-10482",
  amountCents: 4850,
  currency: "EUR",
  method: "Original payment method: Visa ending in 4242",
  issuedAt: "12 May 2025, 14:32",
  customerSeesBy: "19 May 2025 to 26 May 2025",
  timingNote:
    "Banks usually post refunds within 5 to 10 business days. The exact date depends on the customer's bank.",
}

const amountFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: REFUND.currency,
})

export default function RefundConfirmationScreen() {
  const amount = amountFormatter.format(REFUND.amountCents / 100)

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 bg-background p-6 text-foreground">
      <Alert variant="success">
        <CircleCheck />
        <AlertTitle>Refund issued for order {REFUND.orderId}</AlertTitle>
        <AlertDescription>
          The refund has been sent to the bank. Nothing more is needed from you.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            Refund details
            <Badge variant="success">
              <CircleCheck />
              Refunded
            </Badge>
          </CardTitle>
          <CardDescription>Issued {REFUND.issuedAt}</CardDescription>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Receipt className="size-4" aria-hidden="true" />
                Amount refunded
              </dt>
              <dd className="text-2xl font-semibold tabular-nums">{amount}</dd>
            </div>

            <div className="flex flex-col gap-1">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="size-4" aria-hidden="true" />
                Refund method
              </dt>
              <dd className="text-base">{REFUND.method}</dd>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" aria-hidden="true" />
                When the customer will see it
              </dt>
              <dd className="text-base font-medium">{REFUND.customerSeesBy}</dd>
              <dd className="text-sm text-muted-foreground">{REFUND.timingNote}</dd>
            </div>
          </dl>
        </CardContent>

        <CardFooter className="justify-end">
          <Button variant="outline" asChild>
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
