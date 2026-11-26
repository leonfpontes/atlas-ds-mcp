import { ArrowLeft, CheckCircle2, Clock, Copy, CreditCard, Mail } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"

const REFUND = {
  id: "RF-20418",
  orderNumber: "FM-10293",
  orderHref: "/admin/orders/FM-10293",
  amountCents: 4850,
  currency: "USD",
  method: "Visa ending in 4242",
  status: "Processed",
  processedOn: "2025-06-12T09:30:00Z",
  expectedFrom: "2025-06-16T00:00:00Z",
  expectedTo: "2025-06-19T00:00:00Z",
  customerEmail: "maya.ortiz@example.com",
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: REFUND.currency,
})

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
  timeZoneName: "short",
})

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 space-y-0.5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="text-sm font-medium text-foreground">{children}</div>
      </div>
    </div>
  )
}

export default function RefundConfirmation() {
  const amount = currencyFormatter.format(REFUND.amountCents / 100)
  const processedAt = dateTimeFormatter.format(new Date(REFUND.processedOn))
  const expectedRange = `${dateFormatter.format(
    new Date(REFUND.expectedFrom),
  )} – ${dateFormatter.format(new Date(REFUND.expectedTo))}`

  const copyRefundId = async () => {
    try {
      await navigator.clipboard.writeText(REFUND.id)
      toast.success("Refund ID copied", { description: REFUND.id })
    } catch {
      toast.error("Could not copy the refund ID")
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <a href={REFUND.orderHref}>
            <ArrowLeft className="size-4" />
            Back to order {REFUND.orderNumber}
          </a>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-6 text-emerald-600" />
            <Badge variant="secondary">{REFUND.status}</Badge>
          </div>
          <CardTitle className="text-2xl">Refund issued</CardTitle>
          <CardDescription>
            A refund of <span className="font-semibold text-foreground">{amount}</span>{" "}
            for order {REFUND.orderNumber} has been sent to the customer's
            original payment method.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="divide-y">
          <DetailRow icon={CreditCard} label="Amount refunded">
            <span className="text-lg font-semibold">{amount}</span>
          </DetailRow>

          <DetailRow icon={CreditCard} label="Refund method">
            {REFUND.method}
          </DetailRow>

          <DetailRow icon={Clock} label="When the customer will see it">
            <p>{expectedRange}</p>
            <p className="text-xs font-normal text-muted-foreground">
              Typically 3–5 business days after processing. Processed {processedAt}.
            </p>
          </DetailRow>

          <DetailRow icon={Mail} label="Customer notified">
            {REFUND.customerEmail}
          </DetailRow>

          <div className="flex items-start gap-3 py-3">
            <Copy className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-1 items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-sm text-muted-foreground">Refund ID</p>
                <p className="font-mono text-sm font-medium">{REFUND.id}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyRefundId}>
                Copy
              </Button>
            </div>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="justify-end gap-2 pt-6">
          <Button variant="outline" asChild>
            <a href={REFUND.orderHref}>View order</a>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
