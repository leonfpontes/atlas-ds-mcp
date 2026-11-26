import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Toaster } from "@/components/ui/sonner"

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
  minimumOrder: "25.00",
  deliveryFee: "4.50",
  deliveryRadius: "15",
}

const PAYMENT_METHODS = [
  { id: "pm-card", name: "Credit and debit cards", provider: "Card processor", enabled: true },
  { id: "pm-wallet", name: "Digital wallets", provider: "Card processor", enabled: true },
  { id: "pm-bank", name: "Bank transfer", provider: "Manual", enabled: false },
  { id: "pm-cash", name: "Cash on delivery", provider: "Manual", enabled: true },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function StoreSettingsPage() {
  const [general, setGeneral] = useState(INITIAL_GENERAL)
  const [delivery, setDelivery] = useState(INITIAL_DELIVERY)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)

  function handleSaveGeneral(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nameMissing = general.storeName.trim() === ""
    const emailInvalid = !EMAIL_PATTERN.test(general.contactEmail.trim())

    setNameError(nameMissing ? "Enter a store name." : null)
    setEmailError(emailInvalid ? "Enter an email address like name@example.com." : null)

    if (nameMissing || emailInvalid) return

    toast.success("General settings saved")
  }

  function handleSaveDelivery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success("Delivery settings saved")
  }

  return (
    <main className="mx-auto w-full max-w-3xl space-y-6 p-6">
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
            <form onSubmit={handleSaveGeneral} noValidate>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>
                  The store name and contact details shown on receipts and order emails.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="store-name" className="text-sm font-medium text-foreground">
                    Store name
                  </label>
                  <Input
                    id="store-name"
                    value={general.storeName}
                    aria-invalid={nameError !== null}
                    aria-describedby={nameError ? "store-name-error" : undefined}
                    onChange={(e) => setGeneral({ ...general, storeName: e.target.value })}
                  />
                  {nameError && (
                    <p id="store-name-error" className="text-sm text-destructive">
                      {nameError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
                    Contact email
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={general.contactEmail}
                    aria-invalid={emailError !== null}
                    aria-describedby={emailError ? "contact-email-error" : "contact-email-hint"}
                    onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })}
                  />
                  {emailError ? (
                    <p id="contact-email-error" className="text-sm text-destructive">
                      {emailError}
                    </p>
                  ) : (
                    <p id="contact-email-hint" className="text-sm text-muted-foreground">
                      Customers reply to this address.
                    </p>
                  )}
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
                      {TIME_ZONES.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone.replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Opening hours and order cut-off times use this zone.
                  </p>
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
            <form onSubmit={handleSaveDelivery} noValidate>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
                <CardDescription>Minimum order, fee and the area you deliver to.</CardDescription>
              </CardHeader>

              <CardContent className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="minimum-order" className="text-sm font-medium text-foreground">
                    Minimum order (USD)
                  </label>
                  <Input
                    id="minimum-order"
                    type="number"
                    min="0"
                    step="0.01"
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
                    type="number"
                    min="0"
                    step="0.01"
                    value={delivery.deliveryFee}
                    onChange={(e) => setDelivery({ ...delivery, deliveryFee: e.target.value })}
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
                    step="1"
                    value={delivery.deliveryRadius}
                    onChange={(e) => setDelivery({ ...delivery, deliveryRadius: e.target.value })}
                  />
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
              <CardDescription>Payment methods accepted at checkout.</CardDescription>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PAYMENT_METHODS.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="font-medium">{method.name}</TableCell>
                      <TableCell className="text-muted-foreground">{method.provider}</TableCell>
                      <TableCell>
                        <Badge variant={method.enabled ? "default" : "secondary"}>
                          {method.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Toaster />
    </main>
  )
}
