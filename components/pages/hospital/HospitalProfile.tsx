import { MapPin, BookOpen, BadgeCheck, Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Speciality } from "@/types/speciality.type";
import { SingleDoctorInfo } from "@/types/doctor";

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

const HospitalProfile = ({ hospital }: { hospital: SingleDoctorInfo }) => {
  const specialities: Speciality[] =
    hospital.professionalInfoResponse?.specialities ?? [];

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm flex-1">
      {/* Top: icon + name */}
      <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
        <div className="relative mb-4">
          <div className="w-[120px] h-[120px] rounded-full bg-primary/10 border-2 border-border flex items-center justify-center">
            <Building2 className="w-14 h-14 text-primary/60" />
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-snug">
          {hospital.firstName} {hospital.lastName}
        </h2>

        {hospital.professionalInfoResponse?.designation && (
          <p className="text-sm text-muted-foreground mt-1 px-4">
            {hospital.professionalInfoResponse.designation}
          </p>
        )}

        {hospital.professionalInfoResponse?.onmsregistrationNumber && (
          <div className="flex items-center gap-1.5 mt-2">
            <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs text-primary font-medium">
              Reg. {hospital.professionalInfoResponse.onmsregistrationNumber}
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

      {/* Contact */}
      {hospital.phoneNumber && (
        <>
          <div className="px-6 py-5 space-y-2">
            <SectionHeading icon={Building2} label="Contact" />
            <p className="text-sm text-muted-foreground pl-1">{hospital.phoneNumber}</p>
            {hospital.email && (
              <p className="text-sm text-muted-foreground pl-1">{hospital.email}</p>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Departments / Specialities */}
      {specialities.length > 0 && (
        <>
          <div className="px-6 py-5">
            <SectionHeading icon={MapPin} label="Departments" />
            <p className="text-sm text-muted-foreground pl-1">
              {specialities.map((s) => s.name).join(", ")}
            </p>
          </div>
          <Separator />
        </>
      )}

      {/* About */}
      {hospital.professionalInfoResponse?.professionalStatement && (
        <>
          <div className="px-6 py-5">
            <SectionHeading icon={BookOpen} label="About" />
            <p className="text-sm text-muted-foreground leading-relaxed pl-1">
              {hospital.professionalInfoResponse.professionalStatement}
            </p>
          </div>
          <Separator />
        </>
      )}
    </div>
  );
};

export default HospitalProfile;
