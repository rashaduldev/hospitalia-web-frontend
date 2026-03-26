import { Metadata } from "next";
import SecretaryDashboardPage from "@/components/pages/secretary/SecretaryDashboardPage";

export const metadata: Metadata = {
  title: "Hospitalia - Secretary Dashboard",
};

export default function SecretaryDashboardRoutePage() {
  return <SecretaryDashboardPage />;
}
