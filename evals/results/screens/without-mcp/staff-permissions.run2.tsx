import { useState } from "react"
import { Info } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  startedOn: string
}

const ROLES: Role[] = ["Owner", "Manager", "Cashier"]

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  Owner:
    "Full access to the store. Manages billing, staff roles, store settings, and all reports.",
  Manager:
    "Runs daily operations. Manages inventory, schedules, refunds, and cashier accounts.",
  Cashier:
    "Handles sales at the register. Can process payments and returns, with no access to settings.",
}

const ROLE_BADGE_VARIANT: Record<Role, "default" | "secondary" | "outline"> = {
  Owner: "default",
  Manager: "secondary",
  Cashier: "outline",
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "s-001",
    name: "Eleanor Hayes",
    email: "eleanor@fernhillmarket.com",
    role: "Owner",
    startedOn: "2019-03-02",
  },
  {
    id: "s-002",
    name: "Marcus Ellery",
    email: "marcus@fernhillmarket.com",
    role: "Manager",
    startedOn: "2021-07-19",
  },
  {
    id: "s-003",
    name: "Priya Raman",
    email: "priya@fernhillmarket.com",
    role: "Cashier",
    startedOn: "2023-01-09",
  },
  {
    id: "s-004",
    name: "Tomasz Nowak",
    email: "tomasz@fernhillmarket.com",
    role: "Cashier",
    startedOn: "2023-05-22",
  },
  {
    id: "s-005",
    name: "Grace Okafor",
    email: "grace@fernhillmarket.com",
    role: "Manager",
    startedOn: "2022-11-14",
  },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)

  function handleRoleChange(id: string, nextRole: Role) {
    const member = staff.find((m) => m.id === id)
    if (!member || member.role === nextRole) return

    setStaff((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: nextRole } : m))
    )
    toast.success(`${member.name} is now ${nextRole}.`)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Staff
          </h1>
          <p className="text-sm text-muted-foreground">
            Fernhill Market · {staff.length} team members
          </p>
        </header>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Start date</TableHead>
                <TableHead className="w-[200px]">Change role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium text-foreground">
                    {member.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={ROLE_BADGE_VARIANT[member.role]}>
                        {member.role}
                      </Badge>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6"
                            aria-label={`About the ${member.role} role`}
                          >
                            <Info className="size-3.5 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="font-medium">{member.role}</p>
                          <p>{ROLE_DESCRIPTIONS[member.role]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(member.startedOn)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        handleRoleChange(member.id, value as Role)
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-label={`Role for ${member.name}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <Tooltip key={role}>
                            <TooltipTrigger asChild>
                              <div>
                                <SelectItem value={role}>{role}</SelectItem>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              {ROLE_DESCRIPTIONS[role]}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  )
}
