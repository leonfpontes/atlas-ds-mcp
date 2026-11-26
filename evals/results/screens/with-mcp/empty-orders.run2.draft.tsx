import { ShoppingBag, Copy } from "lucide-react";
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
const STORE_URL = "https://fernhill.market/store";

export default function OrdersPage() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(STORE_URL);
      toast.success("Store link copied");
    } catch {
      toast.error("Couldn't copy the link. Select it and copy it manually.");
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{STORE_NAME}</p>
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
      </header>

      <Card>
        <CardHeader>
          <ShoppingBag className="size-6 text-muted-foreground" aria-hidden="true" />
          <CardTitle>No orders yet</CardTitle>
          <CardDescription>
            Orders appear here when a customer checks out in your store. Your store is
            open, but no one has bought anything yet. Share your store link so
            customers can find it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm text-foreground break-all">
            {STORE_URL}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCopy}>
            <Copy />
            Copy store link
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}