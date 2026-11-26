import { useEffect, useState } from "react"
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
import { Button } from "@/components/ui/button"
import {
  Package,
  Search,
  Settings,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react"

type NavItem = {
  label: string
  href: string
  keywords?: string[]
}

type NavGroup = {
  heading: string
  icon: LucideIcon
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    heading: "Orders",
    icon: ShoppingBag,
    items: [
      { label: "All orders", href: "/admin/orders", keywords: ["sales", "transactions"] },
      { label: "Pending fulfillment", href: "/admin/orders?status=pending", keywords: ["unfulfilled", "to ship"] },
      { label: "Refund requests", href: "/admin/orders?status=refund", keywords: ["return", "chargeback"] },
    ],
  },
  {
    heading: "Products",
    icon: Package,
    items: [
      { label: "All products", href: "/admin/products", keywords: ["catalog", "inventory", "sku"] },
      { label: "Low stock", href: "/admin/products?filter=low-stock", keywords: ["inventory", "out of stock"] },
      { label: "Collections", href: "/admin/products/collections", keywords: ["categories", "tags"] },
    ],
  },
  {
    heading: "Customers",
    icon: Users,
    items: [
      { label: "All customers", href: "/admin/customers", keywords: ["buyers", "accounts"] },
      { label: "Wholesale accounts", href: "/admin/customers?type=wholesale", keywords: ["b2b", "trade"] },
      { label: "Subscribers", href: "/admin/customers?type=subscriber", keywords: ["newsletter", "email"] },
    ],
  },
  {
    heading: "Settings",
    icon: Settings,
    items: [
      { label: "General", href: "/admin/settings", keywords: ["store", "profile", "business"] },
      { label: "Shipping", href: "/admin/settings/shipping", keywords: ["delivery", "rates", "carriers"] },
      { label: "Payments", href: "/admin/settings/payments", keywords: ["stripe", "payouts", "billing"] },
      { label: "Team", href: "/admin/settings/team", keywords: ["users", "roles", "permissions"] },
    ],
  },
]

export default function AdminCommandMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((previous) => !previous)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const navigate = (href: string) => {
    setOpen(false)
    window.location.assign(href)
  }

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
  const modifierKey = isMac ? "⌘" : "Ctrl"

  return (
    <div className="flex items-center justify-end p-4">
      <Button
        variant="outline"
        className="w-64 justify-between text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          Search admin…
        </span>
        <CommandShortcut>{modifierKey} K</CommandShortcut>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command menu"
        description="Jump to orders, products, customers or settings"
      >
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {NAV_GROUPS.map((group, index) => (
            <div key={group.heading}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={`${group.heading} ${item.label}`}
                    keywords={item.keywords}
                    onSelect={() => navigate(item.href)}
                  >
                    <group.icon className="size-4 text-muted-foreground" />
                    <span>{item.label}</span>
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
