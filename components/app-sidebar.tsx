"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  Settings2Icon,
  SearchIcon,
  CircleUserRound,
} from "lucide-react";
import DashboardLogo from "@/public/assets/logo.svg";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Lifecycle",
      url: "#",
      icon: <ListIcon />,
    },

    {
      title: "Team",
      url: "#",
      icon: <UsersIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Sign Out",
      url: "#",
      icon: <SearchIcon />,
    },
  ],
  documents: [
    {
      name: "Dashboard",
      url: "#",
      icon: <LayoutDashboardIcon />,
    },
    {
      name: "Set Availability",
      url: "#",
      icon: <ChartBarIcon />,
    },
    {
      name: "Messages",
      url: "#",
      icon: <FolderIcon />,
    },
    {
      name: "Add Secretary",
      url: "#",
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
              <a
                href="#"
                className="w-full h-full bg-primary py-5 flex justify-center"
              >
                <DashboardLogo className="w-32 h-8" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CircleUserRound className="size-5!" />
                <span className="text-base font-semibold">Welcome Back</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
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
