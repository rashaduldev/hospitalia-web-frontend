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
  Users2,
  Building2,
  type LucideIcon,
} from "lucide-react";

export const REQUEST_TIMEOUT_MS = 10_000;

export type RouteItem = {
  name: string;
  url: string;
  icon: LucideIcon;
  /** Permission required to show this item (secretary only). Absent = always shown. */
  permission?: string;
};

export const ROUTES: Record<string, RouteItem[]> = {
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
      name: "Book Offline",
      url: "/doctor/book-offline",
      icon: CalendarPlus,
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
    {
      name: "Secretaries",
      url: "/doctor/secretaries",
      icon: Users2,
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
    {
      name: "Roles & Permissions",
      url: "/admin/roles",
      icon: ShieldCheck,
    },
    {
      name: "Admins",
      url: "/admin/admins",
      icon: ShieldCheck,
    },
    {
      name: "Doctors",
      url: "/admin/doctors",
      icon: Stethoscope,
    },
    {
      name: "Patients",
      url: "/admin/patients",
      icon: UserRound,
    },
    {
      name: "Secretaries",
      url: "/admin/secretaries",
      icon: Users2,
    },
    {
      name: "Hospitals",
      url: "/admin/hospitals",
      icon: Building2,
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
  SECRETARY: [
    {
      name: "Dashboard",
      url: "/secretary/dashboard",
      icon: LayoutDashboardIcon,
      permission: "SECRETARY_DASHBOARD_READ",
    },
    {
      name: "Appointments",
      url: "/secretary/appointments",
      icon: CalendarDays,
      permission: "SECRETARY_APPOINTMENT_READ",
    },
    {
      name: "Book Offline",
      url: "/secretary/book-offline",
      icon: CalendarPlus,
      permission: "SECRETARY_APPOINTMENT_UPDATE",
    },
    {
      name: "Availability",
      url: "/secretary/schedule",
      icon: Clock,
      permission: "SECRETARY_SCHEDULE_MANAGE",
    },
    {
      name: "Patients",
      url: "/secretary/patients",
      icon: Users,
      permission: "SECRETARY_PATIENT_READ",
    },
    {
      name: "Messages",
      url: "/secretary/messages",
      icon: MessageSquare,
      permission: "SECRETARY_MESSAGES_MANAGE",
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

export type Role = "DOCTOR" | "HOSPITAL" | "ADMIN" | "PATIENT" | "SECRETARY" | "COMMON";
