"use client";

import { DynamicHeading } from "@/components/common/DynamicHeading";
import { DefaultLocationManager } from "./DefaultLocationManager";
import AvailabilityScheduleForm from "./AvailabilityScheduleForm";
import { useI18n } from "@/locales/client";
import ScheduleManager from "./ScheduleManager";

export default function Availability({
  userId,
  lang,
}: {
  lang: string;
  userId: number;
}) {
  const t = useI18n();

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
        <DefaultLocationManager doctorUserId={userId} lang={lang} />
      </div>
      <div>
        <AvailabilityScheduleForm
          lang={lang}
          doctorUserId={userId}
          // existingAvailability={user?.data}
        />
      </div>
      <ScheduleManager lang={lang} doctorUserId={userId} />
    </div>
  );
}
