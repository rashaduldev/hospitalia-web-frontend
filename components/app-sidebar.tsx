"use client";

import * as React from "react";
import {
  LayoutDashboardIcon,
  ChartBarIcon,
  FolderIcon,
  Settings2Icon,
  SearchIcon,
  CircleUserRound,
} from "lucide-react";
import DashboardLogo from "@/public/icons/dashLogo";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
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

const data = {
  navSecondary: [
    {
      title: "Settings",
      url: "/b",
      icon: <Settings2Icon />,
    },
    {
      title: "Sign Out",
      url: "dd",
      icon: <SearchIcon />,
    },
  ],
  documents: [
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
      name: "Messages",
      url: "/a",
      icon: <FolderIcon />,
    },
    {
      name: "Add Secretary",
      url: "/s",
      icon: <FolderIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="bg-primary! rounded-none [&_svg]:w-auto! [&_svg]:h-auto!"
            >
              <Link
                href=""
                className="w-full h-full bg-primary py-5 flex justify-center"
              >
                <DashboardLogo className="w-32 h-8" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Link
            href="#"
            className="flex items-center justify-center gap-3 py-4"
          >
            <CircleUserRound className="size-5!" />
            <span className="text-base font-semibold">Welcome Back</span>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}