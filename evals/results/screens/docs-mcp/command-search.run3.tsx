import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  ClipboardList,
  Package,
  Search,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"

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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "@/components/ui/sonner"

type Section = "Orders" | "Products" | "Customers" | "Settings"

type NavItem = {
  id: string
  label: string
  meta: string
  section: Section
  href: string
}

const SECTION_ICONS: Record<Section, LucideIcon> = {
  Orders: ClipboardList,
  Products: Package,
  Customers: Users,
  Settings: Settings,
}

// Example data for the command menu.
const ORDERS: NavItem[] = [
  { id: "1042", label: "#1042 · Ana Ruiz", meta: "Paid · 3 items", section: "Orders", href: "/admin/orders/1042" },
  { id: "1041", label: "#1041 · Tomás Ferreira", meta: "Shipped · 1 item", section: "Orders", href: "/admin/orders/1041" },
  { id: "1040", label: "#1040 · Mei Lin", meta: "Refund pending · 2 items", section: "Orders", href: "/admin/orders/1040" },
  { id: "1039", label: "#1039 · Omar Haddad", meta: "Packing · 5 items", section: "Orders", href: "/admin/orders/1039" },
]

const PRODUCTS: NavItem[] = [
  { id: "p-101", label: "Stoneware pour-over set", meta: "SKU FH-101 · 24 in stock", section: "Products", href: "/admin/products/p-101" },
  { id: "p-114", label: "Linen tea towel, indigo", meta: "SKU FH-114 · 8 in stock", section: "Products", href: "/admin/products/p-114" },
  { id: "p-127", label: "Beeswax candle, cedar", meta: "SKU FH-127 · 0 in stock", section: "Products", href: "/admin/products/p-127" },
]

const CUSTOMERS: NavItem[] = [
  { id: "c-88", label: "Ana Ruiz", meta: "ana.ruiz@example.com · 12 orders", section: "Customers", href: "/admin/customers/c-88" },
  { id: "c-75", label: "Tomás Ferreira", meta: "tomas.f@example.com · 4 orders", section: "Customers", href: "/admin/customers/c-75" },
  { id: "c-61", label: "Mei Lin", meta: "mei.lin@example.com · 7 orders", section: "Customers", href: "/admin/customers/c-61" },
]

const SETTINGS: NavItem[] = [
  { id: "s-store", label: "Store profile", meta: "Name, address, contact", section: "Settings", href: "/admin/settings/store" },
  { id: "s-shipping", label: "Shipping rates", meta: "Zones and carriers", section: "Settings", href: "/admin/settings/shipping" },
  { id: "s-tax", label: "Taxes", meta: "Rates per region", section: "Settings", href: "/admin/settings/taxes" },
  { id: "s-team", label: "Team and permissions", meta: "Staff roles", section: "Settings", href: "/admin/settings/team" },
]

const GROUPS: { heading: Section; items: NavItem[] }[] = [
  { heading: "Orders", items: ORDERS },
  { heading: "Products", items: PRODUCTS },
  { heading: "Customers", items: CUSTOMERS },
  { heading: "Settings", items: SETTINGS },
]

const SECTION_DESCRIPTIONS: Record<Section, string> = {
  Orders: "Find and fulfil customer orders.",
  Products: "Manage the catalogue, prices and stock.",
  Customers: "Look up customers and their order history.",
  Settings: "Configure the store, shipping, taxes and team.",
}

function isMacPlatform() {
  return typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
}

export default function AdminCommandMenuScreen() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<{ section: Section; label: string } | null>(null)
  const modKey = isMacPlatform() ? "⌘" : "Ctrl"

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((previous) => !previous)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function go(item: NavItem) {
    setOpen(false)
    setActive({ section: item.section, label: item.label })
    toast.success(`Opened ${item.label}`)
  }

  const current = active ? SECTION_ICONS[active.section] : Search
  const CurrentIcon = current

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">Fernhill Market</span>
          <span className="text-sm text-muted-foreground">Admin</span>
        </div>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          aria-label="Open command menu"
          className="w-full max-w-xs justify-between text-muted-foreground sm:w-72"
        >
          <span className="flex items-center gap-2">
            <Search className="size-4" aria-hidden="true" />
            Search or jump to…
          </span>
          <CommandShortcut>{modKey} K</CommandShortcut>
        </Button>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CurrentIcon className="size-5 text-muted-foreground" aria-hidden="true" />
              {active ? active.label : "Admin home"}
            </CardTitle>
            <CardDescription>
              {active
                ? SECTION_DESCRIPTIONS[active.section]
                : `Press ${modKey} K anywhere to jump to orders, products, customers or settings.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {active
                ? `You are viewing ${active.label}. Choose another destination with ${modKey} K.`
                : "Pick a destination from the menu to start working."}
            </p>
          </CardContent>
        </Card>
      </main>

      <CommandDialog open={open} onOpenChange={setOpen} title="Command menu">
        <CommandInput placeholder="Search orders, products, customers, settings…" />
        <CommandList>
          <CommandEmpty>No results. Try an order number, a product SKU, a customer name or a settings page.</CommandEmpty>
          {GROUPS.map((group, index) => (
            <div key={group.heading}>
              {index > 0 && <CommandSeparator />}
              <CommandGroup heading={group.heading}>
                {group.items.map((item) => {
                  const Icon = SECTION_ICONS[item.section]
                  return (
                    <CommandItem
                      key={item.id}
                      value={`${item.section} ${item.label} ${item.meta}`}
                      onSelect={() => go(item)}
                    >
                      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{item.label}</span>
                        <span className="truncate text-xs text-muted-foreground">{item.meta}</span>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </div>
          ))}
        </CommandList>
      </CommandDialog>

      <Toaster position="bottom-right" />
    </div>
  )
}
