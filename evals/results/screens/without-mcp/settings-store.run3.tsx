import { useState } from "react"
import { Clock, CreditCard, Mail, Save, Store, Truck } from "lucide-react"
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
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "America/Chicago", label: "Chicago (CT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
]

const INITIAL_GENERAL = {
  storeName: "Fernhill Market",
  contactEmail: "hello@fernhillmarket.com",
  timeZone: "Europe/London",
}

const INITIAL_DELIVERY = {
  freeShippingThreshold: "45.00",
  standardDays: "3-5",
  expressEnabled: true,
  expressFee: "9.99",
  pickupEnabled: false,
}

const INITIAL_PAYMENTS = {
  cardEnabled: true,
  paypalEnabled: true,
  applePayEnabled: false,
  currency: "GBP",
  captureOnOrder: false,
}

export default function StoreSettingsPage() {
  const [general, setGeneral] = useState(INITIAL_GENERAL)
  const [delivery, setDelivery] = useState(INITIAL_DELIVERY)
  const [payments, setPayments] = useState(INITIAL_PAYMENTS)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (section: string) => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      toast.success(`${section} settings saved`)
    } catch {
      toast.error(`Could not save ${section.toLowerCase()} settings`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Store settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage how Fernhill Market appears to customers and how orders are fulfilled and paid.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>
                Basic details shown on receipts, emails and your storefront.
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleSave("General")
              }}
            >
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store name</Label>
                  <Input
                    id="store-name"
                    value={general.storeName}
                    onChange={(event) =>
                      setGeneral((prev) => ({ ...prev, storeName: event.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="contact-email"
                      type="email"
                      className="pl-9"
                      value={general.contactEmail}
                      onChange={(event) =>
                        setGeneral((prev) => ({ ...prev, contactEmail: event.target.value }))
                      }
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Customer questions and order notifications are sent here.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-zone">Time zone</Label>
                  <Select
                    value={general.timeZone}
                    onValueChange={(value) =>
                      setGeneral((prev) => ({ ...prev, timeZone: value }))
                    }
                  >
                    <SelectTrigger id="time-zone" className="w-full">
                      <Clock className="size-4 text-muted-foreground" />
                      <SelectValue placeholder="Select a time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_ZONES.map((zone) => (
                        <SelectItem key={zone.value} value={zone.value}>
                          {zone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                <Button type="submit" disabled={isSaving}>
                  <Save className="size-4" />
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery</CardTitle>
              <CardDescription>
                Control shipping thresholds, delivery speeds and collection options.
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleSave("Delivery")
              }}
            >
              <CardContent className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="free-threshold">Free shipping threshold (£)</Label>
                    <Input
                      id="free-threshold"
                      inputMode="decimal"
                      value={delivery.freeShippingThreshold}
                      onChange={(event) =>
                        setDelivery((prev) => ({
                          ...prev,
                          freeShippingThreshold: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="standard-days">Standard delivery (business days)</Label>
                    <Input
                      id="standard-days"
                      value={delivery.standardDays}
                      onChange={(event) =>
                        setDelivery((prev) => ({ ...prev, standardDays: event.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="express-enabled">Express delivery</Label>
                    <p className="text-xs text-muted-foreground">
                      Next-day delivery for orders placed before 2pm.
                    </p>
                  </div>
                  <Switch
                    id="express-enabled"
                    checked={delivery.expressEnabled}
                    onCheckedChange={(checked) =>
                      setDelivery((prev) => ({ ...prev, expressEnabled: checked }))
                    }
                  />
                </div>

                {delivery.expressEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="express-fee">Express fee (£)</Label>
                    <Input
                      id="express-fee"
                      inputMode="decimal"
                      className="sm:max-w-xs"
                      value={delivery.expressFee}
                      onChange={(event) =>
                        setDelivery((prev) => ({ ...prev, expressFee: event.target.value }))
                      }
                    />
                  </div>
                )}

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="pickup-enabled">Click and collect</Label>
                    <p className="text-xs text-muted-foreground">
                      Let customers collect orders from the shop at no charge.
                    </p>
                  </div>
                  <Switch
                    id="pickup-enabled"
                    checked={delivery.pickupEnabled}
                    onCheckedChange={(checked) =>
                      setDelivery((prev) => ({ ...prev, pickupEnabled: checked }))
                    }
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                <Button type="submit" disabled={isSaving}>
                  <Save className="size-4" />
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>
                Choose which payment methods customers can use at checkout.
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleSave("Payments")
              }}
            >
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="card-enabled">Credit and debit cards</Label>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard and Amex.</p>
                  </div>
                  <Switch
                    id="card-enabled"
                    checked={payments.cardEnabled}
                    onCheckedChange={(checked) =>
                      setPayments((prev) => ({ ...prev, cardEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="paypal-enabled">PayPal</Label>
                    <p className="text-xs text-muted-foreground">
                      Customers pay through their PayPal account.
                    </p>
                  </div>
                  <Switch
                    id="paypal-enabled"
                    checked={payments.paypalEnabled}
                    onCheckedChange={(checked) =>
                      setPayments((prev) => ({ ...prev, paypalEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="applepay-enabled">Apple Pay</Label>
                    <p className="text-xs text-muted-foreground">
                      Shown on supported Safari and iOS devices.
                    </p>
                  </div>
                  <Switch
                    id="applepay-enabled"
                    checked={payments.applePayEnabled}
                    onCheckedChange={(checked) =>
                      setPayments((prev) => ({ ...prev, applePayEnabled: checked }))
                    }
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={payments.currency}
                      onValueChange={(value) =>
                        setPayments((prev) => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectTrigger id="currency" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="capture-on-order">Capture payment on order</Label>
                    <p className="text-xs text-muted-foreground">
                      Charge immediately instead of when the order ships.
                    </p>
                  </div>
                  <Switch
                    id="capture-on-order"
                    checked={payments.captureOnOrder}
                    onCheckedChange={(checked) =>
                      setPayments((prev) => ({ ...prev, captureOnOrder: checked }))
                    }
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                <Button type="submit" disabled={isSaving}>
                  <Save className="size-4" />
                  {isSaving ? "Saving..." : "Save changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
