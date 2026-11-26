import { Fragment, useEffect, useState } from "react"
import { toast } from "sonner"
import { Search, ShoppingBag, Package, Users, Settings, CornerDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "@/components/ui/sonner"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

type Destination = {
  id: string
  label: string
  description: string
  href: string
  keywords: string
}

type Section = {
  heading: string
  icon: typeof ShoppingBag
  items: Destination[]
}

const SECTIONS: Section[] = [
  {
    heading: "Orders",
    icon: ShoppingBag,
    items: [
      { id: "order-1042", label: "#1042 · Ana Ruiz", description: "Paid · 3 items · $84.00", href: "/admin/orders/1042", keywords: "order ana ruiz paid" },
      { id: "order-1041", label: "#1041 · Tom Okafor", description: "Packed · 1 item · $23.50", href: "/admin/orders/1041", keywords: "order tom okafor packed" },
      { id: "order-1040", label: "#1040 · Lena Brandt", description: "Refunded · 2 items · $41.00", href: "/admin/orders/1040", keywords: "order lena brandt refunded" },
    ],
  },
  {
    heading: "Products",
    icon: Package,
    items: [
      { id: "product-oat", label: "Oat milk, 1 L", description: "In stock · 124 units", href: "/admin/products/oat-milk", keywords: "product grocery dairy" },
      { id: "product-sourdough", label: "Sourdough loaf", description: "Low stock · 6 units", href: "/admin/products/sourdough", keywords: "product bakery bread" },
      { id: "product-honey", label: "Wildflower honey, 500 g", description: "In stock · 38 units", href: "/admin/products/wildflower-honey", keywords: "product pantry jar" },
    ],
  },
  {
    heading: "Customers",
    icon: Users,
    items: [
      { id: "customer-ana", label: "Ana Ruiz", description: "14 orders · ana.ruiz@example.com", href: "/admin/customers/ana-ruiz", keywords: "customer email" },
      { id: "customer-tom", label: "Tom Okafor", description: "3 orders · tom.okafor@example.com", href: "/admin/customers/tom-okafor", keywords: "customer email" },
      { id: "customer-lena", label: "Lena Brandt", description: "7 orders · lena.brandt@example.com", href: "/admin/customers/lena-brandt", keywords: "customer email" },
    ],
  },
  {
    heading: "Settings",
    icon: Settings,
    items: [
      { id: "settings-store", label: "Store profile", description: "Name, address, opening hours", href: "/admin/settings/store", keywords: "settings store profile hours" },
      { id: "settings-payments", label: "Payments", description: "Payment providers and payouts", href: "/admin/settings/payments", keywords: "settings payments payouts" },
      { id: "settings-team", label: "Team and roles", description: "Staff accounts and permissions", href: "/admin/settings/team", keywords: "settings team roles staff" },
    ],
  },
]

const RECENT_ORDERS = SECTIONS[0].items

export default function AdminCommandMenu() {
  const [open, setOpen] = useState(false)
  const [lastOpened, setLastOpened] = useState<Destination | null>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function jumpTo(destination: Destination) {
    setOpen(false)
    setLastOpened(destination)
    // Replace with the router push for destination.href in the app shell.
    toast.success(`Opened ${destination.label}`, { description: destination.href })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold">Fernhill Market</span>
          <Badge variant="secondary">Admin</Badge>
        </div>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full max-w-xs justify-between text-muted-foreground sm:w-72"
        >
          <span className="flex items-center gap-2">
            <Search aria-hidden="true" />
            Search or jump to…
          </span>
          <CommandShortcut>⌘K</CommandShortcut>
        </Button>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">Recent orders</h2>
          <ul className="flex flex-col divide-y divide-border rounded-md border border-border">
            {RECENT_ORDERS.map((order) => (
              <li key={order.id}>
                <button
                  type="button"
                  onClick={() => jumpTo(order)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted"
                >
                  <span className="font-medium">{order.label}</span>
                  <span className="text-sm text-muted-foreground">{order.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {lastOpened && (
          <p className="text-sm text-muted-foreground">
            Last opened: <span className="text-foreground">{lastOpened.label}</span>
          </p>
        )}
      </main>

      <CommandDialog open={open} onOpenChange={setOpen} title="Jump to">
        <CommandInput placeholder="Search orders, products, customers, settings…" />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-1 py-4">
              <span>No results found.</span>
              <span className="text-sm text-muted-foreground">Try an order number, a product name or an email.</span>
            </div>
          </CommandEmpty>
          {SECTIONS.map((section, index) => {
            const Icon = section.icon
            return (
              <Fragment key={section.heading}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={section.heading}>
                  {section.items.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.label} ${item.description} ${item.keywords}`}
                      onSelect={() => jumpTo(item)}
                    >
                      <Icon aria-hidden="true" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{item.label}</span>
                        <span className="truncate text-xs text-muted-foreground">{item.description}</span>
                      </div>
                      <CommandShortcut>
                        <CornerDownLeft aria-hidden="true" />
                      </CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Fragment>
            )
          })}
        </CommandList>
      </CommandDialog>

      <Toaster />
    </div>
  )
}
