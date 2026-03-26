import { Metadata } from "next";
import SecretaryMessagesPage from "@/components/pages/secretary/SecretaryMessagesPage";

export const metadata: Metadata = {
  title: "Hospitalia - Messages",
};

export default function SecretaryMessagesRoutePage() {
  return <SecretaryMessagesPage />;
}
