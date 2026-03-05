"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { format, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Typography } from "@/components/ui/Typography";
import {
  createDoctorUnAvailability,
  getDoctorUnAvailability,
} from "@/actions/doctor/unavailability";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { useI18n } from "@/locales/client";
import AppButton from "@/components/common/AppButton";
import { UnavailableDate } from "@/types/doctor.unavailable";

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
  const { data: existingDatesResponse } = useQuery({
    queryKey: ["doctor-availability"],
    queryFn: () => getDoctorUnAvailability({ lang, doctorUserId }),
    enabled: !!doctorUserId,
  });

  const existingDates = existingDatesResponse?.payload?.content || [];
  console.log("existingDates", existingDates);

  const isDateInDatabase =
    selectedDate &&
    existingDates.some(
      (item: UnavailableDate) =>
        format(new Date(item.unavailableDate), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd"),
    );

  const unavailabilityMutation = useMutation({
    mutationFn: (date: string) =>
      createDoctorUnAvailability({ lang, doctorUserId, unavailableDate: date }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
    },
  });

  const handleSetUnavailable = () => {
    if (selectedDate && !isDateInDatabase) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      unavailabilityMutation.mutate(formattedDate);
    }
  };

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
            unavailabilityMutation.reset();
          }}
          disabled={{ before: startOfDay(new Date()) }}
        />

        <div>
          {unavailabilityMutation.isSuccess ? (
            <p className="text-sm text-secondary font-medium">
              {t("unavailability.success_message")}
            </p>
          ) : (
            <>
              {isDateInDatabase && (
                <p className="text-sm text-destructive font-medium">
                  {t("unavailability.already_set") ||
                    "This day is already set as unavailable"}
                </p>
              )}

              {unavailabilityMutation.isError && (
                <p className="text-sm text-destructive font-medium">
                  {t("unavailability.error_message")}
                </p>
              )}
            </>
          )}
        </div>

        <AppButton
          onClick={handleSetUnavailable}
          className="px-5 rounded-lg bg-destructive/50 hover:bg-destructive/50 max-w-68.25 w-full text-foreground"
          type="button"
          isLoading={unavailabilityMutation.isPending}
          disabled={
            !selectedDate ||
            (isDateInDatabase && !unavailabilityMutation.isSuccess)
          }
        >
          {t("unavailability.btn")}
        </AppButton>
      </section>
    </div>
  );
}
