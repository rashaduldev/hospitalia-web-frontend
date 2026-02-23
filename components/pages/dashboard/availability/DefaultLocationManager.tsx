"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Trash2, Loader2, MapPin, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { locationSchema, LocationFormValues } from "@/schema/doctor.location.schema";
import { Location } from "@/types/doctor.location.type";
import { cn } from "@/lib/utils";
import { useLocations } from "@/hooks/use-locations";

export function DefaultLocationManager({ doctorUserId }: { doctorUserId: string }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const { data: locations, isLoading, mutation, deleteMutation } = useLocations(doctorUserId);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
  });
  const onSubmit: SubmitHandler<LocationFormValues> = async (formData) => {
    await mutation.mutateAsync({
      locationId: editingId ?? undefined,
      doctorUserId: doctorUserId,
      locationName: formData.locationName,
      addressLine1: formData.addressLine1,
      city: formData.city,
      postalCode: formData.postalCode,
      addressLine2: "", 
      country: "Bangladesh",
      state: "Dhaka",
      longitude: 0,
      latitude: 0,
    });
    setEditingId(null);
    reset();
  };

  if (isLoading) return <div className="py-10 text-center"><Loader2 className="mx-auto animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* form */}
      <div className={cn("p-6 rounded-xl border transition-all", editingId ? "bg-primary/5 border-primary/30" : "bg-muted/20 border-border")}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Location Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold ml-1">Hospital Name *</label>
              <Input {...register("locationName")} placeholder="e.g. Apollo Hospital" className="bg-background" />
              {errors.locationName && <p className="text-[10px] text-destructive">{errors.locationName.message}</p>}
            </div>

            {/* Address Line 1 */}
            <div className="space-y-1">
              <label className="text-xs font-semibold ml-1">Address *</label>
              <Input {...register("addressLine1")} placeholder="Street or Area" className="bg-background" />
              {errors.addressLine1 && <p className="text-[10px] text-destructive">{errors.addressLine1.message}</p>}
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-semibold ml-1">City *</label>
              <Input {...register("city")} placeholder="e.g. Dhaka" className="bg-background" />
              {errors.city && <p className="text-[10px] text-destructive">{errors.city.message}</p>}
            </div>

            {/* Postal Code */}
            <div className="space-y-1">
              <label className="text-xs font-semibold ml-1">Postal Code *</label>
              <Input {...register("postalCode")} placeholder="e.g. 1212" className="bg-background" />
              {errors.postalCode && <p className="text-[10px] text-destructive">{errors.postalCode.message}</p>}
            </div>

          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="animate-spin size-4 mr-2" />}
              {editingId ? "Update Location" : "Save Location"}
            </Button>
            {editingId && <Button variant="outline" type="button" onClick={() => { setEditingId(null); reset(); }}>Cancel</Button>}
            {mutation.isSuccess && <span className="text-secondary text-sm flex items-center gap-1"><CheckCircle2 size={14} /> Success!</span>}
          </div>
        </form>
      </div>

      <div className="space-y-3">
        {deleteMutation.isSuccess && (
          <div className="text-secondary p-3 rounded-lg text-sm flex items-center gap-2">
            <CheckCircle2 size={16} /> Deleted successfully.
          </div>
        )}

        {locations?.map((loc: Location) => (
          <div key={loc.locationId} className="flex items-center justify-between p-4 border rounded-xl bg-card hover:shadow-sm transition-all">
            <div className="flex gap-4">
              <div className="p-2 bg-muted rounded-lg h-fit text-muted-foreground"><MapPin size={20} /></div>
              <div>
                <p className="font-bold text-sm">{loc.locationName}</p>
                <p className="text-xs text-muted-foreground">{loc.addressLine1}, {loc?.city} - {loc.postalCode}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => {
                setEditingId(loc.locationId);
                setValue("locationName", loc.locationName);
                setValue("addressLine1", loc.addressLine1);
                setValue("city", loc.city || "");
                setValue("postalCode", loc.postalCode || "");
              }}><Edit3 size={16} /></Button>
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(loc.locationId)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Are you sure?</DialogTitle></DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>No</Button>
            <Button variant="destructive" disabled={deleteMutation.isPending} onClick={async () => {
                await deleteMutation.mutateAsync(deleteId!);
                setDeleteId(null);
              }}>{deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}