import {
  LayoutDashboardIcon,
  ChartBarIcon,
  Settings2Icon,
  UserRoundPlus,
  Clock,
  CalendarPlus,
  MessageSquare,
} from "lucide-react";

export const REQUEST_TIMEOUT_MS = 10_000;

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
      url: "/patient/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Get Appointment",
      url: "/patient/get-appointment",
      icon: CalendarPlus,
    },
    {
      name: "Messages",
      url: "/patient/messages",
      icon: MessageSquare,
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
