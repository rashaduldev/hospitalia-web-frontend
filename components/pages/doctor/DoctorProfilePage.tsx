"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSafeQuery, useSafeMutation } from "@/lib/safeQuery";
import { getDoctorInfobyUserid, updateDoctorProfile, changeDoctorPassword } from "@/actions/doctor/doctordata";
import ChangePasswordDialog from "@/components/pages/patient/profile/ChangePasswordDialog";
import { getDoctorLocations } from "@/actions/doctor/location";
import { useDoctorId } from "@/providers/DoctorIdProvider";
import { getSpecialitiesAllCustomer } from "@/actions/speciality.customer";
import { doctorProfileSchema, DoctorProfileFormValues } from "@/schema/doctor.profile.schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledTextarea } from "@/components/common/FormUIControllers/ControlledTextarea";
import {
  User,
  Stethoscope,
  MapPin,
  Pencil,
  ShieldCheck,
  GraduationCap,
  KeyRound,
} from "lucide-react";
import { Location } from "@/types/doctor.location.type";
import { Speciality } from "@/types/speciality.type";
import { Label } from "@/components/ui/label";

// ─── Small reusable display components ────────────────────────────────────────

const SectionCard = ({
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
      <div className={`p-2 ${iconBg} rounded-lg shrink-0`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <h2 className="text-base font-bold text-foreground leading-none">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
    <div className="px-6 py-4">{children}</div>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value?: string | number }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground text-right break-all">{value}</p>
    </div>
  );
};

// ─── Profile skeleton ──────────────────────────────────────────────────────────

