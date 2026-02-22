"use client";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { useI18n } from "@/locales/client";
import { DefaultLocationManager } from "./DefaultLocationManager";

export default function Availability({ user }: { user: any }) {
  const t = useI18n();

  const UserId = user?.id;

  return (
    <div className="pace-y-8">
      <DynamicHeading
        title={t("availability.title")}
        description={t("availability.description")}
        titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
        descriptionProps={{ size: "sm" }}
        className="mb-6"
      />
      {/* SECTION 1: Default Locations and Time Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border p-6 rounded-lg">
        <DefaultLocationManager doctorUserId={UserId} />
      </div>
    </div>
  );
}
