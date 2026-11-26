import { useEffect } from "react"
import { ArrowLeft, CircleCheck } from "lucide-react"
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

const REFUND = {
  orderId: "FM-10482",
  orderHref: "/orders/FM-10482",
  amount: "$84.00",
  method: "Visa ending in 4242",
  issuedOn: "June 12, 2025",
  customerSees: "Within 5 to 10 business days",
  timingNote:
    "The time depends on the card issuer. Fernhill Market has sent the refund, so the customer's bank posts it to their account from here.",
}

export default function RefundConfirmationPage() {
  useEffect(() => {
    toast.success(`Refund of ${REFUND.amount} issued`)
  }, [])

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 bg-background p-6 text-foreground">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="success">
              <CircleCheck aria-hidden="true" />
              Refunded
            </Badge>
          </div>
          <CardTitle>Refund issued for order {REFUND.orderId}</CardTitle>
          <CardDescription>
            The refund has been sent to the customer's original payment method.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Refund amount</dt>
              <dd className="text-lg font-semibold tabular-nums">{REFUND.amount}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Refund method</dt>
              <dd className="text-base font-medium">{REFUND.method}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Issued on</dt>
              <dd className="text-base font-medium">{REFUND.issuedOn}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-sm text-muted-foreground">Customer sees it</dt>
              <dd className="text-base font-medium">{REFUND.customerSees}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">{REFUND.timingNote}</p>
        </CardContent>

        <CardFooter>
          <Button asChild variant="outline">
            <a href={REFUND.orderHref}>
              <ArrowLeft aria-hidden="true" />
              Back to order {REFUND.orderId}
            </a>
          </Button>
        </CardFooter>
      </Card>

      <Toaster position="bottom-right" />
    </main>
  )
}
