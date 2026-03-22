import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import { redirect } from "next/navigation";
import HospitalSetupProfileForm from "@/components/pages/hospital/HospitalSetupProfileForm";
import { Building2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Setup Hospital Profile",
};

export default async function HospitalSetupProfilePage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });

  if (!user) redirect("/hospital/login");

  // If already set up, skip this page
  if (user.onboardingStatus !== "REGISTERED") {
    redirect("/hospital/dashboard");
  }

  return (
    <div className="py-6 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            First Time Setup
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Setup Your Hospital Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete your hospital profile to get started. You can update this information later.
        </p>
      </div>

      <HospitalSetupProfileForm userId={user.id} lang={lang} />
    </div>
  );
}
