import { ArrowLeft, CheckCircle2, Clock, Copy, CreditCard, Receipt } from "lucide-react"
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

const STORE_NAME = "Fernhill Market"

const ORDER = {
  number: "FM-10482",
  href: "/admin/orders/FM-10482",
  customerName: "Amara Holt",
  customerEmail: "amara.holt@example.com",
}

const REFUND = {
  id: "rf_3QX7a1KpLmW9",
  status: "succeeded" as const,
  amountCents: 4850,
  currency: "EUR",
  reason: "Item arrived damaged",
  method: {
    label: "Visa",
    last4: "4242",
  },
  processedAt: "2025-06-12T10:24:00Z",
  // Bank settlement window, in business days after processing
  settlementBusinessDays: { min: 5, max: 10 },
}

const moneyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency })

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from)
  let remaining = days
  while (remaining > 0) {
    result.setUTCDate(result.getUTCDate() + 1)
    const day = result.getUTCDay()
    if (day !== 0 && day !== 6) remaining -= 1
  }
  return result
}

export default function RefundConfirmationPage() {
  const processed = new Date(REFUND.processedAt)
  const earliest = addBusinessDays(processed, REFUND.settlementBusinessDays.min)
  const latest = addBusinessDays(processed, REFUND.settlementBusinessDays.max)

  const amount = moneyFormatter(REFUND.currency).format(REFUND.amountCents / 100)
  const arrivalWindow = `${dateFormatter.format(earliest)} – ${dateFormatter.format(latest)}`

  const copyRefundId = async () => {
    try {
      await navigator.clipboard.writeText(REFUND.id)
      toast.success("Refund ID copied")
    } catch {
      toast.error("Could not copy the refund ID")
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 p-6">
      <header className="flex items-start gap-3">
        <CheckCircle2 className="mt-1 size-6 text-emerald-600" aria-hidden="true" />
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Refund issued</h1>
          <p className="text-muted-foreground text-sm">
            The refund for order {ORDER.number} has been sent to {ORDER.customerName} via{" "}
            {STORE_NAME}.
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Refund summary</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {REFUND.status}
            </Badge>
          </div>
          <CardDescription>Reason: {REFUND.reason}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                <Receipt className="size-4" aria-hidden="true" />
                Amount refunded
              </dt>
              <dd className="text-xl font-semibold tabular-nums">{amount}</dd>
            </div>

            <div className="space-y-1">
              <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                <CreditCard className="size-4" aria-hidden="true" />
                Refunded to
              </dt>
              <dd className="font-medium">
                {REFUND.method.label} ending in {REFUND.method.last4}
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                <Clock className="size-4" aria-hidden="true" />
                Customer sees it by
              </dt>
              <dd className="font-medium">{arrivalWindow}</dd>
              <dd className="text-muted-foreground text-xs">
                {REFUND.settlementBusinessDays.min}–{REFUND.settlementBusinessDays.max} business
                days, depending on the bank
              </dd>
            </div>

            <div className="space-y-1">
              <dt className="text-muted-foreground text-sm">Refund ID</dt>
              <dd className="flex items-center gap-2">
                <code className="bg-muted rounded px-2 py-1 font-mono text-xs">{REFUND.id}</code>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={copyRefundId}
                  aria-label="Copy refund ID"
                >
                  <Copy className="size-4" />
                </Button>
              </dd>
            </div>
          </dl>

          <Separator />

          <p className="text-muted-foreground text-sm">
            Customer notified at <span className="text-foreground">{ORDER.customerEmail}</span>.
            Banks can take longer than the window shown, so contact the customer if the refund has
            not arrived after {dateFormatter.format(latest)}.
          </p>
        </CardContent>

        <CardFooter className="justify-between gap-3">
          <Button variant="outline" asChild>
            <a href={ORDER.href}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to order {ORDER.number}
            </a>
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
