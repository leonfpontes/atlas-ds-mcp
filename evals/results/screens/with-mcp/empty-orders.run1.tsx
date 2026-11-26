import { useState } from "react"
import { PackageOpen, Share2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"

const STORE_NAME = "Fernhill Market"
const STORE_URL = "https://fernhillmarket.com/shop"
const ORDERS: Array<{ id: string; customer: string; total: string; status: string }> = []

export default function OrdersPage() {
  const [orders] = useState(ORDERS)

  async function shareStoreLink() {
    try {
      await navigator.clipboard.writeText(STORE_URL)
      toast.success("Store link copied")
    } catch {
      toast.error("Could not copy the link. Copy it from the address above.")
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">{STORE_NAME}</p>
      </header>

      {orders.length === 0 ? (
        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <PackageOpen className="size-5" aria-hidden="true" />
            </div>
            <CardTitle>No orders yet</CardTitle>
            <CardDescription>
              Orders appear here when a customer checks out in your store. Your store is open, but
              no one has placed an order yet. Customers usually find a store through a shared link,
              so send your store link to the people you want to reach.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Store link: <span className="font-medium text-foreground">{STORE_URL}</span>
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={shareStoreLink}>
              <Share2 aria-hidden="true" />
              Copy store link
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardDescription>{orders.length} orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y">
              {orders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-foreground">{order.customer}</span>
                  <span className="text-muted-foreground">
                    {order.total} · {order.status}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Toaster />
    </main>
  )
}
