import { getCurrentUser } from "@/actions/user.actions";
import { getSecretaryByUserId } from "@/actions/secretary/secretary.actions";
import { getSecretaryLocations } from "@/actions/secretary/secretaryLocations.actions";
import { getDoctorInfobyUserid } from "@/actions/doctor/doctordata";
import { getDoctorLocations } from "@/actions/doctor/location";
import { getCurrentLocale } from "@/locales/server";
import { SecretaryLocationProvider } from "@/providers/SecretaryLocationProvider";
import { SecretaryLocationBar } from "@/components/pages/secretary/SecretaryLocationBar";
import { LocationPickerItem } from "@/types/secretary.type";
import { DoctorLocation } from "@/types/doctor.location.type";

export default async function SecretaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getCurrentLocale();
  const user = await getCurrentUser({ lang });
  const secretaryUserId = user?.id as number;

  // Get secretary profile (for entity id + doctorUserId)
  const secretaryRes = await getSecretaryByUserId({ userId: secretaryUserId, lang });
  const secretary = secretaryRes?.payload;

  // Get doctor entity id from doctorUserId
  const doctorUserId = secretary?.doctorUserId ?? 0;
  const doctorInfoRes = doctorUserId
    ? await getDoctorInfobyUserid({ lang, SignleDoctorUserId: doctorUserId })
    : null;
  const doctorId: number =
    (doctorInfoRes?.payload as { id?: number; doctorId?: number } | null)?.id ??
    (doctorInfoRes?.payload as { id?: number; doctorId?: number } | null)?.doctorId ??
    0;

  const secretaryEntityId = secretary?.id ?? 0;

  // Fetch secretary's assigned locations
  let locations: LocationPickerItem[] = [];
  if (secretaryEntityId) {
    const locationsRes = await getSecretaryLocations({ secretaryId: secretaryEntityId, lang });
    const assigned = locationsRes?.payload ?? [];

    if (assigned.length > 0) {
      locations = assigned.map((l) => ({
        id: l.locationId,
        locationName: l.locationName,
        city: l.city,
      }));
    } else if (doctorId) {
      // No restrictions — show all doctor locations
      const allRes = await getDoctorLocations({ lang, doctorId });
      const allLocs: DoctorLocation[] = allRes?.payload ?? [];
      locations = allLocs.map((l) => ({
        id: l.locationId,
        locationName: l.locationName,
        city: l.city,
      }));
    }
  }

  return (
    <SecretaryLocationProvider
      locations={locations}
      doctorId={doctorId}
      doctorUserId={doctorUserId}
      secretaryId={secretaryEntityId}
    >
      <div className="space-y-4 p-4 sm:p-6">
        <SecretaryLocationBar />
        {children}
      </div>
    </SecretaryLocationProvider>
  );
}
