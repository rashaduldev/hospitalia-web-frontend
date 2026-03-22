import { getCurrentUser } from "@/actions/user.actions";
import { getCurrentLocale } from "@/locales/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ManageDoctors from "@/components/pages/hospital/ManageDoctors";

export const metadata: Metadata = {
  title: "Hospitalia - Manage Doctors",
  description: "Assign and manage doctors at your hospital.",
};

export default async function ManageDoctorsPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });

  if (!user) redirect("/hospital/login");
  if (user.onboardingStatus === "REGISTERED") redirect("/hospital/setup-profile");

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Manage Doctors</h1>
        <p className="text-sm text-muted-foreground mt-1">Assign and manage doctors at your hospital.</p>
      </div>
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="p-6">
          <ManageDoctors hospitalUserId={user.id} lang={lang} />
        </div>
      </div>
    </div>
  );
}
