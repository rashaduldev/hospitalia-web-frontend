"use client";

import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import { useSafeQuery } from "@/lib/safeQuery";
import { getDoctorInfoByDoctorId } from "@/actions/doctor/doctordata";
import { useCurrentLocale } from "@/locales/client";
import ChatPage from "@/components/chat/ChatPage";
import { MapPin, AlertCircle } from "lucide-react";

export default function SecretaryMessagesPage() {
  const ctx = useSecretaryLocation();
  const lang = useCurrentLocale();

  const selectedLocationId = ctx?.selectedLocationId ?? null;
  const doctorId = ctx?.doctorId ?? 0;

  const { data: doctorData, isLoading } = useSafeQuery({
    queryKey: ["doctorProfile", doctorId, lang],
    queryFn: () => getDoctorInfoByDoctorId({ lang, doctorId }),
    enabled: !!doctorId,
  });

  const doctorUserId: number =
    (doctorData?.payload as { userId?: number } | null)?.userId ?? 0;

  if (!selectedLocationId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <MapPin className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">No location selected</p>
        <p className="text-xs text-muted-foreground">Choose a location above to access messages.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!doctorUserId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertCircle className="w-10 h-10 text-destructive/60" />
        <p className="text-sm font-semibold text-foreground">Doctor information unavailable</p>
        <p className="text-xs text-muted-foreground">Could not resolve the doctor for this location.</p>
      </div>
    );
  }

  return (
    <ChatPage
      key={doctorUserId}
      myId={String(doctorUserId)}
      myNumericId={doctorUserId}
      myRole="DOCTOR"
    />
  );
}
