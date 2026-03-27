"use client";

import { useEffect, useState } from "react";
import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import { DoctorIdProvider } from "@/providers/DoctorIdProvider";
import SecretaryWeeklyScheduleOverview from "./SecretaryWeeklyScheduleOverview";
import SecretaryScheduleForm from "./SecretaryScheduleForm";
import ScheduleManager from "@/components/pages/doctor/availability/ScheduleManager";
import ConfirmSlotsTable from "@/components/pages/doctor/availability/ConfirmSlotsTable";
import { useLocations } from "@/hooks/useLocations";
import { Location } from "@/types/doctor.location.type";
import { MapPin, AlertCircle } from "lucide-react";

export default function SecretarySchedulePage({ lang }: { lang: string }) {
  const ctx = useSecretaryLocation();
  const { doctorUserId = 0, doctorId = 0, selectedLocationId = null } = ctx ?? {};

  const [preselectedDay, setPreselectedDay] = useState<string | null>(null);

  // Reset form when the secretary switches location
  useEffect(() => {
    setPreselectedDay(null);
  }, [selectedLocationId]);

  const { locations } = useLocations({ lang, doctorId: doctorId ?? 0 });
  const selectedLocation = (locations as Location[]).find(
    (l) => Number(l.locationId) === selectedLocationId,
  );
  const locationName = selectedLocation?.locationName;

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
        <SecretaryWeeklyScheduleOverview
          doctorEntityId={doctorId}
          lang={lang}
          locationId={selectedLocationId}
          locationName={locationName}
          onAddSchedule={(day) => setPreselectedDay(day)}
        />
        {preselectedDay !== null && (
          <SecretaryScheduleForm
            doctorEntityId={doctorId}
            lang={lang}
            locationId={selectedLocationId}
            locationName={locationName}
            preselectedDay={preselectedDay}
            onClose={() => setPreselectedDay(null)}
          />
        )}
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
