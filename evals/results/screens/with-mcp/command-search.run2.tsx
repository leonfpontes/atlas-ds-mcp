import { Fragment, useEffect, useState } from "react"
import { Package, Settings, ShoppingCart, Users } from "lucide-react"
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

type Group = "Orders" | "Products" | "Customers" | "Settings"

type NavItem = {
  id: string
  label: string
  href: string
  group: Group
}

const NAV_ITEMS: NavItem[] = [
  { id: "orders", label: "All orders", href: "/admin/orders", group: "Orders" },
  { id: "orders-pending", label: "Pending fulfillment", href: "/admin/orders?status=pending", group: "Orders" },
  { id: "orders-refunds", label: "Refund requests", href: "/admin/orders?status=refund", group: "Orders" },
  { id: "products", label: "All products", href: "/admin/products", group: "Products" },
  { id: "products-low-stock", label: "Low stock", href: "/admin/products?stock=low", group: "Products" },
  { id: "products-new", label: "Add product", href: "/admin/products/new", group: "Products" },
  { id: "customers", label: "All customers", href: "/admin/customers", group: "Customers" },
  { id: "customers-wholesale", label: "Wholesale accounts", href: "/admin/customers?type=wholesale", group: "Customers" },
  { id: "settings-store", label: "Store details", href: "/admin/settings/store", group: "Settings" },
  { id: "settings-shipping", label: "Shipping and taxes", href: "/admin/settings/shipping", group: "Settings" },
  { id: "settings-team", label: "Team and permissions", href: "/admin/settings/team", group: "Settings" },
]

const GROUPS: { name: Group; icon: typeof Package }[] = [
  { name: "Orders", icon: ShoppingCart },
  { name: "Products", icon: Package },
  { name: "Customers", icon: Users },
  { name: "Settings", icon: Settings },
]

export default function AdminCommandMenu() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((previous) => !previous)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  function go(href: string) {
    setOpen(false)
    window.location.assign(href)
  }

  return (
    <div className="flex min-h-screen items-start justify-end p-6">
      <Button variant="outline" onClick={() => setOpen(true)} aria-label="Open command menu">
        Search admin
        <CommandShortcut>⌘K</CommandShortcut>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title="Fernhill Market admin commands">
        <CommandInput placeholder="Jump to orders, products, customers or settings…" />
        <CommandList>
          <CommandEmpty>No matches. Try an order number, a product name or "settings".</CommandEmpty>
          {GROUPS.map((group, index) => {
            const Icon = group.icon
            const items = NAV_ITEMS.filter((item) => item.group === group.name)
            return (
              <Fragment key={group.name}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={group.name}>
                  {items.map((item) => (
                    <CommandItem key={item.id} value={item.label} onSelect={() => go(item.href)}>
                      <Icon />
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Fragment>
            )
          })}
        </CommandList>
      </CommandDialog>
    </div>
  )
}
