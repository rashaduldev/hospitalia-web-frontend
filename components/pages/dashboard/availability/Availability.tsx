import { DynamicHeading } from "@/components/common/DynamicHeading";
import AvailabilityScheduleForm from "./AvailabilityScheduleForm";
import ScheduleManager from "./ScheduleManager";
import { getI18n } from "@/locales/server";
import { DefaultLocationManager } from "./DefaultLocationManager";
import ConfirmSlotsTable from "./ConfirmSlotsTable";
import { getDefaultTimeSlot } from "@/actions/doctor/slot";

const Availability = async ({
  userId,
  lang,
}: {
  lang: string;
  userId: number;
}) => {
  const t = await getI18n();
  const timeSlots = await getDefaultTimeSlot({ lang });
  console.log("timeSlots", timeSlots.payload);

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
        {/* Default Locations */}
        <DefaultLocationManager doctorUserId={userId} lang={lang} />
      </div>
      <AvailabilityScheduleForm
        timeSlots={timeSlots?.payload}
        lang={lang}
        doctorUserId={userId}
      />
      <ScheduleManager lang={lang} doctorUserId={userId} />
      <ConfirmSlotsTable lang={lang} doctorUserId={userId} />
    </div>
  );
};

export default Availability;
