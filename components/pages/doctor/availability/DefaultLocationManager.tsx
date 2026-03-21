"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import { Check, CheckCircle2, Trash2, Pencil, Save, X, MapPin } from "lucide-react";
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
import { getAppointmentTypes } from "@/actions/doctor/appointment-types";
import { useI18n } from "@/locales/client";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const COUNTRY_OPTIONS = [
  { label: "Bangladesh", value: "Bangladesh" },
  { label: "Burkina Faso", value: "Burkina Faso" },
  { label: "Cape Verde", value: "Cape Verde" },
  { label: "Côte d'Ivoire", value: "Côte d'Ivoire" },
  { label: "France", value: "France" },
  { label: "Gambia", value: "Gambia" },
  { label: "Ghana", value: "Ghana" },
  { label: "Guinea", value: "Guinea" },
  { label: "Guinea-Bissau", value: "Guinea-Bissau" },
  { label: "Mali", value: "Mali" },
  { label: "Mauritania", value: "Mauritania" },
  { label: "Morocco", value: "Morocco" },
  { label: "Niger", value: "Niger" },
  { label: "Nigeria", value: "Nigeria" },
  { label: "Senegal", value: "Senegal" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "United States", value: "United States" },
];

const CURRENCY_OPTIONS = [
  { label: "XOF — West African CFA Franc", value: "XOF" },
  { label: "EUR — Euro", value: "EUR" },
  { label: "USD — US Dollar", value: "USD" },
  { label: "GBP — British Pound", value: "GBP" },
  { label: "XAF — Central African CFA Franc", value: "XAF" },
  { label: "NGN — Nigerian Naira", value: "NGN" },
  { label: "GHS — Ghanaian Cedi", value: "GHS" },
  { label: "MAD — Moroccan Dirham", value: "MAD" },
];

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

  const { handleSubmit, reset, setValue, watch, control } =
    useForm<LocationFormValues>({
      resolver: zodResolver(locationSchema(t)) as Resolver<LocationFormValues>,
      defaultValues: {
        locationName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        newPatientFee: undefined,
        oldPatientFee: undefined,
        feeCurrency: "",
        supportedAppointmentTypeIds: [],
      },
    });

  const selectedTypeIds = watch("supportedAppointmentTypeIds");

  const { data: response, isLoading } = useSafeQuery({
    queryKey: ["doctor-locations", doctorUserId],
    queryFn: () => getDoctorLocations({ lang, doctorUserId }),
  });

  const { data: appointmentTypesRes } = useSafeQuery({
    queryKey: ["appointmentTypes", lang],
    queryFn: () => getAppointmentTypes(lang),
  });
  const appointmentTypes = appointmentTypesRes?.payload || [];

  const locations = response?.payload || [];

  const chunkedLocations = [];
  for (let i = 0; i < locations.length; i += 5) {
    chunkedLocations.push(locations.slice(i, i + 5));
  }

  const toggleAppointmentType = (id: number) => {
    const current = selectedTypeIds ?? [];
    const updated = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    setValue("supportedAppointmentTypeIds", updated);
  };

  const mutation = useSafeMutation({
    mutationFn: (data: LocationFormValues) => {
      const payload = {
        lang,
        locationName: data.locationName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2 || undefined,
        city: data.city,
        state: data.state || undefined,
        country: data.country || undefined,
        postalCode: data.postalCode,
        newPatientFee: data.newPatientFee,
        oldPatientFee: data.oldPatientFee,
        feeCurrency: data.feeCurrency || undefined,
        supportedAppointmentTypeIds: data.supportedAppointmentTypeIds,
        doctorUserId,
      };
      if (editingId) {
        return updateDoctorLocation({ ...payload, locationId: editingId } as UpdateLocationParams);
      }
      return createDoctorLocation(payload);
    },
    onSuccess: () => {
      setSuccessMessage(
        editingId ? "Location updated successfully." : "Location added successfully.",
      );
      queryClient.invalidateQueries({ queryKey: ["doctor-locations", doctorUserId] });
      setEditingId(null);
      reset();
    },
  });

  const onSubmit: SubmitHandler<LocationFormValues> = (data) => mutation.mutate(data);

  const deleteMutation = useSafeMutation({
    mutationFn: (locationId: number) =>
      deleteDoctorLocation({ lang, locationId, doctorUserId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-locations", doctorUserId] });
      setDeleteId(null);
    },
  });

  const startEditing = (loc: Location) => {
    setEditingId(loc.locationId);
    setValue("locationName", loc.locationName);
    setValue("addressLine1", loc.addressLine1);
    setValue("addressLine2", loc.addressLine2 ?? "");
    setValue("city", loc.city);
    setValue("state", loc.state ?? "");
    setValue("country", loc.country ?? "");
    setValue("postalCode", loc.postalCode);
    setValue("newPatientFee", loc.newPatientFee ?? undefined);
    setValue("oldPatientFee", loc.oldPatientFee ?? undefined);
    setValue("feeCurrency", loc.feeCurrency ?? "");
    setValue(
      "supportedAppointmentTypeIds",
      loc.supportedAppointmentTypes?.map((a) => a.id) ?? [],
    );
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {editingId ? "Edit Location" : t("availability.deafult_location")}
        </p>

        {/* Address */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">Address</p>
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
              name="addressLine2"
              placeholder="Address Line 2 (optional)"
              control={control}
            />
            <ControlledInput
              name="city"
              placeholder={t("availability.city_placeh")}
              control={control}
            />
            <ControlledInput
              name="state"
              placeholder="State / Region (optional)"
              control={control}
            />
            <ControlledSelect
              name="country"
              placeholder="Country (optional)"
              control={control}
              options={COUNTRY_OPTIONS}
            />
            <ControlledInput
              name="postalCode"
              placeholder={t("availability.postal_code_placeh")}
              control={control}
            />
          </div>
        </div>

        {/* Consultation Fees */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">Consultation Fees</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ControlledInput
              name="newPatientFee"
              placeholder="New Patient Fee"
              control={control}
              type="number"
            />
            <ControlledInput
              name="oldPatientFee"
              placeholder="Returning Patient Fee"
              control={control}
              type="number"
            />
            <ControlledSelect
              name="feeCurrency"
              placeholder="Currency"
              control={control}
              options={CURRENCY_OPTIONS}
            />
          </div>
        </div>

        {/* Appointment Types */}
        {appointmentTypes.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium">
              Supported Appointment Types
            </p>
            <div className="flex flex-wrap gap-3">
              {appointmentTypes.map((type) => {
                const checked = (selectedTypeIds ?? []).includes(type.id);
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => toggleAppointmentType(type.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 border text-sm transition-all duration-150",
                      checked
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-border text-foreground hover:border-primary/40",
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center",
                      checked ? "bg-primary border-primary" : "border-muted-foreground/40",
                    )}>
                      {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                    {type.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button type="submit" disabled={mutation.isPending} className="gap-2">
            {editingId ? <Save className="w-4 h-4" /> : null}
            {mutation.isPending
              ? editingId ? "Updating…" : "Adding…"
              : editingId ? "Update Location" : "Add Location"}
          </Button>
          {editingId && (
            <Button
              variant="outline"
              type="button"
              className="gap-2"
              onClick={() => { setEditingId(null); reset(); }}
            >
              <X className="w-4 h-4" /> Cancel
            </Button>
          )}
        </div>

        {successMessage && (
          <p className="text-secondary text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMessage}
          </p>
        )}
      </form>

      {/* Location List */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t("availability.deafult_location")}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {[...Array(2)].map((_, col) => (
              <div key={col} className="flex flex-col gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-3">
                    <div className="flex flex-col gap-1.5 flex-1 pr-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : locations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg bg-muted/40 border border-dashed border-border">
            <MapPin className="w-8 h-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">{t("availability.no_deafult_location")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {chunkedLocations.map((chunk, columnIndex) => (
              <div key={columnIndex} className="flex flex-col">
                {chunk.map((loc: Location) => (
                  <div
                    key={loc.locationId}
                    className="flex items-start justify-between border-b py-3 gap-4 last:border-0"
                  >
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground break-all leading-tight">
                        {loc.locationName}
                      </p>
                      {loc.addressLine1 && (
                        <p className="text-xs text-muted-foreground break-all leading-relaxed">
                          {loc.addressLine1}
                        </p>
                      )}
                      {(loc.city || loc.postalCode) && (
                        <p className="text-xs text-muted-foreground/80">
                          {loc.city}{loc.postalCode ? ` — ${loc.postalCode}` : ""}
                        </p>
                      )}
                      {(loc.newPatientFee != null || loc.oldPatientFee != null) && (
                        <div className="flex items-center gap-3 mt-0.5">
                          {loc.newPatientFee != null && (
                            <span className="text-xs text-secondary font-medium">
                              New: {loc.newPatientFee.toLocaleString()} {loc.feeCurrency ?? ""}
                            </span>
                          )}
                          {loc.oldPatientFee != null && (
                            <span className="text-xs text-primary font-medium">
                              Returning: {loc.oldPatientFee.toLocaleString()} {loc.feeCurrency ?? ""}
                            </span>
                          )}
                        </div>
                      )}
                      {loc.supportedAppointmentTypes && loc.supportedAppointmentTypes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {loc.supportedAppointmentTypes.map((a) => (
                            <span
                              key={a.id}
                              className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"
                            >
                              {a.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0 mt-0.5">
                      <button
                        type="button"
                        className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        onClick={() => startEditing(loc)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => setDeleteId(loc.locationId)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-destructive/10 shrink-0">
                <Trash2 className="h-4 w-4 text-destructive" />
              </div>
              <DialogTitle className="text-base font-semibold">
                {t("availability.delete_title")}
              </DialogTitle>
            </div>
            <DialogDescription>
              {t("availability.delete_description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              {t("availability.btn_no")}
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(deleteId!)}
            >
              {deleteMutation.isPending ? t("availability.btn_deleting") : t("availability.btn_yes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
