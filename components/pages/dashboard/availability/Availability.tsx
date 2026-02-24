import { DynamicHeading } from "@/components/common/DynamicHeading";
import { DefaultLocationManager } from "./DefaultLocationManager";
import AvailabilityScheduleForm from "./AvailabilityScheduleForm";
import { getCurrentLocale, getI18n } from "@/locales/server";

export default async function Availability({ user }: { user: any }) {
  const t =await getI18n();

  const UserId = user?.id;
  const lang = await getCurrentLocale();

  return (
    <div>
      <div className="pace-y-0 border rounded-sm p-4 md:p-6">
      <DynamicHeading
        title={t("availability.title")}
        description={t("availability.description")}
        titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
        descriptionProps={{ size: "sm" }}
        className="mb-6"
      />
      {/* Default Locations and Time Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DefaultLocationManager doctorUserId={UserId} />
      </div>
    </div>
     <div>
        <AvailabilityScheduleForm
        lang={lang}
        doctorUserId={UserId}
        existingAvailability={user?.data}
      />
      </div>
    </div>
  );
}
