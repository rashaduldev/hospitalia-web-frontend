"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery } from "@/lib/safeQuery";
import {
  createDoctorAvailability,
  updateDoctorAvailability,
  getDoctorAvailabilityWithLocation,
} from "@/actions/doctor/availability";
import { getDefaultTimeSlot } from "@/actions/doctor/slot";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledTimePicker } from "@/components/common/FormUIControllers/ControlledTimePicker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DoctorAvailabilitySlot } from "@/types/doctor.slot";
import { CalendarCheck2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// ── Schema ────────────────────────────────────────────────────────────────────
const SecretaryScheduleSchema = z.object({
  availabilityStatus: z.string().min(1, "Status is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
});
type SecretaryScheduleValues = z.infer<typeof SecretaryScheduleSchema>;

// ── Constants ─────────────────────────────────────────────────────────────────
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Sun", MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat",
};
const AVAILABILITY_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
];
const SLOT_LABELS: Record<string, string> = {
  MIN_10: "10 min", MIN_15: "15 min", MIN_30: "30 min",
  HOUR_1: "1 hour", MIN_90: "1 hr 30 min", HOUR_2: "2 hours",
};
const SLOT_MINUTES_TO_OPTION: Record<number, string> = {
  10: "MIN_10", 15: "MIN_15", 30: "MIN_30",
  60: "HOUR_1", 90: "MIN_90", 120: "HOUR_2",
};

function toInputTime(t: string | undefined): string {
  if (!t) return "";
  return t.split(":").slice(0, 2).join(":");
}

function resolveTimeSlot(val: number | string, options: string[]): string {
  const mapped = SLOT_MINUTES_TO_OPTION[Number(val)];
  if (mapped && options.includes(mapped)) return mapped;
  if (options.includes(String(val))) return String(val);
  return "";
}

// ── Component ─────────────────────────────────────────────────────────────────
type Props = {
  doctorEntityId: number;
  lang: string;
  locationId: number;
  locationName?: string;
  preselectedDay?: string | null;
  onClose?: () => void;
};

