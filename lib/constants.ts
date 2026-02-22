import {
  LayoutDashboardIcon,
  ChartBarIcon,
  FolderIcon,
  Settings2Icon,
  LogOut,
} from "lucide-react";

export const ROUTES = {
  DOCTOR: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Set Availability",
      url: "/availability",
      icon: ChartBarIcon,
    },
    {
      name: "Add Secretary",
      url: "/secretary",
      icon: FolderIcon,
    },
  ],
  HOSPITAL: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Set Availability",
      url: "/availability",
      icon: ChartBarIcon,
    },
  ],
  PATIENT: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Get Appointment",
      url: "/appointment",
      icon: FolderIcon,
    },
    {
      name: "Message",
      url: "/message",
      icon: ChartBarIcon,
    },
  ],
  COMMON: [
    {
      name: "Settings",
      url: "/settings",
      icon: Settings2Icon,
    },
    {
      name: "Sign Out",
      url: "/logout",
      icon: LogOut,
    },
  ],
};

export type Role = keyof typeof ROUTES;
