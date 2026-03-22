"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Phone, Globe, BedDouble, CalendarDays, FileText, BookOpen, Stethoscope, Loader2 } from "lucide-react";
import { ControlledInput } from "@/components/common/FormUIControllers/ControlledInput";
import { ControlledSelect } from "@/components/common/FormUIControllers/ControlledSelect";
import { ControlledTextarea } from "@/components/common/FormUIControllers/ControlledTextarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { setupHospitalProfile } from "@/actions/hospital/hospitaldata";
import { getSpecialitiesAllCustomer } from "@/actions/speciality.customer";
import { HospitalSetupSchema, HospitalSetupFormValues } from "@/schema/hospital.setup.schema";
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

export default function HospitalSetupProfileForm({
  userId,
  lang,
}: {
  userId: number;
  lang: string;
}) {
  const router = useRouter();
  const [selectedSpecialities, setSelectedSpecialities] = useState<Speciality[]>([]);

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
      hospitalName: "",
      hospitalType: "",
      workPhoneNumber: "",
      websiteUrl: "",
      numberOfBeds: "",
      foundedYear: "",
      onmsRegistrationNumber: "",
      about: "",
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
    const res = await setupHospitalProfile({
      lang,
      body: {
        userId,
        hospitalName: data.hospitalName,
        hospitalType: data.hospitalType,
        workPhoneNumber: data.workPhoneNumber || undefined,
        websiteUrl: data.websiteUrl || undefined,
        numberOfBeds: data.numberOfBeds ? Number(data.numberOfBeds) : undefined,
        foundedYear: data.foundedYear ? Number(data.foundedYear) : undefined,
        onmsRegistrationNumber: data.onmsRegistrationNumber || undefined,
        about: data.about || undefined,
        specialityIds: selectedSpecialities.map((s) => s.id),
      },
    });

    if (!res.success) {
      setError("root", { type: "manual", message: res.message });
      return;
    }

    router.replace("/hospital/dashboard");
  };

  return (
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
      <SectionCard icon={Stethoscope} title="Specialities" subtitle="Select the medical specialities your hospital offers">
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
      <SectionCard icon={BookOpen} title="About" subtitle="Brief description of your hospital">
        <ControlledTextarea
          name="about"
          label=""
          control={control}
          placeholder="Describe your hospital's mission, services, and what makes it unique..."
        />
      </SectionCard>

      {errors.root && (
        <p className="text-xs text-destructive font-semibold">{errors.root.message}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="h-11 px-8 font-semibold">
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</>
          ) : (
            "Save & Continue"
          )}
        </Button>
      </div>
    </form>
  );
}
