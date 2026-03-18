import { getCurrentLocale } from "@/locales/server";
import PatientGetAppointmentPage from "@/components/pages/patient/get-appointment/PatientGetAppointmentPage";

export const metadata = { title: "Hospitalia - Get Appointment" };

const GetAppointmentPage = async ({
  searchParams,
}: {
  searchParams: Promise<any>;
}) => {
  const lang = await getCurrentLocale();
  const sParams = await searchParams;

  return <PatientGetAppointmentPage lang={lang} searchParams={sParams} />;
};

export default GetAppointmentPage;
