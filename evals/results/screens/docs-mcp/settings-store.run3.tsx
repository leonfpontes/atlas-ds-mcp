import { useState } from "react"
import { toast } from "sonner"
import { Store } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

const INITIAL_GENERAL = {
  storeName: "Fernhill Market",
  contactEmail: "hello@fernhillmarket.com",
  timeZone: "Europe/London",
}

const INITIAL_DELIVERY = {
  deliveryFee: "3.50",
  freeDeliveryFrom: "40.00",
  radiusKm: "8",
  prepTimeMinutes: "25",
}

const INITIAL_PAYMENTS = {
  defaultMethod: "card",
  taxRate: "20",
  currency: "GBP",
}

const TIME_ZONES = [
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Dublin", label: "Dublin (GMT/IST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "America/New_York", label: "New York (EST/EDT)" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
]

const PAYMENT_METHODS = [
  { value: "card", label: "Card" },
  { value: "wallet", label: "Digital wallet" },
  { value: "cash", label: "Cash on delivery" },
]

const CURRENCIES = [
  { value: "GBP", label: "GBP (£)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "USD", label: "USD ($)" },
]

const PAYMENT_PROVIDERS = [
  { name: "Card processor", status: "Connected" },
  { name: "Wallet provider", status: "Not connected" },
]

export default function StoreSettingsPage() {
  const [general, setGeneral] = useState(INITIAL_GENERAL)
  const [delivery, setDelivery] = useState(INITIAL_DELIVERY)
  const [payments, setPayments] = useState(INITIAL_PAYMENTS)

  const handleGeneralSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success("General settings saved")
  }

  const handleDeliverySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success("Delivery settings saved")
  }

  const handlePaymentsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success("Payment settings saved")
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <header className="flex items-center gap-3">
        <Store className="size-6 text-muted-foreground" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Store settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage how Fernhill Market appears to customers and how orders are handled.
          </p>
        </div>
      </header>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <form onSubmit={handleGeneralSubmit}>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  The store name and contact details shown to customers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="store-name" className="text-sm font-medium text-foreground">
                    Store name
                  </label>
                  <Input
                    id="store-name"
                    type="text"
                    required
                    value={general.storeName}
                    onChange={(e) => setGeneral({ ...general, storeName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                    Contact email
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    required
                    value={general.contactEmail}
                    onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Customer questions about orders are sent to this address.
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="time-zone" className="text-sm font-medium text-foreground">
                    Time zone
                  </label>
                  <Select
                    value={general.timeZone}
                    onValueChange={(value) => setGeneral({ ...general, timeZone: value })}
                  >
                    <SelectTrigger id="time-zone" className="w-full">
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
                  <p className="text-sm text-muted-foreground">
                    Opening hours and delivery windows use this time zone.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">Save general settings</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="mt-4">
          <Card>
            <form onSubmit={handleDeliverySubmit}>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
                <CardDescription>
                  Fees, minimum order value and the area you deliver to.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="delivery-fee" className="text-sm font-medium text-foreground">
                    Delivery fee
                  </label>
                  <Input
                    id="delivery-fee"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={delivery.deliveryFee}
                    onChange={(e) => setDelivery({ ...delivery, deliveryFee: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="free-delivery-from" className="text-sm font-medium text-foreground">
                    Free delivery from
                  </label>
                  <Input
                    id="free-delivery-from"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={delivery.freeDeliveryFrom}
                    onChange={(e) =>
                      setDelivery({ ...delivery, freeDeliveryFrom: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="delivery-radius" className="text-sm font-medium text-foreground">
                    Delivery radius (km)
                  </label>
                  <Input
                    id="delivery-radius"
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={delivery.radiusKm}
                    onChange={(e) => setDelivery({ ...delivery, radiusKm: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="prep-time" className="text-sm font-medium text-foreground">
                    Preparation time (minutes)
                  </label>
                  <Input
                    id="prep-time"
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={delivery.prepTimeMinutes}
                    onChange={(e) =>
                      setDelivery({ ...delivery, prepTimeMinutes: e.target.value })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">Save delivery settings</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <form onSubmit={handlePaymentsSubmit}>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>
                  The default payment method, tax and currency for orders.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="default-method" className="text-sm font-medium text-foreground">
                      Default payment method
                    </label>
                    <Select
                      value={payments.defaultMethod}
                      onValueChange={(value) =>
                        setPayments({ ...payments, defaultMethod: value })
                      }
                    >
                      <SelectTrigger id="default-method" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYMENT_METHODS.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="currency" className="text-sm font-medium text-foreground">
                      Currency
                    </label>
                    <Select
                      value={payments.currency}
                      onValueChange={(value) => setPayments({ ...payments, currency: value })}
                    >
                      <SelectTrigger id="currency" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="tax-rate" className="text-sm font-medium text-foreground">
                      Tax rate (%)
                    </label>
                    <Input
                      id="tax-rate"
                      type="number"
                      min="0"
                      step="0.1"
                      required
                      value={payments.taxRate}
                      onChange={(e) => setPayments({ ...payments, taxRate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Payment providers</p>
                  <ul className="divide-y divide-border rounded-md border border-border">
                    {PAYMENT_PROVIDERS.map((provider) => (
                      <li
                        key={provider.name}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <span className="text-sm text-foreground">{provider.name}</span>
                        <Badge
                          variant={provider.status === "Connected" ? "secondary" : "outline"}
                        >
                          {provider.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">Save payment settings</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  )
}
