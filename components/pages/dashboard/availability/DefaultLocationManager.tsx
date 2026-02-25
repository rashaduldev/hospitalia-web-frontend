"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, Trash, Pencil, Save, X } from "lucide-react";

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
import AppButton from "@/components/common/AppButton";

export function DefaultLocationManager({
  lang,
  doctorUserId,
}: {
  lang: string;
  doctorUserId: number;
}) {
  const t = useI18n();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { handleSubmit, reset, setValue, control } =
    useForm<LocationFormValues>({
      resolver: zodResolver(locationSchema) as any,
      defaultValues: { locationName: "", addressLine1: "", city: "" },
    });

  const { data: response, isLoading } = useQuery({
    queryKey: ["doctor-locations", doctorUserId],
    queryFn: () => getDoctorLocations({ lang, doctorUserId }),
  });

  const locations = response?.payload || [];

  const chunkedLocations = [];
  for (let i = 0; i < locations.length; i += 5) {
    chunkedLocations.push(locations.slice(i, i + 5));
  }

  const mutation = useMutation({
    mutationFn: async (data: LocationFormValues) => {
      const userId = Number(doctorUserId);
      if (editingId) {
        return updateDoctorLocation({
          locationId: editingId,
          doctorUserId: userId,
          ...data,
        } as UpdateLocationParams);
      }
      return createDoctorLocation({ lang, ...data, doctorUserId: userId });
    },
    onSuccess: () => {
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

  const onSubmit: SubmitHandler<LocationFormValues> = (data) =>
    mutation.mutate(data);

  const deleteMutation = useMutation({
    mutationFn: (locationId: number) =>
      deleteDoctorLocation({ lang, locationId, doctorUserId }),
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
    <div className="space-y-6">
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

        <div className="flex gap-2">
          <AppButton
            className="px-5 rounded-lg"
            type="submit"
            isLoading={mutation.isPending}
            leftIcon={editingId && <Save size={16} />}
          >
            {editingId ? "Update Location" : "Add Default Location"}
          </AppButton>

          {editingId && (
            <AppButton
              variant="outline"
              type="button"
              leftIcon={<X size={16} />}
              onClick={() => {
                setEditingId(null);
                reset();
              }}
            >
              Cancel
            </AppButton>
          )}
        </div>

        {successMessage && (
          <span className="text-secondary text-sm flex items-center gap-1 mt-2">
            <CheckCircle2 size={14} /> {successMessage}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {chunkedLocations.map((chunk, columnIndex) => (
            <div key={columnIndex} className="flex flex-col">
              {chunk.map((loc: Location) => (
                <div
                  key={loc.locationId}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div className="flex flex-col gap-1">
                    <Typography size="sm" color="foreground">
                      {loc.locationName}
                    </Typography>
                    <Typography size="xs" color="muted_foreground">
                      {loc.addressLine1}
                    </Typography>
                  </div>

                  <div className="flex gap-1">
                    <AppButton
                      variant="ghost"
                      onClick={() => {
                        setEditingId(loc.locationId);
                        setValue("locationName", loc.locationName);
                        setValue("addressLine1", loc.addressLine1);
                        setValue("city", loc.city);
                        setValue("postalCode", Number(loc.postalCode));
                      }}
                    >
                      <Pencil size={16} />
                    </AppButton>
                    <AppButton
                      className="bg-destructive hover:bg-destructive text-muted"
                      onClick={() => setDeleteId(loc.locationId)}
                    >
                      <Trash size={16} />
                    </AppButton>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
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
            <AppButton variant="outline" onClick={() => setDeleteId(null)}>
              {t("availability.btn_no")}
            </AppButton>
            <AppButton
              variant="destructive"
              isLoading={deleteMutation.isPending}
              loadingText={t("availability.btn_deleting")}
              onClick={() => deleteMutation.mutate(deleteId!)}
            >
              {t("availability.btn_yes")}
            </AppButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
