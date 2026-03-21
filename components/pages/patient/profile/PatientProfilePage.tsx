"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useCurrentLocale } from "@/locales/client";
import { getCurrentUser } from "@/actions/user.actions";
import {
  getPatientProfile,
  updatePatientProfile,
  changePatientPassword,
} from "@/actions/patient/profile.actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/Typography";
import AppButton from "@/components/common/AppButton";
import { Button } from "@/components/ui/button";
import ErrorDialog from "@/components/common/ErrorDialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { Separator } from "@/components/ui/separator";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledDateInput } from "@/components/common/FormUIControllers/ControlledDateInput";
import {
  Pencil,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  UserCircle2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, isValid } from "date-fns";

// ── helpers ────────────────────────────────────────────────────────────────

function getInitials(first?: string, last?: string) {
  return ((first?.[0] ?? "") + (last?.[0] ?? "")).toUpperCase() || "P";
}

function formatGender(g?: string) {
  if (!g) return undefined;
  return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
}

function parseDobToDate(dob: string | number): Date | null {
  const str = String(dob);
  let date = parseISO(str);
  if (!isValid(date)) date = new Date(str);
  if (!isValid(date) && !isNaN(Number(str))) date = new Date(Number(str));
  return isValid(date) ? date : null;
}

function formatDob(dob?: string | number) {
  if (!dob) return undefined;
  try {
    const date = parseDobToDate(dob);
    return date ? format(date, "d MMMM yyyy") : String(dob);
  } catch {
    return String(dob);
  }
}

// Convert raw API dateOfBirth to yyyy-MM-dd for sending back to the API
function toApiDate(dob?: string | number): string {
  if (!dob) return "";
  try {
    const date = parseDobToDate(dob);
    return date ? format(date, "yyyy-MM-dd") : String(dob);
  } catch {
    return String(dob);
  }
}

// ── schema ─────────────────────────────────────────────────────────────────

const ProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "Must be at least 2 characters")
    .max(50),
  lastName: z.string().max(50).optional(),
  email: z
    .string()
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.string().optional().or(z.literal("")),
});

type ProfileValues = z.infer<typeof ProfileSchema>;

// ── InfoRow ────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/8 shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-muted rounded animate-pulse ${className}`} />;
}

// ── page ───────────────────────────────────────────────────────────────────

