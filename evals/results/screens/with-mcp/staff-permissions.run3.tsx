import { useState } from "react"
import { Info } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

type Role = "Owner" | "Manager" | "Cashier"

type StaffMember = {
  id: string
  name: string
  email: string
  role: Role
  since: string
}

const ROLES: Role[] = ["Owner", "Manager", "Cashier"]

const ROLE_DETAILS: Record<Role, { description: string; variant: "info" | "secondary" | "outline" }> = {
  Owner: {
    description: "Full access: staff, pricing, payouts and store settings.",
    variant: "info",
  },
  Manager: {
    description: "Runs the shop day to day: schedules, stock, refunds and reports.",
    variant: "secondary",
  },
  Cashier: {
    description: "Rings up sales and takes payments. No access to staff or settings.",
    variant: "outline",
  },
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "s1", name: "Elena Marsh", email: "elena@fernhillmarket.com", role: "Owner", since: "Mar 2019" },
  { id: "s2", name: "Tom Okafor", email: "tom@fernhillmarket.com", role: "Manager", since: "Jun 2021" },
  { id: "s3", name: "Priya Raman", email: "priya@fernhillmarket.com", role: "Cashier", since: "Jan 2024" },
  { id: "s4", name: "Lucas Berg", email: "lucas@fernhillmarket.com", role: "Cashier", since: "Sep 2024" },
  { id: "s5", name: "Aisha Bello", email: "aisha@fernhillmarket.com", role: "Manager", since: "Feb 2022" },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)

  function changeRole(id: string, role: Role) {
    const member = staff.find((m) => m.id === id)
    if (!member || member.role === role) return
    setStaff((current) => current.map((m) => (m.id === id ? { ...m, role } : m)))
    toast.success(`${member.name} is now ${role}`)
  }

  return (
    <TooltipProvider>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">Fernhill Market</p>
          <h1 className="text-2xl font-semibold text-foreground">Staff</h1>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Staff members</CardTitle>
            <CardDescription>Change a role to update what a person can access.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>{member.since}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          onValueChange={(value) => changeRole(member.id, value as Role)}
                        >
                          <SelectTrigger aria-label={`Role for ${member.name}`} className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`About the ${member.role} role`}>
                              <Info />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {member.role}: {ROLE_DETAILS[member.role].description}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>What each role can do in Fernhill Market.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {ROLES.map((role) => (
                <li key={role} className="flex items-start gap-3">
                  <Badge variant={ROLE_DETAILS[role].variant}>{role}</Badge>
                  <p className="text-sm text-muted-foreground">{ROLE_DETAILS[role].description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </TooltipProvider>
  )
}
