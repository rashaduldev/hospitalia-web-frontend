import { getCurrentUser } from "@/actions/user.actions";
import { getDoctorInfobyUserid } from "@/actions/doctor/doctordata";
import { getDoctorLocations } from "@/actions/doctor/location";
import { getCurrentLocale } from "@/locales/server";
import { Users2 } from "lucide-react";
import { Metadata } from "next";
import SecretaryManagePage from "@/components/pages/doctor/secretaries/SecretaryManagePage";
import { DoctorLocation } from "@/types/doctor.location.type";

export const metadata: Metadata = {
  title: "Hospitalia - Manage Secretaries",
};

export default async function DoctorSecretariesRoutePage() {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });
  const doctorUserId = user?.id as number;

  const doctorInfoRes = await getDoctorInfobyUserid({ lang, SignleDoctorUserId: doctorUserId });
  const doctorId: number =
    (doctorInfoRes?.payload as { id?: number; doctorId?: number } | null)?.id ??
    (doctorInfoRes?.payload as { id?: number; doctorId?: number } | null)?.doctorId ??
    0;

  const locationsRes = doctorId ? await getDoctorLocations({ lang, doctorId }) : null;
  const doctorLocations: DoctorLocation[] = locationsRes?.payload ?? [];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Users2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground leading-none">Secretaries</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage assistants who help run your day-to-day tasks
          </p>
        </div>
      </div>
      <SecretaryManagePage
        doctorUserId={doctorUserId}
        lang={lang}
        doctorLocations={doctorLocations}
      />
    </div>
  );
}
