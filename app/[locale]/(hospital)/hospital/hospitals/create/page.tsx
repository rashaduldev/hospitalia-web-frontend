import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import { createHospital } from "@/actions/hospital/hospitaldata";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import HospitalForm from "@/components/pages/hospital/HospitalForm";
import { HospitalSetupFormValues } from "@/schema/hospital.setup.schema";

export const metadata: Metadata = {
  title: "Hospitalia - Create Hospital",
};

export default async function CreateHospitalPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });

  if (!user) redirect("/hospital/login");

  async function handleCreate(data: HospitalSetupFormValues, specialityIds: number[]) {
    "use server";
    const res = await createHospital({
      lang,
      body: {
        userId: user!.id,
        hospitalName: data.hospitalName || undefined,
        hospitalType: data.hospitalType || undefined,
        workPhoneNumber: data.workPhoneNumber || undefined,
        websiteUrl: data.websiteUrl || undefined,
        numberOfBeds: data.numberOfBeds ? Number(data.numberOfBeds) : undefined,
        foundedYear: data.foundedYear ? Number(data.foundedYear) : undefined,
        onmsRegistrationNumber: data.onmsRegistrationNumber || undefined,
        about: data.about || undefined,
        specialityIds: specialityIds.length > 0 ? specialityIds : undefined,
      },
    });
    return { success: res.success, message: res.message };
  }

  return (
    <HospitalForm
      userId={user.id}
      lang={lang}
      mode="create"
      onSubmit={handleCreate}
    />
  );
}
