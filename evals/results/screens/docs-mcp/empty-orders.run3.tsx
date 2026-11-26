import { Copy, ShoppingBag } from "lucide-react"
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
const STORE_URL = "https://fernhillmarket.example/shop"

const NEXT_STEPS = [
  "Share your store link with customers, friends and your mailing list.",
  "Post the link on your social profiles and in your email signature.",
  "New orders appear here as soon as a customer checks out.",
]

export default function OrdersEmptyPage() {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(STORE_URL)
      toast.success("Store link copied")
    } catch {
      toast.error("Could not copy the link. Select it and copy it by hand.")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
        <header className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{STORE_NAME}</p>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        </header>

        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </div>
            <CardTitle>No orders yet</CardTitle>
            <CardDescription>
              Your store is open, but no customer has placed an order yet. Orders
              only arrive when people find your store, and the easiest way for
              them to find it is through your store link.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Your store link</p>
              <div className="truncate rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground">
                {STORE_URL}
              </div>
            </div>

            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted-foreground">
              {NEXT_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-3">
            <Button onClick={handleCopyLink}>
              <Copy aria-hidden="true" />
              Copy store link
            </Button>
          </CardFooter>
        </Card>
      </main>

      <Toaster />
    </div>
  )
}
