import { DataTableWithExport } from "@/components/data-table";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { getDoctorAvailability } from "@/actions/doctor/availability";
import ConfirmSlotsColumns from "@/components/common/ConfirmSlotsColumns";
import { Suspense } from "react";
import { getI18n } from "@/locales/server";

const ConfirmSlotsTable = async ({
  lang,
  doctorUserId,
}: {
  lang: string;
  doctorUserId: number;
}) => {
  const t = await getI18n();

  const data = await getDoctorAvailability({ lang, doctorUserId });

  const slots = data?.payload?.content || [];
  return (
    <div className="mt-8">
      <div className="border rounded-sm p-6 space-y-6">
        <DynamicHeading
          title={t("unavailability.confirmed_slots")}
          description={t("unavailability.confirmed_slots_des")}
          titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
          descriptionProps={{ size: "sm" }}
        />
        <Suspense fallback={<p>loading...</p>}>
          <DataTableWithExport columns={ConfirmSlotsColumns} data={slots} />
        </Suspense>
      </div>
    </div>
  );
};

export default ConfirmSlotsTable;