const ProfileSkeleton = () => (
  <div className="p-4 sm:p-6 space-y-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="p-6 space-y-4">
          {[...Array(4)].map((_, j) => (
            <Skeleton key={j} className="h-4 w-full" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ─── Speciality multi-select ───────────────────────────────────────────────────

const SpecialityMultiSelect = ({
  specialities,
  selected,
  onChange,
}: {
  specialities: Speciality[];
  selected: number[];
  onChange: (ids: number[]) => void;
}) => {
  const toggle = (id: number) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  return (
    <div className="space-y-1.5">
      <Label>Specialities</Label>
      <ScrollArea className="h-36 border border-border rounded-md p-3">
        <div className="space-y-2">
          {specialities.map((sp) => (
            <div key={sp.id} className="flex items-center gap-2">
              <Checkbox
                id={`sp-${sp.id}`}
                checked={selected.includes(sp.id)}
                onCheckedChange={() => toggle(sp.id)}
              />
              <label htmlFor={`sp-${sp.id}`} className="text-sm cursor-pointer select-none">
                {sp.name}
              </label>
            </div>
          ))}
          {specialities.length === 0 && (
            <p className="text-xs text-muted-foreground">No specialities available</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Converts API licenseExpiryDate ([2028,12,30] or "2028-12-30") → "yyyy-MM-dd" for <input type="date"> */
function toDateInputValue(raw?: string | number[]): string {
  if (!raw) return "";
  if (Array.isArray(raw)) {
    const [y, m, d] = raw;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  return raw;
}

/** Formats a date value for human-readable display */
function formatExpiryDisplay(raw?: string | number[]): string | undefined {
  const iso = toDateInputValue(raw);
  if (!iso) return undefined;
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function DoctorProfilePage({
  userId,
  lang,
  mobileNumber: userMobileNumber = "",
  countryCode: userCountryCode = "",
}: {
  userId: number;
  lang: string;
  mobileNumber?: string;
  countryCode?: string;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // ── Queries ────────────────────────────────────────────────────────────────
  const doctorId = useDoctorId();

  const {
    data: doctorData,
    isLoading: loadingDoctor,
    refetch,
  } = useSafeQuery({
    queryKey: ["doctorProfile", userId],
    queryFn: () => getDoctorInfobyUserid({ lang, SignleDoctorUserId: userId }),
  });

  const { data: locationsData, isLoading: loadingLocations } = useSafeQuery({
    queryKey: ["doctor-locations", doctorId ?? userId],
    queryFn: () => getDoctorLocations({ lang, doctorId: doctorId ?? userId }),
  });

  const { data: specialitiesData } = useSafeQuery({
    queryKey: ["specialities"],
    queryFn: () => getSpecialitiesAllCustomer(lang),
  });

  const doctor = doctorData?.payload;
  const locations: Location[] = locationsData?.payload || [];
  const allSpecialities: Speciality[] = (specialitiesData?.payload?.content ?? []).slice().sort((a: Speciality, b: Speciality) => a.name.localeCompare(b.name));
  const doctorSpecialities: Speciality[] = doctor?.professionalInfoResponse?.specialities ?? [];

  // ── Form ───────────────────────────────────────────────────────────────────
  const { control, handleSubmit, reset, watch, setValue } = useForm<DoctorProfileFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(doctorProfileSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "MALE",
      email: "",
      countryCode: "",
      mobileNumber: "",
      designation: "",
      workPhoneNumber: "",
      onmsRegistrationNumber: "",
      professionalStatement: "",
      specialityIds: [] as number[],
      medicalLicenseNumber: "",
      licenseIssuingAuthority: "",
      licenseExpiryDate: "",
      yearsOfExperience: undefined,
      qualification: "",
    },
  });

  const selectedSpecialityIds = watch("specialityIds") ?? [];

  useEffect(() => {
    if (!doctor) return;
    reset({
      firstName: doctor.firstName ?? "",
      lastName: doctor.lastName ?? "",
      gender: doctor.gender ?? "MALE",
      email: doctor.email ?? "",
      countryCode: doctor.countryCode ?? "",
      mobileNumber: doctor.mobileNumber ?? "",
      designation: doctor.professionalInfoResponse?.designation ?? "",
      workPhoneNumber: doctor.professionalInfoResponse?.workPhoneNumber ?? "",
      onmsRegistrationNumber: doctor.professionalInfoResponse?.onmsRegistrationNumber ?? "",
      professionalStatement: doctor.professionalInfoResponse?.professionalStatement ?? "",
      specialityIds: doctorSpecialities.map((s) => s.id),
      medicalLicenseNumber: doctor.medicalLicenseNumber ?? "",
      licenseIssuingAuthority: doctor.licenseIssuingAuthority ?? "",
      licenseExpiryDate: toDateInputValue(doctor.licenseExpiryDate),
      yearsOfExperience: doctor.yearsOfExperience ?? undefined,
      qualification: doctor.qualification ?? "",
    });
  }, [doctor]);

  // ── Mutation ───────────────────────────────────────────────────────────────
  const { mutate, isPending } = useSafeMutation({
    mutationFn: (values: DoctorProfileFormValues) =>
      updateDoctorProfile({
        lang,
        data: {
          userId,
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          email: values.email,
          countryCode: userCountryCode,
          mobileNumber: userMobileNumber,
          professionalInfoRequest: {
            designation: values.designation,
            specialityId: values.specialityIds ?? [],
            workPhoneNumber: values.workPhoneNumber ?? "",
            onmsRegistrationNumber: values.onmsRegistrationNumber ?? "",
            professionalStatement: values.professionalStatement ?? "",
          },
          medicalLicenseNumber: values.medicalLicenseNumber,
          licenseIssuingAuthority: values.licenseIssuingAuthority,
          licenseExpiryDate: values.licenseExpiryDate,
          yearsOfExperience: values.yearsOfExperience,
          qualification: values.qualification,
          verified: doctor?.verified,
        },
      }),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setEditOpen(false);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile");
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => mutate(values as DoctorProfileFormValues);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalid = (errors: any) => {
    const first = Object.values(errors)[0] as any;
    toast.error(first?.message ?? "Please fix the form errors before saving.");
  };

  // ── Change password handler ────────────────────────────────────────────────
  const onChangePassword = async (newPassword: string) => {
    await changeDoctorPassword({
      lang,
      data: {
        userId,
        firstName: doctor?.firstName ?? "",
        lastName: doctor?.lastName ?? "",
        gender: doctor?.gender ?? "MALE",
        email: doctor?.email ?? "",
        countryCode: userCountryCode,
        mobileNumber: userMobileNumber,
        password: newPassword,
        professionalInfoRequest: {
          designation: doctor?.professionalInfoResponse?.designation ?? "",
          specialityId: doctorSpecialities.map((s) => s.id),
          workPhoneNumber: doctor?.professionalInfoResponse?.workPhoneNumber ?? "",
          onmsRegistrationNumber: doctor?.professionalInfoResponse?.onmsRegistrationNumber ?? "",
          professionalStatement: doctor?.professionalInfoResponse?.professionalStatement ?? "",
        },
      },
    });
    toast.success("Password changed successfully");
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loadingDoctor || loadingLocations) return <ProfileSkeleton />;
  if (!doctor) return null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-3xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            View and manage your professional information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setChangingPassword(true)}>
            <KeyRound className="w-3.5 h-3.5" />
            Change Password
          </Button>
          <Button onClick={() => setEditOpen(true)} size="sm" className="gap-2">
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Personal Info */}
      <SectionCard icon={User} title="Personal Information" subtitle="Your account details">
        <InfoRow label="Full Name" value={`${doctor.firstName} ${doctor.lastName}`} />
        <InfoRow label="Gender" value={doctor.gender} />
        <InfoRow label="Email" value={doctor.email} />
        <InfoRow
          label="Mobile"
          value={
            userCountryCode && userMobileNumber
              ? `+${userCountryCode} ${userMobileNumber}`
              : userMobileNumber || undefined
          }
        />
        <InfoRow label="Date of Birth" value={doctor.dateOfBirth} />
      </SectionCard>

      {/* Professional Info */}
      <SectionCard
        icon={Stethoscope}
        iconColor="text-secondary"
        iconBg="bg-secondary/10"
        title="Professional Information"
        subtitle="Your credentials and specialisation"
      >
        <InfoRow label="Designation" value={doctor.professionalInfoResponse?.designation} />
        <InfoRow
          label="ONMS Number"
          value={doctor.professionalInfoResponse?.onmsRegistrationNumber}
        />
        <InfoRow label="Work Phone" value={doctor.professionalInfoResponse?.workPhoneNumber} />
        {doctorSpecialities.length > 0 && (
          <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
              Specialities
            </p>
            <div className="flex flex-wrap justify-end gap-1.5">
              {doctorSpecialities.map((s) => (
                <Badge key={s.id} variant="secondary" className="text-xs text-white">
                  {s.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {doctor.professionalInfoResponse?.professionalStatement && (
          <div className="py-2.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Professional Statement
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {doctor.professionalInfoResponse.professionalStatement}
            </p>
          </div>
        )}
      </SectionCard>

      {/* License & Credentials */}
      {(doctor.medicalLicenseNumber ||
        doctor.licenseIssuingAuthority ||
        doctor.licenseExpiryDate ||
        doctor.yearsOfExperience != null ||
        doctor.qualification) && (
        <SectionCard
          icon={ShieldCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-950/30"
          title="License & Credentials"
          subtitle="Your medical license and qualifications"
        >
          <InfoRow label="Medical License No." value={doctor.medicalLicenseNumber} />
          <InfoRow label="Issuing Authority" value={doctor.licenseIssuingAuthority} />
          <InfoRow label="License Expiry" value={formatExpiryDisplay(doctor.licenseExpiryDate)} />
          <InfoRow
            label="Years of Experience"
            value={
              doctor.yearsOfExperience != null ? `${doctor.yearsOfExperience} years` : undefined
            }
          />
          <InfoRow label="Qualification" value={doctor.qualification} />
        </SectionCard>
      )}

      {/* Practice Locations */}
      {locations.length > 0 && (
        <SectionCard
          icon={MapPin}
          title="Practice Locations"
          subtitle="Chambers where you see patients"
        >
          <div className="space-y-3">
            {locations.map((loc) => (
              <div
                key={loc.locationId}
                className="border-b border-border last:border-0 pb-3 last:pb-0"
              >
                <p className="text-sm font-medium text-foreground">{loc.locationName}</p>
                {loc.addressLine1 && (
                  <p className="text-xs text-muted-foreground mt-0.5">{loc.addressLine1}</p>
                )}
                {(loc.city || loc.postalCode) && (
                  <p className="text-xs text-muted-foreground/80">
                    {loc.city}
                    {loc.postalCode ? ` — ${loc.postalCode}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Change Password Dialog ───────────────────────────────────────────── */}
      <ChangePasswordDialog
        open={changingPassword}
        onOpenChange={setChangingPassword}
        onChangePassword={onChangePassword}
      />

      {/* ── Edit Dialog ───────────────────────────────────────────────────────── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Pencil className="w-4 h-4 text-primary" />
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update your professional information.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
            <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <ControlledInput
                    name="firstName"
                    control={control}
                    label="First Name"
                    placeholder="Enter first name"
                    requiredMark="*"
                  />
                  <ControlledInput
                    name="lastName"
                    control={control}
                    label="Last Name"
                    placeholder="Enter last name"
                    requiredMark="*"
                  />
                </div>
                <ControlledSelect
                  name="gender"
                  control={control}
                  label="Gender"
                  required="*"
                  options={[
                    { label: "Male", value: "MALE" },
                    { label: "Female", value: "FEMALE" },
                  ]}
                />
                <ControlledInput
                  name="email"
                  control={control}
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  requiredMark="*"
                />
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-secondary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Professional Information
                  </h3>
                </div>
                <Separator />
                <ControlledInput
                  name="designation"
                  control={control}
                  label="Designation / Title"
                  placeholder="e.g. General Practitioner"
                  requiredMark="*"
                />
                <ControlledInput
                  name="workPhoneNumber"
                  control={control}
                  label="Work Phone"
                  placeholder="Enter work phone number"
                />
                <ControlledInput
                  name="onmsRegistrationNumber"
                  control={control}
                  label="ONMS Registration Number"
                  placeholder="Enter ONMS number"
                />
                <ControlledTextarea
                  name="professionalStatement"
                  control={control}
                  label="Professional Statement"
                  placeholder="Brief description of your practice and expertise..."
                />
                <SpecialityMultiSelect
                  specialities={allSpecialities}
                  selected={selectedSpecialityIds}
                  onChange={(ids) => setValue("specialityIds", ids)}
                />
              </div>

              {/* License & Credentials */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-foreground">License & Credentials</h3>
                </div>
                <Separator />
                <ControlledInput
                  name="medicalLicenseNumber"
                  control={control}
                  label="Medical License Number"
                  placeholder="Enter license number"
                />
                <ControlledInput
                  name="licenseIssuingAuthority"
                  control={control}
                  label="License Issuing Authority"
                  placeholder="e.g. Medical Board of Senegal"
                />
                <ControlledInput
                  name="licenseExpiryDate"
                  control={control}
                  label="License Expiry Date"
                  type="date"
                />
                <div className="grid grid-cols-2 gap-4">
                  <ControlledInput
                    name="yearsOfExperience"
                    control={control}
                    label="Years of Experience"
                    type="number"
                    placeholder="0"
                  />
                  <ControlledInput
                    name="qualification"
                    control={control}
                    label="Qualification"
                    placeholder="e.g. MBBS, MD"
                  />
                </div>
              </div>
            </form>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-profile-form"
              disabled={isPending}
              className="min-w-24"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