export default function SecretaryScheduleForm({
  doctorEntityId,
  lang,
  locationId,
  locationName,
  preselectedDay,
  onClose,
}: Props) {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLDivElement>(null);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // ── Fetch time slot options from API ──────────────────────────────────────
  const { data: timeSlotsData } = useSafeQuery({
    queryKey: ["defaultTimeSlots", lang],
    queryFn: () => getDefaultTimeSlot({ lang }),
  });
  const timeSlots: string[] = (timeSlotsData?.payload as string[] | null) ?? [];
  const slotOptions = timeSlots.map((s) => ({ label: SLOT_LABELS[s] ?? s.replace(/_/g, " "), value: s }));

  // ── Fetch existing slots for this doctor + location ───────────────────────
  const { data: slotsData } = useSafeQuery({
    queryKey: ["secretaryAvailability", doctorEntityId, locationId, lang],
    queryFn: () =>
      getDoctorAvailabilityWithLocation({
        doctorId: doctorEntityId,
        doctorLocationId: locationId,
        lang,
      }),
    enabled: !!doctorEntityId && !!locationId,
  });
  const allSlots: DoctorAvailabilitySlot[] = slotsData?.payload?.content ?? [];

  // Find existing slot for the selected day at this location
  const existingSlot: DoctorAvailabilitySlot | undefined = selectedDay
    ? allSlots.find((s) => s.dayOfWeek === selectedDay)
    : undefined;

  const isUpdateMode = !!existingSlot;

  // ── Form ──────────────────────────────────────────────────────────────────
  const { handleSubmit, reset, control, setError, formState: { errors, isSubmitting } } =
    useForm<SecretaryScheduleValues>({
      resolver: zodResolver(SecretaryScheduleSchema),
      defaultValues: { availabilityStatus: "AVAILABLE", startTime: "", endTime: "", timeSlot: "" },
    });

  // ── Effects ───────────────────────────────────────────────────────────────
  // When preselectedDay changes, clear form and set new day
  useEffect(() => {
    if (!preselectedDay) return;
    setSelectedDay(preselectedDay);
    reset({ availabilityStatus: "AVAILABLE", startTime: "", endTime: "", timeSlot: "" });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedDay]);

  // When existing slot found AND time slots loaded, populate form
  useEffect(() => {
    if (!existingSlot || timeSlots.length === 0) return;
    reset({
      availabilityStatus: existingSlot.availabilityStatus,
      startTime: toInputTime(existingSlot.startTime),
      endTime: toInputTime(existingSlot.endTime),
      timeSlot: resolveTimeSlot(existingSlot.timeSlot, timeSlots),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingSlot?.id, timeSlots.length]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleDayClick = (day: string) => {
    const next = selectedDay === day ? null : day;
    setSelectedDay(next);
    if (!next) {
      reset({ availabilityStatus: "AVAILABLE", startTime: "", endTime: "", timeSlot: "" });
    }
  };

  const onSubmit = async (data: SecretaryScheduleValues) => {
    if (!selectedDay) {
      setError("root", { type: "manual", message: "Please select a day." });
      return;
    }
    const formatTime = (t: string) => `${t}:00Z`;

    try {
      let res;
      if (isUpdateMode && existingSlot) {
        res = await updateDoctorAvailability({
          doctorId: doctorEntityId,
          availabilityIds: [existingSlot.id] as [number],
          weeklySchedule: [{
            dayOfWeek: selectedDay,
            availabilityStatus: data.availabilityStatus,
            doctorLocationId: locationId,
            startTime: formatTime(data.startTime),
            endTime: formatTime(data.endTime),
            timeSlot: data.timeSlot,
          }],
        });
      } else {
        res = await createDoctorAvailability({
          lang,
          doctorId: doctorEntityId,
          weeklySchedule: [{
            dayOfWeek: selectedDay,
            availabilityStatus: data.availabilityStatus,
            doctorLocationId: locationId,
            startTime: formatTime(data.startTime),
            endTime: formatTime(data.endTime),
            timeSlot: data.timeSlot,
          }],
        });
      }

      if (!res.success) {
        setError("root", { type: "manual", message: res.message });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["secretaryAvailability", doctorEntityId, locationId] });
      onClose?.();
    } catch {
      setError("root", { type: "manual", message: "Something went wrong. Please try again." });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const headerLabel = isUpdateMode
    ? `Update Schedule — ${DAY_LABELS[selectedDay!]}`
    : selectedDay
      ? `Create Schedule — ${DAY_LABELS[selectedDay]}`
      : "Schedule";

  return (
    <div ref={formRef} className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <CalendarCheck2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground leading-none">{headerLabel}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {locationName ? locationName : "Set recurring availability for this day"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Day selector */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Select Day *
          </p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayClick(day)}
                className={cn(
                  "px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200",
                  selectedDay === day
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
                )}
              >
                {DAY_LABELS[day]}
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Schedule fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <ControlledSelect
              name="availabilityStatus"
              label="Availability"
              control={control}
              options={AVAILABILITY_OPTIONS}
            />
          </div>
          <ControlledSelect
            name="timeSlot"
            label="Time Slot *"
            placeholder="Select Time Slot"
            control={control}
            options={slotOptions}
          />
          <div />
          <ControlledTimePicker name="startTime" label="Start Time *" control={control} />
          <ControlledTimePicker name="endTime" label="End Time *" control={control} />
        </div>

        {errors.root && (
          <p className="text-xs text-destructive font-medium">{errors.root.message}</p>
        )}

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting || !selectedDay}
            className="font-semibold h-11 px-8"
          >
            {isSubmitting
              ? (isUpdateMode ? "Updating…" : "Creating…")
              : (isUpdateMode ? "Update Schedule" : "Create Schedule")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 px-6"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
