// ConfirmSlotsTable.tsx (Server Component)
import { getDoctorAvailability } from "@/actions/doctor/availability";
import { getDoctorLocations } from "@/actions/doctor/location";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { getI18n } from "@/locales/server";
import ConfirmSlotsTableClient from "./ConfirmSlotsTableClient";

const ConfirmSlotsTable = async ({
  lang,
  doctorUserId,
}: {
  lang: string;
  doctorUserId: number;
}) => {
  const t = await getI18n();
  const [availabilityRes, locationsRes] = await Promise.all([
    getDoctorAvailability({ lang, doctorUserId }),
    getDoctorLocations({ lang, doctorUserId }),
  ]);
  console.log("locationsRes", locationsRes);

  const slots = availabilityRes?.payload?.content || [];
  const locations = locationsRes?.payload || [];
  console.log("locations", locations);
  return (
    <div className="my-8">
      <div className="border rounded-sm p-6 space-y-6">
        <DynamicHeading
          title={t("unavailability.confirmed_slots")}
          description={t("unavailability.confirmed_slots_des")}
          titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
          descriptionProps={{ size: "sm" }}
        />

        {/* Pass raw data to the Client Component */}
        <ConfirmSlotsTableClient slots={slots} locations={locations} />
      </div>
    </div>
  );
};

export default ConfirmSlotsTable;
