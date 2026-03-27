"use client";

import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import { DoctorIdProvider } from "@/providers/DoctorIdProvider";
import SecretaryScheduleForm from "@/components/pages/secretary/SecretaryScheduleForm";
import ScheduleManager from "@/components/pages/doctor/availability/ScheduleManager";
import ConfirmSlotsTable from "@/components/pages/doctor/availability/ConfirmSlotsTable";
import { MapPin, AlertCircle } from "lucide-react";

export default function SecretarySchedulePage({
  timeSlots,
  lang,
}: {
  timeSlots: string[];
  lang: string;
}) {
  const ctx = useSecretaryLocation();
  const { doctorUserId = 0, doctorId = 0, selectedLocationId = null } = ctx ?? {};

  if (!selectedLocationId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <MapPin className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">Select a location</p>
        <p className="text-xs text-muted-foreground">Choose a location above to manage the schedule.</p>
      </div>
    );
  }

  if (!doctorId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="w-10 h-10 text-destructive/60" />
        <p className="text-sm font-semibold text-foreground">Doctor information unavailable</p>
        <p className="text-xs text-muted-foreground">Could not resolve the doctor for this location. Please try again.</p>
      </div>
    );
  }

  return (
    <DoctorIdProvider doctorId={doctorId}>
      <div className="space-y-6 p-4 sm:p-6">
        <SecretaryScheduleForm
          timeSlots={timeSlots}
          lang={lang}
          doctorUserId={doctorUserId}
          doctorEntityId={doctorId}
          preselectedLocationId={selectedLocationId}
        />
        <ScheduleManager lang={lang} doctorUserId={doctorUserId} />
        <ConfirmSlotsTable
          lang={lang}
          doctorUserId={doctorUserId}
          filterLocationId={selectedLocationId}
        />
      </div>
    </DoctorIdProvider>
  );
}
