import { useState } from "react"
import { Info } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"

type Role = "Owner" | "Manager" | "Cashier"

type StaffMember = {
  id: string
  name: string
  email: string
  since: string
  role: Role
}

const ROLES: Role[] = ["Owner", "Manager", "Cashier"]

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  Owner: "Full access: billing, store settings, and staff roles.",
  Manager: "Runs the shop day to day: schedules, stock, refunds, and reports.",
  Cashier: "Rings up sales, takes payments, and handles returns.",
}

const ROLE_BADGE_VARIANT: Record<Role, "default" | "secondary" | "outline"> = {
  Owner: "default",
  Manager: "secondary",
  Cashier: "outline",
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "s-001",
    name: "Elena Marsh",
    email: "elena@fernhillmarket.com",
    since: "Mar 2019",
    role: "Owner",
  },
  {
    id: "s-002",
    name: "Daniel Okafor",
    email: "daniel@fernhillmarket.com",
    since: "Jun 2021",
    role: "Manager",
  },
  {
    id: "s-003",
    name: "Priya Raman",
    email: "priya@fernhillmarket.com",
    since: "Feb 2023",
    role: "Manager",
  },
  {
    id: "s-004",
    name: "Tomasz Nowak",
    email: "tomasz@fernhillmarket.com",
    since: "Sep 2023",
    role: "Cashier",
  },
  {
    id: "s-005",
    name: "Aisha Bello",
    email: "aisha@fernhillmarket.com",
    since: "Jan 2024",
    role: "Cashier",
  },
  {
    id: "s-006",
    name: "Lucas Ferreira",
    email: "lucas@fernhillmarket.com",
    since: "Apr 2025",
    role: "Cashier",
  },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)

  const changeRole = (id: string, nextRole: Role) => {
    const member = staff.find((m) => m.id === id)
    if (!member || member.role === nextRole) return

    setStaff((current) =>
      current.map((m) => (m.id === id ? { ...m, role: nextRole } : m))
    )
    toast.success(`${member.name} is now ${nextRole.toLowerCase()}`)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market team members and what each role can do.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Team members</CardTitle>
            <CardDescription>
              {staff.length} people across the store. Hover a role for its details.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>
                    <span className="inline-flex items-center gap-2">
                      Role
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="About staff roles"
                            className="size-7"
                          >
                            <Info />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <ul className="space-y-1">
                            {ROLES.map((role) => (
                              <li key={role}>
                                <span className="font-medium">{role}:</span>{" "}
                                {ROLE_DESCRIPTIONS[role]}
                              </li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </TableHead>
                  <TableHead>Change role</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell>{member.since}</TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant={ROLE_BADGE_VARIANT[member.role]} tabIndex={0}>
                            {member.role}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          {ROLE_DESCRIPTIONS[member.role]}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={member.role}
                        onValueChange={(value) => changeRole(member.id, value as Role)}
                      >
                        <SelectTrigger
                          aria-label={`Change role for ${member.name}`}
                          className="w-40"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
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
