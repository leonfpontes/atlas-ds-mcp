import { useState, type FormEvent } from "react"
import { Store } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const TIME_ZONES = [
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Australia/Sydney", label: "Sydney" },
]

const INITIAL_GENERAL = {
  storeName: "Fernhill Market",
  contactEmail: "hello@fernhillmarket.com",
  timeZone: "America/New_York",
}

const INITIAL_DELIVERY = {
  minimumOrder: "25.00",
  deliveryFee: "4.99",
  radiusKm: "12",
}

const PAYMENT_METHODS = [
  { id: "card", name: "Credit and debit cards", fee: "2.9% + $0.30", enabled: true },
  { id: "wallet", name: "Digital wallets", fee: "2.9% + $0.30", enabled: true },
  { id: "cash", name: "Cash on pickup", fee: "No fee", enabled: false },
]

export default function StoreSettingsPage() {
  const [general, setGeneral] = useState(INITIAL_GENERAL)
  const [delivery, setDelivery] = useState(INITIAL_DELIVERY)
  const [emailError, setEmailError] = useState("")

  const handleSaveGeneral = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!general.contactEmail.includes("@")) {
      setEmailError("Enter an email address such as hello@fernhillmarket.com.")
      return
    }
    setEmailError("")
    toast.success("General settings saved")
  }

  const handleSaveDelivery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success("Delivery settings saved")
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <header className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-md border bg-muted">
          <Store className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Store settings</h1>
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
        </div>
      </header>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>How your store appears to customers and where they can reach you.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveGeneral} noValidate>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="store-name" className="text-sm font-medium text-foreground">Store name</label>
                  <Input
                    id="store-name"
                    value={general.storeName}
                    onChange={(e) => setGeneral({ ...general, storeName: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-foreground">Contact email</label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={general.contactEmail}
                    aria-invalid={emailError !== "" || undefined}
                    aria-describedby={emailError ? "contact-email-error" : "contact-email-hint"}
                    onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                  />
                  {emailError ? (
                    <p id="contact-email-error" className="text-sm text-destructive">{emailError}</p>
                  ) : (
                    <p id="contact-email-hint" className="text-sm text-muted-foreground">Customers see this address on receipts.</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="time-zone" className="text-sm font-medium text-foreground">Time zone</label>
                  <Select
                    value={general.timeZone}
                    onValueChange={(value) => setGeneral({ ...general, timeZone: value })}
                  >
                    <SelectTrigger id="time-zone" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ZONES.map((zone) => (
                        <SelectItem key={zone.value} value={zone.value}>{zone.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">Save general settings</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery</CardTitle>
              <CardDescription>Set the order minimum, fee and the area you deliver to.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveDelivery}>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="minimum-order" className="text-sm font-medium text-foreground">Minimum order (USD)</label>
                  <Input
                    id="minimum-order"
                    inputMode="decimal"
                    value={delivery.minimumOrder}
                    onChange={(e) => setDelivery({ ...delivery, minimumOrder: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="delivery-fee" className="text-sm font-medium text-foreground">Delivery fee (USD)</label>
                  <Input
                    id="delivery-fee"
                    inputMode="decimal"
                    value={delivery.deliveryFee}
                    onChange={(e) => setDelivery({ ...delivery, deliveryFee: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="delivery-radius" className="text-sm font-medium text-foreground">Delivery radius (km)</label>
                  <Input
                    id="delivery-radius"
                    inputMode="numeric"
                    value={delivery.radiusKm}
                    onChange={(e) => setDelivery({ ...delivery, radiusKm: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">Addresses outside this radius can still place pickup orders.</p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">Save delivery settings</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Methods customers can use at checkout and the fee each one carries.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col divide-y rounded-md border">
                {PAYMENT_METHODS.map((method) => (
                  <li key={method.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{method.name}</span>
                      <span className="text-sm text-muted-foreground">Processing fee: {method.fee}</span>
                    </div>
                    <span className={method.enabled ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>
                      {method.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </main>
  )
}
