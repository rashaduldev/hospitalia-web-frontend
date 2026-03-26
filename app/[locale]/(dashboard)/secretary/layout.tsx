import { getCurrentUser } from "@/actions/user.actions";
import { getSecretaryByUserId } from "@/actions/secretary/secretary.actions";
import { DoctorIdProvider } from "@/providers/DoctorIdProvider";
import { getCurrentLocale } from "@/locales/server";

export default async function SecretaryLayout({ children }: { children: React.ReactNode }) {
  const lang = await getCurrentLocale();
  const res = await getCurrentUser({ lang });

  if (!res || res.userType !== "SECRETARY") {
    return <>{children}</>;
  }

  const secretaryRes = await getSecretaryByUserId({ userId: res.id as number, lang });
  const doctorId = secretaryRes?.payload?.doctorId;

  return (
    <DoctorIdProvider doctorId={doctorId}>
      {children}
    </DoctorIdProvider>
  );
}
