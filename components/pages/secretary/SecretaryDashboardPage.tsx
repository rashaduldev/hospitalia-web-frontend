"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarClock, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useCurrentLocale } from "@/locales/client";
import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import { getSecretaryAppointments, getSecretaryAppointmentsByDate } from "@/actions/secretary/secretaryAppointments.actions";
import { DoctorAppointmentsTable } from "@/components/pages/doctor/appointments/DoctorAppointmentsTable";
import { Appointment } from "@/types/appointment.type";

function formatApptDate(d: Appointment["appointmentDate"]): string {
  if (Array.isArray(d)) {
    const [y, m, day] = d as number[];
    return new Date(y, m - 1, day).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  }
  if (typeof d === "string") {
    return new Date(d).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric", year: "numeric",
    });
  }
  return String(d);
}

function formatTime(t: string): string {
  if (!t) return "";
  const [h, m] = t.replace("Z", "").split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

export default function SecretaryDashboardPage() {
  const locale = useCurrentLocale();
  const { doctorId, doctorUserId, selectedLocationId, locations } = useSecretaryLocation();
  const today = format(new Date(), "yyyy-MM-dd");
  const lang = locale;

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);

  const { data: todayData } = useQuery({
    queryKey: ["secretary-appointments-today", doctorId, selectedLocationId, today],
    queryFn: () =>
      getSecretaryAppointmentsByDate({ doctorId, locationId: selectedLocationId!, date: today, lang }),
    enabled: !!doctorId && !!selectedLocationId,
  });

  const { data: allData } = useQuery({
    queryKey: ["secretary-appointments-all", doctorId, selectedLocationId],
    queryFn: () => getSecretaryAppointments({ doctorId, locationId: selectedLocationId!, lang }),
    enabled: !!doctorId && !!selectedLocationId,
  });

  const todayList: Appointment[] = todayData?.payload?.content ?? [];
  const allList: Appointment[] = allData?.payload?.content ?? [];

  const upcomingList = allList.filter((a) => {
    const d = a.appointmentDate;
    const dateStr = Array.isArray(d)
      ? `${d[0]}-${String(d[1]).padStart(2, "0")}-${String(d[2]).padStart(2, "0")}`
      : String(d).slice(0, 10);
    return dateStr >= today;
  });

  const nextAppointment = upcomingList[0] ?? null;

  if (!selectedLocationId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <MapPin className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">Select a location</p>
        <p className="text-xs text-muted-foreground">Choose a location above to view appointments.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-secondary/10 rounded-lg shrink-0">
            <CalendarDays className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{todayList.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Today&apos;s Appointments</p>
          </div>
        </div>
        <div className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg shrink-0">
            <CalendarClock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{upcomingList.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Upcoming Appointments</p>
          </div>
        </div>
        <div className="border border-border rounded-xl bg-card shadow-sm p-5 flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-lg shrink-0">
            <MapPin className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground truncate">
              {selectedLocation?.locationName ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Active Location</p>
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
              <span className="text-sm font-semibold text-foreground">Next Appointment</span>
            </div>
            <Link
              href={`/${locale}/secretary/appointments`}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="font-medium text-foreground truncate">{nextAppointment.patientName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">{formatApptDate(nextAppointment.appointmentDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="font-medium text-foreground">
                {formatTime(nextAppointment.startTime)} – {formatTime(nextAppointment.endTime)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium text-foreground truncate">{nextAppointment.locationName ?? "—"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Today's appointments */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
              <CalendarDays className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-none">Today&apos;s Appointments</h2>
              <p className="text-xs text-muted-foreground mt-1">Scheduled for today at this location</p>
            </div>
          </div>
          {todayList.length > 5 && (
            <Link
              href={`/${locale}/secretary/appointments`}
              className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
            >
              View all ({todayList.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        <DoctorAppointmentsTable
          appointments={todayList.slice(0, 5)}
          doctorUserId={doctorUserId}
          emptyMessage="No appointments today at this location."
        />
      </div>
    </div>
  );
}
