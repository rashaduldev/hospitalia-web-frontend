"use client";

import { useState } from "react";
import { Pencil, Trash2, MoreVertical, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppButton from "../common/AppButton";
import { deleteAvailabilitySlot, updateDoctorAvailability } from "@/actions/doctor/availability";

const VALID_TIME_SLOTS = [
  { label: "10 Minutes", value: "MIN_10" },
  { label: "15 Minutes", value: "MIN_15" },
  { label: "30 Minutes", value: "MIN_30" },
  { label: "90 Minutes", value: "MIN_90" },
  { label: "1 Hour", value: "HOUR_1" },
  { label: "2 Hours", value: "HOUR_2" },
];

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

type FormDataType = {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  timeSlot: string;
  doctorLocationId: number;
};

export const SlotActionCell = ({ slot }: { slot: any }) => {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [formData, setFormData] = useState<FormDataType>({
    dayOfWeek: slot.dayOfWeek || "",
    startTime: slot.startTime?.slice(0, 8) || "00:00:00",
    endTime: slot.endTime?.slice(0, 8) || "00:00:00",
    timeSlot: String(slot.timeSlot || "10"),
    doctorLocationId: Number(slot.doctorLocationId || 0),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormDataType) => {
  return await updateDoctorAvailability({
    doctorUserId: slot.doctorUserId,
    availabilityIds: slot.id,
    weeklySchedule: [
      {
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime + "Z",
        endTime: data.endTime + "Z",
        timeSlot: data.timeSlot, 
        doctorLocationId: data.doctorLocationId,
        availabilityStatus: "AVAILABLE",
      },
    ],
  });
},
    onSuccess: (updatedSlot) => {
      // Update cache
      queryClient.setQueryData(["doctor-availability"], (old: any) => {
        if (!old) return [updatedSlot];
        return old.map((s: any) => (s.id === slot.id ? { ...s, ...formData } : s));
      });
      setIsEditOpen(false);
      setStatusMessage("Schedule updated successfully ");
    },
    onError: (error: any) => {
      setStatusMessage("Update failed : " + (error?.message || "Unknown error"));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await deleteAvailabilitySlot({ id });
    },
    onSuccess: () => {
      queryClient.setQueryData(["doctor-availability"], (old: any) =>
        old.filter((s: any) => s.id !== slot.id)
      );
      setIsDeleteOpen(false);
      setStatusMessage("Deleted successfully ");
    },
    onError: (error: any) => {
      setStatusMessage("Delete failed : " + (error?.message || "Unknown error"));
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {/* {statusMessage && (
        <div className="text-center text-sm font-medium text-primary">{statusMessage}</div>
      )} */}

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
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
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

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-112.5">
            <DialogHeader>
              <DialogTitle>Edit Schedule</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Day of Week</label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(v) => setFormData({ ...formData, dayOfWeek: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input
                    type="time"
                    step={1} // include seconds
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time</label>
                  <Input
                    type="time"
                    step={1}
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Slot</label>
                <Select
                  value={formData.timeSlot}
                  onValueChange={(v) => setFormData({ ...formData, timeSlot: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_TIME_SLOTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => updateMutation.mutate(formData)} disabled={updateMutation.isLoading}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-100">
            <div className="flex flex-col items-center text-center p-2">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <DialogTitle className="text-xl">Are you sure?</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                This will permanently delete the schedule for <strong>{slot.dayOfWeek}</strong>.
              </DialogDescription>
            </div>
            <DialogFooter className="sm:justify-center gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => deleteMutation.mutate(slot.id)}
                disabled={deleteMutation.isLoading}
              >
                Delete Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};