import HospitalDashboardPage from "@/components/pages/hospital/HospitalDashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Hospital Dashboard",
  description: "Manage your hospital services and appointments.",
};

export default function HospitalDashboard() {
  return <HospitalDashboardPage />;
}
