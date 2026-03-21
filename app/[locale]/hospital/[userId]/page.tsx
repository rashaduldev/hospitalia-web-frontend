import { getHospitalInfoByUserId } from "@/actions/hospital/hospitaldata";
import Header from "@/components/pages/home/Header";
import { getCurrentLocale } from "@/locales/server";
import HospitalProfile from "@/components/pages/hospital/HospitalProfile";
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
  const hospitalUserId = Number(userId);

  const hospitalData = await getHospitalInfoByUserId({ lang, hospitalUserId });
  const hospital = hospitalData?.payload;

  if (!hospital) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-4">
          {/* Left: Hospital profile */}
          <div className="w-full md:w-3/5">
            <HospitalProfile hospital={hospital} />
          </div>

          {/* Right: placeholder — to be built */}
          <div className="w-full md:w-2/5">
            <div className="border border-border rounded-xl bg-card shadow-sm p-6 flex items-center justify-center min-h-[200px]">
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfilePage;
