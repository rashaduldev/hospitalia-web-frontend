"use client";

import { createDoctorAvailability } from "@/actions/doctor/availability";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { Button } from "@/components/ui/button";
import { useLocations } from "@/hooks/useLocations";
import { useDoctorId } from "@/providers/DoctorIdProvider";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AvailabilityScheduleSchema,
  AvailabilityScheduleSchemaFormValues,
} from "@/schema/doctor.availability.schedule.schema";
import { Location } from "@/types/doctor.location.type";
import { WeeklySchedule } from "@/types/doctorSchedule";
import { CalendarCheck2, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Sun", MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat",
};

const AVAILABILITY_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Unavailable", value: "UNAVAILABLE" },
];

export default function AvailabilityScheduleForm({
  doctorUserId,
  lang,
  timeSlots,
}: {
  doctorUserId: number;
  lang: string;
  timeSlots: string[];
}) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const doctorId = useDoctorId();
  const { locations } = useLocations({ lang, doctorId: doctorId ?? doctorUserId });
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
      loc1: { availabilityStatus: "AVAILABLE", doctorLocationId: "", startTime: "", endTime: "", timeSlot: "" },
      loc2: { availabilityStatus: "AVAILABLE", doctorLocationId: "", startTime: "", endTime: "", timeSlot: "" },
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
      setFormStatus({ type: "error", message: "Please select at least one day." });
      return;
    }

    const finalScheduleArray: WeeklySchedule[] = [];
    selectedDays.forEach((day) => {
      const formatTime = (time: string | undefined) => (time ? `${time}:00Z` : "");
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
          timeSlot: data.loc2.timeSlot ?? "",
          dayOfWeek: day,
        });
      }
    });

    const res = await createDoctorAvailability({
      lang,
      doctorId: doctorId ?? doctorUserId,
      weeklySchedule: finalScheduleArray,
    });

    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }
    setFormStatus({ type: "success", message: res.message });
    setSelectedDays([]);
    reset();
  };

  const locationOptions = locations?.map((loc: Location) => ({
    label: loc.locationName,
    value: String(loc.locationId),
  })) || [];

  const slotOptions = timeSlots.map((slot) => ({
    label: slot.replace("_", " "),
    value: slot,
  }));

  return (
    <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <CalendarCheck2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground leading-none">
            {t("schedule.title")}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {t("schedule.description")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Day selection */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {t("schedule.select_day")} *
          </p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200",
                    isSelected
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
                  )}
                >
                  {DAY_LABELS[day]}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Location 1 */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Primary Location *
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <ControlledSelect
                name="loc1.availabilityStatus"
                label="Availability"
                control={control}
                options={AVAILABILITY_OPTIONS}
              />
            </div>
            <ControlledSelect
              name="loc1.doctorLocationId"
              label="Location *"
              control={control}
              placeholder="Select Location"
              options={locationOptions}
            />
            <div className="grid grid-cols-2 gap-4">
              <ControlledInput name="loc1.startTime" label="Start Time *" type="time" control={control} />
              <ControlledInput name="loc1.endTime" label="End Time *" type="time" control={control} />
            </div>
            <ControlledSelect
              name="loc1.timeSlot"
              label="Time Slot"
              placeholder="Select Time Slot"
              control={control}
              options={slotOptions}
            />
          </div>
        </div>

        <Separator />

        {/* Location 2 */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Secondary Location (Optional)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ControlledSelect
              name="loc2.doctorLocationId"
              label="Location"
              control={control}
              placeholder="Select Another Location"
              options={locationOptions}
            />
            <div className="grid grid-cols-2 gap-4">
              <ControlledInput name="loc2.startTime" label="Start Time" type="time" control={control} />
              <ControlledInput name="loc2.endTime" label="End Time" type="time" control={control} />
            </div>
            <ControlledSelect
              name="loc2.timeSlot"
              label="Time Slot"
              placeholder="Select Time Slot"
              control={control}
              options={slotOptions}
            />
          </div>
        </div>

        {/* Feedback & Submit */}
        {formStatus && (
          <p className={cn("text-sm flex items-center gap-1.5", formStatus.type === "success" ? "text-secondary" : "text-destructive")}>
            {formStatus.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {formStatus.message}
          </p>
        )}
        {errors.root && (
          <p className="text-xs text-destructive font-medium">{errors.root.message}</p>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto font-semibold h-11 px-8">
          {isSubmitting ? "Creating…" : "Confirm Availability"}
        </Button>
      </form>
    </div>
  );
}
