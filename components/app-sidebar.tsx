"use client";

import * as React from "react";
import Link from "next/link";
import DashboardLogo from "@/public/icons/dashLogo";
import { CircleUserRound } from "lucide-react";
import { NavDocuments } from "./nav-documents";
import { ROUTES, Role } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "./ui/sidebar";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: Role;
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {

  const formattedRoleLinks = React.useMemo(() => {
    const links = ROUTES[userRole] || [];
    return links.map((item) => ({
      ...item,
      icon: <item.icon className="size-4" />,
    }));
  }, [userRole]);

  const formattedCommonLinks = React.useMemo(() => {
    return ROUTES.COMMON.map((item) => ({
      ...item,
      icon: <item.icon className="size-4" />,
    }));
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <Link
            href={ROUTES[userRole]?.[0]?.url || "/"}
            className="w-full bg-primary py-5 flex justify-center"
          >
            <DashboardLogo className="w-32 h-6" />
          </Link>
          <div className="flex items-center justify-center gap-3 py-4 border-b">
            <CircleUserRound className="size-5 text-muted-foreground" />
            <span className="text-sm font-semibold capitalize">
              {userRole?.toLowerCase() || "User"} Portal
            </span>
          </div>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-full mt-5">
        <div className="flex-1">
          <NavDocuments items={formattedRoleLinks} />
        </div>
        <div className="mt-auto pb-4 border-t pt-4">
          <NavDocuments items={formattedCommonLinks} />
        </div>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}