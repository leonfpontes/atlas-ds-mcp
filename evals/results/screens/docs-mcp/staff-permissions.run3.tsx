import { useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

type Role = "Owner" | "Manager" | "Cashier"

type StaffMember = {
  id: string
  name: string
  email: string
  role: Role
  since: string
}

const ROLES: Role[] = ["Owner", "Manager", "Cashier"]

const ROLE_INFO: Record<
  Role,
  {
    description: string
    badge: "default" | "secondary" | "outline"
  }
> = {
  Owner: {
    description:
      "Full access, including billing, store settings and managing every other staff member.",
    badge: "default",
  },
  Manager: {
    description:
      "Runs daily operations: schedules, inventory, pricing and refunds. Cannot change billing.",
    badge: "secondary",
  },
  Cashier: {
    description:
      "Takes payments and handles returns at the register. No access to settings or reports.",
    badge: "outline",
  },
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "s-001",
    name: "Eleanor Hart",
    email: "eleanor@fernhillmarket.example",
    role: "Owner",
    since: "Mar 2019",
  },
  {
    id: "s-002",
    name: "Marcus Oyelaran",
    email: "marcus@fernhillmarket.example",
    role: "Manager",
    since: "Aug 2021",
  },
  {
    id: "s-003",
    name: "Priya Raman",
    email: "priya@fernhillmarket.example",
    role: "Manager",
    since: "Jan 2022",
  },
  {
    id: "s-004",
    name: "Tom Lindqvist",
    email: "tom@fernhillmarket.example",
    role: "Cashier",
    since: "Jun 2023",
  },
  {
    id: "s-005",
    name: "Aisha Bello",
    email: "aisha@fernhillmarket.example",
    role: "Cashier",
    since: "Nov 2024",
  },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)

  function changeRole(id: string, role: Role) {
    const member = staff.find((m) => m.id === id)
    if (!member || member.role === role) return

    setStaff((current) =>
      current.map((m) => (m.id === id ? { ...m, role } : m))
    )
    toast.success(`${member.name} is now ${role}`)
  }

  return (
    <TooltipProvider>
      <main className="mx-auto max-w-5xl space-y-6 bg-background p-6 text-foreground">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market team and their access levels.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team members</CardTitle>
            <CardDescription>
              {staff.length} people. Hover a role to see what it can do.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Since</TableHead>
                  <TableHead>Change role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.email}
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={ROLE_INFO[member.role].badge}
                            tabIndex={0}
                          >
                            {member.role}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="font-medium">{member.role}</p>
                          <p>{ROLE_INFO[member.role].description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.since}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          changeRole(member.id, value as Role)
                        }
                      >
                        <SelectTrigger
                          aria-label={`Role for ${member.name}`}
                          className="w-40"
                        >
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
