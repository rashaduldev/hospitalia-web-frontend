"use client";

import Link from "next/link";
import DashboardLogo from "@/public/icons/dashLogo";
import { CircleUserRound, LogOut } from "lucide-react";
import { NavDocuments } from "./nav-documents";
import { ROUTES, Role } from "@/lib/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "./ui/sidebar";
import { useMemo } from "react";
import { handleLogout } from "@/actions/auth.actions";
import { Typography } from "./ui/Typography";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: Role;
  lang: string;
}

export function AppSidebar({ lang, userRole, ...props }: AppSidebarProps) {
  const formattedRoleLinks = useMemo(() => {
    const links = ROUTES[userRole] || [];
    return links.map((item) => ({
      ...item,
      icon: <item.icon className="size-4" />,
    }));
  }, [userRole]);

  const formattedCommonLinks = useMemo(() => {
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
            href="/dashboard"
            className="w-full bg-primary py-5 flex justify-center"
          >
            <DashboardLogo className="w-32 h-6" />
          </Link>
          <div className="flex items-center justify-center gap-3 pb-14 pt-9">
            <CircleUserRound className="size-10 text-muted-foreground" />
            <Typography color="black" size="2xl" weight="semiBold">
              Welcome Back
            </Typography>
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
        <button
          onClick={() => handleLogout({ lang })}
          className="flex items-center gap-2 text-sm p-1 cursor-pointer hover:bg-muted-foreground/8 rounded-md"
        >
          <LogOut />
          Sign Out
        </button>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
