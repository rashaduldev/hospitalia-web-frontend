import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: "Active",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  IN_ACTIVE: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
  TEMPORARY_IN_ACTIVE: {
    label: "Temp. Inactive",
    className: "bg-muted text-muted-foreground border-border",
  },
  LOCKED: {
    label: "Locked",
    className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  TEMPORARY_LOCKED: {
    label: "Temp. Locked",
    className: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  DISABLED: {
    label: "Disabled",
    className: "bg-muted text-muted-foreground border-border",
  },
  TEMPORARY_DISABLED: {
    label: "Temp. Disabled",
    className: "bg-muted text-muted-foreground border-border",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  TEMPORARY_SUSPENDED: {
    label: "Temp. Suspended",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  BLACKLISTED: {
    label: "Blacklisted",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  TEMPORARY_BLACKLISTED: {
    label: "Temp. Blacklisted",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  BANNED: {
    label: "Banned",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  TEMPORARY_BANNED: {
    label: "Temp. Banned",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  DELETED: {
    label: "Deleted",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function UserStatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border",
        c.className,
      )}
    >
      {c.label}
    </span>
  );
}
