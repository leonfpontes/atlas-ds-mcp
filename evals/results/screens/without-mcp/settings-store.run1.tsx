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
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Australia/Sydney",
]

const INITIAL_GENERAL = {
  storeName: "Fernhill Market",
  contactEmail: "hello@fernhillmarket.com",
  timeZone: "America/New_York",
}

const INITIAL_DELIVERY = {
  deliveryEnabled: true,
  pickupEnabled: true,
  minimumOrder: "25.00",
  deliveryFee: "4.99",
  radiusKm: "12",
}

const INITIAL_PAYMENTS = {
  cardsEnabled: true,
  walletsEnabled: true,
  cashOnPickup: false,
  captureOnShip: true,
}

export default function StoreSettingsPage() {
  const [general, setGeneral] = useState(INITIAL_GENERAL)
  const [delivery, setDelivery] = useState(INITIAL_DELIVERY)
  const [payments, setPayments] = useState(INITIAL_PAYMENTS)

  const handleSave = (section: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success(`${section} settings saved`)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Store settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage how Fernhill Market appears to customers and how orders are fulfilled.
        </p>
      </div>

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

        <TabsContent value="general" className="mt-4">
          <form onSubmit={handleSave("General")}>
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  Basic information shown on receipts and customer emails.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="store-name">Store name</Label>
                  <Input
                    id="store-name"
                    value={general.storeName}
                    onChange={(e) =>
                      setGeneral({ ...general, storeName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-email">Contact email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={general.contactEmail}
                    onChange={(e) =>
                      setGeneral({ ...general, contactEmail: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="time-zone">Time zone</Label>
                  <Select
                    value={general.timeZone}
                    onValueChange={(value) =>
                      setGeneral({ ...general, timeZone: value })
                    }
                  >
                    <SelectTrigger id="time-zone" className="w-full">
                      <SelectValue placeholder="Select a time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ZONES.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" className="gap-2">
                  <Save className="size-4" />
                  Save changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="delivery" className="mt-4">
          <form onSubmit={handleSave("Delivery")}>
            <Card>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
                <CardDescription>
                  Choose how customers receive their orders and what it costs them.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="delivery-enabled">Home delivery</Label>
                    <p className="text-sm text-muted-foreground">
                      Deliver orders to customers within the service radius.
                    </p>
                  </div>
                  <Switch
                    id="delivery-enabled"
                    checked={delivery.deliveryEnabled}
                    onCheckedChange={(checked) =>
                      setDelivery({ ...delivery, deliveryEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="pickup-enabled">Store pickup</Label>
                    <p className="text-sm text-muted-foreground">
                      Let customers collect orders in person.
                    </p>
                  </div>
                  <Switch
                    id="pickup-enabled"
                    checked={delivery.pickupEnabled}
                    onCheckedChange={(checked) =>
                      setDelivery({ ...delivery, pickupEnabled: checked })
                    }
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="minimum-order">Minimum order (USD)</Label>
                    <Input
                      id="minimum-order"
                      inputMode="decimal"
                      value={delivery.minimumOrder}
                      onChange={(e) =>
                        setDelivery({ ...delivery, minimumOrder: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="delivery-fee">Delivery fee (USD)</Label>
                    <Input
                      id="delivery-fee"
                      inputMode="decimal"
                      value={delivery.deliveryFee}
                      onChange={(e) =>
                        setDelivery({ ...delivery, deliveryFee: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="radius">Service radius (km)</Label>
                    <Input
                      id="radius"
                      inputMode="numeric"
                      value={delivery.radiusKm}
                      onChange={(e) =>
                        setDelivery({ ...delivery, radiusKm: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" className="gap-2">
                  <Save className="size-4" />
                  Save changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <form onSubmit={handleSave("Payments")}>
            <Card>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>
                  Control which payment methods are accepted at checkout.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="cards-enabled">Credit and debit cards</Label>
                    <p className="text-sm text-muted-foreground">
                      Visa, Mastercard, and American Express.
                    </p>
                  </div>
                  <Switch
                    id="cards-enabled"
                    checked={payments.cardsEnabled}
                    onCheckedChange={(checked) =>
                      setPayments({ ...payments, cardsEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="wallets-enabled">Digital wallets</Label>
                    <p className="text-sm text-muted-foreground">
                      Apple Pay and Google Pay.
                    </p>
                  </div>
                  <Switch
                    id="wallets-enabled"
                    checked={payments.walletsEnabled}
                    onCheckedChange={(checked) =>
                      setPayments({ ...payments, walletsEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="cash-pickup">Cash on pickup</Label>
                    <p className="text-sm text-muted-foreground">
                      Customers pay in cash when collecting in store.
                    </p>
                  </div>
                  <Switch
                    id="cash-pickup"
                    checked={payments.cashOnPickup}
                    onCheckedChange={(checked) =>
                      setPayments({ ...payments, cashOnPickup: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="capture-ship">Capture payment on shipment</Label>
                    <p className="text-sm text-muted-foreground">
                      Authorize at checkout and charge once the order ships.
                    </p>
                  </div>
                  <Switch
                    id="capture-ship"
                    checked={payments.captureOnShip}
                    onCheckedChange={(checked) =>
                      setPayments({ ...payments, captureOnShip: checked })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit" className="gap-2">
                  <Save className="size-4" />
                  Save changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
