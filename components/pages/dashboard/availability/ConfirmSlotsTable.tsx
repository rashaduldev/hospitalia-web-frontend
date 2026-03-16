import { DataTableWithExport } from "@/components/data-table";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { getDoctorAvailability } from "@/actions/doctor/availability";
import ConfirmSlotsColumns from "@/components/common/ConfirmSlotsColumns";
import { Suspense } from "react";
import { getI18n } from "@/locales/server";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import {
  parse,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
} from "date-fns";
import { DoctorAvailabilitySlot } from "@/types/doctor.slot";

const ConfirmSlotsTable = async ({
  lang,
  doctorUserId,
}: {
  lang: string;
  doctorUserId: number;
}) => {
  const t = await getI18n();

  const data = await getDoctorAvailability({ lang, doctorUserId });

  const getFutureWeekdaysOfMonth = (dayOfWeek: string, referenceDate: Date) => {
    const start = startOfMonth(referenceDate);
    const end = endOfMonth(referenceDate);

    const days = eachDayOfInterval({ start, end });

    return days.filter(
      (date) =>
        format(date, "EEEE").toUpperCase() === dayOfWeek &&
        !isBefore(date, referenceDate),
    );
  };

  const slots = data?.payload?.content || [];
  const expandedSlots = slots.flatMap((slot: DoctorAvailabilitySlot) => {
    const referenceDate = parse(
      slot.lastModifiedDate,
      "dd-MM-yyyy HH:mm:ss",
      new Date(),
    );
    const futureDates = getFutureWeekdaysOfMonth(slot.dayOfWeek, referenceDate);

    return futureDates.map((date) => ({
      ...slot,
      displayDate: date,
      appointmentDate: [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      ],
    }));
  });
  return (
    <div className="border rounded-sm p-6 space-y-6 mt-8">
      <DynamicHeading
        title={t("unavailability.confirmed_slots")}
        description={t("unavailability.confirmed_slots_des")}
        titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
        descriptionProps={{ size: "sm" }}
      />
      <Suspense fallback={<TableSkeleton columnCount={5} />}>
        <DataTableWithExport
          columns={ConfirmSlotsColumns}
          data={expandedSlots}
        />
      </Suspense>
    </div>
  );
};

export default ConfirmSlotsTable;
