"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, MoreVertical, AlertCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import AppButton from "../common/AppButton";
import { ControlledSelect } from "../common/FormUIControllers/ControlledSelect";
import {
  deleteAvailabilitySlot,
  updateDoctorAvailability,
} from "@/actions/doctor/availability";
import { ErrorHandle } from "../common/ErrorHandle";
import { DoctorAvailabilitySlot } from "@/types/doctor.slot";
import { ControlledInput } from "../common/FormUIControllers/ControlledInput";
import { getDoctorLocations } from "@/actions/doctor/location";
import { Location } from "@/types/doctor.location.type";

const TIME_SLOTS = [
  { label: "10 Minutes", value: "10" },
  { label: "15 Minutes", value: "15" },
  { label: "30 Minutes", value: "30" },
  { label: "90 Minutes", value: "90" },
  { label: "1 Hour", value: "60" },
  { label: "2 Hours", value: "120" },
];

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
].map((day) => ({ label: day, value: day }));

type FormDataType = {
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  startTime: string;
  endTime: string;
  timeSlot: string;
  doctorLocationId: string | number;
};

export const SlotActionCell = ({ slot }: { slot: DoctorAvailabilitySlot }) => {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const { control, handleSubmit } = useForm<FormDataType>({
    defaultValues: {
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime?.replace("Z", ""),
      endTime: slot.endTime?.replace("Z", ""),
      timeSlot: String(slot.timeSlot),
      doctorLocationId: String(slot.doctorLocationId),
    },
  });

  const { data: locationResponse } = useQuery({
    queryKey: ["doctor-locations", slot.doctorUserId],
    queryFn: () =>
      getDoctorLocations({
        lang: "en",
        doctorUserId: slot.doctorUserId,
      }),
  });
  const locationOptions =
    locationResponse?.payload?.map((loc: Location) => ({
      label: loc.locationName,
      value: String(loc.locationId),
    })) || [];

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (formData: FormDataType) => {
      await updateDoctorAvailability({
        doctorUserId: slot.doctorUserId,
        availabilityIds: [slot.id],
        weeklySchedule: [
          {
            dayOfWeek: formData.dayOfWeek,
            startTime: formData.startTime,
            endTime: formData.endTime,
            timeSlot: formData.timeSlot,
            doctorLocationId: Number(formData.doctorLocationId),
            availabilityStatus: "AVAILABLE",
          },
        ],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
      setIsEditOpen(false);
    },
    onError: (error) => {
      setStatusMessage("Update failed: " + error?.message);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteAvailabilitySlot({ id });
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
      setIsDeleteOpen(false);
      setStatusMessage(res?.message || "Deleted successfully");
    },
    onError: (error) => {
      setStatusMessage(
        "Update failed: " +
          (error instanceof Error ? error.message : JSON.stringify(error)),
      );
    },
  });

  const onUpdateSubmit = (data: FormDataType) => {
    updateMutation.mutate(data);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <AppButton
        variant="ghost"
        size="sm"
        onClick={() => setIsEditOpen(true)}
        leftIcon={<Pencil className="h-4 w-4" />}
        className="bg-transparent hover:bg-transparent active:bg-transparent shadow-none"
      >
        Edit
      </AppButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AppButton variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </AppButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-destructive font-medium"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-112.5">
          <DialogHeader>
            <DialogTitle className="text-2xl">Update Schedule</DialogTitle>
          </DialogHeader>

          {/* EDIT DIALOG */}
          <form onSubmit={handleSubmit(onUpdateSubmit)} className="grid gap-4">
            {updateMutation.isError && (
              <ErrorHandle
                message={
                  updateMutation.error?.message || "Failed to update schedule."
                }
                type="inline"
              />
            )}

            <ControlledSelect
              name="dayOfWeek"
              label="Day of Week"
              control={control}
              options={DAYS_OF_WEEK}
              placeholder="Select Day"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <ControlledInput
                  label="Start Time"
                  name="startTime"
                  control={control}
                  type="time"
                />
              </div>
              <div className="space-y-2">
                <ControlledInput
                  label="End Time"
                  name="endTime"
                  control={control}
                  type="time"
                />
              </div>
            </div>

            <div className="space-y-2">
              <ControlledSelect
                name="doctorLocationId"
                label="Location"
                control={control}
                options={locationOptions}
                placeholder="Select location"
              />
            </div>

            <ControlledSelect
              name="timeSlot"
              label="Time Slot"
              control={control}
              options={TIME_SLOTS}
            />

            <DialogFooter>
              <AppButton
                variant="outline"
                type="button"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </AppButton>
              <AppButton type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save"}
              </AppButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-100">
          <div className="flex flex-col items-center text-center p-2">
            <div className="h-14 w-14 rounded-full bg-background flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <DialogTitle className="text-xl">Are you sure?</DialogTitle>
            <DialogDescription className="mt-2 text-base">
              This will permanently delete the schedule for{" "}
              <strong>{slot.dayOfWeek}</strong>.
            </DialogDescription>

            {deleteMutation.isError && (
              <ErrorHandle
                message={
                  deleteMutation.error?.message ||
                  "Error: Could not delete schedule."
                }
                type="inline"
              />
            )}
          </div>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <AppButton
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </AppButton>
            <AppButton
              variant="destructive"
              className="flex-1"
              onClick={() => deleteMutation.mutate(slot.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Now"}
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
