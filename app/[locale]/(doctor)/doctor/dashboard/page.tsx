import { Metadata } from "next";
import DoctorDashboardPage from "@/components/pages/doctor/DoctorDashboardPage";

export const metadata: Metadata = {
  title: "Hospitalia - Doctor Dashboard",
  description: "View today's and upcoming appointments from your doctor dashboard.",
};

export default function DoctorDashboard() {
  return <DoctorDashboardPage />;
}