export default function PatientProfilePage() {
  const locale = useCurrentLocale();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  // ── current user (for ID) ─────────────────────────────────────────────
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser", locale],
    queryFn: () => getCurrentUser({ lang: locale }),
  });

  // ── fetch profile ────────────────────────────────────────────────────────
  const { data, isLoading, isError, error, refetch, isRefetching } = useSafeQuery({
    queryKey: ["patientProfile", currentUser?.id, locale],
    queryFn: () =>
      getPatientProfile({ lang: locale, userId: currentUser!.id }),
    enabled: !!currentUser?.id,
  });

  const p = data?.payload;
  // Patient profile fields (from /api/patients/id/{id})
  const firstName = p?.userDetails?.firstName ?? p?.firstName;
  const lastName = p?.userDetails?.lastName ?? p?.lastName;
  const gender = p?.userDetails?.gender ?? p?.gender;
  const dateOfBirth = p?.userDetails?.dateOfBirth ?? p?.dateOfBirth;
  const profileImage = p?.profileImage;

  // Contact info from currentUser (/api/users/me) — more reliable source
  const email = currentUser?.contactInfo?.email ?? currentUser?.email;
  const countryCode = currentUser?.contactInfo?.countryCode ?? currentUser?.countryCode;
  const mobileNumber = currentUser?.contactInfo?.mobileNumber ?? currentUser?.mobileNumber;

  const phone =
    countryCode && mobileNumber
      ? `${countryCode} ${mobileNumber}`
      : mobileNumber;
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Patient";
  const initials = getInitials(firstName, lastName);

  // ── form ─────────────────────────────────────────────────────────────────
  const { control, handleSubmit, reset } = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    values: {
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      email: email ?? "",
      dateOfBirth: toApiDate(dateOfBirth),
    },
  });

  // ── update mutation ──────────────────────────────────────────────────────
  const { mutate, isPending } = useSafeMutation({
    mutationFn: (values: ProfileValues) =>
      updatePatientProfile({
        body: {
          ...values,
          userId: currentUser!.id,
          gender: gender ?? "",
          countryCode: countryCode ?? "",
          mobileNumber: mobileNumber ?? "",
        },
        lang: locale,
      }),
    onSuccess: (res) => {
      if (!res.success) {
        setErrorMsg(res.message || "Failed to update profile");
        return;
      }
      qc.invalidateQueries({ queryKey: ["patientProfile"] });
      setEditing(false);
      toast.success("Profile updated successfully");
    },
    onError: (err: Error) => {
      if (err.name === "SessionExpiredError") return;
      setErrorMsg(err.message);
    },
  });

  // ── change password mutation ─────────────────────────────────────────────
  const { mutateAsync: changePasswordAsync } = useSafeMutation({
    mutationFn: async (newPassword: string) => {
      if (!currentUser?.id) throw new Error("User session not loaded. Please refresh.");
      return changePatientPassword({
        body: {
          userId: currentUser.id,
          firstName: firstName ?? "",
          lastName: lastName ?? "",
          email: email ?? "",
          dateOfBirth: toApiDate(dateOfBirth),
          gender: gender ?? "",
          countryCode: countryCode ?? "",
          mobileNumber: mobileNumber ?? "",
          password: newPassword,
        },
        lang: locale,
      });
    },
    onSuccess: () => toast.success("Password changed successfully"),
    onError: (err: Error) => {
      if (err.name === "SessionExpiredError") return;
      setErrorMsg(err.message);
    },
  });

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      <Typography size="2xl" weight="bold" color="foreground" as="h1">
        My Profile
      </Typography>

      {/* ── Fetch error ── */}
      {isError && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <span>
            {error instanceof Error
              ? error.message
              : typeof error === "string"
                ? error
                : "Failed to load profile. Please try again."}
          </span>
          <AppButton
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="ml-auto gap-1.5 text-xs text-destructive hover:text-destructive"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
            />
            {isRefetching ? "Retrying…" : "Try again"}
          </AppButton>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* ── Left: profile card ── */}
        <div className="bg-card rounded-xl border p-8 flex flex-col items-center text-center gap-4">
          {isLoading ? (
            <>
              <Skeleton className="w-28 h-28 rounded-full" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-20" />
            </>
          ) : (
            <>
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={fullName}
                  width={112}
                  height={112}
                  className="rounded-full object-cover ring-4 ring-primary/15"
                />
              ) : (
                <Avatar className="w-28 h-28 ring-4 ring-primary/15">
                  <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary w-full h-full">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}

              <div>
                <p className="text-lg font-bold text-foreground">{fullName}</p>
                <span className="inline-block mt-1.5 text-xs font-medium px-3 py-0.5 rounded-full bg-primary/10 text-primary tracking-wide">
                  Patient
                </span>
              </div>

              {phone && (
                <>
                  <Separator className="w-full" />
                  <p className="text-sm text-muted-foreground">{phone}</p>
                </>
              )}

              <Separator className="w-full" />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setChangingPassword(true)}
                disabled={isLoading || !currentUser?.id}
              >
                Change Password
              </Button>
            </>
          )}
        </div>

        {/* ── Right: details / edit ── */}
        <div className="md:col-span-2 bg-card rounded-xl border">
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b">
            <Typography size="lg" weight="semiBold" color="foreground">
              Personal Information
            </Typography>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                disabled={isLoading || isError}
              >
                <Pencil />
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setEditing(false);
                  reset({ firstName: firstName ?? "", lastName: lastName ?? "", email: email ?? "", dateOfBirth: toApiDate(dateOfBirth) });
                }}
              >
                <X />
                Cancel
              </Button>
            )}
          </div>

          <div className="p-6">
            {!editing ? (
              /* ── view mode ── */
              isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoRow icon={User} label="First Name" value={firstName} />
                  <InfoRow icon={User} label="Last Name" value={lastName} />
                  <InfoRow icon={Mail} label="Email" value={email} />
                  <InfoRow
                    icon={Calendar}
                    label="Date of Birth"
                    value={formatDob(dateOfBirth)}
                  />
                  <InfoRow
                    icon={UserCircle2}
                    label="Gender"
                    value={formatGender(gender)}
                  />
                  <InfoRow icon={Phone} label="Phone" value={phone} />
                </div>
              )
            ) : (
              /* ── edit mode ── */
              <form
                onSubmit={handleSubmit((values) => mutate(values))}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ControlledInput
                    control={control}
                    name="firstName"
                    label="First Name"
                    placeholder="Enter first name"
                  />
                  <ControlledInput
                    control={control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter last name"
                  />
                  <ControlledInput
                    control={control}
                    name="email"
                    label="Email"
                    placeholder="Enter email address"
                  />
                  <ControlledDateInput
                    control={control}
                    name="dateOfBirth"
                    label="Date of Birth"
                    disableFuture
                  />
                </div>

                {/* Gender and Phone are read-only */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60 pointer-events-none select-none">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Gender
                    </label>
                    <div className="flex h-9 w-full items-center rounded-lg border bg-muted px-3 text-sm text-muted-foreground">
                      {formatGender(gender) || "—"}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Phone
                    </label>
                    <div className="flex h-9 w-full items-center rounded-lg border bg-muted px-3 text-sm text-muted-foreground">
                      {phone || "—"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <AppButton
                    type="submit"
                    isLoading={isPending}
                    loadingText="Saving…"
                    className="px-8"
                  >
                    Save Changes
                  </AppButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Mutation error dialog ── */}
      <ErrorDialog message={errorMsg} onClose={() => setErrorMsg(null)} />

      {/* ── Change password dialog ── */}
      <ChangePasswordDialog
        open={changingPassword}
        onOpenChange={setChangingPassword}
        onChangePassword={changePasswordAsync}
      />
    </div>
  );
}
