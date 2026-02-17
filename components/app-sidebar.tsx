"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  ChartBarIcon,
  FolderIcon,
  Settings2Icon,
  CircleUserRound,
  LogOut,
} from "lucide-react";
import DashboardLogo from "@/public/icons/dashLogo";
import { NavDocuments } from "./nav-documents";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: any }) {
  const roleLinks = React.useMemo(() => {
    const links = [];
    if (user === "DOCTOR") {
      links.push(
        {
          name: "Dashboard",
          url: "/en/customer/doctor/dashboard",
          icon: <LayoutDashboardIcon />,
        },
        {
          name: "Set Availability",
          url: "/customer/doctor/availability",
          icon: <ChartBarIcon />,
        },
        {
          name: "Add Secretary",
          url: "/s",
          icon: <FolderIcon />,
        },
      );
    }
    return links;
  }, [user?.role]);
  const commonLinks = [
    {
      name: "Settings",
      url: "/a",
      icon: <Settings2Icon />,
    },
    {
      name: "Sign Out",
      url: "/logout",
      icon: <LogOut />,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <Link
            href="/en/customer/doctor/dashboard"
            className="w-full bg-primary py-5 flex justify-center"
          >
            <DashboardLogo className="w-32 h-6" />
          </Link>
          <div className="flex items-center justify-center gap-3 py-4 border-b">
            <CircleUserRound className="size-5" />
            <span className="text-base font-semibold">
              {user?.fullName || "Welcome Back"}
            </span>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full mt-5">
        <div className="flex-1">
          <NavDocuments items={roleLinks} />
        </div>
        <div className="mt-auto pb-4">
          <NavDocuments items={commonLinks} />
        </div>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
