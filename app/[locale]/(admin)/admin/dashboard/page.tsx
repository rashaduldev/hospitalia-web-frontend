import AdminDashboardPage from "@/components/pages/admin/AdminDashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitalia - Admin Dashboard",
  description: "Manage the platform.",
};

export default function AdminDashboard() {
  return <AdminDashboardPage />;
}
