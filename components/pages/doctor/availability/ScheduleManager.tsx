/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import { format, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  createDoctorUnAvailability,
  getDoctorUnAvailability,
  deleteAvailabilitySlot,
} from "@/actions/doctor/unavailability";
import { getAppointmentsByDate, cancelAppointment } from "@/actions/doctor/appointment";
import { useI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import { UnavailableDate } from "@/types/doctor.unavailable";
import { Appointment } from "@/types/appointment.type";
import { StatusMessage } from "./StatusMessage";
import { AlertTriangle, CalendarX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AppButton from "@/components/common/AppButton";

export default function ScheduleManager({
  lang,
  doctorUserId,
}: {
  lang: string;
  doctorUserId: number;
}) {
  const t = useI18n();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"set-unavailable" | "make-available" | null>(null);
  const [appointmentsOnDate, setAppointmentsOnDate] = useState<Appointment[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const { data: existingDatesResponse, isLoading: isFetching } = useSafeQuery({
    queryKey: ["doctor-availability", doctorUserId],
    queryFn: () => getDoctorUnAvailability({ lang, doctorUserId }),
    enabled: !!doctorUserId,
  });

  const existingDates: UnavailableDate[] = existingDatesResponse?.payload?.content || [];

  const existingSlot = useMemo(() => {
    if (!selectedDate) return null;
    return existingDates.find(
      (item) =>
        format(new Date(item.unavailableDate), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd"),
    );
  }, [selectedDate, existingDates]);

  const isDateInDatabase = !!existingSlot;

  const createMutation = useSafeMutation({
    mutationFn: (date: string) =>
      createDoctorUnAvailability({ lang, doctorUserId, unavailableDate: date }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-availability"] }),
  });

  const deleteMutation = useSafeMutation({
    mutationFn: (id: number) => deleteAvailabilitySlot({ id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-availability"] }),
  });

  const handleButtonClick = async () => {
    if (!selectedDate) return;

    if (isDateInDatabase) {
      setPendingAction("make-available");
      setAppointmentsOnDate([]);
      setDialogOpen(true);
    } else {
      setIsChecking(true);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const appointments = await getAppointmentsByDate({ doctorUserId, date: dateStr, lang });
        setAppointmentsOnDate(appointments);
      } catch {
        setAppointmentsOnDate([]);
      } finally {
        setIsChecking(false);
      }
      setPendingAction("set-unavailable");
      setDialogOpen(true);
    }
  };

  const handleConfirm = async () => {
    setDialogOpen(false);
    if (!selectedDate) return;

    if (pendingAction === "set-unavailable") {
      if (appointmentsOnDate.length > 0) {
        await Promise.all(
          appointmentsOnDate.map((apt) =>
            cancelAppointment({
              appointmentId: apt.appointmentId,
              cancelledByUserId: doctorUserId,
              cancellationReason: "Doctor is unavailable.",
              lang,
            }),
          ),
        );
      }
      createMutation.mutate(format(selectedDate, "yyyy-MM-dd"));
    } else if (pendingAction === "make-available" && existingSlot?.id) {
      deleteMutation.mutate(existingSlot.id);
    }

    setPendingAction(null);
    setAppointmentsOnDate([]);
  };

  const isPending = createMutation.isPending || deleteMutation.isPending;

  return (
    <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="p-2 bg-destructive/10 rounded-lg shrink-0">
          <CalendarX className="w-4 h-4 text-destructive" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground leading-none">
            {t("unavailability.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t("unavailability.description")}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t("unavailability.date")} *
        </p>

        <Calendar
          className="mx-auto border rounded-xl"
          mode="single"
          locale={enUS}
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            createMutation.reset();
            deleteMutation.reset();
          }}
          disabled={{ before: startOfDay(new Date()) }}
          modifiers={{ unavailable: (date) => existingDates.some((item) => format(new Date(item.unavailableDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")) }}
          modifiersClassNames={{ unavailable: "bg-destructive/10 text-destructive line-through" }}
        />

        <StatusMessage
          isPending={isPending}
          createError={createMutation.isError}
          deleteError={deleteMutation.isError}
          isDateInDatabase={isDateInDatabase}
        />

        <Button
          onClick={handleButtonClick}
          type="button"
          disabled={!selectedDate || isFetching || isPending || isChecking}
          variant={isDateInDatabase ? "default" : "destructive"}
          className="w-full sm:w-auto font-semibold h-11 px-8"
        >
          {isChecking
            ? "Checking…"
            : isPending
              ? "Processing…"
              : isDateInDatabase
                ? t("unavailability.undo_btn")
                : t("unavailability.btn")}
        </Button>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === "set-unavailable" && appointmentsOnDate.length > 0 && (
                <AlertTriangle className="inline w-5 h-5 text-destructive mr-2 shrink-0 -mt-0.5" />
              )}
              {pendingAction === "set-unavailable"
                ? t("unavailability.confirm_unavailable_title")
                : t("unavailability.confirm_available_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === "set-unavailable" ? (
                appointmentsOnDate.length > 0 ? (
                  <>
                    {t("unavailability.confirm_unavailable_with_appointments")}
                    <span className="block mt-1 text-destructive font-medium">
                      {appointmentsOnDate.length} {t("unavailability.appointments_on_date")}:{" "}
                      {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                    </span>
                  </>
                ) : (
                  t("unavailability.confirm_unavailable_no_appointments")
                )
              ) : (
                t("unavailability.confirm_available_description")
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              {t("unavailability.dialog_cancel")}
            </AlertDialogCancel>
            <AppButton
              variant={pendingAction === "set-unavailable" ? "destructive" : "default"}
              isLoading={isPending}
              loadingText="Processing…"
              onClick={handleConfirm}
            >
              {pendingAction === "set-unavailable"
                ? appointmentsOnDate.length > 0
                  ? t("unavailability.confirm_cancel_appointments_btn")
                  : t("unavailability.confirm_set_unavailable_btn")
                : t("unavailability.confirm_make_available_btn")}
            </AppButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
