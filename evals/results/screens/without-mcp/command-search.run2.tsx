import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Store,
  Truck,
  Users,
} from "lucide-react"
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

const ORDERS = [
  {
    id: "FM-1042",
    customer: "Maya Lindqvist",
    total: "$84.50",
    status: "Paid",
    href: "/admin/orders/FM-1042",
  },
  {
    id: "FM-1041",
    customer: "Tomas Okafor",
    total: "$212.00",
    status: "Fulfilled",
    href: "/admin/orders/FM-1041",
  },
  {
    id: "FM-1040",
    customer: "Priya Raman",
    total: "$39.99",
    status: "Refund pending",
    href: "/admin/orders/FM-1040",
  },
]

const PRODUCTS = [
  {
    id: "prod_101",
    name: "Oak Cutting Board",
    sku: "FM-CB-001",
    href: "/admin/products/prod_101",
  },
  {
    id: "prod_114",
    name: "Stoneware Mug, Sage",
    sku: "FM-MG-114",
    href: "/admin/products/prod_114",
  },
  {
    id: "prod_122",
    name: "Linen Tea Towel Set",
    sku: "FM-TT-122",
    href: "/admin/products/prod_122",
  },
]

const CUSTOMERS = [
  {
    id: "cus_01",
    name: "Maya Lindqvist",
    email: "maya.l@example.com",
    href: "/admin/customers/cus_01",
  },
  {
    id: "cus_02",
    name: "Tomas Okafor",
    email: "tomas.o@example.com",
    href: "/admin/customers/cus_02",
  },
  {
    id: "cus_03",
    name: "Priya Raman",
    email: "priya.r@example.com",
    href: "/admin/customers/cus_03",
  },
]

const SETTINGS = [
  { id: "store", label: "Store profile", href: "/admin/settings/store", icon: Store },
  { id: "payments", label: "Payments", href: "/admin/settings/payments", icon: CreditCard },
  { id: "shipping", label: "Shipping", href: "/admin/settings/shipping", icon: Truck },
  { id: "notifications", label: "Notifications", href: "/admin/settings/notifications", icon: Bell },
  { id: "security", label: "Security", href: "/admin/settings/security", icon: Shield },
]

export default function AdminDashboardScreen() {
  const [open, setOpen] = useState(false)

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.userAgent)
  const modifierLabel = isMac ? "⌘" : "Ctrl"

  // Global Cmd+K / Ctrl+K toggle
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  function navigate(href: string) {
    setOpen(false)
    window.location.assign(href)
  }

  async function copyCurrentPageLink() {
    setOpen(false)
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Page link copied")
    } catch {
      toast.error("Could not copy the page link")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div>
            <h1 className="text-lg font-semibold">Fernhill Market Admin</h1>
            <p className="text-sm text-muted-foreground">Dashboard</p>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full max-w-xs justify-between text-muted-foreground sm:w-72"
          onClick={() => setOpen(true)}
          aria-label="Open command menu"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" aria-hidden="true" />
            Search or jump to…
          </span>
          <CommandShortcut>{modifierLabel} K</CommandShortcut>
        </Button>
      </header>

      <main className="px-6 py-8">
        <p className="text-sm text-muted-foreground">
          Press <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs">{modifierLabel} K</kbd> at any time to jump to orders, products, customers or settings.
        </p>
      </main>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command menu"
        description="Jump to orders, products, customers and settings"
      >
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Orders">
            {ORDERS.map((order) => (
              <CommandItem
                key={order.id}
                value={`order ${order.id} ${order.customer}`}
                keywords={[order.customer, order.status, order.total]}
                onSelect={() => navigate(order.href)}
              >
                <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-medium">{order.id}</span>
                <span className="ml-2 text-muted-foreground">{order.customer}</span>
                <CommandShortcut>{order.status}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Products">
            {PRODUCTS.map((product) => (
              <CommandItem
                key={product.id}
                value={`product ${product.name} ${product.sku}`}
                keywords={[product.sku]}
                onSelect={() => navigate(product.href)}
              >
                <Package className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>{product.name}</span>
                <CommandShortcut>{product.sku}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Customers">
            {CUSTOMERS.map((customer) => (
              <CommandItem
                key={customer.id}
                value={`customer ${customer.name} ${customer.email}`}
                keywords={[customer.email]}
                onSelect={() => navigate(customer.href)}
              >
                <Users className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>{customer.name}</span>
                <span className="ml-2 truncate text-muted-foreground">{customer.email}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings">
            {SETTINGS.map((setting) => {
              const Icon = setting.icon
              return (
                <CommandItem
                  key={setting.id}
                  value={`settings ${setting.label}`}
                  onSelect={() => navigate(setting.href)}
                >
                  <Icon className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>{setting.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem value="copy current page link" onSelect={copyCurrentPageLink}>
              <Settings className="mr-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span>Copy link to this page</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
