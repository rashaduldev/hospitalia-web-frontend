"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Typography } from "@/components/ui/Typography";
import { toast } from "sonner";
import { Pencil, MoreVertical } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { getDoctorAvailability } from "@/actions/doctor/availability";
import { createDoctorUnAvailability } from "@/actions/doctor/unavailability";
import { DataTableWithExport } from "@/components/data-table";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { useI18n } from "@/locales/client";
import AppButton from "@/components/common/AppButton";

export default function ScheduleManager({
  lang,
  doctorUserId,
}: {
  lang: string;
  doctorUserId: number;
}) {
  const t = useI18n();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const queryClient = useQueryClient();

  const { data: response } = useQuery({
    queryKey: ["doctor-availability", doctorUserId],
    queryFn: () => getDoctorAvailability({ lang, doctorUserId }),
  });

  const slots = response?.payload || [];

  const unavailabilityMutation = useMutation({
    mutationFn: (date: string) =>
      createDoctorUnAvailability({ lang, doctorUserId, unavailableDate: date }),
    onSuccess: () => {
      toast.success("Date set as unavailable successfully");
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
    },
    onError: () => toast.error("Failed to set unavailability"),
  });

  const handleSetUnavailable = () => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      unavailabilityMutation.mutate(formattedDate);
    }
  };

  return (
    <div className="space-y-10 mt-7">
      {/* --- Schedule Exceptions Section --- */}
      <section className="space-y-4 border rounded-lg p-6">
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
          onSelect={setSelectedDate}
        />
        <AppButton
          onClick={handleSetUnavailable}
          className="px-5 rounded-lg bg-destructive/50 hover:bg-destructive/50 max-w-68.25 w-full text-foreground"
          type="submit"
          isLoading={unavailabilityMutation.isPending}
        >
          {t("unavailability.btn")}
        </AppButton>
      </section>

      {/* --- Confirmed Slots Section --- */}
      <section className="space-y-4">
        <div>
          <Typography
            as="h4"
            className="text-secondary font-bold tracking-tight"
          >
            Confirmed Slots
          </Typography>
          <Typography size="sm" color="muted_foreground">
            All your confirmed time slots
          </Typography>
        </div>

        <div className="bg-muted rounded-xl shadow-sm border overflow-hidden">
          <DataTableWithExport
            columns={appointmentColumns}
            data={slots}
            filename="confirmed-slots"
            emptyMessage="No availability slots found"
            // isLoading={isLoading}
          />
        </div>
      </section>
    </div>
  );
}

const appointmentColumns: ColumnDef<any>[] = [
  {
    accessorKey: "dayOfWeek",
    header: "Date",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.original.dayOfWeek}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex flex-col py-1">
        <span className="font-medium text-foreground">
          {row.original.locationName || "Clinic Name"}
        </span>
        <span className="text-[11px] text-foreground line-clamp-1">
          {row.original.addressLine1 || "Location Address"}
        </span>
      </div>
    ),
  },
  {
    header: "Time Duration",
    cell: ({ row }) => (
      <span className="text-sm text-foreground font-medium">
        {row.original.startTime} - {row.original.endTime}
      </span>
    ),
  },
  {
    header: "Time Slot",
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {row.original.slotDuration || "30"} Min
      </span>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <div className="flex items-center gap-4 justify-end pr-2">
        <button className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
          <Pencil size={14} />
          <span>Edit</span>
        </button>
        <button className="text-foreground">
          <MoreVertical size={18} />
        </button>
      </div>
    ),
  },
];
