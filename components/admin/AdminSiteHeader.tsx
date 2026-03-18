"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { adminLogout } from "@/actions/admin/auth.actions";
import { useState } from "react";
import type { AdminUser } from "@/actions/admin/user.actions";

function getInitials(firstName?: string, lastName?: string) {
  return (
    ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase() || "A"
  );
}

export function AdminSiteHeader({ user }: { user: AdminUser }) {
  const [confirmLogout, setConfirmLogout] = useState(false);

  const firstName = user.userDetails?.firstName;
  const lastName = user.userDetails?.lastName;
  const initials = getInitials(firstName, lastName);
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Admin";
  const roleLabel = user.roleType?.replace("_", " ") ?? "Admin";

  const doLogout = async () => {
    setConfirmLogout(false);
    await adminLogout();
  };

  return (
    <header className="flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between px-4 lg:gap-2 lg:px-6 py-4">
        <SidebarTrigger className="-ml-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors outline-none">
              <span className="text-sm font-medium text-muted-foreground hidden sm:block capitalize">
                {firstName}
              </span>
              <Avatar size="sm" className="ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
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
    </header>
  );
}
