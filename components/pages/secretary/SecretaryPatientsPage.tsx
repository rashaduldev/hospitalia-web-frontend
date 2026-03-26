"use client";

import { useQuery } from "@tanstack/react-query";
import { useCurrentLocale } from "@/locales/client";
import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import { getSecretaryAppointments } from "@/actions/secretary/secretaryAppointments.actions";
import { ChatThreadButton } from "@/components/chat/ChatThreadButton";
import { Appointment } from "@/types/appointment.type";
import { Users, MapPin } from "lucide-react";

interface PatientRow {
  patientUserId: number;
  patientName: string;
  appointmentCount: number;
}

function derivePatients(appointments: Appointment[]): PatientRow[] {
  const map = new Map<number, PatientRow>();
  for (const appt of appointments) {
    if (!appt.patientUserId) continue;
    const existing = map.get(appt.patientUserId);
    if (existing) {
      existing.appointmentCount += 1;
    } else {
      map.set(appt.patientUserId, {
        patientUserId: appt.patientUserId,
        patientName: appt.patientName,
        appointmentCount: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.patientName.localeCompare(b.patientName));
}

export default function SecretaryPatientsPage() {
  const locale = useCurrentLocale();
  const ctx = useSecretaryLocation();
  const { doctorId = 0, doctorUserId = 0, selectedLocationId = null } = ctx ?? {};

  const { data, isLoading } = useQuery({
    queryKey: ["secretary-appointments-all", doctorId, selectedLocationId],
    queryFn: () =>
      getSecretaryAppointments({ doctorId, locationId: selectedLocationId!, lang: locale }),
    enabled: !!doctorId && !!selectedLocationId,
  });

  const allAppointments: Appointment[] = data?.payload?.content ?? [];
  const patients = derivePatients(allAppointments);

  if (!selectedLocationId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <MapPin className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">Select a location</p>
        <p className="text-xs text-muted-foreground">Choose a location above to view patients.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">Patients</h2>
            <p className="text-xs text-muted-foreground mt-1">
              All patients with appointments at this location
            </p>
          </div>
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Loading...</p>
        ) : patients.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No patients found at this location.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">
                    Patient
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">
                    Appointments
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-foreground text-xs uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.patientUserId}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <p className="text-sm font-medium text-foreground">{patient.patientName}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {patient.appointmentCount}{" "}
                        {patient.appointmentCount === 1 ? "appointment" : "appointments"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <ChatThreadButton
                        doctorUserId={doctorUserId}
                        patientUserId={patient.patientUserId}
                        navigateTo="/secretary/messages"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
