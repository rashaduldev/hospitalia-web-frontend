"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Phone, BookOpen, Stethoscope, Loader2, ArrowLeft } from "lucide-react";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledTextarea } from "@/components/common/FormUIControllers/ControlledTextarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSpecialitiesAllCustomer } from "@/actions/speciality.customer";
import { HospitalSetupSchema, HospitalSetupFormValues } from "@/schema/hospital.setup.schema";
import { HospitalInfo } from "@/types/hospital.type";
import { Speciality } from "@/types/speciality.type";

const HOSPITAL_TYPES = [
  { label: "General Hospital", value: "GENERAL" },
  { label: "Specialty Hospital", value: "SPECIALTY" },
  { label: "Teaching Hospital", value: "TEACHING" },
  { label: "Clinic", value: "CLINIC" },
  { label: "Polyclinic", value: "POLYCLINIC" },
  { label: "Diagnostic Center", value: "DIAGNOSTIC" },
  { label: "Rehabilitation Center", value: "REHABILITATION" },
  { label: "Maternity Hospital", value: "MATERNITY" },
  { label: "Children's Hospital", value: "CHILDREN" },
  { label: "Other", value: "OTHER" },
];

const SectionCard = ({ icon: Icon, title, subtitle, children }: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h2 className="text-base font-bold text-foreground leading-none">{title}</h2>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default function HospitalForm({
  userId,
  lang,
  mode = "create",
  initialData,
  onSubmit: onSubmitProp,
}: {
  userId: number;
  lang: string;
  mode?: "create" | "edit";
  initialData?: HospitalInfo | null;
  onSubmit: (data: HospitalSetupFormValues, specialityIds: number[]) => Promise<{ success: boolean; message: string }>;
}) {
  const router = useRouter();
  const p = initialData?.professionalInfoResponse;

  const [selectedSpecialities, setSelectedSpecialities] = useState<Speciality[]>(
    p?.specialities ?? [],
  );

  const { data: specialitiesData } = useQuery({
    queryKey: ["specialities"],
    queryFn: async () => {
      const res = await getSpecialitiesAllCustomer();
      if (!res.success) throw new Error(res.message);
      return res.payload;
    },
  });
  const specialities: Speciality[] = specialitiesData?.content ?? [];

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<HospitalSetupFormValues>({
    resolver: zodResolver(HospitalSetupSchema),
    defaultValues: {
      hospitalName: initialData?.hospitalName ?? "",
      hospitalType: initialData?.hospitalType ?? "",
      workPhoneNumber: initialData?.workPhoneNumber ?? "",
      websiteUrl: initialData?.websiteUrl ?? "",
      numberOfBeds: initialData?.numberOfBeds != null ? String(initialData.numberOfBeds) : "",
      foundedYear: initialData?.foundedYear != null ? String(initialData.foundedYear) : "",
      onmsRegistrationNumber: p?.onmsRegistrationNumber ?? "",
      about: p?.professionalStatement ?? "",
      specialityIds: [],
    },
  });

  const toggleSpeciality = (spec: Speciality) => {
    setSelectedSpecialities((prev) =>
      prev.find((s) => s.id === spec.id)
        ? prev.filter((s) => s.id !== spec.id)
        : [...prev, spec],
    );
  };

  const onSubmit = async (data: HospitalSetupFormValues) => {
    const res = await onSubmitProp(data, selectedSpecialities.map((s) => s.id));
    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }
    router.push("/hospital/hospitals");
  };

  return (
    <div className="py-6 max-w-3xl">
      {/* Page header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => router.push("/hospital/hospitals")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hospitals
        </button>
        <h1 className="text-2xl font-bold text-foreground">
          {mode === "edit" ? "Update Hospital" : "Create Hospital"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "edit"
            ? "Update the information for this hospital."
            : "Fill in the details to add a new hospital to your account."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-6">
        {/* Basic Info */}
        <SectionCard icon={Building2} title="Basic Information" subtitle="Hospital name, type, and registration">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <ControlledInput
                name="hospitalName"
                requiredMark="*"
                label="Hospital Name"
                control={control}
                placeholder="e.g. Dhaka Medical Center"
              />
            </div>
            <ControlledSelect
              name="hospitalType"
              required="*"
              label="Hospital Type"
              control={control}
              placeholder="Select hospital type"
              options={HOSPITAL_TYPES}
            />
            <ControlledInput
              name="onmsRegistrationNumber"
              label="Registration Number"
              control={control}
              placeholder="Official registration number"
            />
            <ControlledInput
              name="numberOfBeds"
              label="Number of Beds"
              type="number"
              control={control}
              placeholder="e.g. 200"
            />
            <ControlledInput
              name="foundedYear"
              label="Founded Year"
              type="number"
              control={control}
              placeholder="e.g. 1990"
            />
          </div>
        </SectionCard>

        {/* Contact & Online */}
        <SectionCard icon={Phone} title="Contact & Online Presence" subtitle="Work phone and website">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ControlledInput
              name="workPhoneNumber"
              label="Work Phone Number"
              control={control}
              placeholder="+880 1X XXXX XXXX"
            />
            <ControlledInput
              name="websiteUrl"
              label="Website URL"
              control={control}
              placeholder="https://yourhospital.com"
            />
          </div>
        </SectionCard>

        {/* Specialities */}
        <SectionCard icon={Stethoscope} title="Specialities" subtitle="Select the medical specialities this hospital offers">
          <div className="flex flex-wrap gap-2">
            {specialities.map((spec) => {
              const selected = !!selectedSpecialities.find((s) => s.id === spec.id);
              return (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() => toggleSpeciality(spec)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                    selected
                      ? "bg-primary text-white border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {spec.name}
                </button>
              );
            })}
            {specialities.length === 0 && (
              <p className="text-sm text-muted-foreground">Loading specialities...</p>
            )}
          </div>
          {selectedSpecialities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border">
              {selectedSpecialities.map((s) => (
                <Badge key={s.id} variant="secondary" className="text-xs text-white">
                  {s.name}
                </Badge>
              ))}
            </div>
          )}
        </SectionCard>

        {/* About */}
        <SectionCard icon={BookOpen} title="About" subtitle="Brief description of this hospital">
          <ControlledTextarea
            name="about"
            label=""
            control={control}
            placeholder="Describe the hospital's mission, services, and what makes it unique..."
          />
        </SectionCard>

        {errors.root && (
          <p className="text-xs text-destructive font-semibold">{errors.root.message}</p>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/hospital/hospitals")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="h-10 px-8 font-semibold">
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />{mode === "edit" ? "Saving..." : "Creating..."}</>
            ) : (
              mode === "edit" ? "Save Changes" : "Create Hospital"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
