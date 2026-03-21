import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import DoctorMessagesPage from "@/components/pages/doctor/messages/DoctorMessagesPage";

export const metadata = { title: "Hospitalia - Messages" };

export default async function MessagesPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });
  const myId = String(user?.id ?? "doctor-me");
  const myName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "You";

  return <DoctorMessagesPage myId={myId} myName={myName} />;
}
