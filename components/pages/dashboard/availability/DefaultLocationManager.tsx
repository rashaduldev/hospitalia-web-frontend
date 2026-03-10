"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Trash, Pencil, Save, X } from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";

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
      defaultValues: {
        locationName: "",
        addressLine1: "",
        city: "",
      },
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
      if (editingId) {
        return updateDoctorLocation({
          lang,
          locationId: editingId,
          city: data.city,
          postalCode: data.postalCode,
          doctorUserId,
          locationName: data.locationName,
          addressLine1: data.addressLine1,
        } as UpdateLocationParams);
      }
      return createDoctorLocation({
        lang,
        locationName: data.locationName,
        addressLine1: data.addressLine1,
        city: data.city,
        postalCode: data.postalCode,
        doctorUserId,
      });
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {[...Array(2)].map((_, columnIndex) => (
              <div key={columnIndex} className="flex flex-col">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1"
                  >
                    {/* Left text area */}
                    <div className="flex flex-col gap-1 w-full pr-4">
                      <Skeleton className="h-4 w-3/4 bg-foreground/20" />
                      <Skeleton className="h-3 w-2/3 bg-foreground/20" />
                      <Skeleton className="h-3 w-1/2 bg-foreground/20" />
                      <Skeleton className="h-3 w-1/3 bg-foreground/20" />
                    </div>

                    {/* Right action buttons */}
                    <div className="flex gap-1">
                      <Skeleton className="h-8 w-8 rounded-md bg-foreground/20" />
                      <Skeleton className="h-8 w-8 rounded-md bg-foreground/20" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-6">
            <Typography size="sm" color="muted_foreground">
              You have no default location added.
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {chunkedLocations.map((chunk, columnIndex) => (
              <div key={columnIndex} className="flex flex-col">
                {chunk.map((loc: Location) => (
                  <div
                    key={loc.locationId}
                    className="flex items-start justify-between border-b py-3 gap-4"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <Typography
                        size="sm"
                        color="foreground"
                        className="font-medium wrap-break-word leading-tight"
                      >
                        {loc.locationName}
                      </Typography>

                      <Typography
                        size="xs"
                        color="muted_foreground"
                        className="wrap-break-word whitespace-normal leading-relaxed"
                      >
                        {loc.addressLine1}
                      </Typography>
                      <Typography
                        size="xs"
                        color="muted_foreground"
                        className="opacity-80"
                      >
                        {loc.city} {loc.postalCode ? `- ${loc.postalCode}` : ""}
                      </Typography>
                    </div>
                    <div className="flex gap-1 shrink-0 items-center mt-1">
                      <AppButton
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setEditingId(loc.locationId);
                          setValue("locationName", loc.locationName);
                          setValue("addressLine1", loc.addressLine1);
                          setValue("city", loc.city);
                          setValue("postalCode", loc.postalCode);
                        }}
                      >
                        <Pencil size={16} />
                      </AppButton>
                      <AppButton
                        size="sm"
                        className="h-8 w-8 p-0 bg-destructive hover:bg-destructive/90 text-muted"
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
        )}
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
