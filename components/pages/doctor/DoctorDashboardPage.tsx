import { getCurrentUser } from "@/actions/user.actions";
import {
  getTodaysAppointments,
  getUpcomingAppointments,
} from "@/actions/doctor/appointment";
import { getDoctorLocations } from "@/actions/doctor/location";
import { getDoctorInfobyUserid } from "@/actions/doctor/doctordata";
import { getCurrentLocale, getI18n } from "@/locales/server";
import { appointmentColumns } from "@/components/common/DataTableColumns";
import { DataTableWithExport } from "@/components/data-table";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import {
  CalendarDays,
  CalendarClock,
  MapPin,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Appointment } from "@/types/appointment.type";

function formatTime(t: string): string {
  if (!t) return "";
  const [h, m] = t.replace("Z", "").split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${m} ${ampm}`;
}

function formatAppointmentDate(d: Appointment["appointmentDate"]): string {
  if (Array.isArray(d)) {
    const [y, m, day] = d;
    return new Date(y, m - 1, day).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  if (typeof d === "string") {
    return new Date(d).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return String(d);
}

export default async function DoctorDashboardPage() {
  const t = await getI18n();
  const lang = await getCurrentLocale();
  const currentUser = await getCurrentUser({ lang });
  const doctorUserId = currentUser?.id;

  const doctorInfoRes = await getDoctorInfobyUserid({ lang, SignleDoctorUserId: doctorUserId });
  const doctorId = doctorInfoRes?.payload?.id ?? doctorInfoRes?.payload?.doctorId;

  const [todayRes, upcomingRes, locationsRes] = await Promise.all([
    getTodaysAppointments({
      doctorId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "creationDate",
      ascOrDesc: "desc",
      lang,
    }),
    getUpcomingAppointments({
      doctorId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "appointmentDate",
      ascOrDesc: "asc",
      lang,
    }),
    doctorId ? getDoctorLocations({ doctorId, lang }) : null,
  ]);

  const todayList = todayRes?.payload?.content || [];
  const upcomingList = upcomingRes?.payload?.content || [];
  const locationCount = locationsRes?.payload?.length ?? 0;

  const nextAppointment = upcomingList[0] ?? null;
  const todayPreview = todayList.slice(0, 5);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-secondary/10 rounded-lg shrink-0">
            <CalendarDays className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{todayList.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("appoinment.today")}
            </p>
          </div>
        </div>

        <div className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg shrink-0">
            <CalendarClock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{upcomingList.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("appoinment.upcoming")}
            </p>
          </div>
        </div>

        <div className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-lg shrink-0">
            <MapPin className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{locationCount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Locations</p>
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
              href={`/${lang}/doctor/appointments`}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="font-medium text-foreground truncate">
                {nextAppointment.patientName}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">
                {formatAppointmentDate(nextAppointment.appointmentDate)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium text-foreground">
                {formatTime(nextAppointment.startTime)} – {formatTime(nextAppointment.endTime)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium text-foreground truncate">
                {nextAppointment.locationName || "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Today's appointments preview */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
              <CalendarDays className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-none">
                {t("appoinment.today")}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t("appoinment.todaydescription")}
              </p>
            </div>
          </div>
          {todayList.length > 5 && (
            <Link
              href={`/${lang}/doctor/appointments`}
              className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
            >
              View all ({todayList.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        <div className="p-6">
          <Suspense fallback={<TableSkeleton columnCount={5} />}>
            <DataTableWithExport
              columns={appointmentColumns}
              data={todayPreview}
              filename="todays-appointments"
              emptyMessage={t("appoinment.no_today")}
            />
          </Suspense>
          {todayList.length > 5 && (
            <div className="mt-4 flex justify-end">
              <Link
                href={`/${lang}/doctor/appointments`}
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                See all {todayList.length} appointments today{" "}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
