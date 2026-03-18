import {
  LayoutDashboardIcon,
  ChartBarIcon,
  Settings2Icon,
  Clock,
  CalendarPlus,
  MessageSquare,
  UserRound,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export const REQUEST_TIMEOUT_MS = 10_000;

export const ROUTES = {
  DOCTOR: [
    {
      name: "Dashboard",
      url: "/doctor/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Set Availability",
      url: "/doctor/availability",
      icon: Clock,
    },
    {
      name: "My Profile",
      url: "/doctor/profile",
      icon: UserRound,
    },
  ],
  HOSPITAL: [
    {
      name: "Dashboard",
      url: "/hospital/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Set Availability",
      url: "/hospital/availability",
      icon: ChartBarIcon,
    },
  ],
  ADMIN: [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Specialities",
      url: "/admin/specialities",
      icon: Stethoscope,
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
