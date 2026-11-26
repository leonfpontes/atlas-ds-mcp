import { useState } from "react"
import { Copy, Share2, ShoppingBag, Globe, Megaphone, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const STORE_NAME = "Fernhill Market"
const STORE_URL = "https://fernhillmarket.example/shop"

const TIPS = [
  {
    icon: Globe,
    title: "Your store is live",
    description: "Customers can browse and place orders at the link below.",
  },
  {
    icon: Megaphone,
    title: "Tell your customers",
    description: "Share the link on social media, in your newsletter, or on your receipts.",
  },
  {
    icon: ShoppingBag,
    title: "Orders appear here",
    description: "Every order placed through your store will be listed on this page.",
  },
]

export default function FernhillOrdersPage() {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareData = {
      title: STORE_NAME,
      text: `Shop ${STORE_NAME} online`,
      url: STORE_URL,
    }

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(shareData)
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
      }
    }

    try {
      await navigator.clipboard.writeText(STORE_URL)
      setCopied(true)
      toast.success("Store link copied to clipboard")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy the link. Please copy it manually.")
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-muted-foreground">{STORE_NAME}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Orders</h1>
      </header>

      <Card className="border-dashed">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="size-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl">No orders yet</CardTitle>
          <CardDescription className="max-w-md">
            Your store hasn&apos;t received any orders so far. New orders appear here as soon as
            customers check out. Most stores get their first orders after sharing their link with
            customers.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-3">
          <div className="w-full max-w-md truncate rounded-md border bg-muted/50 px-3 py-2 text-center font-mono text-sm text-muted-foreground">
            {STORE_URL}
          </div>
          <Button onClick={handleShare} size="lg" className="w-full max-w-md gap-2">
            {copied ? (
              <Check className="size-4" aria-hidden="true" />
            ) : typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
              <Share2 className="size-4" aria-hidden="true" />
            ) : (
              <Copy className="size-4" aria-hidden="true" />
            )}
            {copied ? "Link copied" : "Share store link"}
          </Button>
        </CardContent>
      </Card>

      <section aria-labelledby="getting-started" className="flex flex-col gap-4">
        <h2 id="getting-started" className="text-base font-semibold text-foreground">
          Getting your first orders
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {TIPS.map(({ icon: Icon, title, description }) => (
            <li key={title}>
              <Card className="h-full">
                <CardContent className="flex flex-col gap-2 pt-6">
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
