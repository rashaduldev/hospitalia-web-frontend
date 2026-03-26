"use client";

import Link from "next/link";
import DashboardLogo from "@/public/icons/dashLogo";
import { LogOut, Stethoscope } from "lucide-react";
import { NavDocuments } from "./nav-documents";
import { ROUTES, Role } from "@/lib/constants";
import { SecretaryPermission } from "@/types/secretary.type";
import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "./ui/sidebar";
import { useMemo, useState } from "react";
import { handleLogout } from "@/actions/auth.actions";
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
import AppButton from "@/components/common/AppButton";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: Role;
  lang: string;
  user?: any;
}

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0]?.toUpperCase() ?? "";
  const l = lastName?.[0]?.toUpperCase() ?? "";
  return (f + l) || "U";
}

const ROLE_LABELS: Record<Role, string> = {
  DOCTOR: "Doctor",
  HOSPITAL: "Hospital",
  PATIENT: "Patient",
  ADMIN: "Admin",
  SECRETARY: "Secretary",
  COMMON: "",
};

const DASHBOARD_URL: Partial<Record<Role, string>> = {
  PATIENT: "/patient/dashboard",
  DOCTOR: "/doctor/dashboard",
  HOSPITAL: "/hospital/dashboard",
  ADMIN: "/admin/dashboard",
  SECRETARY: "/secretary/dashboard",
};

const PROFILE_URL: Partial<Record<Role, string>> = {
  PATIENT: "/patient/profile",
  DOCTOR: "/doctor/profile",
};

function UserCard({ initials, displayName, roleLabel }: { initials: string; displayName: string; roleLabel: string }) {
  return (
    <>
      <Avatar size="lg" className="shrink-0 ring-2 ring-primary/20">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-semibold text-foreground truncate leading-tight group-hover:text-primary transition-colors">
          {displayName}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">
          {roleLabel}
        </span>
      </div>
    </>
  );
}

export function AppSidebar({ lang, userRole, user, ...props }: AppSidebarProps) {
  const dashboardUrl = DASHBOARD_URL[userRole] ?? "/dashboard";
  const profileUrl = PROFILE_URL[userRole] ?? null;
  const [confirmLogout, setConfirmLogout] = useState(false);
  const secretaryCtx = useSecretaryLocation();

  const formattedRoleLinks = useMemo(() => {
    const links = ROUTES[userRole] || [];
    const filtered = userRole === "SECRETARY" && secretaryCtx
      ? links.filter((item) => !item.permission || secretaryCtx.activePermissions.includes(item.permission as SecretaryPermission))
      : links;
    return filtered.map((item) => ({
      ...item,
      icon: <item.icon className="size-4" />,
    }));
  }, [userRole, secretaryCtx?.activePermissions]);

  const formattedCommonLinks = useMemo(() => {
    return ROUTES.COMMON.map((item) => ({
      ...item,
      icon: <item.icon className="size-4" />,
    }));
  }, []);

  const initials = getInitials(
    user?.userDetails?.firstName,
    user?.userDetails?.lastName,
  );
  const displayName = [user?.userDetails?.firstName, user?.userDetails?.lastName]
    .filter(Boolean)
    .join(" ") || "Welcome";

  const doLogout = async () => {
    setConfirmLogout(false);
    await handleLogout({ lang });
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* ── Logo ── */}
      <SidebarHeader className="p-0">
        <Link
          href={dashboardUrl}
          className="flex items-center justify-center bg-primary py-5"
        >
          <DashboardLogo className="w-32 h-6 text-white dark:text-card-foreground transition-colors duration-300" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-full pt-5">
        {/* ── User card ── */}
        {profileUrl ? (
          <Link
            href={profileUrl}
            className="flex items-center gap-3 px-2 pb-5 rounded-lg hover:bg-primary/5 transition-colors group"
          >
            <UserCard initials={initials} displayName={displayName} roleLabel={ROLE_LABELS[userRole]} />
          </Link>
        ) : (
          <div className="flex items-center gap-3 px-2 pb-5">
            <UserCard initials={initials} displayName={displayName} roleLabel={ROLE_LABELS[userRole]} />
          </div>
        )}

        {/* ── Doctor badge (secretary accounts) ── */}
        {userRole === "SECRETARY" && secretaryCtx?.doctorName && (
          <div className="flex items-center gap-2 px-2 pb-3 -mt-2">
            <Stethoscope className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              Secretary for <span className="font-medium text-foreground">{secretaryCtx.doctorName.startsWith("Dr.") ? secretaryCtx.doctorName : `Dr. ${secretaryCtx.doctorName}`}</span>
            </span>
          </div>
        )}

        <SidebarSeparator className="mb-3" />

        {/* ── Main nav ── */}
        <div className="flex-1">
          <NavDocuments items={formattedRoleLinks} />
        </div>

        {/* ── Common nav (Settings etc.) ── */}
        {userRole !== "HOSPITAL" && (
          <div className="pb-2">
            <SidebarSeparator className="mb-3" />
            <NavDocuments items={formattedCommonLinks} />
          </div>
        )}
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
      <AlertDialog open={confirmLogout} onOpenChange={(open) => !open && setConfirmLogout(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmLogout(false)}>
              Cancel
            </AlertDialogCancel>
            <AppButton
              variant="destructive"
              onClick={doLogout}
            >
              Sign Out
            </AppButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
