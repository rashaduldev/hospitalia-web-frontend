"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, MapPin, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { toast } from "sonner";
import {
  getHospitalLocations,
  createHospitalLocation,
  updateHospitalLocation,
  deleteHospitalLocation,
  HospitalLocation,
} from "@/actions/hospital/hospitalLocations";
import { HospitalLocationSchema, HospitalLocationFormValues } from "@/schema/hospital.location.schema";

function LocationForm({
  hospitalUserId,
  lang,
  initial,
  onSuccess,
  onCancel,
}: {
  hospitalUserId: number;
  lang: string;
  initial?: HospitalLocation;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HospitalLocationFormValues>({
    resolver: zodResolver(HospitalLocationSchema),
    defaultValues: {
      locationName: initial?.locationName ?? "",
      addressLine1: initial?.addressLine1 ?? "",
      addressLine2: initial?.addressLine2 ?? "",
      city: initial?.city ?? "",
      state: initial?.state ?? "",
      country: initial?.country ?? "",
      postalCode: initial?.postalCode ?? "",
      latitude: initial?.latitude ?? "",
      longitude: initial?.longitude ?? "",
    },
  });

  const onSubmit = async (data: HospitalLocationFormValues) => {
    const body = {
      hospitalUserId,
      locationName: data.locationName,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || null,
      city: data.city,
      state: data.state || null,
      country: data.country || null,
      postalCode: data.postalCode || null,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
    };

    const res = initial
      ? await updateHospitalLocation({ lang, body: { ...body, locationId: initial.id } })
      : await createHospitalLocation({ lang, body });

    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <ControlledInput name="locationName" requiredMark="*" label="Location Name" control={control} placeholder="e.g. Main Branch" />
        </div>
        <div className="sm:col-span-2">
          <ControlledInput name="addressLine1" requiredMark="*" label="Address Line 1" control={control} placeholder="Street address" />
        </div>
        <div className="sm:col-span-2">
          <ControlledInput name="addressLine2" label="Address Line 2" control={control} placeholder="Floor, suite, etc." />
        </div>
        <ControlledInput name="city" requiredMark="*" label="City" control={control} placeholder="City" />
        <ControlledInput name="state" label="State / Division" control={control} placeholder="State or division" />
        <ControlledInput name="country" label="Country" control={control} placeholder="Country" />
        <ControlledInput name="postalCode" label="Postal Code" control={control} placeholder="Postal code" />
        <ControlledInput name="latitude" label="Latitude" type="number" control={control} placeholder="e.g. 23.8103" />
        <ControlledInput name="longitude" label="Longitude" type="number" control={control} placeholder="e.g. 90.4125" />
      </div>

      {errors.root && (
        <p className="text-xs text-destructive font-semibold">{errors.root.message}</p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />{initial ? "Saving..." : "Creating..."}</>
            : initial ? "Save Changes" : "Create Location"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function ManageLocations({
  hospitalUserId,
  lang,
}: {
  hospitalUserId: number;
  lang: string;
}) {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<HospitalLocation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HospitalLocation | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["hospital-locations", hospitalUserId],
    queryFn: () => getHospitalLocations({ lang, hospitalUserId }),
  });
  const locations: HospitalLocation[] = data?.payload ?? [];

  const deleteMutation = useMutation({
    mutationFn: (locationId: number) => deleteHospitalLocation({ lang, locationId }),
    onSuccess: (res) => {
      if (!res.success) { toast.error(res.message); return; }
      toast.success("Location deleted");
      queryClient.invalidateQueries({ queryKey: ["hospital-locations", hospitalUserId] });
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete location"),
  });

  const handleFormSuccess = () => {
    toast.success(editTarget ? "Location updated" : "Location created");
    queryClient.invalidateQueries({ queryKey: ["hospital-locations", hospitalUserId] });
    setFormOpen(false);
    setEditTarget(null);
  };

  const openEdit = (loc: HospitalLocation) => { setEditTarget(loc); setFormOpen(true); };
  const openCreate = () => { setEditTarget(null); setFormOpen(true); };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${locations.length} location${locations.length !== 1 ? "s" : ""}`}
        </p>
        <Button size="sm" className="gap-1.5" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Add Location
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Building2 className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No locations yet</p>
          <p className="text-xs text-muted-foreground">Add your hospital branches and facilities.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          {locations.map((loc, i) => (
            <div
              key={loc.id}
              className={`flex items-start gap-4 px-5 py-4 ${i !== locations.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="p-2 bg-primary/10 rounded-lg shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{loc.locationName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {[loc.addressLine1, loc.addressLine2, loc.city, loc.state, loc.postalCode, loc.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {(loc.latitude != null && loc.longitude != null) && (
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {loc.latitude}, {loc.longitude}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => openEdit(loc)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteTarget(loc)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={(v) => { if (!v) { setFormOpen(false); setEditTarget(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogTitle>{editTarget ? "Edit Location" : "Add Location"}</DialogTitle>
          <LocationForm
            hospitalUserId={hospitalUserId}
            lang={lang}
            initial={editTarget ?? undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => { setFormOpen(false); setEditTarget(null); }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <DialogContent className="max-w-sm">
          <DialogTitle>Delete Location</DialogTitle>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{deleteTarget?.locationName}</span>?
            This will also delete the linked address record.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Deleting...</>
                : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
