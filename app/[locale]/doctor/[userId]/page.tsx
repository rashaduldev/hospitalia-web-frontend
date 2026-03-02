import { getAllDoctor } from "@/actions/doctor/doctordata";
import Header from "@/components/pages/home/Header";
import { getCurrentLocale } from "@/locales/server";
import { Typography } from "@/components/ui/Typography";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ userId: string }>;
};

const DoctorBookingPage = async ({ params }: Props) => {
  console.log("params", await params);

  const lang = await getCurrentLocale();
  const { userId } = await params;
  const doctorData = await getAllDoctor({ lang });
  const doctors = doctorData?.payload?.content || [];
  console.log("doctors", doctors);

  const doctor = doctors.find((doc: any) => doc.userId.toString() === userId);
  console.log("doctor", doctor);

  if (!doctor) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto p-8">
        <div>
          <Typography as="h1" size="3xl" weight="bold">
            {doctor.firstName} {doctor.lastName}
          </Typography>
        </div>
        <div></div>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-popover p-8 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side: Basic Info */}
            <div className="flex-1">
              <Typography as="h1" size="3xl" weight="bold">
                Dr. {doctor.firstName} {doctor.lastName}
              </Typography>

              <Typography color="primary" weight="medium" className="mt-1">
                {doctor.professionalInfoResponse?.specialities?.[0]?.name ||
                  "Specialist"}
              </Typography>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Designation:</span>{" "}
                  {doctor.professionalInfoResponse?.designation}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Reg No:</span>{" "}
                  {doctor.professionalInfoResponse?.onmsregistrationNumber}
                </p>
              </div>

              <div className="mt-6">
                <Typography as="h4" weight="semiBold" size="lg">
                  About
                </Typography>
                <p className="text-sm mt-2 leading-relaxed">
                  {doctor.professionalInfoResponse?.professionalStatement ||
                    "No statement available."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorBookingPage;
