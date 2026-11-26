import { useState } from "react"
import { Briefcase, Crown, Info, Receipt, type LucideIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

type Role = "Owner" | "Manager" | "Cashier"

type StaffMember = {
  id: string
  name: string
  email: string
  role: Role
  startDate: string
}

const ROLES: Role[] = ["Owner", "Manager", "Cashier"]

const ROLE_DETAILS: Record<Role, { description: string; icon: LucideIcon }> = {
  Owner: {
    description:
      "Full access to the store. Manages billing, staff roles, store settings and can remove any other member.",
    icon: Crown,
  },
  Manager: {
    description:
      "Runs daily operations. Manages inventory, schedules, pricing and reports, but cannot change owner roles.",
    icon: Briefcase,
  },
  Cashier: {
    description:
      "Handles sales at the register, processes returns and opens or closes their own till. No access to reports or settings.",
    icon: Receipt,
  },
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "s-001",
    name: "Eleanor Hart",
    email: "eleanor@fernhillmarket.com",
    role: "Owner",
    startDate: "2015-03-02",
  },
  {
    id: "s-002",
    name: "Marcus Reyes",
    email: "marcus@fernhillmarket.com",
    role: "Manager",
    startDate: "2018-07-19",
  },
  {
    id: "s-003",
    name: "Priya Nair",
    email: "priya@fernhillmarket.com",
    role: "Manager",
    startDate: "2020-11-05",
  },
  {
    id: "s-004",
    name: "Tomasz Kowalski",
    email: "tomasz@fernhillmarket.com",
    role: "Cashier",
    startDate: "2022-04-11",
  },
  {
    id: "s-005",
    name: "Aisha Bello",
    email: "aisha@fernhillmarket.com",
    role: "Cashier",
    startDate: "2023-09-25",
  },
]

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function RoleBadge({ role }: { role: Role }) {
  const { description, icon: Icon } = ROLE_DETAILS[role]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="secondary" className="cursor-help gap-1.5">
          <Icon className="size-3.5" aria-hidden="true" />
          {role}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-balance">{description}</TooltipContent>
    </Tooltip>
  )
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)

  function changeRole(memberId: string, nextRole: Role) {
    const member = staff.find((m) => m.id === memberId)
    if (!member || member.role === nextRole) return

    const ownerCount = staff.filter((m) => m.role === "Owner").length
    if (member.role === "Owner" && ownerCount === 1) {
      toast.error("The store must keep at least one owner.")
      return
    }

    setStaff((current) =>
      current.map((m) => (m.id === memberId ? { ...m, role: nextRole } : m)),
    )
    toast.success(`${member.name} is now ${nextRole}.`)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Staff
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage who works at Fernhill Market and what they can do.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Team members</CardTitle>
            <CardDescription>
              {staff.length} people across {ROLES.length} roles
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {ROLES.map((role) => {
                const { description, icon: Icon } = ROLE_DETAILS[role]
                const count = staff.filter((m) => m.role === role).length
                return (
                  <div
                    key={role}
                    className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Icon className="size-4" aria-hidden="true" />
                        {role}
                      </span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                )
              })}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>
                    <span className="inline-flex items-center gap-1.5">
                      Role
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-5"
                            aria-label="About staff roles"
                          >
                            <Info className="size-3.5" aria-hidden="true" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-balance">
                          Hover a role badge to see what it allows. Change a role with the
                          dropdown in the Change role column.
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </TableHead>
                  <TableHead>Start date</TableHead>
                  <TableHead className="text-right">Change role</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={member.role} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(member.startDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={member.role}
                        onValueChange={(value) => changeRole(member.id, value as Role)}
                      >
                        <SelectTrigger
                          size="sm"
                          className="ml-auto w-[140px]"
                          aria-label={`Change role for ${member.name}`}
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
      </div>
    </TooltipProvider>
  )
}
