import { useEffect, useState } from "react"
import { Package, Search, Settings, ShoppingCart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

type JumpTarget = {
  id: string
  label: string
  description: string
  href: string
}

type JumpGroup = {
  heading: string
  icon: typeof ShoppingCart
  items: JumpTarget[]
}

const JUMP_GROUPS: JumpGroup[] = [
  {
    heading: "Orders",
    icon: ShoppingCart,
    items: [
      { id: "order-1042", label: "#1042 · Ana Ruiz", description: "Paid · 3 items · €86.40", href: "/orders/1042" },
      { id: "order-1041", label: "#1041 · Tom Okafor", description: "Packing · 1 item · €18.90", href: "/orders/1041" },
      { id: "order-1040", label: "#1040 · Lena Berg", description: "Shipped · 5 items · €142.00", href: "/orders/1040" },
      { id: "orders-all", label: "All orders", description: "Open the orders list", href: "/orders" },
    ],
  },
  {
    heading: "Products",
    icon: Package,
    items: [
      { id: "product-oat", label: "Oat milk, 1 L", description: "SKU FM-1182 · 24 in stock", href: "/products/FM-1182" },
      { id: "product-honey", label: "Wildflower honey, 500 g", description: "SKU FM-0734 · 3 in stock", href: "/products/FM-0734" },
      { id: "products-all", label: "All products", description: "Open the product catalogue", href: "/products" },
    ],
  },
  {
    heading: "Customers",
    icon: Users,
    items: [
      { id: "customer-ana", label: "Ana Ruiz", description: "ana.ruiz@example.com · 12 orders", href: "/customers/ana-ruiz" },
      { id: "customer-lena", label: "Lena Berg", description: "lena.berg@example.com · 4 orders", href: "/customers/lena-berg" },
      { id: "customers-all", label: "All customers", description: "Open the customer list", href: "/customers" },
    ],
  },
  {
    heading: "Settings",
    icon: Settings,
    items: [
      { id: "settings-store", label: "Store settings", description: "Name, address, opening hours", href: "/settings/store" },
      { id: "settings-shipping", label: "Shipping", description: "Zones and delivery rates", href: "/settings/shipping" },
      { id: "settings-team", label: "Team and roles", description: "Staff access and permissions", href: "/settings/team" },
    ],
  },
]

export default function CommandMenuScreen() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((previous) => !previous)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const jumpTo = (href: string) => {
    setOpen(false)
    window.location.assign(href)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div>
          <p className="text-sm text-muted-foreground">Fernhill Market admin</p>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          aria-keyshortcuts="Meta+K Control+K"
          className="gap-2"
        >
          <Search className="size-4 text-muted-foreground" aria-hidden="true" />
          <span className="text-muted-foreground">Jump to…</span>
          <CommandShortcut>⌘K</CommandShortcut>
        </Button>
      </header>

      <main className="px-6 py-8">
        <p className="max-w-prose text-sm text-muted-foreground">
          Press ⌘K (Ctrl+K on Windows) from any page to jump to orders, products, customers or settings.
        </p>
      </main>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Jump to"
        showCloseButton={false}
      >
        <CommandInput placeholder="Search orders, products, customers, settings…" />
        <CommandList>
          <CommandEmpty>No matches. Try an order number, a product SKU or a customer name.</CommandEmpty>
          {JUMP_GROUPS.map((group, index) => (
            <div key={group.heading}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${group.heading} ${item.label} ${item.description}`}
                    onSelect={() => jumpTo(item.href)}
                  >
                    <group.icon className="text-muted-foreground" aria-hidden="true" />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate">{item.label}</span>
                      <span className="truncate text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  )
}
