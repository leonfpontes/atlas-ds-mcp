import { useState } from "react"
import { Info } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

type Role = "Owner" | "Manager" | "Cashier"

type StaffMember = {
  id: string
  name: string
  email: string
  role: Role
  lastActive: string
}

const ROLES: Role[] = ["Owner", "Manager", "Cashier"]

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  Owner: "Full access: billing, store settings and staff roles.",
  Manager: "Runs daily operations: schedules, inventory, refunds and reports.",
  Cashier: "Handles sales and returns at the register. No access to settings.",
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "s1", name: "Elena Marsh", email: "elena@fernhillmarket.com", role: "Owner", lastActive: "Today, 08:12" },
  { id: "s2", name: "Tomas Okafor", email: "tomas@fernhillmarket.com", role: "Manager", lastActive: "Today, 07:45" },
  { id: "s3", name: "Priya Nair", email: "priya@fernhillmarket.com", role: "Cashier", lastActive: "Yesterday, 18:30" },
  { id: "s4", name: "Lucas Berg", email: "lucas@fernhillmarket.com", role: "Cashier", lastActive: "Yesterday, 17:02" },
  { id: "s5", name: "Amira Haddad", email: "amira@fernhillmarket.com", role: "Manager", lastActive: "2 days ago" },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)

  function changeRole(id: string, role: Role) {
    const member = staff.find((m) => m.id === id)
    if (!member || member.role === role) return
    setStaff((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))
    toast.success(`${member.name} is now ${role}`)
  }

  return (
    <TooltipProvider>
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Staff</h1>
          <p className="text-sm text-muted-foreground">Fernhill Market · {staff.length} people</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Team and roles</CardTitle>
            <CardDescription>
              Change a role at any time. Hover or focus the info icon to see what each role can do.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Change role</TableHead>
                  <TableHead className="text-right">Last active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{member.role}</Badge>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`About the ${member.role} role`}>
                              <Info />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{ROLE_DESCRIPTIONS[member.role]}</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={member.role} onValueChange={(value) => changeRole(member.id, value as Role)}>
                        <SelectTrigger aria-label={`Role for ${member.name}`} className="w-40">
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
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{member.lastActive}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Toaster />
    </TooltipProvider>
  )
}
