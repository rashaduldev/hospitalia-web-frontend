"use client";

import { useSecretaryLocation } from "@/providers/SecretaryLocationProvider";
import ChatPage from "@/components/chat/ChatPage";
import { MapPin } from "lucide-react";

export default function SecretaryMessagesPage() {
  const ctx = useSecretaryLocation();
  const doctorUserId = ctx?.doctorUserId ?? 0;

  if (!doctorUserId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <MapPin className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm font-semibold text-foreground">No location selected</p>
        <p className="text-xs text-muted-foreground">Choose a location above to access messages.</p>
      </div>
    );
  }

  return (
    <ChatPage
      myId={String(doctorUserId)}
      myNumericId={doctorUserId}
      myRole="DOCTOR"
    />
  );
}
