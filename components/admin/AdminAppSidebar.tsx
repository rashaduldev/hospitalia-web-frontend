"use client";

import Link from "next/link";
import DashboardLogo from "@/public/icons/dashLogo";
import { LogOut } from "lucide-react";
import { NavDocuments } from "@/components/nav-documents";
import { ROUTES } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useMemo, useState } from "react";
import { adminLogout } from "@/actions/admin/auth.actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { AdminUser } from "@/actions/admin/user.actions";

interface AdminAppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: AdminUser;
}

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0]?.toUpperCase() ?? "";
  const l = lastName?.[0]?.toUpperCase() ?? "";
  return (f + l) || "A";
}

export function AdminAppSidebar({ user, ...props }: AdminAppSidebarProps) {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const navLinks = useMemo(
    () =>
      ROUTES.ADMIN.map((item) => ({
        ...item,
        icon: <item.icon className="size-4" />,
      })),
    [],
  );

  const initials = getInitials(
    user.userDetails?.firstName,
    user.userDetails?.lastName,
  );
  const displayName =
    [user.userDetails?.firstName, user.userDetails?.lastName]
      .filter(Boolean)
      .join(" ") || "Admin";

  const doLogout = async () => {
    setConfirmLogout(false);
    await adminLogout();
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* ── Logo ── */}
      <SidebarHeader className="p-0">
        <Link
          href="/admin/dashboard"
          className="flex items-center justify-center bg-primary py-5"
        >
          <DashboardLogo className="w-32 h-6 text-white dark:text-card-foreground transition-colors duration-300" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex flex-col pt-5">
        {/* ── User card ── */}
        <div className="flex items-center gap-3 px-2 pb-5">
          <Avatar size="lg" className="shrink-0 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-foreground truncate leading-tight">
              {displayName}
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {user.roleType?.replace("_", " ")}
            </span>
          </div>
        </div>

        <SidebarSeparator className="mb-3" />

        {/* ── Nav ── */}
        <div className="flex-1">
          <NavDocuments items={navLinks} />
        </div>
      </SidebarContent>

      {/* ── Sign out ── */}
      <SidebarFooter className="border-t px-3 py-3">
        <button
          onClick={() => setConfirmLogout(true)}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/8 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={15} className="shrink-0" />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>

      {/* ── Logout confirmation ── */}
      <AlertDialog
        open={confirmLogout}
        onOpenChange={(open) => !open && setConfirmLogout(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of the admin portal?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmLogout(false)}>
              Cancel
            </AlertDialogCancel>
            <Button variant="destructive" onClick={doLogout}>
              Sign Out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
