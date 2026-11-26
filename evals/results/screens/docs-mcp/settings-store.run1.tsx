import { useState, type FormEvent, type ReactNode } from "react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
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

const STORE_NAME = "Fernhill Market"

const TIME_ZONES = [
  { value: "Europe/London", label: "(GMT+00:00) London" },
  { value: "Europe/Berlin", label: "(GMT+01:00) Berlin" },
  { value: "America/New_York", label: "(GMT-05:00) New York" },
  { value: "America/Chicago", label: "(GMT-06:00) Chicago" },
  { value: "America/Los_Angeles", label: "(GMT-08:00) Los Angeles" },
  { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo" },
  { value: "Australia/Sydney", label: "(GMT+10:00) Sydney" },
]

const CURRENCIES = [
  { value: "GBP", label: "Pound sterling (GBP)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "USD", label: "US dollar (USD)" },
]

const PAYOUT_SCHEDULES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
]

const INITIAL_GENERAL = {
  storeName: "Fernhill Market",
  contactEmail: "hello@fernhillmarket.com",
  timeZone: "Europe/London",
}

const INITIAL_DELIVERY = {
  radiusKm: "8",
  minimumOrder: "15.00",
  deliveryFee: "3.50",
  freeDeliveryFrom: "40.00",
}

const INITIAL_PAYMENTS = {
  currency: "GBP",
  payoutSchedule: "weekly",
  statementDescriptor: "FERNHILL MKT",
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type GeneralSettings = typeof INITIAL_GENERAL
type GeneralErrors = Partial<Record<keyof GeneralSettings, string>>

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <span className="sr-only" aria-hidden="true">
        {describedBy}
      </span>
    </div>
  )
}

export default function StoreSettingsPage() {
  const [general, setGeneral] = useState<GeneralSettings>(INITIAL_GENERAL)
  const [generalErrors, setGeneralErrors] = useState<GeneralErrors>({})
  const [delivery, setDelivery] = useState(INITIAL_DELIVERY)
  const [payments, setPayments] = useState(INITIAL_PAYMENTS)

  function saveGeneral(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors: GeneralErrors = {}
    if (!general.storeName.trim()) {
      errors.storeName = "Enter a store name."
    }
    if (!EMAIL_PATTERN.test(general.contactEmail.trim())) {
      errors.contactEmail = "Enter an email address like name@example.com."
    }
    setGeneralErrors(errors)
    if (Object.keys(errors).length > 0) return
    toast.success("General settings saved")
  }

  function saveDelivery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success("Delivery settings saved")
  }

  function savePayments(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast.success("Payment settings saved")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10">
        <header className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Store settings
          </h1>
          <p className="text-sm text-muted-foreground">
            {STORE_NAME} · Manage how your store appears and operates.
          </p>
        </header>

        <Tabs defaultValue="general" className="gap-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <form onSubmit={saveGeneral} noValidate>
              <Card>
                <CardHeader>
                  <CardTitle>General</CardTitle>
                  <CardDescription>
                    The name and contact details customers see.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <Field
                    id="store-name"
                    label="Store name"
                    error={generalErrors.storeName}
                  >
                    <Input
                      id="store-name"
                      value={general.storeName}
                      aria-invalid={!!generalErrors.storeName}
                      aria-describedby={
                        generalErrors.storeName ? "store-name-error" : undefined
                      }
                      onChange={(e) =>
                        setGeneral((s) => ({ ...s, storeName: e.target.value }))
                      }
                    />
                  </Field>

                  <Field
                    id="contact-email"
                    label="Contact email"
                    hint="Customer questions and order updates are sent here."
                    error={generalErrors.contactEmail}
                  >
                    <Input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      value={general.contactEmail}
                      aria-invalid={!!generalErrors.contactEmail}
                      aria-describedby={
                        generalErrors.contactEmail
                          ? "contact-email-error"
                          : "contact-email-hint"
                      }
                      onChange={(e) =>
                        setGeneral((s) => ({
                          ...s,
                          contactEmail: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field id="time-zone" label="Time zone">
                    <Select
                      value={general.timeZone}
                      onValueChange={(value) =>
                        setGeneral((s) => ({ ...s, timeZone: value }))
                      }
                    >
                      <SelectTrigger id="time-zone" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_ZONES.map((zone) => (
                          <SelectItem key={zone.value} value={zone.value}>
                            {zone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button type="submit">Save general settings</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="delivery">
            <form onSubmit={saveDelivery}>
              <Card>
                <CardHeader>
                  <CardTitle>Delivery</CardTitle>
                  <CardDescription>
                    Where you deliver and what it costs the customer.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <Field
                    id="delivery-radius"
                    label="Delivery radius (km)"
                    hint="Addresses further away than this are not offered delivery."
                  >
                    <Input
                      id="delivery-radius"
                      type="number"
                      min="0"
                      step="0.5"
                      value={delivery.radiusKm}
                      onChange={(e) =>
                        setDelivery((s) => ({ ...s, radiusKm: e.target.value }))
                      }
                    />
                  </Field>

                  <Field id="minimum-order" label="Minimum order (£)">
                    <Input
                      id="minimum-order"
                      type="number"
                      min="0"
                      step="0.01"
                      value={delivery.minimumOrder}
                      onChange={(e) =>
                        setDelivery((s) => ({
                          ...s,
                          minimumOrder: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field id="delivery-fee" label="Delivery fee (£)">
                    <Input
                      id="delivery-fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={delivery.deliveryFee}
                      onChange={(e) =>
                        setDelivery((s) => ({
                          ...s,
                          deliveryFee: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field
                    id="free-delivery-from"
                    label="Free delivery from (£)"
                    hint="Orders at or above this amount ship without the delivery fee."
                  >
                    <Input
                      id="free-delivery-from"
                      type="number"
                      min="0"
                      step="0.01"
                      value={delivery.freeDeliveryFrom}
                      onChange={(e) =>
                        setDelivery((s) => ({
                          ...s,
                          freeDeliveryFrom: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button type="submit">Save delivery settings</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="payments">
            <form onSubmit={savePayments}>
              <Card>
                <CardHeader>
                  <CardTitle>Payments</CardTitle>
                  <CardDescription>
                    How you are paid and how charges appear on customer statements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <Field id="currency" label="Store currency">
                    <Select
                      value={payments.currency}
                      onValueChange={(value) =>
                        setPayments((s) => ({ ...s, currency: value }))
                      }
                    >
                      <SelectTrigger id="currency" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field id="payout-schedule" label="Payout schedule">
                    <Select
                      value={payments.payoutSchedule}
                      onValueChange={(value) =>
                        setPayments((s) => ({ ...s, payoutSchedule: value }))
                      }
                    >
                      <SelectTrigger id="payout-schedule" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYOUT_SCHEDULES.map((schedule) => (
                          <SelectItem key={schedule.value} value={schedule.value}>
                            {schedule.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field
                    id="statement-descriptor"
                    label="Statement descriptor"
                    hint="Up to 22 characters. Shown on the customer's card statement."
                  >
                    <Input
                      id="statement-descriptor"
                      maxLength={22}
                      value={payments.statementDescriptor}
                      onChange={(e) =>
                        setPayments((s) => ({
                          ...s,
                          statementDescriptor: e.target.value,
                        }))
                      }
                    />
                  </Field>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button type="submit">Save payment settings</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </main>
  )
}
