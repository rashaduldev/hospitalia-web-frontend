"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Loader2, Mail, Trash2, UserX, Users2, MapPin, CheckSquare, Square, ShieldCheck,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledPhoneInput } from "@/components/common/FormUIControllers/ControlledPhoneInput";
import { SecretaryCreateSchema, SecretaryCreateValues } from "@/schema/secretary.create.schema";
import {
  getDoctorSecretaries,
  createSecretary,
  inviteSecretary,
  resendSecretaryInvitation,
  deleteSecretaryByUserId,
} from "@/actions/secretary/secretary.actions";
import {
  getSecretaryLocations,
  assignLocationToSecretary,
  removeSecretaryLocation,
} from "@/actions/secretary/secretaryLocations.actions";
import { SecretaryResponse, SecretaryStatus } from "@/types/secretary.type";
import { DoctorLocation } from "@/types/doctor.location.type";
import { getCleanPhoneData } from "@/lib/phone-utils";

const STATUS_CONFIG: Record<SecretaryStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  INVITED: { label: "Invited", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  ACTIVE: { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

// ── Create Secretary Dialog ──────────────────────────────────────────────────

function CreateSecretaryDialog({
  open,
  onClose,
  doctorUserId,
  lang,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  doctorUserId: number;
  lang: string;
  onSuccess: () => void;
}) {
  const { handleSubmit, control, setValue, setError, reset, formState: { errors, isSubmitting } } =
    useForm<SecretaryCreateValues>({
      resolver: zodResolver(SecretaryCreateSchema),
      defaultValues: { firstName: "", lastName: "", email: "", mobileNumber: "" },
      mode: "onChange",
    });

  const handleClose = () => { reset(); onClose(); };

  const onSubmit = async (data: SecretaryCreateValues) => {
    const { countryCode, number: mobileNumber } = getCleanPhoneData(data.mobileNumber);
    const res = await createSecretary({
      lang,
      body: {
        doctorUserId,
        firstName: data.firstName,
        lastName: data.lastName ?? "",
        gender: data.gender,
        email: data.email,
        countryCode,
        mobileNumber,
      },
    });
    if (!res.success) { setError("root", { type: "manual", message: res.message }); return; }
    toast.success("Secretary created successfully");
    onSuccess();
    handleClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Users2 className="w-5 h-5 text-primary" />
            Add Secretary
          </AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ControlledInput name="firstName" requiredMark="*" label="First Name" control={control} placeholder="First name" />
            <ControlledInput name="lastName" label="Last Name" control={control} placeholder="Last name" />
            <ControlledSelect
              name="gender"
              required="*"
              label="Gender"
              control={control}
              placeholder="Select gender"
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
                { label: "Other", value: "OTHER" },
              ]}
            />
            <ControlledInput name="email" requiredMark="*" label="Email" type="email" control={control} placeholder="Email address" />
            <div className="sm:col-span-2">
              <ControlledPhoneInput
                name="mobileNumber"
                control={control}
                requiredMark="*"
                label="Phone Number"
                setValue={setValue}
                defaultCountry="SN"
                readOnlyCountryCode
              />
            </div>
          </div>
          {errors.root && (
            <p className="text-xs text-destructive font-medium">{errors.root.message}</p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={handleClose}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Creating...</> : "Create Secretary"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Manage Locations Dialog ──────────────────────────────────────────────────

function ManageLocationsDialog({
  open,
  onClose,
  secretary,
  doctorLocations,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  secretary: SecretaryResponse;
  doctorLocations: DoctorLocation[];
  lang: string;
}) {
  const secretaryId = secretary.id ?? 0;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["secretary-locations", secretaryId],
    queryFn: () => getSecretaryLocations({ secretaryId, lang }),
    enabled: open && !!secretaryId,
  });

  const assigned = data?.payload ?? [];
  const assignedIds = new Set(assigned.map((l) => l.locationId));

  const [toggling, setToggling] = useState<number | null>(null);

  const handleToggle = async (locationId: number) => {
    if (!secretaryId) return;
    setToggling(locationId);
    try {
      if (assignedIds.has(locationId)) {
        const res = await removeSecretaryLocation({ lang, secretaryId, locationId });
        if (!res.success) { toast.error(res.message); return; }
        toast.success("Location removed");
      } else {
        const res = await assignLocationToSecretary({ lang, secretaryId, locationId });
        if (!res.success) { toast.error(res.message); return; }
        toast.success("Location assigned");
      }
      refetch();
    } finally {
      setToggling(null);
    }
  };

  const name = [secretary.firstName, secretary.lastName].filter(Boolean).join(" ");

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Locations for {name}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="py-1 space-y-2">
          <p className="text-xs text-muted-foreground">
            No assigned locations = access to all. Assign specific locations to restrict access.
          </p>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : doctorLocations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No locations found.</p>
          ) : (
            <div className="border border-border rounded-xl overflow-hidden">
              {doctorLocations.map((loc, i) => {
                const isAssigned = assignedIds.has(loc.locationId);
                const isToggling = toggling === loc.locationId;
                return (
                  <button
                    key={loc.locationId}
                    type="button"
                    onClick={() => handleToggle(loc.locationId)}
                    disabled={isToggling}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      i !== doctorLocations.length - 1 ? "border-b border-border" : ""
                    } ${isAssigned ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40"} disabled:opacity-60`}
                  >
                    {isToggling ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                    ) : isAssigned ? (
                      <CheckSquare className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{loc.locationName}</p>
                      {loc.city && <p className="text-xs text-muted-foreground">{loc.city}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <Button onClick={onClose}>Done</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function SecretaryManagePage({
  doctorUserId,
  lang,
  doctorLocations,
}: {
  doctorUserId: number;
  lang: string;
  doctorLocations: DoctorLocation[];
}) {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SecretaryResponse | null>(null);
  const [locationTarget, setLocationTarget] = useState<SecretaryResponse | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["doctor-secretaries", doctorUserId],
    queryFn: () => getDoctorSecretaries({ doctorUserId, lang }),
  });
  const secretaries: SecretaryResponse[] = data?.payload?.content ?? [];

  const inviteMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: number; status: SecretaryStatus }) =>
      status === "PENDING"
        ? inviteSecretary({ lang, secretaryUserId: userId })
        : resendSecretaryInvitation({ lang, secretaryUserId: userId }),
    onSuccess: (res, vars) => {
      if (!res.success) { toast.error(res.message); return; }
      toast.success(vars.status === "PENDING" ? "Invitation sent" : "Invitation resent");
      queryClient.invalidateQueries({ queryKey: ["doctor-secretaries", doctorUserId] });
    },
    onError: () => toast.error("Failed to send invitation"),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: number) => deleteSecretaryByUserId({ lang, userId }),
    onSuccess: (res) => {
      if (!res.success) { toast.error(res.message); return; }
      toast.success("Secretary removed");
      queryClient.invalidateQueries({ queryKey: ["doctor-secretaries", doctorUserId] });
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to remove secretary"),
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading..." : `${secretaries.length} secretary${secretaries.length !== 1 ? "s" : ""}`}
        </p>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Secretary
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : secretaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <UserX className="w-10 h-10 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No secretaries yet</p>
          <p className="text-xs text-muted-foreground">Add a secretary to help manage your appointments.</p>
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          {secretaries.map((sec, i) => {
            const name = [sec.firstName, sec.lastName].filter(Boolean).join(" ") || `Secretary #${sec.userId}`;
            const statusCfg = STATUS_CONFIG[sec.status] ?? STATUS_CONFIG.PENDING;
            return (
              <div
                key={sec.userId}
                className={`flex items-center gap-4 px-5 py-4 ${i !== secretaries.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                  <Users2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                    {sec.status === "ACTIVE" && (
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
                    )}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.className}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                  {sec.email && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{sec.email}</p>
                  )}
                  {sec.phoneNumber && (
                    <p className="text-xs text-muted-foreground">{sec.phoneNumber}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Location management */}
                  {sec.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      title="Manage Locations"
                      onClick={() => setLocationTarget(sec)}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {/* Invite / Resend */}
                  {(sec.status === "PENDING" || sec.status === "INVITED") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${sec.status === "INVITED" ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-primary"}`}
                      title={sec.status === "PENDING" ? "Send Invitation" : "Resend Invitation"}
                      disabled={inviteMutation.isPending}
                      onClick={() => inviteMutation.mutate({ userId: sec.userId, status: sec.status })}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(sec)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create dialog */}
      <CreateSecretaryDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        doctorUserId={doctorUserId}
        lang={lang}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["doctor-secretaries", doctorUserId] })}
      />

      {/* Manage locations dialog */}
      {locationTarget && (
        <ManageLocationsDialog
          open={!!locationTarget}
          onClose={() => setLocationTarget(null)}
          secretary={locationTarget}
          doctorLocations={doctorLocations}
          lang={lang}
        />
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Secretary</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-foreground">
              {deleteTarget ? [deleteTarget.firstName, deleteTarget.lastName].filter(Boolean).join(" ") : ""}
            </span>?
            {" "}This action cannot be undone.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteTarget(null)}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.userId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Removing...</> : "Remove"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
