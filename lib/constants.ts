import {
  LayoutDashboardIcon,
  ChartBarIcon,
  FolderIcon,
  Settings2Icon,
  UserRoundPlus,
  Clock,
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
      icon: Clock,
    },
    {
      name: "Add Secretary",
      url: "/secretary",
      icon: UserRoundPlus,
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
  ],
};

export type Role = keyof typeof ROUTES;
