import Image from "next/image";
import { MapPin, Stethoscope, Banknote, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Speciality } from "@/types/speciality.type";
import { SingleDoctorInfo } from "@/types/doctor";
import { DoctorLocation } from "@/types/doctor.location.type";
import doctorMale from "../../../public/assets/doctor_male.jpg";
import doctorFemale from "../../../public/assets/doctor_female.jpg";

const NEW_PATIENT_FEE = 25000;
const RETURNING_PATIENT_FEE = 10000;
const CURRENCY = "CFA";

const formatPrice = (price: number) =>
  `${price.toLocaleString("fr-SN")} ${CURRENCY}`;

const SectionHeading = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-2.5 mb-3">
    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm font-semibold text-foreground">{label}</span>
  </div>
);

const DoctorProfile = ({
  doctor,
  doctorLocations,
}: {
  doctor: SingleDoctorInfo;
  doctorLocations: DoctorLocation[];
}) => {
  const profileImage = doctor?.profileImage
    ? doctor.profileImage
    : doctor?.gender === "MALE"
      ? doctorMale
      : doctorFemale;

  const specialities: Speciality[] =
    doctor.professionalInfoResponse?.specialities ?? [];

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm flex-1">
      {/* Top: avatar + name */}
      <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
        <div className="relative mb-4">
          <Image
            className="rounded-full object-cover border-2 border-border"
            src={profileImage}
            alt={`${doctor.firstName} ${doctor.lastName}`}
            height={120}
            width={120}
          />
        </div>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-snug">
          {doctor.firstName} {doctor.lastName}
        </h2>

        {doctor.professionalInfoResponse?.designation && (
          <p className="text-sm text-muted-foreground mt-1">
            {doctor.professionalInfoResponse.designation}
          </p>
        )}

        {specialities.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {specialities.map((s) => (
              <Badge
                key={s.id}
                variant="secondary"
                className="text-xs text-white px-2.5"
              >
                {s.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Specialist in */}
      {(specialities.length > 0 ||
        doctor.professionalInfoResponse?.departments) && (
        <>
          <div className="px-6 py-5">
            <SectionHeading icon={Stethoscope} label="Specialist In" />
            <div className="space-y-1 pl-1">
              {specialities.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {specialities.map((s) => s.name).join(", ")}
                </p>
              )}
              {doctor.professionalInfoResponse?.departments && (
                <p className="text-sm text-muted-foreground">
                  {doctor.professionalInfoResponse.departments}
                </p>
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Chambers */}
      {doctorLocations?.length > 0 && (
        <>
          <div className="px-6 py-5">
            <SectionHeading icon={MapPin} label="Chambers" />
            <ul className="space-y-1.5 pl-1">
              {doctorLocations.map((loc) => (
                <li
                  key={loc.locationId}
                  className="text-sm text-muted-foreground flex items-start gap-1.5"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  {loc.locationName}
                </li>
              ))}
            </ul>
          </div>
          <Separator />
        </>
      )}

      {/* Fees */}
      <div className="px-6 py-5">
        <SectionHeading icon={Banknote} label="Consultation Fees" />
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="rounded-lg bg-secondary/10 border border-secondary/20 px-3 py-2.5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">
              New Patient
            </p>
            <p className="text-sm font-bold text-secondary">
              {formatPrice(NEW_PATIENT_FEE)}
            </p>
          </div>
          <div className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-2.5 text-center">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">
              Returning
            </p>
            <p className="text-sm font-bold text-primary">
              {formatPrice(RETURNING_PATIENT_FEE)}
            </p>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mx-6 mb-6 flex items-start gap-2 rounded-lg bg-muted/60 border border-border px-4 py-3">
        <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Availability subject to confirmation. Your request may need further
          processing with the doctor.
        </p>
      </div>
    </div>
  );
};

export default DoctorProfile;
