import { Metadata } from "next";
import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import PatientBeneficiariesPage from "@/components/pages/patient/beneficiaries/PatientBeneficiariesPage";

export const metadata: Metadata = {
  title: "Hospitalia - Beneficiaries",
  description: "Manage your beneficiaries for appointment booking.",
};

export default async function BeneficiariesPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });
  return <PatientBeneficiariesPage lang={lang} patientUserId={user?.id ?? null} />;
}
