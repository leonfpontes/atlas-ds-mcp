import { Copy, ExternalLink, PackageOpen, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STORE_NAME = "Fernhill Market";
const STORE_URL = "https://fernhillmarket.com/shop";
const STORE_SHARE_TEXT = "Shop Fernhill Market online";

const ORDER_STEPS = [
  {
    id: "store-live",
    title: "Store is live",
    description: "Your storefront is published and reachable at the link below.",
  },
  {
    id: "first-visit",
    title: "Customers find your store",
    description: "Share the link so shoppers can browse your products.",
  },
  {
    id: "first-checkout",
    title: "A customer completes checkout",
    description: "Orders appear here once payment is confirmed.",
  },
];

export default function FernhillOrdersEmptyPage() {
  async function handleShare() {
    const shareData = {
      title: STORE_NAME,
      text: STORE_SHARE_TEXT,
      url: STORE_URL,
    };

    try {
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(STORE_URL);
      toast.success("Store link copied to clipboard");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      toast.error("Couldn't share the link. Copy it manually instead.");
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(STORE_URL);
      toast.success("Store link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link. Try again.");
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6 md:p-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Orders
        </h1>
        <p className="text-sm text-muted-foreground">
          Orders from {STORE_NAME} customers will show up here.
        </p>
      </header>

      <Card className="items-center text-center">
        <CardHeader className="items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <PackageOpen className="size-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <CardTitle className="text-xl">No orders yet</CardTitle>
          <CardDescription className="max-w-md">
            Your store is set up, but no customer has completed a checkout yet.
            Orders appear here as soon as a payment goes through. Share your store
            link to bring in your first shoppers.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleShare}>
            <Share2 aria-hidden="true" />
            Share store link
          </Button>
          <Button variant="outline" onClick={handleCopy}>
            <Copy aria-hidden="true" />
            Copy link
          </Button>
        </CardFooter>

        <CardContent className="w-full">
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {STORE_URL.replace("https://", "")}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </CardContent>
      </Card>

      <section aria-labelledby="order-steps-heading" className="flex flex-col gap-3">
        <h2 id="order-steps-heading" className="text-sm font-medium text-foreground">
          How your first order happens
        </h2>
        <ol className="flex flex-col divide-y rounded-lg border bg-card">
          {ORDER_STEPS.map((step, index) => (
            <li key={step.id} className="flex items-start gap-4 p-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {index + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{step.title}</span>
                <span className="text-sm text-muted-foreground">{step.description}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
