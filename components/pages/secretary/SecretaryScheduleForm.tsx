"use client";

import { useSafeQuery } from "@/lib/safeQuery";
import {
  createDoctorAvailability,
  getDoctorAvailabilityWithLocation,
} from "@/actions/doctor/availability";
import { useLocations } from "@/hooks/useLocations";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AvailabilityScheduleSchema,
  AvailabilityScheduleSchemaFormValues,
} from "@/schema/doctor.availability.schedule.schema";
import { DoctorAvailabilitySlot } from "@/types/doctor.slot";
import { Location } from "@/types/doctor.location.type";
import {
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock,
  PlusCircle,
  Pencil,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useQueryClient } from "@tanstack/react-query";

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Sun", MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat",
};
const DAY_FULL: Record<string, string> = {
  SUNDAY: "Sunday", MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday",
};

const AVAILABILITY_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Unavailable", value: "UNAVAILABLE" },
];

function toInputTime(apiTime: string | undefined): string {
  if (!apiTime) return "";
  return apiTime.split(":").slice(0, 2).join(":");
}

/** Maps the stored numeric timeSlot (minutes) back to its API enum string. */
const SLOT_MINUTES_TO_OPTION: Record<number, string> = {
  10: "MIN_10",
  15: "MIN_15",
  30: "MIN_30",
  60: "HOUR_1",
  90: "MIN_90",
  120: "HOUR_2",
};

/**
 * Resolve a slot's stored timeSlot number (e.g. 30) to its option string ("MIN_30").
 * Falls back to a direct string comparison for future-proofing.
 */
function resolveTimeSlotOption(slotValue: number | string, options: string[]): string {
  const asNum = Number(slotValue);
  if (!isNaN(asNum) && SLOT_MINUTES_TO_OPTION[asNum]) {
    const mapped = SLOT_MINUTES_TO_OPTION[asNum];
    if (options.includes(mapped)) return mapped;
  }
  // Direct string fallback
  const asStr = String(slotValue);
  if (options.includes(asStr)) return asStr;
  return "";
}

