"use client";

import { useCurrentLocale } from "@/locales/client";
import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import { OfflineBookingPage } from "@/components/pages/offline-booking/OfflineBookingPage";
import { MapPin } from "lucide-react";

export default function SecretaryOfflineBookingRoute() {
  const locale = useCurrentLocale();
  const ctx = useSecretaryLocation();
  const {
    doctorId = 0,
    secretaryId = 0,
    selectedLocationId = null,
    doctorName = "",
  } = ctx ?? {};

  if (!selectedLocationId || !doctorId || !secretaryId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <MapPin className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">No location selected</p>
        <p className="text-xs text-muted-foreground">
          Go back to appointments and select a location first.
        </p>
      </div>
    );
  }

  return (
    <OfflineBookingPage
      doctorId={doctorId}
      bookedByUserId={secretaryId}
      bookingSource="SECRETARY"
      doctorName={doctorName}
      lang={locale}
      defaultLocationId={selectedLocationId}
      backHref={`/${locale}/secretary/appointments`}
    />
  );
}
