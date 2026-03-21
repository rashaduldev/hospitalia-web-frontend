import { getCurrentLocale } from "@/locales/server";
import { getCurrentUser } from "@/actions/user.actions";
import PatientMessagesPage from "@/components/pages/patient/messages/PatientMessagesPage";

export const metadata = { title: "Hospitalia - Messages" };

export default async function MessagesPage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });
  const myNumericId = user?.id ?? 0;
  const myId = String(myNumericId);

  return <PatientMessagesPage myId={myId} myNumericId={myNumericId} />;
}
