"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "./ui/Typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { LogOut, User, MapPin } from "lucide-react";
import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import { handleLogout } from "@/actions/auth.actions";
import Link from "next/link";
import { useCurrentLocale } from "@/locales/client";
import { useState } from "react";

function getInitials(firstName?: string, lastName?: string) {
  return (
    ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || "U"
  );
}

const PROFILE_URL: Record<string, string> = {
  PATIENT: "/patient/profile",
};

export function SiteHeader({ user }: { user: any }) {
  const locale = useCurrentLocale();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const firstName = user?.userDetails?.firstName;
  const lastName = user?.userDetails?.lastName;
  const initials = getInitials(firstName, lastName);
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || "User";
  const userType: string = user?.userType ?? "";
  const profileUrl = PROFILE_URL[userType] ?? null;
  const secretaryCtx = useSecretaryLocation();

  const doLogout = async () => {
    setConfirmLogout(false);
    await handleLogout({ lang: locale });
  };

  return (
    <header className="flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6 py-4">
        <SidebarTrigger className="-ml-1" />

        {/* Location picker — visible for secretary users only */}
        {secretaryCtx && secretaryCtx.locations.length > 0 && (
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <select
              value={secretaryCtx.selectedLocationId ?? ""}
              onChange={(e) => secretaryCtx.setSelectedLocationId(Number(e.target.value))}
              className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {secretaryCtx.locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.locationName}{loc.city ? ` — ${loc.city}` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors outline-none">
              <Typography
                as="span"
                color="ghost_foreground"
                size="sm"
                weight="medium"
                className="capitalize hidden sm:block"
              >
                {firstName}
              </Typography>
              <Avatar size="sm" className="ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground truncate">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {userType.toLowerCase()}
              </p>
            </div>
            <DropdownMenuSeparator />
            {profileUrl && (
              <DropdownMenuItem asChild>
                <Link href={profileUrl} className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/8 cursor-pointer"
              onClick={() => setConfirmLogout(true)}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
    </header>
  );
}
