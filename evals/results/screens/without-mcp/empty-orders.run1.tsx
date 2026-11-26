import { useState } from "react";
import { Copy, Link as LinkIcon, PackageOpen, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STORE = {
  name: "Fernhill Market",
  url: "https://fernhill.market/s/fernhill-market",
  shareTitle: "Shop Fernhill Market",
  shareText: "Browse and order from Fernhill Market.",
};

const EMPTY_REASONS = [
  {
    title: "No customers have found the store yet",
    description: "Share your store link so people can start browsing and ordering.",
  },
  {
    title: "Your store is not yet visible to shoppers",
    description: "Stores appear to customers once at least one product is published.",
  },
  {
    title: "Orders show up after checkout is completed",
    description: "Abandoned carts and test sessions do not appear in this list.",
  },
];

export default function OrdersPage() {
  const [isSharing, setIsSharing] = useState(false);

  async function handleShareStore() {
    setIsSharing(true);
    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({
          title: STORE.shareTitle,
          text: STORE.shareText,
          url: STORE.url,
        });
        toast.success("Store link shared");
      } else {
        await navigator.clipboard.writeText(STORE.url);
        toast.success("Store link copied to clipboard");
      }
    } catch (error) {
      // The user cancelling the native share sheet rejects with AbortError; that is not a failure.
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      toast.error("Could not share the store link. Try copying it instead.");
    } finally {
      setIsSharing(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(STORE.url);
      toast.success("Store link copied to clipboard");
    } catch {
      toast.error("Could not copy the store link.");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{STORE.name}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Orders</h1>
      </header>

      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <PackageOpen className="size-7 text-muted-foreground" aria-hidden="true" />
          </div>

          <div className="flex max-w-md flex-col gap-2">
            <h2 className="text-lg font-semibold text-foreground">No orders yet</h2>
            <p className="text-sm text-muted-foreground">
              Orders will appear here once customers place them. Your order list is empty
              for one of these reasons:
            </p>
          </div>

          <ul className="flex w-full max-w-md flex-col gap-3 text-left">
            {EMPTY_REASONS.map((reason) => (
              <li
                key={reason.title}
                className="rounded-lg border border-border bg-background p-4"
              >
                <p className="text-sm font-medium text-foreground">{reason.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{reason.description}</p>
              </li>
            ))}
          </ul>

          <div className="flex w-full max-w-md flex-col gap-3 rounded-lg border border-dashed border-border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LinkIcon className="size-4" aria-hidden="true" />
              <span className="truncate" title={STORE.url}>
                {STORE.url}
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1"
                onClick={handleShareStore}
                disabled={isSharing}
              >
                <Share2 className="size-4" aria-hidden="true" />
                {isSharing ? "Sharing..." : "Share store link"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleCopyLink}>
                <Copy className="size-4" aria-hidden="true" />
                Copy link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
