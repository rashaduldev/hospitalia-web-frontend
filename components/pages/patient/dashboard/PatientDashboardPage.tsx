"use client";

import { useSafeQuery } from "@/lib/safeQuery";
import {
  getPatientUpcomingAppointments,
  getPatientPastAppointments,
} from "@/actions/patient/appointments.actions";
import { getBeneficiaries } from "@/actions/patient/beneficiary.actions";
import { Typography } from "@/components/ui/Typography";
import {
  CalendarCheck,
  CalendarClock,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Appointment } from "@/types/appointment.type";
import Link from "next/link";
import { useCurrentLocale } from "@/locales/client";

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-destructive/10 text-destructive",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const formatApptDate = (d: string | number[]) => {
  try {
    if (Array.isArray(d)) {
      const [year, month, day] = d as number[];
      return format(new Date(year, month - 1, day), "d MMMM yyyy");
    }
    return format(parseISO(d as string), "d MMMM yyyy");
  } catch {
    return String(d);
  }
};

const formatApptTime = (start: string, end: string) => {
  try {
    const parseT = (t: string) => {
      const [h, m] = t.replace("Z", "").split(":");
      return format(new Date(2000, 0, 1, Number(h), Number(m)), "h:mm a");
    };
    return `${parseT(start)} – ${parseT(end)}`;
  } catch {
    return `${start?.slice(0, 5) ?? ""} – ${end?.slice(0, 5) ?? ""}`;
  }
};

export default function PatientDashboardPage({
  lang,
  patientUserId,
}: {
  lang: string;
  patientUserId: number | null;
}) {
  const locale = useCurrentLocale();

  const { data: upcomingData } = useSafeQuery({
    queryKey: ["patientAppointments", patientUserId, 0],
    queryFn: () =>
      getPatientUpcomingAppointments({ lang, patientUserId: patientUserId!, page: 0, size: 3 }),
    enabled: !!patientUserId,
  });

  const { data: pastData } = useSafeQuery({
    queryKey: ["patientPastAppointments", patientUserId, 0],
    queryFn: () =>
      getPatientPastAppointments({ lang, patientUserId: patientUserId!, page: 0, size: 1 }),
    enabled: !!patientUserId,
  });

  const { data: benefData } = useSafeQuery({
    queryKey: ["beneficiaries"],
    queryFn: () => getBeneficiaries({ lang, pageNo: 0, pageSize: 1 }),
  });

  const upcomingList: Appointment[] = upcomingData?.payload?.content ?? [];
  const upcomingTotal: number = upcomingData?.payload?.totalElements ?? 0;
  const pastTotal: number = pastData?.payload?.totalElements ?? 0;
  const benefTotal: number = benefData?.payload?.totalElements ?? 0;

  const nextAppointment = upcomingList[0] ?? null;
  const previewList = upcomingList.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <Typography size="2xl" weight="bold" color="foreground" as="h1">
        Dashboard
      </Typography>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg shrink-0">
            <CalendarCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{upcomingTotal}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Upcoming Appointments</p>
          </div>
        </div>

        <div className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-secondary/10 rounded-lg shrink-0">
            <CalendarClock className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{pastTotal}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Past Appointments</p>
          </div>
        </div>

        <div className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-lg shrink-0">
            <Users className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{benefTotal}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Beneficiaries</p>
          </div>
        </div>
      </div>

      {/* Next appointment highlight */}
      {nextAppointment && (
        <div className="border border-border rounded-xl bg-card shadow-sm p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Next Appointment
              </span>
            </div>
            <Link
              href={`/${locale}/patient/appointments`}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Doctor</p>
              <p className="font-medium text-foreground truncate">{nextAppointment.doctorName}</p>
              {nextAppointment.designation && (
                <p className="text-xs text-muted-foreground">{nextAppointment.designation}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">
                {formatApptDate(nextAppointment.appointmentDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium text-foreground">
                {formatApptTime(nextAppointment.startTime, nextAppointment.endTime)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[nextAppointment.appointmentStatus] ?? "bg-muted text-muted-foreground"}`}
              >
                {nextAppointment.appointmentStatus?.charAt(0) +
                  nextAppointment.appointmentStatus?.slice(1).toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming appointments preview */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <CalendarCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-none">
                Upcoming Appointments
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Your next scheduled visits
              </p>
            </div>
          </div>
          <Link
            href={`/${locale}/patient/appointments`}
            className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Date</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Doctor</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Location</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Time</th>
                <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {previewList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                    No upcoming appointments
                  </td>
                </tr>
              ) : (
                previewList.map((appt) => (
                  <tr key={appt.appointmentId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <p className="text-sm font-medium text-foreground">{formatApptDate(appt.appointmentDate)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                        {appt.dayOfWeek ? appt.dayOfWeek.charAt(0) + appt.dayOfWeek.slice(1).toLowerCase() : ""}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 min-w-[150px]">
                      <p className="text-sm font-medium text-foreground">{appt.doctorName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{appt.designation}</p>
                    </td>
                    <td className="py-3.5 px-4 min-w-[160px] max-w-[220px]">
                      <p className="text-sm text-foreground whitespace-normal leading-snug">{appt.locationName}</p>
                    </td>
                    <td className="py-3.5 px-4 min-w-[140px]">
                      <p className="text-[11px] text-foreground">{formatApptTime(appt.startTime, appt.endTime)}</p>
                      <span className="inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{appt.slotDuration} min slot</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[appt.appointmentStatus] ?? "bg-muted text-muted-foreground"}`}>
                        {appt.appointmentStatus?.charAt(0) + appt.appointmentStatus?.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {upcomingTotal > 3 && (
          <div className="px-6 py-4 border-t flex justify-end">
            <Link
              href={`/${locale}/patient/appointments`}
              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              See all {upcomingTotal} upcoming appointments <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/${locale}/patient/get-appointment`}
          className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-secondary/10 rounded-lg shrink-0 group-hover:bg-secondary/20 transition-colors">
            <CalendarCheck className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Book an Appointment</p>
            <p className="text-xs text-muted-foreground mt-0.5">Find a doctor and schedule a visit</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
        </Link>

        <Link
          href={`/${locale}/patient/beneficiaries`}
          className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group"
        >
          <div className="p-3 bg-primary/10 rounded-lg shrink-0 group-hover:bg-primary/20 transition-colors">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Manage Beneficiaries</p>
            <p className="text-xs text-muted-foreground mt-0.5">Add or remove family members</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
        </Link>
      </div>
    </div>
  );
}
