import { useState } from "react"
import { Store, Truck, CreditCard, Save } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const TIME_ZONES = [
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
]

const INITIAL_GENERAL = {
  storeName: "Fernhill Market",
  contactEmail: "hello@fernhillmarket.com",
  timeZone: "America/New_York",
}

const DELIVERY_ZONES = [
  { id: "zone-local", name: "Local (within 10 km)", fee: "3.50", minOrder: "25.00", enabled: true },
  { id: "zone-regional", name: "Regional (10–40 km)", fee: "7.90", minOrder: "50.00", enabled: true },
  { id: "zone-express", name: "Same-day express", fee: "12.00", minOrder: "75.00", enabled: false },
]

const PAYMENT_METHODS = [
  { id: "card", name: "Credit and debit cards", description: "Visa, Mastercard, American Express", enabled: true },
  { id: "wallet", name: "Digital wallets", description: "Apple Pay and Google Pay", enabled: true },
  { id: "bank", name: "Bank transfer", description: "Manual confirmation within 1 business day", enabled: false },
  { id: "cod", name: "Cash on delivery", description: "Available for local zones only", enabled: false },
]

export default function StoreSettingsPage() {
  const [general, setGeneral] = useState(INITIAL_GENERAL)
  const [savingGeneral, setSavingGeneral] = useState(false)
  const [zones, setZones] = useState(DELIVERY_ZONES)
  const [methods, setMethods] = useState(PAYMENT_METHODS)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(general.contactEmail)
  const nameValid = general.storeName.trim().length > 0

  const updateGeneral = (field: keyof typeof general) => (value: string) =>
    setGeneral((prev) => ({ ...prev, [field]: value }))

  const handleSaveGeneral = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!nameValid || !emailValid) {
      toast.error("Please fix the highlighted fields before saving.")
      return
    }
    setSavingGeneral(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      toast.success("General settings saved.")
    } finally {
      setSavingGeneral(false)
    }
  }

  const toggleZone = (id: string, enabled: boolean) =>
    setZones((prev) => prev.map((z) => (z.id === id ? { ...z, enabled } : z)))

  const toggleMethod = (id: string, enabled: boolean) =>
    setMethods((prev) => prev.map((m) => (m.id === id ? { ...m, enabled } : m)))

  const handleSaveDelivery = () => toast.success("Delivery settings saved.")
  const handleSavePayments = () => toast.success("Payment settings saved.")

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Store settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage how Fernhill Market appears to customers and how orders are fulfilled and paid.
        </p>
      </header>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Store className="size-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2">
            <Truck className="size-4" />
            Delivery
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="size-4" />
            Payments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <form onSubmit={handleSaveGeneral} noValidate>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Basic information about your store and how customers can reach you.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="store-name">Store name</Label>
                  <Input
                    id="store-name"
                    value={general.storeName}
                    onChange={(e) => updateGeneral("storeName")(e.target.value)}
                    aria-invalid={!nameValid}
                    placeholder="Your store name"
                  />
                  {!nameValid && (
                    <p className="text-sm text-destructive">Store name is required.</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="contact-email">Contact email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={general.contactEmail}
                    onChange={(e) => updateGeneral("contactEmail")(e.target.value)}
                    aria-invalid={!emailValid}
                    placeholder="name@example.com"
                  />
                  {!emailValid && (
                    <p className="text-sm text-destructive">Enter a valid email address.</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Customers see this address on receipts and order confirmations.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time-zone">Time zone</Label>
                  <Select
                    value={general.timeZone}
                    onValueChange={updateGeneral("timeZone")}
                  >
                    <SelectTrigger id="time-zone" className="w-full">
                      <SelectValue placeholder="Select a time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Used for opening hours, delivery windows and order timestamps.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="justify-end border-t pt-6">
                <Button type="submit" disabled={savingGeneral}>
                  <Save className="size-4" />
                  {savingGeneral ? "Saving…" : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery</CardTitle>
              <CardDescription>
                Control which delivery zones are available at checkout and what they cost.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{zone.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Fee ${zone.fee} · Minimum order ${zone.minOrder}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor={`${zone.id}-toggle`} className="text-sm text-muted-foreground">
                      {zone.enabled ? "Enabled" : "Disabled"}
                    </Label>
                    <Switch
                      id={`${zone.id}-toggle`}
                      checked={zone.enabled}
                      onCheckedChange={(checked) => toggleZone(zone.id, checked)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="justify-end border-t pt-6">
              <Button onClick={handleSaveDelivery}>
                <Save className="size-4" />
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>
                Choose which payment methods customers can use at checkout.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {methods.map((method) => (
                <div
                  key={method.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor={`${method.id}-toggle`} className="text-sm text-muted-foreground">
                      {method.enabled ? "Enabled" : "Disabled"}
                    </Label>
                    <Switch
                      id={`${method.id}-toggle`}
                      checked={method.enabled}
                      onCheckedChange={(checked) => toggleMethod(method.id, checked)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>

            <CardFooter className="justify-end border-t pt-6">
              <Button onClick={handleSavePayments}>
                <Save className="size-4" />
                Save changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
