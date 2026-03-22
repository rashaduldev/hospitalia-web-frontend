import {
  BookOpen,
  BadgeCheck,
  Building2,
  Phone,
  Globe,
  BedDouble,
  CalendarDays,
  Stethoscope,
  Mail,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Speciality } from "@/types/speciality.type";
import { HospitalInfo } from "@/types/hospital.type";

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

const InfoRow = ({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) => (
  <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
    <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline truncate block"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      )}
    </div>
  </div>
);

const HospitalProfile = ({ hospital }: { hospital: HospitalInfo }) => {
  const d = hospital.userDetails;
  const specialities: Speciality[] = d?.specialities ?? [];
  const displayName = d?.firstName ?? hospital.email ?? "Hospital";
  const hospitalTypeLabel = d?.hospitalType
    ? d.hospitalType.charAt(0) + d.hospitalType.slice(1).toLowerCase().replace(/_/g, " ")
    : null;

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm flex-1">
      {/* Header: icon + name + type + reg */}
      <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
        <div className="relative mb-4">
          <div className="w-[120px] h-[120px] rounded-full bg-primary/10 border-2 border-border flex items-center justify-center">
            <Building2 className="w-14 h-14 text-primary/60" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground leading-snug">{displayName}</h2>

        {hospitalTypeLabel && (
          <p className="text-sm text-muted-foreground mt-1">{hospitalTypeLabel}</p>
        )}

        {d?.onmsRegistrationNumber && (
          <div className="flex items-center gap-1.5 mt-2">
            <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs text-primary font-medium">
              Reg. {d.onmsRegistrationNumber}
            </span>
          </div>
        )}

        {specialities.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            {specialities.map((s) => (
              <Badge key={s.id} variant="secondary" className="text-xs text-white px-2.5">
                {s.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Quick stats: beds + founded */}
      {(d?.numberOfBeds || d?.foundedYear) && (
        <>
          <div className="grid grid-cols-2 divide-x divide-border px-0">
            {d?.numberOfBeds && (
              <div className="flex flex-col items-center py-4">
                <BedDouble className="w-4 h-4 text-primary mb-1" />
                <p className="text-base font-bold text-foreground">{d.numberOfBeds}</p>
                <p className="text-xs text-muted-foreground">Beds</p>
              </div>
            )}
            {d?.foundedYear && (
              <div className="flex flex-col items-center py-4">
                <CalendarDays className="w-4 h-4 text-primary mb-1" />
                <p className="text-base font-bold text-foreground">{d.foundedYear}</p>
                <p className="text-xs text-muted-foreground">Founded</p>
              </div>
            )}
          </div>
          <Separator />
        </>
      )}

      {/* Contact */}
      {(d?.workPhoneNumber || hospital.email || d?.websiteUrl) && (
        <>
          <div className="px-6 py-5">
            <SectionHeading icon={Phone} label="Contact" />
            <div className="pl-1">
              {d?.workPhoneNumber && (
                <InfoRow icon={Phone} label="Phone" value={d.workPhoneNumber} />
              )}
              {hospital.email && (
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={hospital.email}
                  href={`mailto:${hospital.email}`}
                />
              )}
              {d?.websiteUrl && (
                <InfoRow
                  icon={Globe}
                  label="Website"
                  value={d.websiteUrl}
                  href={d.websiteUrl}
                />
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Specialities */}
      {specialities.length > 0 && (
        <>
          <div className="px-6 py-5">
            <SectionHeading icon={Stethoscope} label="Specialities & Departments" />
            <div className="flex flex-wrap gap-1.5 pl-1">
              {specialities.map((s) => (
                <Badge key={s.id} variant="outline" className="text-xs font-medium">
                  {s.name}
                </Badge>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* About */}
      {d?.about && (
        <>
          <div className="px-6 py-5">
            <SectionHeading icon={BookOpen} label="About" />
            <p className="text-sm text-muted-foreground leading-relaxed pl-1">{d.about}</p>
          </div>
          <Separator />
        </>
      )}
    </div>
  );
};

export default HospitalProfile;
