"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit3,
  Trash2,
  Loader2,
  MapPin,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/Typography";
import { useI18n } from "@/locales/client";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createDoctorLocation,
  updateDoctorLocation,
  getDoctorLocations,
  deleteDoctorLocation,
} from "@/actions/doctor/location";
import { Location, LocationFormValues } from "@/types/doctor.location.type";
import { locationSchema } from "@/schema/doctor.location.schema";

export function DefaultLocationManager({
  doctorUserId,
}: {
  doctorUserId: string;
}) {
  const t = useI18n();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formStatus, setFormStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [deleteStatus, setDeleteStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { locationName: "", addressLine1: "" },
  });

  const fetchLocations = async () => {
    const res = await getDoctorLocations({ doctorUserId });
    console.log("res", res);

    if (res?.payload) setLocations(res.payload);
    if (!res.success) {
      setError("root", {
        type: "manual",
        message: res.message,
      });
      return;
    }
    setIsInitialLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, [doctorUserId]);

  // Create/Update Logic
  const onSubmit = async (data: LocationFormValues) => {
    setFormStatus(null);
    try {
      // FIX: Ensure keys match what your Server Action expects
      const res = editingId
        ? await updateDoctorLocation({
            locationId:1,
            doctorUserId,
            hospitalName:"",
            address: data?.addressLine1,
          })
        : await createDoctorLocation({
            doctorUserId,
            hospitalName: "",
            address: data?.addressLine1,
            lang: "en",
          });

      if (res?.success) {
        setFormStatus({
          type: "success",
          message: editingId
            ? "Location updated successfully!"
            : "New location added successfully!",
        });

        await fetchLocations();
        handleCancelEdit();
      } else {
        setFormStatus({
          type: "error",
          message: res?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      setFormStatus({ type: "error", message: "A network error occurred." });
    }
  };

  const onEditClick = (loc: Location) => {
    console.log("loc",loc);
    
    setFormStatus(null);
    setEditingId(loc?.locationId);
    setValue("locationName", loc.locationName || "");
    setValue("addressLine1", loc.addressLine1 || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({ locationName: "", addressLine1: "" });
  };

  // Delete Logic
  const confirmDelete = async () => {
    if (!locationToDelete) return;
    setIsDeleting(true);
    setDeleteStatus(null);
    try {
      const res = await deleteDoctorLocation(locationToDelete, doctorUserId);
      if (res?.success) {
        setLocations((prev) =>
          prev.filter((l) => l.locationId !== locationToDelete),
        );
        setDeleteStatus({
          type: "success",
          message: "Location deleted successfully.",
        });
        setTimeout(() => setDeleteStatus(null), 4000);
      } else {
        setDeleteStatus({
          type: "error",
          message: "Failed to delete location.",
        });
      }
    } catch (error) {
      setDeleteStatus({ type: "error", message: "Error deleting location." });
    } finally {
      setIsDeleting(false);
      setLocationToDelete(null);
    }
  };

  return (
    <div className="pb-10">
      {/* --- FORM SECTION --- */}
      <div
        className={cn(
          "rounded-xl transition-all duration-300 mb-8",
          editingId ? "bg-primary/5 ring-1 ring-primary/10" : "bg-muted/30",
        )}
      >
        <Typography
          size="sm"
          weight="medium"
          color="foreground"
          className="mb-2"
        >
          {t("availability.deafult_location")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="space-y-1">
              <Input
                {...register("locationName")}
                placeholder={t("availability.hospital_name_search")}
                className="max-w-112.5"
              />
              {errors.locationName && (
                <p className="text-[10px] text-destructive font-medium">
                  {errors.locationName.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Input
                {...register("addressLine1")}
                placeholder={t("availability.hospital_location_search")}
                className="max-w-112.5"
              />
              {errors.addressLine1 && (
                <p className="text-[10px] text-destructive font-medium">
                  {errors.addressLine1.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-48.75"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : editingId ? (
                  "Update Location"
                ) : (
                  "Add Default Location"
                )}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>

            {formStatus && (
              <div
                className={cn(
                  "flex items-center gap-2 text-sm font-medium p-2 rounded-md transition-all animate-in fade-in slide-in-from-top-1",
                  formStatus.type === "success"
                    ? "text-primary bg-background"
                    : "text-destructive bg-destructive/5",
                )}
              >
                {formStatus.type === "success" ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <AlertCircle className="size-4" />
                )}
                {formStatus.message}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* --- LIST SECTION --- */}
      <div className="space-y-4">
        {deleteStatus && (
          <div
            className={cn(
              "p-3 rounded-lg text-sm flex items-center gap-2 animate-pulse",
              deleteStatus.type === "success"
                ? "bg-background text-secondary"
                : "bg-background text-destructive",
            )}
          >
            {deleteStatus.message}
          </div>
        )}

        {isInitialLoading ? (
          <div className="py-20 flex flex-col items-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : locations.length > 0 ? (
          locations.map((loc) => (
            <div
              key={loc.locationId}
              className={cn(
                "flex items-center justify-between p-4 border rounded-xl transition-all",
                editingId === loc.locationId
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "bg-card hover:bg-muted/10",
              )}
            >
              <div className="flex gap-4 items-start">
                <div className="mt-0.5 p-2 rounded-lg bg-muted text-muted-foreground">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="font-bold text-sm leading-none">
                    {loc.locationName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {loc.addressLine1}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full"
                  onClick={() => onEditClick(loc)}
                >
                  <Edit3 className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full text-destructive hover:bg-destructive/10"
                  onClick={() => setLocationToDelete(loc.locationId)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
            <MapPin className="size-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No locations found.</p>
          </div>
        )}
      </div>

      {/* --- DELETE DIALOG --- */}
      <Dialog
        open={locationToDelete !== null}
        onOpenChange={(open) => !open && setLocationToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this location? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setLocationToDelete(null)}
              disabled={isDeleting}
            >
              No, Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
