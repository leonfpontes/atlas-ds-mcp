import { useEffect, useState } from "react"
import { Package, Search, Settings, ShoppingBag, Users, CornerDownLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

type NavItem = {
  id: string
  label: string
  href: string
  meta?: string
  keywords?: string[]
}

type NavGroup = {
  heading: string
  icon: typeof ShoppingBag
  items: NavItem[]
}

const COMMAND_GROUPS: NavGroup[] = [
  {
    heading: "Orders",
    icon: ShoppingBag,
    items: [
      { id: "order-1042", label: "#1042 · Ana Ruiz", href: "/admin/orders/1042", meta: "Paid · 3 items", keywords: ["order", "1042", "ana ruiz"] },
      { id: "order-1041", label: "#1041 · Tomás Ortega", href: "/admin/orders/1041", meta: "Shipped · 1 item", keywords: ["order", "1041", "tomas ortega"] },
      { id: "order-1040", label: "#1040 · Priya Nair", href: "/admin/orders/1040", meta: "Refund pending · 2 items", keywords: ["order", "1040", "priya nair"] },
      { id: "orders-all", label: "All orders", href: "/admin/orders", keywords: ["orders", "list", "sales"] },
    ],
  },
  {
    heading: "Products",
    icon: Package,
    items: [
      { id: "product-oat", label: "Oat milk, barista edition", href: "/admin/products/oat-milk-barista", meta: "SKU FM-1182", keywords: ["product", "oat", "milk"] },
      { id: "product-honey", label: "Wildflower honey 500 g", href: "/admin/products/wildflower-honey-500", meta: "SKU FM-0934", keywords: ["product", "honey"] },
      { id: "product-tea", label: "Sencha loose leaf", href: "/admin/products/sencha-loose-leaf", meta: "SKU FM-2207", keywords: ["product", "tea", "sencha"] },
      { id: "products-all", label: "All products", href: "/admin/products", keywords: ["products", "catalog", "inventory"] },
    ],
  },
  {
    heading: "Customers",
    icon: Users,
    items: [
      { id: "customer-ana", label: "Ana Ruiz", href: "/admin/customers/ana-ruiz", meta: "ana.ruiz@example.com", keywords: ["customer", "ana"] },
      { id: "customer-tomas", label: "Tomás Ortega", href: "/admin/customers/tomas-ortega", meta: "tomas.ortega@example.com", keywords: ["customer", "tomas"] },
      { id: "customers-all", label: "All customers", href: "/admin/customers", keywords: ["customers", "people", "accounts"] },
    ],
  },
  {
    heading: "Settings",
    icon: Settings,
    items: [
      { id: "settings-store", label: "Store profile", href: "/admin/settings/store", keywords: ["settings", "store", "name", "address"] },
      { id: "settings-shipping", label: "Shipping rates", href: "/admin/settings/shipping", keywords: ["settings", "shipping", "delivery"] },
      { id: "settings-team", label: "Team and permissions", href: "/admin/settings/team", keywords: ["settings", "team", "roles", "permissions"] },
      { id: "settings-payments", label: "Payments", href: "/admin/settings/payments", keywords: ["settings", "payments", "stripe", "payouts"] },
    ],
  },
]

const RECENT_ITEMS: NavItem[] = [
  { id: "recent-orders", label: "All orders", href: "/admin/orders" },
  { id: "recent-products", label: "All products", href: "/admin/products" },
  { id: "recent-settings", label: "Store profile", href: "/admin/settings/store" },
]

export default function AdminCommandMenuScreen() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  function go(href: string) {
    setOpen(false)
    window.location.assign(href)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6 md:p-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Fernhill Market</h1>
            <p className="text-sm text-muted-foreground">Admin overview</p>
          </div>
          <Button variant="outline" onClick={() => setOpen(true)} aria-label="Open command menu">
            <Search />
            <span>Jump to…</span>
            <CommandShortcut className="ml-2 rounded-sm border border-border bg-muted px-1.5 py-0.5 text-muted-foreground">
              ⌘K
            </CommandShortcut>
          </Button>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {COMMAND_GROUPS.map((group) => {
            const Icon = group.icon
            return (
              <Card key={group.heading}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                    {group.heading}
                  </CardTitle>
                  <CardDescription>
                    {group.items.length} destinations in this area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col divide-y divide-border">
                    {group.items.map((item) => (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          className="flex items-center justify-between gap-4 py-2 text-sm hover:text-primary"
                        >
                          <span>{item.label}</span>
                          {item.meta ? (
                            <span className="text-xs text-muted-foreground">{item.meta}</span>
                          ) : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </section>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen} title="Jump to">
        <Command>
          <CommandInput placeholder="Search orders, products, customers, settings…" />
          <CommandList>
            <CommandEmpty>
              No matches. Try an order number, a product name, a customer or a settings page.
            </CommandEmpty>

            <CommandGroup heading="Recent">
              {RECENT_ITEMS.map((item) => (
                <CommandItem key={item.id} value={item.label} onSelect={() => go(item.href)}>
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>

            {COMMAND_GROUPS.map((group) => {
              const Icon = group.icon
              return (
                <div key={group.heading}>
                  <CommandSeparator />
                  <CommandGroup heading={group.heading}>
                    {group.items.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={`${group.heading} ${item.label}`}
                        keywords={item.keywords}
                        onSelect={() => go(item.href)}
                      >
                        <Icon className="text-muted-foreground" aria-hidden="true" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.meta ? (
                          <span className="truncate text-xs text-muted-foreground">{item.meta}</span>
                        ) : null}
                        <CornerDownLeft className="ml-2 size-3 text-muted-foreground" aria-hidden="true" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </div>
              )
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </main>
  )
}
