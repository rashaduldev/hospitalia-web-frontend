"use client";

import { createDoctorAvailability } from "@/actions/doctor/availability";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/Typography";
import { useLocations } from "@/hooks/useLocations";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AvailabilityScheduleSchema,
  AvailabilityScheduleSchemaFormValues,
} from "@/schema/doctor.availability.schedule.schema";
import AppButton from "@/components/common/AppButton";

const DAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const VALID_TIME_SLOTS = [
  { label: "10 Minutes", value: "MIN_10" },
  { label: "15 Minutes", value: "MIN_15" },
  { label: "30 Minutes", value: "MIN_30" },
  { label: "90 Minutes", value: "MIN_90" },
  { label: "1 Hour", value: "HOUR_1" },
  { label: "2 Hours", value: "HOUR_2" },
];

const AVAILABILITY_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Unavailable", value: "UNAVAILABLE" },
];

export default function AvailabilityScheduleForm({
  doctorUserId,
  lang,
}: {
  doctorUserId: number;
  lang: string;
}) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { locations } = useLocations({
    lang,
    doctorUserId,
  });
  const t = useI18n();

  const {
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AvailabilityScheduleSchemaFormValues>({
    resolver: zodResolver(AvailabilityScheduleSchema),
    defaultValues: {
      loc1: {
        availabilityStatus: "AVAILABLE",
        doctorLocationId: "",
        startTime: "",
        endTime: "",
        timeSlot: "MIN_10",
      },
      loc2: {
        availabilityStatus: "AVAILABLE",
        doctorLocationId: "",
        startTime: "",
        endTime: "",
        timeSlot: "MIN_10",
      },
    },
  });

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const onSubmit = async (data: AvailabilityScheduleSchemaFormValues) => {
    setFormStatus(null);

    if (selectedDays.length === 0) {
      setFormStatus({
        type: "error",
        message: "Please select at least one day!",
      });
      return;
    }

    const finalScheduleArray: any[] = [];

    selectedDays.forEach((day) => {
      const formatTime = (time: string | undefined) =>
        time ? `${time}:00Z` : "";

      if (data.loc1.doctorLocationId) {
        finalScheduleArray.push({
          availabilityStatus: data.loc1.availabilityStatus,
          doctorLocationId: Number(data.loc1.doctorLocationId),
          startTime: formatTime(data.loc1.startTime),
          endTime: formatTime(data.loc1.endTime),
          timeSlot: data.loc1.timeSlot,
          dayOfWeek: day,
        });
      }

      if (data.loc2.doctorLocationId) {
        finalScheduleArray.push({
          availabilityStatus: data.loc2.availabilityStatus || "AVAILABLE",
          doctorLocationId: Number(data.loc2.doctorLocationId),
          startTime: formatTime(data.loc2.startTime),
          endTime: formatTime(data.loc2.endTime),
          timeSlot: data.loc2.timeSlot,
          dayOfWeek: day,
        });
      }
    });

    try {
      const res = await createDoctorAvailability({
        lang,
        doctorUserId: doctorUserId,
        weeklySchedule: finalScheduleArray,
      });

      if (!res.success) {
        setError("root", {
          type: "manual",
          message: res.message,
        });
        return;
      }
      setFormStatus({
        type: "success",
        message: res.message,
      });
      setSelectedDays([]);
      reset();
    } catch (error: any) {
      setFormStatus({ type: "error", message: error?.message });
    }
  };

  return (
    <div className="mt-12.5 border rounded-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <DynamicHeading
          title={t("schedule.title")}
          description={t("schedule.description")}
          titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
        />

        {/* --- Day Selection --- */}
        <div>
          <Label className="block text-sm mb-2 font-medium">
            {t("schedule.select_day")}*
          </Label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <AppButton
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-7 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                    {
                      "bg-secondary-foreground border-secondary-foreground text-foreground":
                        isSelected,
                      "bg-ring/20 hover:bg-ring/20 border-muted text-foreground":
                        !isSelected,
                    },
                  )}
                >
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </AppButton>
              );
            })}
          </div>
        </div>

        {/* --- Location 1 --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 col-span-2 gap-4">
            <ControlledSelect
              name="loc1.availabilityStatus"
              label="Availability Status *"
              control={control}
              options={AVAILABILITY_OPTIONS}
            />
          </div>

          <ControlledSelect
            name="loc1.doctorLocationId"
            label="Location *"
            control={control}
            placeholder="Select Location"
            options={
              locations?.map((loc: any) => ({
                label: loc.locationName,
                value: String(loc.locationId),
              })) || []
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <ControlledInput
              name="loc1.startTime"
              label="Duration (Start Time) *"
              type="time"
              control={control}
            />
            <ControlledInput
              name="loc1.endTime"
              label="End Time *"
              type="time"
              control={control}
            />
          </div>

          <div className="md:col-span-1">
            <ControlledSelect
              name="loc1.timeSlot"
              label="Time Slot"
              control={control}
              options={VALID_TIME_SLOTS}
            />
          </div>
        </div>

        {/* --- Location 2 (Optional) --- */}
        <div className="space-y-4">
          <Typography as="h3" color="foreground" weight="semiBold">
            Add Another Location on the Same Day (Optional)
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ControlledSelect
              name="loc2.doctorLocationId"
              label="Location"
              control={control}
              placeholder="Select Another Location"
              options={
                locations?.map((loc: any) => ({
                  label: loc.locationName,
                  value: String(loc.locationId),
                })) || []
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <ControlledInput
                name="loc2.startTime"
                label="Duration (Start Time)"
                type="time"
                control={control}
              />
              <ControlledInput
                name="loc2.endTime"
                label="End Time"
                type="time"
                control={control}
              />
            </div>

            <ControlledSelect
              name="loc2.timeSlot"
              label="Time Slot"
              control={control}
              options={VALID_TIME_SLOTS}
            />
          </div>
        </div>

        {/* --- Feedback & Submit --- */}
        <div className="space-y-4">
          {formStatus && (
            <div
              className={cn("text-sm", {
                "text-secondary": formStatus.type === "success",
                "text-destructive": formStatus.type !== "success",
              })}
            >
              {formStatus.message}
            </div>
          )}
          {errors.root && (
            <Typography as="p" size="xs" weight="semiBold" color="destructive">
              {errors.root.message}
            </Typography>
          )}

          <div className="grid grid-cols-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-4 rounded-lg font-bold text-muted transition-all shadow-md",
                isSubmitting ? "bg-primary/90" : "",
              )}
            >
              {isSubmitting ? "Creating..." : "Confirm Availability"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
