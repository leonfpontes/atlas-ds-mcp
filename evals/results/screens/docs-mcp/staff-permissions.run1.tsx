import { useState } from "react"
import { Briefcase, Crown, Receipt } from "lucide-react"
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
import { Toaster } from "@/components/ui/sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    icon: typeof Crown
    variant: "default" | "secondary" | "outline"
  }
> = {
  Owner: {
    description:
      "Full access to the store: billing, staff roles, settings and every report.",
    icon: Crown,
    variant: "default",
  },
  Manager: {
    description:
      "Runs daily operations: stock, pricing, schedules and reports. Cannot change billing.",
    icon: Briefcase,
    variant: "secondary",
  },
  Cashier: {
    description:
      "Rings up sales and handles returns at the register. No access to reports or settings.",
    icon: Receipt,
    variant: "outline",
  },
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "s-101",
    name: "Eleanor Hart",
    email: "eleanor@fernhillmarket.com",
    role: "Owner",
    since: "Mar 2019",
  },
  {
    id: "s-102",
    name: "Marcus Bell",
    email: "marcus@fernhillmarket.com",
    role: "Manager",
    since: "Jun 2021",
  },
  {
    id: "s-103",
    name: "Priya Raman",
    email: "priya@fernhillmarket.com",
    role: "Cashier",
    since: "Jan 2023",
  },
  {
    id: "s-104",
    name: "Tomas Lindqvist",
    email: "tomas@fernhillmarket.com",
    role: "Cashier",
    since: "Aug 2023",
  },
  {
    id: "s-105",
    name: "Aisha Okafor",
    email: "aisha@fernhillmarket.com",
    role: "Manager",
    since: "Nov 2022",
  },
]

function isRole(value: string): value is Role {
  return (ROLES as string[]).includes(value)
}

function RoleBadge({ role }: { role: Role }) {
  const info = ROLE_INFO[role]
  const Icon = info.icon

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={info.variant} tabIndex={0} className="gap-1">
          <Icon aria-hidden="true" />
          {role}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <span className="font-medium">{role}:</span> {info.description}
      </TooltipContent>
    </Tooltip>
  )
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)

  function changeRole(id: string, value: string) {
    if (!isRole(value)) return

    const member = staff.find((m) => m.id === id)
    if (!member || member.role === value) return

    setStaff((current) =>
      current.map((m) => (m.id === id ? { ...m, role: value } : m))
    )
    toast.success(`${member.name} is now ${value}`)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <main className="mx-auto w-full max-w-5xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Staff</CardTitle>
            <CardDescription>
              Fernhill Market team members and their roles. Hover a role to see
              what it allows.
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
                  <TableHead className="text-right">Since</TableHead>
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
                      <RoleBadge role={member.role} />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={member.role}
                        onValueChange={(value) => changeRole(member.id, value)}
                      >
                        <SelectTrigger
                          className="w-[140px]"
                          aria-label={`Role for ${member.name}`}
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
                    <TableCell className="text-right text-muted-foreground">
                      {member.since}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Toaster />
      </main>
    </TooltipProvider>
  )
}
