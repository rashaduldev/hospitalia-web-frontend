import { DefaultLocationManager } from "@/components/pages/doctor/availability/DefaultLocationManager";
import { getI18n } from "@/locales/server";
import { MapPin } from "lucide-react";

export default async function DoctorLocationsPage({
  lang,
}: {
  lang: string;
}) {
  const t = await getI18n();

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">
              {t("availability.title")}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {t("availability.description")}
            </p>
          </div>
        </div>
        <div className="p-6">
          <DefaultLocationManager lang={lang} />
        </div>
      </div>
    </div>
  );
}
