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
  MapPin,
  CalendarDays,
  CalendarCheck,
  Users,
  Building2,
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
      name: "Appointments",
      url: "/doctor/appointments",
      icon: CalendarDays,
    },
    {
      name: "Availability",
      url: "/doctor/availability",
      icon: Clock,
    },
    {
      name: "Locations",
      url: "/doctor/locations",
      icon: MapPin,
    },
    {
      name: "Messages",
      url: "/doctor/messages",
      icon: MessageSquare,
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
      name: "Hospitals",
      url: "/hospital/hospitals",
      icon: Building2,
    },
    {
      name: "Imported Doctors",
      url: "/hospital/doctors",
      icon: Stethoscope,
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
      name: "Appointments",
      url: "/patient/appointments",
      icon: CalendarCheck,
    },
    {
      name: "Beneficiaries",
      url: "/patient/beneficiaries",
      icon: Users,
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
