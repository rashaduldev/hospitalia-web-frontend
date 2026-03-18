import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Hospital Availability",
  description: "Manage availability for your hospital.",
};

export default function HospitalAvailabilityPage() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Availability</h1>
        <p className="text-sm text-muted-foreground">Hospital availability management coming soon.</p>
      </div>
    </div>
  );
}
