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
      url: "/en/customer/doctor/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Set Availability",
      url: "/customer/doctor/availability",
      icon: ChartBarIcon,
    },
    {
      name: "Add Secretary",
      url: "/customer/doctor/secretary",
      icon: FolderIcon,
    },
  ],
  HOSPITAL: [
    {
      name: "Dashboard",
      url: "/en/customer/hospital/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Set Availability",
      url: "/customer/doctor/availability",
      icon: ChartBarIcon,
    },
  ],
  PATIENT: [
    {
      name: "Dashboard",
      url: "/customer/patient/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Get Appointment",
      url: "/customer/patient/appointment",
      icon: FolderIcon,
    },
    {
      name: "Message",
      url: "/customer/patient/message",
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
