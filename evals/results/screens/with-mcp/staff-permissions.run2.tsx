import { useState } from "react"
import { Info } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

type Role = "Owner" | "Manager" | "Cashier"

type StaffMember = {
  id: string
  name: string
  email: string
  role: Role
  startedOn: string
}

const ROLES: Role[] = ["Owner", "Manager", "Cashier"]

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  Owner: "Full access: manages the store, staff roles, billing and settings.",
  Manager: "Runs daily operations: schedules, inventory, reports and refunds.",
  Cashier: "Handles sales and payments at the register. No access to settings.",
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "s1", name: "Elena Fernhill", email: "elena@fernhillmarket.com", role: "Owner", startedOn: "Mar 2016" },
  { id: "s2", name: "Marcus Odell", email: "marcus@fernhillmarket.com", role: "Manager", startedOn: "Jun 2019" },
  { id: "s3", name: "Priya Raman", email: "priya@fernhillmarket.com", role: "Cashier", startedOn: "Feb 2023" },
  { id: "s4", name: "Tomás Berg", email: "tomas@fernhillmarket.com", role: "Cashier", startedOn: "Sep 2023" },
  { id: "s5", name: "Aisha Yusuf", email: "aisha@fernhillmarket.com", role: "Manager", startedOn: "Jan 2021" },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)

  const changeRole = (id: string, role: Role) => {
    const member = staff.find((m) => m.id === id)
    if (!member || member.role === role) return
    setStaff((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))
    toast.success(`${member.name} is now ${role}`)
  }

  return (
    <TooltipProvider>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">Fernhill Market</h1>
          <p className="text-sm text-muted-foreground">Staff and access roles</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Staff</CardTitle>
            <CardDescription>Change a role to update what a team member can access.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Change role</TableHead>
                  <TableHead className="text-right">Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className="gap-1" tabIndex={0}>
                            {member.role}
                            <Info aria-hidden="true" className="size-3" />
                            <span className="sr-only">: {ROLE_DESCRIPTIONS[member.role]}</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>{ROLE_DESCRIPTIONS[member.role]}</TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Select value={member.role} onValueChange={(value) => changeRole(member.id, value as Role)}>
                        <SelectTrigger aria-label={`Role for ${member.name}`} className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <Tooltip key={role}>
                              <TooltipTrigger asChild>
                                <SelectItem value={role}>{role}</SelectItem>
                              </TooltipTrigger>
                              <TooltipContent side="right">{ROLE_DESCRIPTIONS[role]}</TooltipContent>
                            </Tooltip>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{member.startedOn}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What each role can do</CardTitle>
            <CardDescription>Hover a role in the table to see its summary.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3 text-sm">
              {ROLES.map((role) => (
                <li key={role} className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">{role}</span>
                  <span className="text-muted-foreground">{ROLE_DESCRIPTIONS[role]}</span>
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
