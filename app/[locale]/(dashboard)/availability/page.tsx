import Unauthorized from "@/components/common/Unauthorized";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Availability",
  description: "Manage availability for appointments.",
};

// Doctors now have their own route at /doctor/availability
// This page remains for future HOSPITAL availability management
export default function AvailabilityPage() {
  return <Unauthorized />;
}
