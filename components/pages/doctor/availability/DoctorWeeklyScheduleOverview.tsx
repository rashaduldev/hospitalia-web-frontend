"use client";

import { useState } from "react";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import { getDoctorAvailability, deleteAvailabilitySlot } from "@/actions/doctor/availability";
import { useLocations } from "@/hooks/useLocations";
import { useDoctorId } from "@/providers/DoctorIdProvider";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { DoctorAvailabilitySlot } from "@/types/doctor.slot";
import { Location } from "@/types/doctor.location.type";
import { CalendarDays, Clock, Pencil, PlusCircle, Trash2 } from "lucide-react";
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

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const DAY_LABELS: Record<string, string> = {
  SUNDAY: "Sun", MONDAY: "Mon", TUESDAY: "Tue", WEDNESDAY: "Wed",
  THURSDAY: "Thu", FRIDAY: "Fri", SATURDAY: "Sat",
};
const DAY_FULL: Record<string, string> = {
  SUNDAY: "Sunday", MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday", FRIDAY: "Friday", SATURDAY: "Saturday",
};

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
  lang: string;
  onAddSchedule?: (day: string, locationId?: number) => void;
};

export default function DoctorWeeklyScheduleOverview({ doctorUserId, lang, onAddSchedule }: Props) {
  const doctorId = useDoctorId();
  const fetchId = doctorId ?? doctorUserId;
  const queryClient = useQueryClient();

  const [slotToDelete, setSlotToDelete] = useState<DoctorAvailabilitySlot | null>(null);

  const { data: slotsData, isLoading } = useSafeQuery({
    queryKey: ["doctorAvailability", fetchId, "all", lang],
    queryFn: () => getDoctorAvailability({ doctorId: fetchId, lang }),
    enabled: !!fetchId,
  });

  const { locations } = useLocations({ lang, doctorId: fetchId });
  const locationMap: Record<number, string> = {};
  (locations as Location[]).forEach((l) => {
    locationMap[Number(l.locationId)] = l.locationName;
  });

  // Handle both paginated ({ content: [] }) and flat array responses
  const rawPayload = slotsData?.payload as { content?: DoctorAvailabilitySlot[] } | DoctorAvailabilitySlot[] | null;
  const existingSlots: DoctorAvailabilitySlot[] =
    Array.isArray(rawPayload) ? rawPayload : (rawPayload?.content ?? []);

  const slotsByDay: Record<string, DoctorAvailabilitySlot[]> = {};
  existingSlots.forEach((slot) => {
    if (!slotsByDay[slot.dayOfWeek]) slotsByDay[slot.dayOfWeek] = [];
    slotsByDay[slot.dayOfWeek].push(slot);
  });

  const deleteMutation = useSafeMutation({
    mutationFn: (id: number) => deleteAvailabilitySlot({ id, lang }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctorAvailability"] });
      setSlotToDelete(null);
    },
  });

  const handleDeleteConfirm = () => {
    if (slotToDelete) deleteMutation.mutate(slotToDelete.id);
  };

  return (
    <>
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
            <CalendarDays className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">Weekly Schedule</h2>
            <p className="text-xs text-muted-foreground mt-1">Current recurring availability by day</p>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DAYS.map((day) => (
                <div key={day} className="h-24 rounded-lg bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DAYS.map((day) => {
                const slots = slotsByDay[day] ?? [];
                const hasData = slots.length > 0;

                return (
                  <div
                    key={day}
                    className={cn(
                      "flex flex-col items-start gap-1.5 rounded-xl border p-3",
                      hasData ? "border-secondary/40 bg-secondary/5" : "border-border bg-background",
                    )}
                  >
                    <span className={cn(
                      "text-xs font-bold",
                      hasData ? "text-secondary" : "text-muted-foreground",
                    )}>
                      {DAY_LABELS[day]}
                    </span>

                    {hasData ? (
                      <div className="space-y-2 w-full">
                        {slots.map((slot) => (
                          <div key={slot.id} className="flex items-start justify-between gap-1">
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-muted-foreground shrink-0" />
                                <span className="text-[10px] text-foreground leading-tight">
                                  {formatDisplayTime(slot.startTime)}–{formatDisplayTime(slot.endTime)}
                                </span>
                              </div>
                              {locationMap[slot.doctorLocationId] && (
                                <span className="text-[9px] text-muted-foreground leading-tight block pl-3.5 truncate">
                                  {locationMap[slot.doctorLocationId]}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => onAddSchedule?.(day, slot.doctorLocationId)}
                                className="p-0.5 rounded text-muted-foreground/50 hover:text-primary hover:bg-primary/10 transition-colors"
                                aria-label="Edit slot"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSlotToDelete(slot)}
                                className="p-0.5 rounded text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                aria-label="Delete slot"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <PlusCircle className="w-2.5 h-2.5 text-muted-foreground/40" />
                        <span className="text-[10px] text-muted-foreground/60">Not set</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => onAddSchedule?.(day)}
                      className="mt-1 w-full flex items-center justify-center gap-1 rounded-lg border border-dashed border-primary/30 py-1.5 text-[10px] font-medium text-primary/70 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-colors"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Add New
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!slotToDelete} onOpenChange={(open) => { if (!open) setSlotToDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete availability slot?</AlertDialogTitle>
            <AlertDialogDescription>
              {slotToDelete && (
                <>
                  This will remove the{" "}
                  <span className="font-medium text-foreground">
                    {formatDisplayTime(slotToDelete.startTime)}–{formatDisplayTime(slotToDelete.endTime)}
                  </span>{" "}
                  slot on{" "}
                  <span className="font-medium text-foreground">
                    {DAY_FULL[slotToDelete.dayOfWeek]}
                  </span>
                  {locationMap[slotToDelete.doctorLocationId] && (
                    <> at <span className="font-medium text-foreground">{locationMap[slotToDelete.doctorLocationId]}</span></>
                  )}
                  . This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AppButton
              variant="destructive"
              isLoading={deleteMutation.isPending}
              loadingText="Deleting…"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AppButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
