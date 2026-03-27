"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarClock, MapPin, History } from "lucide-react";
import { format } from "date-fns";
import { useCurrentLocale } from "@/locales/client";
import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import { getSecretaryAppointments, getSecretaryAppointmentsByDate, getSecretaryPastAppointments } from "@/actions/secretary/secretaryAppointments.actions";
import { DoctorAppointmentsTable } from "@/components/pages/doctor/appointments/DoctorAppointmentsTable";
import { Appointment } from "@/types/appointment.type";

export default function SecretaryAppointmentsPage() {
  const locale = useCurrentLocale();
  const ctx = useSecretaryLocation();
  const { doctorId = 0, doctorUserId = 0, selectedLocationId = null } = ctx ?? {};
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: todayData, isLoading: todayLoading } = useQuery({
    queryKey: ["secretary-appointments-today", doctorId, selectedLocationId, today],
    queryFn: () =>
      getSecretaryAppointmentsByDate({ doctorId, locationId: selectedLocationId!, date: today, lang: locale }),
    enabled: !!doctorId && !!selectedLocationId,
  });

  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ["secretary-appointments-all", doctorId, selectedLocationId],
    queryFn: () =>
      getSecretaryAppointments({ doctorId, locationId: selectedLocationId!, lang: locale }),
    enabled: !!doctorId && !!selectedLocationId,
  });

  const { data: pastData, isLoading: pastLoading } = useQuery({
    queryKey: ["secretary-appointments-past", doctorId, selectedLocationId],
    queryFn: () =>
      getSecretaryPastAppointments({ doctorId, locationId: selectedLocationId!, lang: locale }),
    enabled: !!doctorId && !!selectedLocationId,
  });

  const todayList: Appointment[] = todayData?.payload?.content ?? [];
  const allList: Appointment[] = allData?.payload?.content ?? [];
  const pastList: Appointment[] = pastData?.payload?.content ?? [];

  const upcomingList = allList.filter((a) => {
    const d = a.appointmentDate;
    const dateStr = Array.isArray(d)
      ? `${d[0]}-${String(d[1]).padStart(2, "0")}-${String(d[2]).padStart(2, "0")}`
      : String(d).slice(0, 10);
    return dateStr >= today;
  });

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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Today */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
            <CalendarDays className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">Today&apos;s Appointments</h2>
            <p className="text-xs text-muted-foreground mt-1">Scheduled for today at this location</p>
          </div>
        </div>
        {todayLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
        ) : (
          <DoctorAppointmentsTable
            appointments={todayList}
            doctorUserId={doctorUserId}
            emptyMessage="No appointments today at this location."
          />
        )}
      </div>

      {/* Upcoming */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <CalendarClock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">Upcoming Appointments</h2>
            <p className="text-xs text-muted-foreground mt-1">All future appointments at this location</p>
          </div>
        </div>
        {allLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
        ) : (
          <DoctorAppointmentsTable
            appointments={upcomingList}
            doctorUserId={doctorUserId}
            emptyMessage="No upcoming appointments at this location."
          />
        )}
      </div>

      {/* Past */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-muted/50 rounded-lg shrink-0">
            <History className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">Past Appointments</h2>
            <p className="text-xs text-muted-foreground mt-1">Previously completed or cancelled appointments</p>
          </div>
        </div>
        {pastLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
        ) : (
          <DoctorAppointmentsTable
            appointments={pastList}
            doctorUserId={doctorUserId}
            emptyMessage="No past appointments at this location."
          />
        )}
      </div>
    </div>
  );
}
