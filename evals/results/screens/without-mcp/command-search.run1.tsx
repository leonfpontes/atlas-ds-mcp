import { useEffect, useState } from "react"
import {
  Bell,
  CreditCard,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

type Entry = {
  id: string
  label: string
  href: string
  meta?: string
  keywords?: string[]
}

type Section = {
  heading: string
  icon: LucideIcon
  items: Entry[]
}

const ORDERS: Entry[] = [
  { id: "ord-1042", label: "Order #1042", href: "/admin/orders/1042", meta: "Ada Lovelace · Paid", keywords: ["shipped", "ada"] },
  { id: "ord-1041", label: "Order #1041", href: "/admin/orders/1041", meta: "Grace Hopper · Pending", keywords: ["grace"] },
  { id: "ord-1040", label: "Order #1040", href: "/admin/orders/1040", meta: "Alan Turing · Refunded", keywords: ["alan", "refund"] },
  { id: "ord-1039", label: "Order #1039", href: "/admin/orders/1039", meta: "Katherine Johnson · Paid", keywords: ["katherine"] },
  { id: "ord-1038", label: "Order #1038", href: "/admin/orders/1038", meta: "Linus Torvalds · Fulfilled", keywords: ["linus"] },
]

const PRODUCTS: Entry[] = [
  { id: "prd-101", label: "Ceramic Pour-Over Set", href: "/admin/products/101", meta: "24 in stock", keywords: ["coffee", "kitchen"] },
  { id: "prd-102", label: "Oak Cutting Board", href: "/admin/products/102", meta: "8 in stock", keywords: ["kitchen", "wood"] },
  { id: "prd-103", label: "Linen Tea Towel (set of 3)", href: "/admin/products/103", meta: "Out of stock", keywords: ["textile"] },
  { id: "prd-104", label: "Brass Herb Scissors", href: "/admin/products/104", meta: "41 in stock", keywords: ["garden", "kitchen"] },
  { id: "prd-105", label: "Beeswax Candle, Cedar", href: "/admin/products/105", meta: "16 in stock", keywords: ["home", "scent"] },
]

const CUSTOMERS: Entry[] = [
  { id: "cus-201", label: "Ada Lovelace", href: "/admin/customers/201", meta: "ada@example.com", keywords: ["vip"] },
  { id: "cus-202", label: "Grace Hopper", href: "/admin/customers/202", meta: "grace@example.com" },
  { id: "cus-203", label: "Katherine Johnson", href: "/admin/customers/203", meta: "katherine@example.com", keywords: ["wholesale"] },
  { id: "cus-204", label: "Linus Torvalds", href: "/admin/customers/204", meta: "linus@example.com" },
]

const SETTINGS: Entry[] = [
  { id: "set-store", label: "Store profile", href: "/admin/settings/store", meta: "Name, address, hours", keywords: ["business", "address"] },
  { id: "set-payments", label: "Payments", href: "/admin/settings/payments", meta: "Gateways and payouts", keywords: ["stripe", "billing"] },
  { id: "set-shipping", label: "Shipping & delivery", href: "/admin/settings/shipping", meta: "Zones and rates", keywords: ["carrier"] },
  { id: "set-taxes", label: "Taxes", href: "/admin/settings/taxes", meta: "Rates and exemptions", keywords: ["vat", "gst"] },
  { id: "set-notifications", label: "Notifications", href: "/admin/settings/notifications", meta: "Email and push alerts", keywords: ["alerts", "email"] },
  { id: "set-team", label: "Team & permissions", href: "/admin/settings/team", meta: "Roles and access", keywords: ["users", "roles", "security"] },
]

const SECTIONS: Section[] = [
  { heading: "Orders", icon: ShoppingCart, items: ORDERS },
  { heading: "Products", icon: Package, items: PRODUCTS },
  { heading: "Customers", icon: Users, items: CUSTOMERS },
  { heading: "Settings", icon: Settings, items: SETTINGS },
]

const SETTINGS_ICONS: Record<string, LucideIcon> = {
  "set-store": Store,
  "set-payments": CreditCard,
  "set-shipping": Truck,
  "set-taxes": Tags,
  "set-notifications": Bell,
  "set-team": Users,
}

export default function CommandMenu() {
  const [open, setOpen] = useState(false)

  // Global Cmd+K / Ctrl+K toggle
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)

  // Swap for your router's navigate() if the admin uses client-side routing.
  const go = (href: string) => {
    setOpen(false)
    window.location.assign(href)
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between gap-2 text-muted-foreground sm:w-72"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" aria-hidden="true" />
          Search or jump to…
        </span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:inline-flex">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to orders, products, customers, settings…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {SECTIONS.map((section, index) => {
            const Icon = section.icon
            return (
              <div key={section.heading}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={section.heading}>
                  {section.items.map((item) => {
                    const ItemIcon = SETTINGS_ICONS[item.id] ?? Icon
                    return (
                      <CommandItem
                        key={item.id}
                        value={[item.label, item.meta, ...(item.keywords ?? [])]
                          .filter(Boolean)
                          .join(" ")}
                        onSelect={() => go(item.href)}
                      >
                        <ItemIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.meta && (
                          <span className="ml-4 truncate text-xs text-muted-foreground">
                            {item.meta}
                          </span>
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </div>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}
