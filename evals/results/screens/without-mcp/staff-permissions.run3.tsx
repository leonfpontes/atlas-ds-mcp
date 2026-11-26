import { useState } from "react"
import { Info, ShieldCheck, Store, UserRound, type LucideIcon } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
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
  store: string
  lastActive: string
}

const ROLES: Role[] = ["Owner", "Manager", "Cashier"]

const ROLE_INFO: Record<Role, { description: string; icon: LucideIcon; badgeClass: string }> = {
  Owner: {
    description:
      "Full access to everything, including billing, store settings, and managing other staff roles. Owners can promote or demote anyone, including other owners.",
    icon: ShieldCheck,
    badgeClass: "bg-primary text-primary-foreground",
  },
  Manager: {
    description:
      "Runs day-to-day operations: inventory, pricing, shift schedules, and reports. Managers cannot change billing details or assign the Owner role.",
    icon: Store,
    badgeClass: "bg-secondary text-secondary-foreground",
  },
  Cashier: {
    description:
      "Processes sales and returns at the register and can look up products. Cashiers cannot edit prices, inventory, or other staff accounts.",
    icon: UserRound,
    badgeClass: "bg-muted text-muted-foreground",
  },
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "s-1",
    name: "Eleanor Hart",
    email: "eleanor@fernhillmarket.com",
    role: "Owner",
    store: "Fernhill Main Street",
    lastActive: "Today, 8:42 AM",
  },
  {
    id: "s-2",
    name: "Marcus Lee",
    email: "marcus@fernhillmarket.com",
    role: "Manager",
    store: "Fernhill Main Street",
    lastActive: "Today, 9:15 AM",
  },
  {
    id: "s-3",
    name: "Priya Raman",
    email: "priya@fernhillmarket.com",
    role: "Cashier",
    store: "Fernhill Main Street",
    lastActive: "Yesterday, 6:03 PM",
  },
  {
    id: "s-4",
    name: "Tom Okafor",
    email: "tom@fernhillmarket.com",
    role: "Cashier",
    store: "Fernhill Riverside",
    lastActive: "Today, 7:58 AM",
  },
  {
    id: "s-5",
    name: "Sofia Mendes",
    email: "sofia@fernhillmarket.com",
    role: "Manager",
    store: "Fernhill Riverside",
    lastActive: "Mon, 4:27 PM",
  },
]

function RoleBadge({ role }: { role: Role }) {
  const info = ROLE_INFO[role]
  const Icon = info.icon

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className={`gap-1 ${info.badgeClass}`}>
          <Icon className="size-3" aria-hidden="true" />
          {role}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{info.description}</TooltipContent>
    </Tooltip>
  )
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF)

  const ownerCount = staff.filter((member) => member.role === "Owner").length

  function changeRole(id: string, nextRole: Role) {
    const member = staff.find((m) => m.id === id)
    if (!member || member.role === nextRole) return

    if (member.role === "Owner" && ownerCount <= 1) {
      toast.error("Fernhill Market needs at least one Owner.")
      return
    }

    setStaff((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: nextRole } : m)),
    )
    toast.success(`${member.name} is now a ${nextRole}.`)
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Manage who works at Fernhill Market and what they can do.
          </p>
        </header>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Info className="size-4" aria-hidden="true" />
          <span>Hover a role to see what it allows:</span>
          {ROLES.map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="w-[200px]">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => {
                const isLastOwner = member.role === "Owner" && ownerCount <= 1

                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </TableCell>
                    <TableCell>{member.store}</TableCell>
                    <TableCell className="text-muted-foreground">{member.lastActive}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Select
                          value={member.role}
                          onValueChange={(value) => changeRole(member.id, value as Role)}
                          disabled={isLastOwner}
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
                        {isLastOwner && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info
                                className="size-4 text-muted-foreground"
                                aria-label="Why this role can't change"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              This is the only Owner. Assign another Owner before changing this role.
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  )
}
