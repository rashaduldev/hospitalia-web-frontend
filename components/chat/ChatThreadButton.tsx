"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Loader2 } from "lucide-react";
import { useCurrentLocale } from "@/locales/client";
import { getOrCreateThread } from "@/actions/chat/chat.actions";

export function ChatThreadButton({
  doctorUserId,
  patientUserId,
  navigateTo,
}: {
  doctorUserId: number;
  patientUserId: number;
  navigateTo: "/patient/messages" | "/doctor/messages";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useCurrentLocale();

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await getOrCreateThread({ doctorUserId, patientUserId, lang: locale });
      if (res.payload?.id) {
        router.push(`${navigateTo}?thread=${res.payload.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border border-primary/40 text-primary hover:bg-primary/5 hover:border-primary transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <MessageSquare className="h-3.5 w-3.5" />
      )}
      Chat
    </button>
  );
}
