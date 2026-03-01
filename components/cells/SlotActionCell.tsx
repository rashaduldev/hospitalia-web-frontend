"use client";

import { useState } from "react";
import { Pencil, Trash2, MoreVertical, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

const VALID_TIME_SLOTS = [
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
];

export const SlotActionCell = ({ slot }: { slot: any }) => {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [formData, setFormData] = useState({
    dayOfWeek: slot.dayOfWeek || "",
    startTime: slot.startTime?.replace("Z", "") || "",
    endTime: slot.endTime?.replace("Z", "") || "",
    timeSlot: String(slot.timeSlot || "10"),
    doctorLocationId: slot.doctorLocationId || "",
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      console.log("Updating:", slot.id, payload);
      // await updateDoctorAvailability(slot.id, payload);
    },
    onSuccess: () => {
      toast.success("Updated successfully");
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
      setIsEditOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      console.log("Deleting:", id);
      // await deleteDoctorAvailability(id);
    },
    onSuccess: () => {
      toast.success("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["doctor-availability"] });
      setIsDeleteOpen(false);
    },
  });

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-primary hover:bg-background"
        onClick={() => setIsEditOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>

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

      {/* EDIT DIALOG */}
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
                onValueChange={(v) =>
                  setFormData({ ...formData, dayOfWeek: v })
                }
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
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location ID</label>
              <Input
                value={formData.doctorLocationId}
                onChange={(e) =>
                  setFormData({ ...formData, doctorLocationId: e.target.value })
                }
              />
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
            <Button
              onClick={() => updateMutation.mutate(formData)}
              disabled={updateMutation.isPending}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PROFESSIONAL DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-100">
          <div className="flex flex-col items-center text-center p-2">
            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <DialogTitle className="text-xl">Are you sure?</DialogTitle>
            <DialogDescription className="mt-2 text-base">
              This will permanently delete the schedule for{" "}
              <strong>{slot.dayOfWeek}</strong>.
            </DialogDescription>
          </div>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => deleteMutation.mutate(slot.id)}
              disabled={deleteMutation.isPending}
            >
              Delete Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
