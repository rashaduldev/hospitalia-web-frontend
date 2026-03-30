import { cn } from "@/lib/utils";

const config: Record<string, { label: string; className: string }> = {
  USER: {
    label: "User",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  ADMIN: {
    label: "Admin",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  SUPER_ADMIN: {
    label: "Super Admin",
    className: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  },
};

export function RoleTypeBadge({ type }: { type: string }) {
  const c = config[type] ?? {
    label: type,
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
