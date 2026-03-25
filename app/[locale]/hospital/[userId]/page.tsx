import { getHospitalPublicProfile } from "@/actions/hospital/hospitaldata";
import { getPublicHospitalDoctors } from "@/actions/hospital/hospitalDoctors";
import { getDoctorInfoByDoctorId } from "@/actions/doctor/doctordata";
import Header from "@/components/pages/home/Header";
import FooterSection from "@/components/common/Footer";
import { getCurrentLocale } from "@/locales/server";
import HospitalProfile from "@/components/pages/hospital/HospitalProfile";
import HospitalDoctorsSection, {
  EnrichedHospitalDoctor,
} from "@/components/pages/hospital/HospitalDoctorsSection";
import { HospitalInfo } from "@/types/hospital.type";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Hospitalia - Hospital Profile",
  description: "View hospital information, departments, and contact details.",
};

type Props = {
  params: Promise<{ userId: string }>;
};

const HospitalProfilePage = async ({ params }: Props) => {
  const lang = await getCurrentLocale();
  const { userId } = await params;
  const hospitalId = Number(userId);

  const [hospitalData, doctorsRes] = await Promise.all([
    getHospitalPublicProfile({ lang, id: hospitalId }),
    getPublicHospitalDoctors({ lang, hospitalId }),
  ]);

  const hospital: HospitalInfo | null = hospitalData?.payload ?? null;

  if (!hospital) {
    notFound();
  }

  // Deduplicate by doctorId, merging location names
  const rawDoctors = doctorsRes?.payload ?? [];
  const doctorMap = new Map<number, { locations: Set<string> }>();
  for (const item of rawDoctors) {
    if (!doctorMap.has(item.doctorId)) {
      doctorMap.set(item.doctorId, { locations: new Set() });
    }
    if (item.hospitalLocationName) {
      doctorMap.get(item.doctorId)!.locations.add(item.hospitalLocationName);
    }
  }

  // Enrich each unique doctor with their full profile
  const enrichedDoctors: EnrichedHospitalDoctor[] = await Promise.all(
    Array.from(doctorMap.entries()).map(async ([doctorId, { locations }]) => {
      const profileRes = await getDoctorInfoByDoctorId({ lang, doctorId });
      return {
        doctorId,
        locations: Array.from(locations),
        profile: profileRes?.payload ?? null,
      };
    }),
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hospital profile card (full width) */}
        <HospitalProfile hospital={hospital} />

        {/* Doctors section */}
        <HospitalDoctorsSection doctors={enrichedDoctors} lang={lang} />
      </div>

      <FooterSection />
    </div>
  );
};

export default HospitalProfilePage;
