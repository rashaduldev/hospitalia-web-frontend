import AvailabilityScheduleForm from "./AvailabilityScheduleForm";
import ScheduleManager from "./ScheduleManager";
import ConfirmSlotsTable from "./ConfirmSlotsTable";
import { getDefaultTimeSlot } from "@/actions/doctor/slot";

const Availability = async ({
  userId,
  lang,
}: {
  lang: string;
  userId: number;
}) => {
  const timeSlots = await getDefaultTimeSlot({ lang });

  return (
    <div className="space-y-6 p-4 sm:p-6">
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
