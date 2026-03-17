import { getCurrentLocale } from "@/locales/server";
import PatientMessagesPage from "@/components/pages/patient/messages/PatientMessagesPage";

export const metadata = { title: "Hospitalia - Messages" };

const MessagesPage = async () => {
  const lang = await getCurrentLocale();
  return <PatientMessagesPage lang={lang} />;
};

export default MessagesPage;
