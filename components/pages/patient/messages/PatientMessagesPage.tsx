"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSafeQuery } from "@/lib/safeQuery";
import { useCurrentLocale } from "@/locales/client";
import { getCurrentUser } from "@/actions/user.actions";
import { getPatientUpcomingAppointments } from "@/actions/patient/appointments.actions";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/input";
import { CircleUserRound, Send, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Appointment } from "@/types/appointment.type";
import AppButton from "@/components/common/AppButton";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "me" | "other";
  text: string;
  senderName?: string;
  timestamp: Date;
}

const formatDate = (dateStr: string | number[]) => {
  try {
    if (Array.isArray(dateStr)) {
      const [year, month, day] = dateStr;
      return format(new Date(year, month - 1, day), "d MMMM yyyy");
    }
    return format(parseISO(dateStr), "d MMMM yyyy");
  } catch {
    return String(dateStr);
  }
};

const formatTime = (start: string, end: string) =>
  `${start?.slice(0, 5) ?? ""} - ${end?.slice(0, 5) ?? ""}`;

export default function PatientMessagesPage({ lang }: { lang: string }) {
  const locale = useCurrentLocale();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  // ── Current user ──────────────────────────────────────────────────────────
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser", locale],
    queryFn: () => getCurrentUser({ lang: locale }),
  });

  // ── Latest appointment ────────────────────────────────────────────────────
  const { data: apptData } = useSafeQuery({
    queryKey: ["patientAppointments", currentUser?.id, 0],
    queryFn: () =>
      getPatientUpcomingAppointments({
        lang,
        patientUserId: currentUser!.id,
        page: 0,
        size: 1,
      }),
    enabled: !!currentUser?.id,
  });

  const appointment: Appointment | null =
    apptData?.payload?.content?.[0] ?? null;

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = messageInput.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "me",
        text,
        timestamp: new Date(),
      },
    ]);
    setMessageInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* ── Appointment Summary ───────────────────────────────────────────── */}
      {appointment && (
        <section className="bg-card rounded-lg border p-8">
          <Typography size="xl" weight="bold" color="foreground" as="h2" className="mb-6">
            Appointment Summary
          </Typography>

          <div className="space-y-4 text-sm">
            <SummaryRow label="Doctor" value={appointment.doctorName} />
            <SummaryRow label="Designation" value={appointment.designation} />
            <SummaryRow label="Location" value={appointment.locationName} />
            <SummaryRow
              label="Date"
              value={formatDate(appointment.appointmentDate)}
            />
            <SummaryRow
              label="Time"
              value={formatTime(appointment.startTime, appointment.endTime)}
            />
            <SummaryRow
              label="Price"
              value={appointment.fees ? `${appointment.fees} CFA` : "—"}
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            {!cancelConfirm ? (
              <>
                <AppButton
                  variant="destructive"
                  onClick={() => setCancelConfirm(true)}
                  className="rounded-full px-6"
                >
                  Cancel Appointment
                </AppButton>
                <AppButton
                  variant="default"
                  className="rounded-full px-6"
                  onClick={() => {
                    toast.info(
                      "Reschedule flow coming soon. Please cancel and rebook."
                    );
                  }}
                >
                  Cancel and Reschedule Appointment
                </AppButton>
              </>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border bg-destructive/5 px-4 py-3 text-sm">
                <span>Are you sure you want to cancel this appointment?</span>
                <button
                  type="button"
                  className="font-semibold text-destructive hover:underline"
                  onClick={() => {
                    toast.success("Appointment cancelled");
                    setCancelConfirm(false);
                  }}
                >
                  Yes, cancel
                </button>
                <button
                  type="button"
                  className="font-semibold text-muted-foreground hover:underline"
                  onClick={() => setCancelConfirm(false)}
                >
                  No, keep it
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Message to the Provider ───────────────────────────────────────── */}
      <section>
        <Typography size="2xl" weight="bold" color="secondary" as="h2" className="mb-4">
          Message to the Provider
        </Typography>

        {/* Chat messages */}
        <div
          ref={scrollRef}
          className="bg-card rounded-lg border p-4 h-80 overflow-y-auto space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No messages yet. Start the conversation below.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === "me" ? "flex-row-reverse" : ""
                }`}
              >
                {msg.sender === "other" && (
                  <CircleUserRound className="h-8 w-8 text-muted-foreground flex-shrink-0 mt-1" />
                )}
                <div
                  className={`flex flex-col gap-1 max-w-xs ${
                    msg.sender === "me" ? "items-end" : "items-start"
                  }`}
                >
                  {msg.sender === "other" && msg.senderName && (
                    <span className="text-xs font-medium text-foreground">
                      {msg.senderName}
                    </span>
                  )}
                  {msg.sender === "me" && (
                    <span className="text-xs text-muted-foreground">You</span>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.sender === "me"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-secondary text-white rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message input */}
        <div className="mt-3 flex gap-3">
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <AppButton
            onClick={handleSend}
            disabled={!messageInput.trim()}
            className="gap-2"
          >
            Send
            <Send className="h-4 w-4" />
          </AppButton>
        </div>
      </section>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <p>
      <span className="font-semibold text-primary">{label} –</span>{" "}
      <span className="text-foreground">{value || "—"}</span>
    </p>
  );
}
