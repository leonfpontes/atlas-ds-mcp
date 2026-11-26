import { useState } from "react"
import { Store } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"

const TIME_ZONES = [
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "America/New_York", label: "New York (ET)" },
  { value: "America/Chicago", label: "Chicago (CT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
]

const CURRENCIES = [
  { value: "GBP", label: "British pound (GBP)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "USD", label: "US dollar (USD)" },
]

const INITIAL_GENERAL = {
  storeName: "Fernhill Market",
  contactEmail: "hello@fernhillmarket.example",
  timeZone: "Europe/London",
}

const INITIAL_DELIVERY = {
  radiusKm: "8",
  minimumOrder: "15.00",
  leadTimeMinutes: "45",
}

const INITIAL_PAYMENTS = {
  currency: "GBP",
  acceptCards: true,
  acceptCash: false,
}

export default function StoreSettingsPage() {
  const [general, setGeneral] = useState(INITIAL_GENERAL)
  const [delivery, setDelivery] = useState(INITIAL_DELIVERY)
  const [payments, setPayments] = useState(INITIAL_PAYMENTS)
  const [emailError, setEmailError] = useState<string | null>(null)

  const handleSaveGeneral = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(general.contactEmail)
    if (!general.storeName.trim()) {
      toast.error("Enter a store name")
      return
    }
    if (!emailOk) {
      setEmailError("Enter an email address like name@example.com.")
      return
    }
    setEmailError(null)
    toast.success("General settings saved")
  }

  const handleSaveDelivery = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success("Delivery settings saved")
  }

  const handleSavePayments = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    toast.success("Payment settings saved")
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-md border border-border bg-muted">
          <Store className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Store settings</h1>
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <form onSubmit={handleSaveGeneral} noValidate>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  The name and contact details customers see on receipts and emails.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="store-name"
                    className="text-sm font-medium text-foreground"
                  >
                    Store name
                  </label>
                  <Input
                    id="store-name"
                    name="storeName"
                    value={general.storeName}
                    onChange={(e) =>
                      setGeneral({ ...general, storeName: e.target.value })
                    }
                    autoComplete="organization"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium text-foreground"
                  >
                    Contact email
                  </label>
                  <Input
                    id="contact-email"
                    name="contactEmail"
                    type="email"
                    value={general.contactEmail}
                    onChange={(e) => {
                      setGeneral({ ...general, contactEmail: e.target.value })
                      if (emailError) setEmailError(null)
                    }}
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={
                      emailError ? "contact-email-error" : "contact-email-hint"
                    }
                    autoComplete="email"
                    required
                  />
                  {emailError ? (
                    <p
                      id="contact-email-error"
                      className="text-sm text-destructive"
                    >
                      {emailError}
                    </p>
                  ) : (
                    <p
                      id="contact-email-hint"
                      className="text-sm text-muted-foreground"
                    >
                      Customers reply to this address.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    Time zone
                  </span>
                  <Select
                    value={general.timeZone}
                    onValueChange={(value) =>
                      setGeneral({ ...general, timeZone: value })
                    }
                  >
                    <SelectTrigger
                      id="time-zone"
                      aria-label="Time zone"
                      className="w-full"
                    >
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
                    Used for opening hours and order cut-off times.
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
            <form onSubmit={handleSaveDelivery} noValidate>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
                <CardDescription>
                  Where you deliver, the smallest order you accept and how long packing takes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="delivery-radius"
                    className="text-sm font-medium text-foreground"
                  >
                    Delivery radius (km)
                  </label>
                  <Input
                    id="delivery-radius"
                    type="number"
                    min={0}
                    step={1}
                    value={delivery.radiusKm}
                    onChange={(e) =>
                      setDelivery({ ...delivery, radiusKm: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="minimum-order"
                    className="text-sm font-medium text-foreground"
                  >
                    Minimum order (£)
                  </label>
                  <Input
                    id="minimum-order"
                    type="number"
                    min={0}
                    step={0.01}
                    value={delivery.minimumOrder}
                    onChange={(e) =>
                      setDelivery({ ...delivery, minimumOrder: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="lead-time"
                    className="text-sm font-medium text-foreground"
                  >
                    Packing lead time (minutes)
                  </label>
                  <Input
                    id="lead-time"
                    type="number"
                    min={0}
                    step={5}
                    value={delivery.leadTimeMinutes}
                    onChange={(e) =>
                      setDelivery({
                        ...delivery,
                        leadTimeMinutes: e.target.value,
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Earliest slot shown to customers, counted from order time.
                  </p>
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
            <form onSubmit={handleSavePayments} noValidate>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>
                  Currency and the payment methods customers can use at checkout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-foreground">
                    Currency
                  </span>
                  <Select
                    value={payments.currency}
                    onValueChange={(value) =>
                      setPayments({ ...payments, currency: value })
                    }
                  >
                    <SelectTrigger
                      id="currency"
                      aria-label="Currency"
                      className="w-full"
                    >
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

                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-foreground">
                    Accepted methods
                  </legend>
                  <label className="flex items-center gap-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={payments.acceptCards}
                      onChange={(e) =>
                        setPayments({
                          ...payments,
                          acceptCards: e.target.checked,
                        })
                      }
                    />
                    Card payments online
                  </label>
                  <label className="flex items-center gap-3 text-sm text-foreground">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={payments.acceptCash}
                      onChange={(e) =>
                        setPayments({
                          ...payments,
                          acceptCash: e.target.checked,
                        })
                      }
                    />
                    Cash on delivery
                  </label>
                </fieldset>
              </CardContent>
              <CardFooter className="justify-end">
                <Button type="submit">Save payment settings</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster position="bottom-right" />
    </div>
  )
}
