import { Copy, Info, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

const STORE_NAME = "Fernhill Market"
const STORE_LINK = "https://fernhill.market/fernhill-market"

const REASONS = [
  "Your store is open, but no customer has placed an order yet.",
  "Orders appear here after a customer completes checkout through your store link.",
  "Share the link with customers so they can find your products and order.",
]

export default function OrdersPage() {
  async function copyStoreLink() {
    try {
      await navigator.clipboard.writeText(STORE_LINK)
      toast.success("Store link copied")
    } catch {
      toast.error("Could not copy the link. Select it and copy it manually.")
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 bg-background p-6 text-foreground">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{STORE_NAME}</p>
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
      </header>

      <Alert variant="info">
        <Info />
        <AlertTitle>No orders yet</AlertTitle>
        <AlertDescription>
          Your store has not received any orders. Orders show up here once
          customers check out.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Why the list is empty</CardTitle>
          <CardDescription>
            Customers order through your store link. Until someone opens it and
            checks out, there is nothing to list.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ul className="flex flex-col gap-3">
            {REASONS.map((reason) => (
              <li key={reason} className="flex items-start gap-3 text-sm text-muted-foreground">
                <ShoppingBag className="mt-0.5 size-4 shrink-0 text-foreground" aria-hidden="true" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="break-all text-sm text-muted-foreground">{STORE_LINK}</p>
          <Button onClick={copyStoreLink}>
            <Copy />
            Copy store link
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
