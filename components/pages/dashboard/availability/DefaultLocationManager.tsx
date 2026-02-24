"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  locationSchema,
  LocationFormValues,
} from "@/schema/doctor.location.schema";
import { Location, UpdateLocationParams } from "@/types/doctor.location.type";
import {
  createDoctorLocation,
  deleteDoctorLocation,
  getDoctorLocations,
  updateDoctorLocation,
} from "@/actions/doctor/location";
import { useI18n } from "@/locales/client";
import { Typography } from "@/components/ui/Typography";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";

export function DefaultLocationManager({
  lang,
  doctorUserId,
}: {
  lang: string,
  doctorUserId: number;
}) {
  const t = useI18n();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema) as any,
    defaultValues: {
      locationName: "",
      addressLine1: "",
      city: "",
    },
  });
  const { data: response, isLoading } = useQuery({
    queryKey: ["doctor-locations", doctorUserId],
    queryFn: () => getDoctorLocations({
      lang,
      doctorUserId
    }),
  });

  const locations = response?.payload || [];
  const mutation = useMutation({
    mutationFn: async (data: LocationFormValues) => {
      const userId = Number(doctorUserId);
      if (editingId) {
        return updateDoctorLocation({
          locationId: editingId,
          doctorUserId: userId,
          locationName: data.locationName,
          addressLine1: data.addressLine1,
          city: data.city,
          postalCode: data.postalCode,
        } as UpdateLocationParams);
      }
      return createDoctorLocation({
        lang,
        locationName: data.locationName,
        addressLine1: data.addressLine1,
        city: data.city,
        postalCode: data.postalCode,
        doctorUserId: userId,
      });
    },
    onSuccess: (_, variables) => {
      setSuccessMessage(
        editingId
          ? "Location Updated Successfully"
          : "Default Location Added Successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["doctor-locations", doctorUserId],
      });

      setEditingId(null);
      reset();
      setTimeout(() => setSuccessMessage(null), 5000);
    },
  });

  const onSubmit: SubmitHandler<LocationFormValues> = (data) => {
    mutation.mutate(data);
  };
  // --- Delete Mutation ---
  const deleteMutation = useMutation({
    mutationFn: (locationId: number) =>
      deleteDoctorLocation({
        lang,
        locationId,
        doctorUserId
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["doctor-locations", doctorUserId],
      });
      setDeleteId(null);
    },
  });

  if (isLoading)
    return (
      <div className="py-10 text-center">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Typography
          size="sm"
          weight="medium"
          color="foreground"
          className="mb-2"
        >
          {t("availability.deafult_location")}
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <ControlledInput
            name="locationName"
            placeholder={t("availability.hospital_name_search")}
            control={control}
          />

          <ControlledInput
            name="addressLine1"
            placeholder={t("availability.hospital_location_search")}
            control={control}
          />

          <ControlledInput
            name="city"
            placeholder={t("availability.city_placeh")}
            control={control}
          />

          <ControlledInput
            name="postalCode"
            placeholder={t("availability.postal_code_placeh")}
            control={control}
          />
        </div>

        <Button className="px-5" type="submit" disabled={mutation.isPending}>
          {mutation.isPending && (
            <Loader2 className="animate-spin size-4 mr-2" />
          )}
          {editingId ? "Update Location" : "Add Default Location"}
        </Button>

        {editingId && (
          <Button
            variant="outline"
            type="button"
            className="ml-2"
            onClick={() => {
              setEditingId(null);
              reset();
            }}
          >
            Cancel
          </Button>
        )}
        {successMessage && (
          <span className="text-secondary text-sm flex items-center gap-1">
            <CheckCircle2 size={14} />
            {successMessage}
          </span>
        )}
        {mutation.isError && (
          <span className="text-destructive text-sm flex items-center gap-1">
            <AlertCircle size={14} /> Failed to save.
          </span>
        )}
      </form>

      {/* List Section */}
      <div className="space-y-3">
        <Typography
          size="sm"
          weight="medium"
          color="foreground"
          className="mb-2"
        >
          {t("availability.deafult_location")}
        </Typography>
        {locations?.map((loc: Location) => (
          <div
            key={loc.locationId}
            className="flex items-center justify-between border-b"
          >
            <div className="flex gap-4 p-2">
              <div>
                <Typography
                  size="sm"
                  className="mb-1.5"
                  as="p"
                  color="foreground"
                >
                  {loc.locationName}
                </Typography>
                <Typography size="sm" as="p" color="muted_foreground">
                  {loc.addressLine1}
                </Typography>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingId(loc.locationId);
                  setValue("locationName", loc.locationName);
                  setValue("addressLine1", loc.addressLine1);
                  setValue("city", loc.city);
                  setValue("postalCode", Number(loc.postalCode));
                }}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="bg-destructive hover:bg-destructive text-muted"
                onClick={() => setDeleteId(loc.locationId)}
              >
                <Trash size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {t("availability.delete_title")}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {t("availability.delete_description")}
          </DialogDescription>
          <DialogFooter className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("availability.btn_no")}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteId!)}
            >
              {deleteMutation.isPending
                ? t("availability.btn_deleting")
                : t("availability.btn_yes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
