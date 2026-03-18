/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { format, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  createDoctorUnAvailability,
  getDoctorUnAvailability,
  deleteAvailabilitySlot,
} from "@/actions/doctor/unavailability";
import { useI18n } from "@/locales/client";
import { Button } from "@/components/ui/button";
import { UnavailableDate } from "@/types/doctor.unavailable";
import { StatusMessage } from "./StatusMessage";
import { CalendarX } from "lucide-react";

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

  const { data: existingDatesResponse, isLoading: isFetching } = useQuery({
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

  const createMutation = useMutation({
    mutationFn: (date: string) =>
      createDoctorUnAvailability({ lang, doctorUserId, unavailableDate: date }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-availability"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAvailabilitySlot({ id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["doctor-availability"] }),
  });

  const handleToggleAvailability = () => {
    if (!selectedDate) return;
    if (isDateInDatabase && existingSlot?.id) {
      deleteMutation.mutate(existingSlot.id);
    } else {
      createMutation.mutate(format(selectedDate, "yyyy-MM-dd"));
    }
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
          onClick={handleToggleAvailability}
          type="button"
          disabled={!selectedDate || isFetching || isPending}
          variant={isDateInDatabase ? "default" : "destructive"}
          className="w-full sm:w-auto font-semibold h-11 px-8"
        >
          {isPending
            ? "Processing…"
            : isDateInDatabase
              ? t("unavailability.undo_btn")
              : t("unavailability.btn") || "Set Unavailable"}
        </Button>
      </div>
    </div>
  );
}
