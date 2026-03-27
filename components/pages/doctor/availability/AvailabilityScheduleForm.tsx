"use client";

import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery } from "@/lib/safeQuery";
import {
  createDoctorAvailability,
  updateDoctorAvailability,
  getDoctorAvailability,
} from "@/actions/doctor/availability";
import { getDefaultTimeSlot } from "@/actions/doctor/slot";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledTimePicker } from "@/components/common/FormUIControllers/ControlledTimePicker";
import { Button } from "@/components/ui/button";
import { useLocations } from "@/hooks/useLocations";
import { useDoctorId } from "@/providers/DoctorIdProvider";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Location } from "@/types/doctor.location.type";
import { DoctorAvailabilitySlot } from "@/types/doctor.slot";
import { CalendarCheck2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// ── Schema ────────────────────────────────────────────────────────────────────
const SingleScheduleSchema = z.object({
  availabilityStatus: z.string().min(1, "Status is required"),
  doctorLocationId: z.string().min(1, "Location is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
});
type SingleScheduleValues = z.infer<typeof SingleScheduleSchema>;

// ── Constants ─────────────────────────────────────────────────────────────────
const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Sun", MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat",
};
const AVAILABILITY_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  // { label: "Unavailable", value: "UNAVAILABLE" },
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
export default function AvailabilityScheduleForm({
  doctorUserId,
  lang,
  preselectedLocationId,
  preselectedDay,
  onClose,
}: {
  doctorUserId: number;
  lang: string;
  preselectedLocationId?: number;
  preselectedDay?: string | null;
  onClose?: () => void;
}) {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLDivElement>(null);
  const doctorId = useDoctorId();
  const fetchId = doctorId ?? doctorUserId;

  const { data: timeSlotsData } = useSafeQuery({
    queryKey: ["defaultTimeSlots", lang],
    queryFn: () => getDefaultTimeSlot({ lang }),
  });
  const timeSlots: string[] = (timeSlotsData?.payload as string[] | null) ?? [];

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const { handleSubmit, reset, control, setError, formState: { errors, isSubmitting } } =
    useForm<SingleScheduleValues>({
      resolver: zodResolver(SingleScheduleSchema),
      defaultValues: {
        availabilityStatus: "AVAILABLE",
        doctorLocationId: preselectedLocationId ? String(preselectedLocationId) : "",
        startTime: "", endTime: "", timeSlot: "",
      },
    });

  const watchedLocationId = useWatch({ control, name: "doctorLocationId" });

  // ── Data ──────────────────────────────────────────────────────────────────
  const { locations } = useLocations({ lang, doctorId: fetchId });
  const allLocationOptions = (locations as Location[]).map((loc) => ({
    label: loc.locationName,
    value: String(loc.locationId),
  }));
  const locationOptions = preselectedLocationId
    ? allLocationOptions.filter((o) => o.value === String(preselectedLocationId))
    : allLocationOptions;

  const slotOptions = timeSlots.map((s) => ({ label: SLOT_LABELS[s] ?? s.replace(/_/g, " "), value: s }));

  const { data: slotsData } = useSafeQuery({
    queryKey: ["doctorAvailability", fetchId, "all", lang],
    queryFn: () => getDoctorAvailability({ doctorId: fetchId, lang }),
    enabled: !!fetchId,
  });
  const rawPayload = slotsData?.payload as { content?: DoctorAvailabilitySlot[] } | DoctorAvailabilitySlot[] | null;
  const allSlots: DoctorAvailabilitySlot[] = Array.isArray(rawPayload)
    ? rawPayload
    : (rawPayload?.content ?? []);

  // Find an existing slot matching selectedDay + selected location
  const existingSlot: DoctorAvailabilitySlot | undefined =
    selectedDay && watchedLocationId
      ? allSlots.find(
          (s) => s.dayOfWeek === selectedDay && String(s.doctorLocationId) === watchedLocationId,
        )
      : undefined;

  const isUpdateMode = !!existingSlot;

  // ── Effects ───────────────────────────────────────────────────────────────
  // When preselectedDay/preselectedLocationId changes from overview:
  // immediately clear the form and set the new location so existingSlot
  // lookup uses fresh values. The slot effect below then fills data in.
  useEffect(() => {
    if (!preselectedDay) return;
    setSelectedDay(preselectedDay);
    reset({
      availabilityStatus: "AVAILABLE",
      doctorLocationId: preselectedLocationId ? String(preselectedLocationId) : "",
      startTime: "",
      endTime: "",
      timeSlot: "",
    });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedDay, preselectedLocationId]);

  // When an existing slot is found (day + location) AND time slots are loaded,
  // populate the form. Re-runs when either the matched slot or the slot options change.
  useEffect(() => {
    if (!existingSlot || timeSlots.length === 0) return;
    reset({
      availabilityStatus: existingSlot.availabilityStatus,
      doctorLocationId: String(existingSlot.doctorLocationId),
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
      reset({
        availabilityStatus: "AVAILABLE",
        doctorLocationId: preselectedLocationId ? String(preselectedLocationId) : "",
        startTime: "", endTime: "", timeSlot: "",
      });
    }
  };

  const onSubmit = async (data: SingleScheduleValues) => {
    if (!selectedDay) {
      setError("root", { type: "manual", message: "Please select a day." });
      return;
    }
    const formatTime = (t: string) => `${t}:00Z`;

    try {
      let res;
      if (isUpdateMode && existingSlot) {
        res = await updateDoctorAvailability({
          doctorId: fetchId,
          availabilityIds: [existingSlot.id] as [number],
          weeklySchedule: [{
            dayOfWeek: selectedDay,
            availabilityStatus: data.availabilityStatus,
            doctorLocationId: Number(data.doctorLocationId),
            startTime: formatTime(data.startTime),
            endTime: formatTime(data.endTime),
            timeSlot: data.timeSlot,
          }],
        });
      } else {
        res = await createDoctorAvailability({
          lang,
          doctorId: fetchId,
          weeklySchedule: [{
            dayOfWeek: selectedDay,
            availabilityStatus: data.availabilityStatus,
            doctorLocationId: Number(data.doctorLocationId),
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
      queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] });
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
          <p className="text-xs text-muted-foreground mt-1">Set your recurring availability by day</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Day selector — single select */}
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
        <div className="space-y-4">
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
              name="doctorLocationId"
              label="Location *"
              control={control}
              placeholder="Select Location"
              options={locationOptions}
            />
            <ControlledSelect
              name="timeSlot"
              label="Time Slot *"
              placeholder="Select Time Slot"
              control={control}
              options={slotOptions}
            />
            <div className="space-y-1">
              <ControlledTimePicker name="startTime" label="Start Time *" control={control} />
            </div>
            <div className="space-y-1">
              <ControlledTimePicker name="endTime" label="End Time *" control={control} />
            </div>
          </div>
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
