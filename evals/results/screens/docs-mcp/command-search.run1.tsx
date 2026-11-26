import { useEffect, useState } from "react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Package, ReceiptText, Search, Settings, Users } from "lucide-react"

type SectionId = "orders" | "products" | "customers" | "settings"

type Section = {
  id: SectionId
  label: string
  description: string
  keywords: string
  icon: typeof Package
  columns: string[]
  rows: string[][]
}

const SECTIONS: Section[] = [
  {
    id: "orders",
    label: "Orders",
    description: "Track fulfilment and payment status.",
    keywords: "sales purchases shipping fulfilment",
    icon: ReceiptText,
    columns: ["Order", "Customer", "Total", "Status"],
    rows: [
      ["#1042", "Ana Ruiz", "€84.00", "Paid"],
      ["#1041", "Tom Becker", "€23.50", "Shipped"],
      ["#1040", "Priya Nair", "€157.20", "Pending"],
      ["#1039", "Lucas Moreau", "€41.00", "Refunded"],
    ],
  },
  {
    id: "products",
    label: "Products",
    description: "Catalogue, prices and stock levels.",
    keywords: "catalogue inventory stock items sku",
    icon: Package,
    columns: ["Product", "SKU", "Price", "Stock"],
    rows: [
      ["Oak cutting board", "FH-CB-014", "€38.00", "23"],
      ["Linen tea towel set", "FH-TT-201", "€18.50", "112"],
      ["Stoneware mug", "FH-MG-077", "€14.00", "0"],
      ["Beeswax candle", "FH-CN-330", "€9.00", "58"],
    ],
  },
  {
    id: "customers",
    label: "Customers",
    description: "Accounts, contact details and order history.",
    keywords: "buyers accounts people contacts",
    icon: Users,
    columns: ["Name", "Email", "Orders", "Last order"],
    rows: [
      ["Ana Ruiz", "ana.ruiz@example.com", "12", "Today"],
      ["Tom Becker", "tom.becker@example.com", "4", "Yesterday"],
      ["Priya Nair", "priya.nair@example.com", "7", "3 days ago"],
      ["Lucas Moreau", "lucas.moreau@example.com", "2", "2 weeks ago"],
    ],
  },
  {
    id: "settings",
    label: "Settings",
    description: "Store profile, taxes, shipping and notifications.",
    keywords: "preferences configuration store tax shipping notifications",
    icon: Settings,
    columns: ["Setting", "Value"],
    rows: [
      ["Store name", "Fernhill Market"],
      ["Currency", "EUR"],
      ["Default tax rate", "21%"],
      ["Order notifications", "Email"],
    ],
  },
]

const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((s) => [s.id, s])) as Record<
  SectionId,
  Section
>

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)

export default function AdminScreen() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<SectionId>("orders")

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

  const go = (id: SectionId) => {
    setActive(id)
    setOpen(false)
  }

  const current = SECTION_BY_ID[active]
  const CurrentIcon = current.icon

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4">
        <div>
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
          <h1 className="text-xl font-semibold">Admin</h1>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)} aria-label="Open command menu">
          <Search />
          Search or jump to…
          <CommandShortcut>{isMac ? "⌘K" : "Ctrl K"}</CommandShortcut>
        </Button>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
        <nav aria-label="Admin sections" className="flex flex-wrap gap-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon
            const isActive = section.id === active
            return (
              <Button
                key={section.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => setActive(section.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon />
                {section.label}
              </Button>
            )
          })}
        </nav>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CurrentIcon className="size-5 text-muted-foreground" />
              {current.label}
            </CardTitle>
            <CardDescription>{current.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {current.columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {current.rows.map((row) => (
                  <TableRow key={row.join("|")}>
                    {row.map((cell, index) => (
                      <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Command menu"
        description="Jump to orders, products, customers or settings."
      >
        <Command>
          <CommandInput placeholder="Jump to orders, products, customers…" />
          <CommandList>
            <CommandEmpty>No matching page. Try “orders”, “products” or “settings”.</CommandEmpty>
            <CommandGroup heading="Go to">
              {SECTIONS.map((section) => {
                const Icon = section.icon
                return (
                  <CommandItem
                    key={section.id}
                    value={`${section.label} ${section.keywords}`}
                    onSelect={() => go(section.id)}
                  >
                    <Icon />
                    <span>{section.label}</span>
                    <span className="ml-auto text-muted-foreground">{section.description}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Shortcuts">
              <CommandItem
                value="close command menu escape"
                onSelect={() => setOpen(false)}
              >
                <Search />
                <span>Close menu</span>
                <CommandShortcut>Esc</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
