/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { format, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Typography } from "@/components/ui/Typography";
import {
  createDoctorUnAvailability,
  getDoctorUnAvailability,
  deleteAvailabilitySlot,
} from "@/actions/doctor/unavailability";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { useI18n } from "@/locales/client";
import AppButton from "@/components/common/AppButton";
import { UnavailableDate } from "@/types/doctor.unavailable";
import { StatusMessage } from "./StatusMessage";

export default function ScheduleManager({
  lang,
  doctorUserId,
}: {
  lang: string;
  doctorUserId: number;
}) {
  const t = useI18n();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const { data: existingDatesResponse, isLoading: isFetching } = useQuery({
    queryKey: ["doctor-availability", doctorUserId],
    queryFn: () => getDoctorUnAvailability({ lang, doctorUserId }),
    enabled: !!doctorUserId,
  });

  const existingDates: UnavailableDate[] =
    existingDatesResponse?.payload?.content || [];
  const existingSlot = useMemo(() => {
    if (!selectedDate) return null;
    return existingDates.find(
      (item) =>
        format(new Date(item.unavailableDate), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd"),
    );
  }, [selectedDate, existingDates]);

  const isDateInDatabase = !!existingSlot;

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (date: string) =>
      createDoctorUnAvailability({ lang, doctorUserId, unavailableDate: date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAvailabilitySlot({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
    },
  });

  const handleToggleAvailability = () => {
    if (!selectedDate) return;

    if (isDateInDatabase && existingSlot?.id) {
      deleteMutation.mutate(existingSlot.id);
    } else {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      createMutation.mutate(formattedDate);
    }
  };

  const isPending = createMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-10 mt-7">
      <section className="space-y-4 border rounded-sm p-6">
        <DynamicHeading
          title={t("unavailability.title")}
          description={t("unavailability.description")}
          titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
          descriptionProps={{ size: "sm" }}
        />

        <Typography size="sm" weight="semiBold" color="foreground">
          {t("unavailability.date")} *
        </Typography>

        <Calendar
          className="p-0"
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            createMutation.reset();
            deleteMutation.reset();
          }}
          disabled={{ before: startOfDay(new Date()) }}
        />
        <div>
          <StatusMessage
            isPending={isPending}
            isCreateError={createMutation.isError}
            isDeleteError={deleteMutation.isError}
            isDateInDatabase={isDateInDatabase}
          />
        </div>

        <AppButton
          onClick={handleToggleAvailability}
          className={`px-5 rounded-lg max-w-68.25 w-full text-foreground transition-all duration-200 ${
            isDateInDatabase
              ? "bg-primary hover:bg-primary/90 text-muted"
              : "bg-destructive/50 hover:bg-destructive/60"
          }`}
          type="button"
          isLoading={isPending}
          disabled={!selectedDate || isFetching}
        >
          {isDateInDatabase
            ? t("unavailability.undo_btn")
            : t("unavailability.btn") || "Set Unavailable"}
        </AppButton>
      </section>
    </div>
  );
}
