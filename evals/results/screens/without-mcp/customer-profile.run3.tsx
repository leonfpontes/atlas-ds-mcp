import { useMemo, useState } from "react";
import {
  Crown,
  Mail,
  MapPin,
  Package,
  Phone,
  StickyNote,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type OrderStatus = "delivered" | "shipped" | "processing" | "refunded";

type Order = {
  id: string;
  placedAt: string;
  items: number;
  total: number;
  status: OrderStatus;
};

type Note = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

type Tier = {
  name: string;
  minPoints: number;
};

const TIERS: Tier[] = [
  { name: "Bronze", minPoints: 0 },
  { name: "Silver", minPoints: 1000 },
  { name: "Gold", minPoints: 2500 },
  { name: "Platinum", minPoints: 5000 },
];

const CUSTOMER = {
  id: "FM-204518",
  firstName: "Amara",
  lastName: "Okafor",
  email: "amara.okafor@example.com",
  phone: "+1 (555) 013-7842",
  address: ["88 Willow Lane", "Apt 4B", "Portland, OR 97209", "United States"],
  memberSince: "2021-03-14T00:00:00Z",
  loyaltyPoints: 2730,
  lifetimeSpend: 4128.6,
  marketingOptIn: true,
};

const ORDERS: Order[] = [
  { id: "FM-88213", placedAt: "2025-05-28T10:42:00Z", items: 6, total: 84.2, status: "processing" },
  { id: "FM-88012", placedAt: "2025-05-14T16:05:00Z", items: 3, total: 41.75, status: "shipped" },
  { id: "FM-87644", placedAt: "2025-04-30T09:18:00Z", items: 11, total: 172.4, status: "delivered" },
  { id: "FM-87120", placedAt: "2025-04-11T13:27:00Z", items: 2, total: 19.99, status: "refunded" },
  { id: "FM-86907", placedAt: "2025-03-29T18:50:00Z", items: 8, total: 127.3, status: "delivered" },
  { id: "FM-86411", placedAt: "2025-03-08T11:12:00Z", items: 4, total: 56.6, status: "delivered" },
  { id: "FM-85998", placedAt: "2025-02-17T08:36:00Z", items: 9, total: 143.05, status: "delivered" },
  { id: "FM-85530", placedAt: "2025-01-26T15:20:00Z", items: 5, total: 68.9, status: "delivered" },
  { id: "FM-85102", placedAt: "2025-01-04T12:01:00Z", items: 7, total: 97.45, status: "delivered" },
  { id: "FM-84677", placedAt: "2024-12-15T19:44:00Z", items: 12, total: 205.8, status: "delivered" },
];

const INITIAL_NOTES: Note[] = [
  {
    id: "n-1",
    author: "Joel R.",
    body: "Customer prefers email over phone. Asked about substitutions for dairy-free items.",
    createdAt: "2025-04-02T14:10:00Z",
  },
  {
    id: "n-2",
    author: "Priya S.",
    body: "Refund on FM-87120 approved after damaged produce report.",
    createdAt: "2025-04-12T09:55:00Z",
  },
];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const STATUS_BADGE: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  delivered: { label: "Delivered", variant: "secondary" },
  shipped: { label: "Shipped", variant: "default" },
  processing: { label: "Processing", variant: "outline" },
  refunded: { label: "Refunded", variant: "destructive" },
};

function getCurrentTier(points: number): { current: Tier; next: Tier | null; progress: number } {
  let currentIndex = 0;
  TIERS.forEach((tier, index) => {
    if (points >= tier.minPoints) currentIndex = index;
  });
  const current = TIERS[currentIndex];
  const next = TIERS[currentIndex + 1] ?? null;
  if (!next) return { current, next: null, progress: 100 };
  const span = next.minPoints - current.minPoints;
  const progress = Math.min(100, Math.round(((points - current.minPoints) / span) * 100));
  return { current, next, progress };
}

export default function CustomerProfilePage() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [draft, setDraft] = useState("");

  const fullName = `${CUSTOMER.firstName} ${CUSTOMER.lastName}`;
  const initials = `${CUSTOMER.firstName[0]}${CUSTOMER.lastName[0]}`;
  const memberSince = dateFmt.format(new Date(CUSTOMER.memberSince));
  const tier = useMemo(() => getCurrentTier(CUSTOMER.loyaltyPoints), []);

  function saveNote() {
    const body = draft.trim();
    if (!body) {
      toast.error("Write a note before saving.");
      return;
    }
    const note: Note = {
      id: crypto.randomUUID(),
      author: "You",
      body,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
    setDraft("");
    toast.success("Internal note saved");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{fullName}</h1>
              <Badge variant="secondary">
                <Crown className="size-3" />
                {tier.current.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Customer {CUSTOMER.id} · Member since {memberSince}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Email composer opened")}>
            <Mail />
            Email customer
          </Button>
          <Button variant="outline" onClick={() => toast.info("Call started")}>
            <Phone />
            Call
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Contact details */}
          <Card>
            <CardHeader>
              <CardTitle>Contact details</CardTitle>
              <CardDescription>Used for order updates and receipts.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Email</Label>
                <p className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  {CUSTOMER.email}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Phone</Label>
                <p className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  {CUSTOMER.phone}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground">Delivery address</Label>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <address className="not-italic leading-relaxed">
                    {CUSTOMER.address.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Marketing emails</span>
                <Badge variant={CUSTOMER.marketingOptIn ? "secondary" : "outline"}>
                  {CUSTOMER.marketingOptIn ? "Opted in" : "Opted out"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty */}
          <Card>
            <CardHeader>
              <CardTitle>Loyalty</CardTitle>
              <CardDescription>
                {tier.next
                  ? `${(tier.next.minPoints - CUSTOMER.loyaltyPoints).toLocaleString()} points to ${tier.next.name}`
                  : "Highest tier reached"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-semibold tabular-nums">
                    {CUSTOMER.loyaltyPoints.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{currency.format(CUSTOMER.lifetimeSpend)}</p>
                  <p className="text-sm text-muted-foreground">lifetime spend</p>
                </div>
              </div>
              <div
                role="progressbar"
                aria-label={`Progress to next tier`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={tier.progress}
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${tier.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{tier.current.name}</span>
                {tier.next && <span>{tier.next.name}</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-4" />
                Recent orders
              </CardTitle>
              <CardDescription>Last 10 orders, most recent first.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Placed</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ORDERS.slice(0, 10).map((order) => {
                    const status = STATUS_BADGE[order.status];
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {dateFmt.format(new Date(order.placedAt))}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{order.items}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {currency.format(order.total)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Internal notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="size-4" />
                Internal notes
              </CardTitle>
              <CardDescription>Visible to the support team only. Never shown to the customer.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="internal-note">Add a note</Label>
                <Textarea
                  id="internal-note"
                  placeholder="Summarise the interaction or next step..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={saveNote} disabled={!draft.trim()}>
                  Save note
                </Button>
              </div>

              <Separator />

              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No internal notes yet.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {notes.map((note) => (
                    <li key={note.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{note.author}</span>
                        <time dateTime={note.createdAt}>
                          {dateTimeFmt.format(new Date(note.createdAt))}
                        </time>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.body}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {notes.length} {notes.length === 1 ? "note" : "notes"} on file
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