function formatDisplayTime(apiTime: string | undefined): string {
  if (!apiTime) return "";
  const [hStr, mStr] = apiTime.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

type Props = {
  doctorUserId: number;
  doctorEntityId: number;
  lang: string;
  timeSlots: string[];
  preselectedLocationId: number;
};

export default function SecretaryScheduleForm({
  doctorUserId,
  doctorEntityId,
  lang,
  timeSlots,
  preselectedLocationId,
}: Props) {
  const t = useI18n();
  const queryClient = useQueryClient();

  // Fetch doctor locations to resolve the name for preselectedLocationId
  const { locations } = useLocations({ lang, doctorId: doctorEntityId });
  const selectedLocation = (locations as Location[]).find(
    (l) => Number(l.locationId) === preselectedLocationId,
  );
  const locationOption = [
    {
      label: selectedLocation?.locationName ?? `Location ${preselectedLocationId}`,
      value: String(preselectedLocationId),
    },
  ];

  // selectedDays drives the form's day picker
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

  // ── Fetch existing slots ──────────────────────────────────────────────────
  const { data: slotsData, isLoading: slotsLoading } = useSafeQuery({
    queryKey: ["doctorAvailability", doctorEntityId, preselectedLocationId, lang],
    queryFn: () =>
      getDoctorAvailabilityWithLocation({
        doctorId: doctorEntityId,
        doctorLocationId: preselectedLocationId,
        lang,
      }),
    enabled: !!doctorEntityId && !!preselectedLocationId,
  });

  const existingSlots: DoctorAvailabilitySlot[] = slotsData?.payload?.content ?? [];

  const slotsByDay: Record<string, DoctorAvailabilitySlot[]> = {};
  existingSlots.forEach((slot) => {
    if (!slotsByDay[slot.dayOfWeek]) slotsByDay[slot.dayOfWeek] = [];
    slotsByDay[slot.dayOfWeek].push(slot);
  });

  // ── Populate form ─────────────────────────────────────────────────────────
  const populateFormForDay = (day: string) => {
    const slots = slotsByDay[day];
    if (!slots?.length) {
      reset({
        loc1: { availabilityStatus: "AVAILABLE", doctorLocationId: String(preselectedLocationId), startTime: "", endTime: "", timeSlot: "" },
        loc2: { availabilityStatus: "AVAILABLE", doctorLocationId: "", startTime: "", endTime: "", timeSlot: "" },
      });
      return;
    }
    const s1 = slots[0];
    const s2 = slots[1];
    reset({
      loc1: {
        availabilityStatus: s1.availabilityStatus,
        doctorLocationId: String(s1.doctorLocationId),
        startTime: toInputTime(s1.startTime),
        endTime: toInputTime(s1.endTime),
        timeSlot: resolveTimeSlotOption(s1.timeSlot, timeSlots),
      },
      loc2: s2
        ? {
            availabilityStatus: s2.availabilityStatus,
            doctorLocationId: String(s2.doctorLocationId),
            startTime: toInputTime(s2.startTime),
            endTime: toInputTime(s2.endTime),
            timeSlot: resolveTimeSlotOption(s2.timeSlot, timeSlots),
          }
        : { availabilityStatus: "AVAILABLE", doctorLocationId: "", startTime: "", endTime: "", timeSlot: "" },
    });
  };

  // When a day is toggled in the form's day picker
  const toggleDay = (day: string) => {
    const alreadySelected = selectedDays.includes(day);
    if (alreadySelected) {
      setSelectedDays((prev) => prev.filter((d) => d !== day));
    } else {
      setSelectedDays((prev) => [...prev, day]);
      // If exactly one day will be selected, populate form with its data
      if (selectedDays.length === 0) {
        populateFormForDay(day);
      }
    }
  };

  // Clicking the overview card: select ONLY that day and populate
  const handleOverviewDayClick = (day: string) => {
    setSelectedDays([day]);
    populateFormForDay(day);
    setFormStatus(null);
  };

  const SLOT_LABELS: Record<string, string> = {
    MIN_10: "10 min",
    MIN_15: "15 min",
    MIN_30: "30 min",
    HOUR_1: "1 hour",
    MIN_90: "1 hr 30 min",
    HOUR_2: "2 hours",
  };
  const slotOptions = timeSlots.map((slot) => ({
    label: SLOT_LABELS[slot] ?? slot.replace(/_/g, " "),
    value: slot,
  }));

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: AvailabilityScheduleSchemaFormValues) => {
    setFormStatus(null);
    if (selectedDays.length === 0) {
      setFormStatus({ type: "error", message: "Please select at least one day." });
      return;
    }
    const formatTime = (t: string | undefined) => (t ? `${t}:00Z` : "");
    const finalSchedule = selectedDays.flatMap((day) => {
      const entries = [];
      if (data.loc1.doctorLocationId) {
        entries.push({
          availabilityStatus: data.loc1.availabilityStatus,
          doctorLocationId: Number(data.loc1.doctorLocationId),
          startTime: formatTime(data.loc1.startTime),
          endTime: formatTime(data.loc1.endTime),
          timeSlot: data.loc1.timeSlot,
          dayOfWeek: day,
        });
      }
      if (data.loc2.doctorLocationId) {
        entries.push({
          availabilityStatus: data.loc2.availabilityStatus || "AVAILABLE",
          doctorLocationId: Number(data.loc2.doctorLocationId),
          startTime: formatTime(data.loc2.startTime),
          endTime: formatTime(data.loc2.endTime),
          timeSlot: data.loc2.timeSlot ?? "",
          dayOfWeek: day,
        });
      }
      return entries;
    });

    try {
      const res = await createDoctorAvailability({ lang, doctorId: doctorEntityId, weeklySchedule: finalSchedule });
      if (!res.success) {
        setError("root", { type: "manual", message: res.message });
        return;
      }
      setFormStatus({ type: "success", message: res.message });
      queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] });
      setSelectedDays([]);
      reset({
        loc1: { availabilityStatus: "AVAILABLE", doctorLocationId: "", startTime: "", endTime: "", timeSlot: "" },
        loc2: { availabilityStatus: "AVAILABLE", doctorLocationId: "", startTime: "", endTime: "", timeSlot: "" },
      });
    } catch {
      setError("root", { type: "manual", message: "Something went wrong. Please try again." });
    }
  };

  // ── Read-only weekly overview ─────────────────────────────────────────────
  const weeklyOverview = (
    <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
          <CalendarDays className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground leading-none">Weekly Schedule</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Click a day to edit its schedule in the form below
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {slotsLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {DAYS.map((day) => (
              <div key={day} className="h-24 rounded-lg bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {DAYS.map((day) => {
              const slots = slotsByDay[day] ?? [];
              const hasData = slots.length > 0;
              const isActive = selectedDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleOverviewDayClick(day)}
                  className={cn(
                    "relative flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all duration-150",
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : hasData
                        ? "border-secondary/40 bg-secondary/5 hover:border-secondary/70 hover:bg-secondary/10"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <span className={cn(
                    "text-xs font-bold",
                    isActive ? "text-primary" : hasData ? "text-secondary" : "text-muted-foreground",
                  )}>
                    {DAY_LABELS[day]}
                  </span>

                  {hasData ? (
                    <div className="space-y-1 w-full">
                      {slots.map((slot, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                          <span className="text-[10px] text-foreground leading-tight">
                            {formatDisplayTime(slot.startTime)}–{formatDisplayTime(slot.endTime)}
                          </span>
                        </div>
                      ))}
                      <div className="absolute top-2 right-2">
                        <Pencil className="w-2.5 h-2.5 text-muted-foreground/60" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <PlusCircle className="w-2.5 h-2.5 text-muted-foreground/40" />
                      <span className="text-[10px] text-muted-foreground/60">Not set</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // ── Create / Edit form ────────────────────────────────────────────────────
  const formLabel =
    selectedDays.length === 1
      ? `${slotsByDay[selectedDays[0]]?.length ? "Edit" : "Add"} Schedule — ${DAY_FULL[selectedDays[0]]}`
      : selectedDays.length > 1
        ? `Set Schedule — ${selectedDays.map((d) => DAY_LABELS[d]).join(", ")}`
        : t("schedule.title");

  const scheduleForm = (
    <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <CalendarCheck2 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground leading-none">{formLabel}</h2>
          <p className="text-xs text-muted-foreground mt-1">{t("schedule.description")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Day picker */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {t("schedule.select_day")} *
          </p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const isSelected = selectedDays.includes(day);
              const hasData = !!slotsByDay[day]?.length;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200",
                    isSelected
                      ? "bg-primary text-white border-primary shadow-sm"
                      : hasData
                        ? "bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20"
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

        {/* Primary time block */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Primary Time Block *
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
              options={locationOption}
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

        {/* Secondary time block */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Secondary Time Block (Optional)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ControlledSelect
              name="loc2.doctorLocationId"
              label="Location"
              control={control}
              placeholder="Add second time block"
              options={locationOption}
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
          {isSubmitting ? "Saving…" : "Confirm Availability"}
        </Button>
      </form>
    </div>
  );

  return (
    <div className="space-y-4">
      {weeklyOverview}
      {scheduleForm}
    </div>
  );
}
