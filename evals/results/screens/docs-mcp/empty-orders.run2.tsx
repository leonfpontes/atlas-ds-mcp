import { Copy, PackageOpen } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"

const STORE_NAME = "Fernhill Market"
const STORE_URL = "https://fernhill.market/shop"
const STORE_URL_LABEL = "fernhill.market/shop"

export default function OrdersPage() {
  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(STORE_URL)
      toast.success("Store link copied")
    } catch {
      toast.error("Could not copy the link. Select it and copy it by hand.")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{STORE_NAME}</p>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Orders from your store appear here as customers check out.
          </p>
        </header>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <PackageOpen
              aria-hidden="true"
              className="size-10 text-muted-foreground"
            />
            <div className="flex max-w-md flex-col gap-2">
              <CardTitle className="text-lg">No orders yet</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Your store is set up, but no customer has placed an order yet.
                Orders are listed here once someone completes checkout. Share
                your store link so customers can find your products.
              </CardDescription>
            </div>
            <p className="rounded-md bg-muted px-3 py-2 font-mono text-sm text-foreground">
              {STORE_URL_LABEL}
            </p>
          </CardContent>
          <CardFooter className="justify-center border-t border-border pt-6">
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
