import { useState } from "react"
import { Save } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const TIME_ZONES = [
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Asia/Tokyo", label: "Tokyo" },
]

const INITIAL_GENERAL = {
  storeName: "Fernhill Market",
  contactEmail: "hello@fernhillmarket.com",
  timeZone: "America/New_York",
}

const INITIAL_DELIVERY = {
  minimumOrder: "25.00",
  deliveryFee: "4.99",
  deliveryWindow: "2 hours",
}

const INITIAL_PAYMENTS = {
  payoutEmail: "finance@fernhillmarket.com",
  currency: "USD",
  acceptCards: "Visa, Mastercard, Amex",
}

export default function StoreSettingsPage() {
  const [general, setGeneral] = useState(INITIAL_GENERAL)
  const [delivery, setDelivery] = useState(INITIAL_DELIVERY)
  const [payments, setPayments] = useState(INITIAL_PAYMENTS)

  function handleSave(event: React.FormEvent<HTMLFormElement>, section: string) {
    event.preventDefault()
    toast.success(`${section} settings saved`)
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 bg-background p-6 text-foreground">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Store settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage how Fernhill Market appears to customers and how orders are delivered and paid.
        </p>
      </header>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <form onSubmit={(e) => handleSave(e, "General")}>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Basic details shown on receipts and to customers.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="store-name" className="text-sm font-medium text-foreground">
                    Store name
                  </label>
                  <Input
                    id="store-name"
                    value={general.storeName}
                    onChange={(e) => setGeneral({ ...general, storeName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                    Contact email
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={general.contactEmail}
                    onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                    required
                  />
                  <p className="text-sm text-muted-foreground">Customers send questions to this address.</p>
                </div>
                <div className="space-y-2">
                  <span id="time-zone-label" className="text-sm font-medium text-foreground">
                    Time zone
                  </span>
                  <Select
                    value={general.timeZone}
                    onValueChange={(value) => setGeneral({ ...general, timeZone: value })}
                  >
                    <SelectTrigger aria-labelledby="time-zone-label" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">
                  <Save />
                  Save general settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <form onSubmit={(e) => handleSave(e, "Delivery")}>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
                <CardDescription>Set the minimum order and the fee for delivery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="minimum-order" className="text-sm font-medium text-foreground">
                    Minimum order (USD)
                  </label>
                  <Input
                    id="minimum-order"
                    inputMode="decimal"
                    value={delivery.minimumOrder}
                    onChange={(e) => setDelivery({ ...delivery, minimumOrder: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="delivery-fee" className="text-sm font-medium text-foreground">
                    Delivery fee (USD)
                  </label>
                  <Input
                    id="delivery-fee"
                    inputMode="decimal"
                    value={delivery.deliveryFee}
                    onChange={(e) => setDelivery({ ...delivery, deliveryFee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="delivery-window" className="text-sm font-medium text-foreground">
                    Delivery window
                  </label>
                  <Input
                    id="delivery-window"
                    value={delivery.deliveryWindow}
                    onChange={(e) => setDelivery({ ...delivery, deliveryWindow: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">
                  <Save />
                  Save delivery settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <form onSubmit={(e) => handleSave(e, "Payments")}>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Where payouts go and which methods customers can use.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="payout-email" className="text-sm font-medium text-foreground">
                    Payout email
                  </label>
                  <Input
                    id="payout-email"
                    type="email"
                    value={payments.payoutEmail}
                    onChange={(e) => setPayments({ ...payments, payoutEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="accepted-cards" className="text-sm font-medium text-foreground">
                    Accepted cards
                  </label>
                  <Input
                    id="accepted-cards"
                    value={payments.acceptCards}
                    onChange={(e) => setPayments({ ...payments, acceptCards: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">
                  <Save />
                  Save payment settings
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}