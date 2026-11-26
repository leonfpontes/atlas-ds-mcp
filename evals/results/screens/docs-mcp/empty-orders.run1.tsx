import { Copy, ExternalLink, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
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
const STORE_URL = "https://fernhill.market/store"

export default function OrdersPage() {
  const orders: never[] = []

  async function copyStoreLink() {
    try {
      await navigator.clipboard.writeText(STORE_URL)
      toast.success("Store link copied")
    } catch {
      toast.error("Could not copy the link. Select it above and copy it by hand.")
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <Toaster />

      <header className="mb-6">
        <p className="text-sm text-muted-foreground">{STORE_NAME}</p>
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
      </header>

      {orders.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No orders yet</CardTitle>
            <CardDescription>
              Orders appear here after a customer checks out in your store. Your store
              has not received an order yet, so there is nothing to list.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              Share your store link with customers to start receiving orders.
            </p>
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2">
              <ShoppingBag className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate font-mono text-sm text-foreground">{STORE_URL}</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-2">
            <Button onClick={copyStoreLink}>
              <Copy />
              Copy store link
            </Button>
            <Button variant="outline" asChild>
              <a href={STORE_URL} target="_blank" rel="noreferrer">
                <ExternalLink />
                Preview store
              </a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </main>
  )
}
