import Image from "next/image";
import { MapPin, Stethoscope, BookOpen, BadgeCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Speciality } from "@/types/speciality.type";
import { SingleDoctorInfo } from "@/types/doctor";
import { DoctorLocation } from "@/types/doctor.location.type";
import doctorMale from "../../../public/assets/doctor_male.jpg";
import doctorFemale from "../../../public/assets/doctor_female.jpg";


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
          <p className="text-sm text-muted-foreground mt-1 px-4">
            {doctor.professionalInfoResponse.designation}
          </p>
        )}

        {doctor.professionalInfoResponse?.onmsregistrationNumber && (
          <div className="flex items-center gap-1.5 mt-2">
            <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs text-primary font-medium">
              Reg. {doctor.professionalInfoResponse.onmsregistrationNumber}
            </span>
          </div>
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

      {/* About */}
      {doctor.professionalInfoResponse?.professionalStatement && (
        <>
          <div className="px-6 py-5">
            <SectionHeading icon={BookOpen} label="About" />
            <p className="text-sm text-muted-foreground leading-relaxed pl-1">
              {doctor.professionalInfoResponse.professionalStatement}
            </p>
          </div>
          <Separator />
        </>
      )}

      {/* Chambers */}
      {doctorLocations?.length > 0 && (
        <>
          <div className="px-6 py-5">
            <SectionHeading icon={MapPin} label="Chambers" />
            <ul className="space-y-3 pl-1">
              {doctorLocations.map((loc) => (
                <li key={loc.locationId} className="flex items-start gap-1.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{loc.locationName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[loc.addressLine1, loc.addressLine2, loc.city, loc.postalCode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    {(loc.newPatientFee != null || loc.oldPatientFee != null) && (
                      <div className="flex items-center gap-3 mt-1">
                        {loc.newPatientFee != null && (
                          <span className="text-xs text-secondary font-medium">
                            New: {loc.newPatientFee.toLocaleString()} {loc.feeCurrency ?? ""}
                          </span>
                        )}
                        {loc.oldPatientFee != null && (
                          <span className="text-xs text-primary font-medium">
                            Old: {loc.oldPatientFee.toLocaleString()} {loc.feeCurrency ?? ""}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
        </>
      )}

    </div>
  );
};

export default DoctorProfile;
