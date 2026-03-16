"use client";

import { useQuery } from "@tanstack/react-query";
import ConfirmSlotsColumns from "@/components/common/ConfirmSlotsColumns";
import { DataTableWithExport } from "@/components/data-table";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { getDoctorAvailability } from "@/actions/doctor/availability";
import { getDoctorLocations } from "@/actions/doctor/location";
import {
  parse,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
} from "date-fns";
import { Location } from "@/types/doctor.location.type";
import { DoctorAvailabilitySlot } from "@/types/doctor.slot";

type ConfirmSlotsTableProps = {
  doctorUserId: number;
  lang: string;
};

const ConfirmSlotsTable: React.FC<ConfirmSlotsTableProps> = ({
  doctorUserId,
  lang,
}) => {
  // slotsData
  const { data: slotsData, isLoading: slotsLoading } = useQuery({
    queryKey: ["doctorAvailability", doctorUserId, lang],
    queryFn: () => getDoctorAvailability({ doctorUserId, lang }),
  });

  // locationsData
  const { data: locationsData, isLoading: locationsLoading } = useQuery({
    queryKey: ["doctorLocations", doctorUserId, lang],
    queryFn: () => getDoctorLocations({ doctorUserId, lang }),
  });

  // TableSkeleton
  if (slotsLoading || locationsLoading)
    return <TableSkeleton columnCount={6} />;

  const slots = slotsData?.payload?.content || [];
  const locations = locationsData?.payload || [];

  const locationMap: Record<number, string> = {};
  locations.forEach((loc: Location) => {
    locationMap[Number(loc.locationId)] = loc.locationName;
  });

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
        title="Confirmed Slots"
        description="All confirmed availability slots"
        titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
        descriptionProps={{ size: "sm" }}
      />

      <DataTableWithExport
        columns={ConfirmSlotsColumns(locationMap)}
        data={expandedSlots}
      />
    </div>
  );
};

export default ConfirmSlotsTable;
