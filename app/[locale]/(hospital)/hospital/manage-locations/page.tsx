import { getCurrentUser } from "@/actions/user.actions";
import { getCurrentLocale } from "@/locales/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ManageLocations from "@/components/pages/hospital/ManageLocations";

export const metadata: Metadata = {
  title: "Hospitalia - Manage Locations",
  description: "Add and manage your hospital branches and facilities.",
};

export default async function ManageLocationsPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });

  if (!user) redirect("/hospital/login");
  if (user.onboardingStatus === "REGISTERED") redirect("/hospital/setup-profile");

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Manage Locations</h1>
        <p className="text-sm text-muted-foreground mt-1">Add and manage your hospital branches and facilities.</p>
      </div>
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="p-6">
          <ManageLocations hospitalUserId={user.id} lang={lang} />
        </div>
      </div>
    </div>
  );
}
