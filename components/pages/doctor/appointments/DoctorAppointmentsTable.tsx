"use client";

import { format, parseISO } from "date-fns";
import { Appointment } from "@/types/appointment.type";
import { ChatThreadButton } from "@/components/chat/ChatThreadButton";
import { AppointmentActionCell } from "@/components/cells/AppointmentActionCell";

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

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-destructive/10 text-destructive",
  PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  COMPLETED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export function DoctorAppointmentsTable({
  appointments,
  doctorUserId,
  emptyMessage = "No appointments",
}: {
  appointments: Appointment[];
  doctorUserId: number;
  emptyMessage?: string;
}) {
  if (appointments.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/20">
            <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Date</th>
            <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Patient</th>
            <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Location</th>
            <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Time</th>
            <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Status</th>
            <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr
              key={appt.appointmentId}
              className="border-b last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td className="py-3.5 px-4 min-w-[130px]">
                <p className="text-sm font-medium text-foreground">{formatApptDate(appt.appointmentDate)}</p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {appt.dayOfWeek ? appt.dayOfWeek.charAt(0) + appt.dayOfWeek.slice(1).toLowerCase() : ""}
                </p>
              </td>
              <td className="py-3.5 px-4 min-w-[150px]">
                <p className="text-sm font-medium text-foreground">{appt.patientName}</p>
                {appt.patientUserId && (
                  <div className="mt-1.5">
                    <ChatThreadButton
                      doctorUserId={doctorUserId}
                      patientUserId={appt.patientUserId}
                      navigateTo="/doctor/messages"
                    />
                  </div>
                )}
              </td>
              <td className="py-3.5 px-4 min-w-[160px]">
                <p className="text-sm text-foreground">{appt.locationName}</p>
              </td>
              <td className="py-3.5 px-4 min-w-[140px]">
                <p className="text-[11px] text-foreground">{formatApptTime(appt.startTime, appt.endTime)}</p>
                <span className="inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {appt.slotDuration} min slot
                </span>
              </td>
              <td className="py-3.5 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[appt.appointmentStatus] ?? "bg-muted text-muted-foreground"}`}
                >
                  {appt.appointmentStatus?.charAt(0) + appt.appointmentStatus?.slice(1).toLowerCase()}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <AppointmentActionCell appointment={appt} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
