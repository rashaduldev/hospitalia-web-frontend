import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import DoctorMessagesPage from "@/components/pages/doctor/messages/DoctorMessagesPage";

export const metadata = { title: "Hospitalia - Messages" };

export default async function MessagesPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });
  const myNumericId = user?.id ?? 0;
  const myId = String(myNumericId);

  return <DoctorMessagesPage myId={myId} myNumericId={myNumericId} />;
}
