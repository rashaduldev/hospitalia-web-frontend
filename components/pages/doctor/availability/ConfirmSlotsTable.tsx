"use client";

import { useSafeQuery } from "@/lib/safeQuery";
import ConfirmSlotsColumns from "@/components/common/ConfirmSlotsColumns";
import { DataTableWithExport } from "@/components/data-table";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { getDoctorAvailability } from "@/actions/doctor/availability";
import { getDoctorLocations } from "@/actions/doctor/location";
import { useDoctorId } from "@/providers/DoctorIdProvider";
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
import { ClipboardList } from "lucide-react";

type ConfirmSlotsTableProps = {
  doctorUserId: number;
  lang: string;
};

const ConfirmSlotsTable: React.FC<ConfirmSlotsTableProps> = ({ doctorUserId, lang }) => {
  const doctorId = useDoctorId();
  const fetchId = doctorId ?? doctorUserId;

  const { data: slotsData, isLoading: slotsLoading } = useSafeQuery({
    queryKey: ["doctorAvailability", fetchId, lang],
    queryFn: () => getDoctorAvailability({ doctorId: fetchId, lang }),
  });

  const { data: locationsData, isLoading: locationsLoading } = useSafeQuery({
    queryKey: ["doctorLocations", fetchId, lang],
    queryFn: () => getDoctorLocations({ doctorId: fetchId, lang }),
  });

  const slots = slotsData?.payload?.content || [];
  const locations = locationsData?.payload || [];

  const locationMap: Record<number, string> = {};
  locations.forEach((loc: Location) => {
    locationMap[Number(loc.locationId)] = loc.locationName;
  });

  const getFutureWeekdaysOfMonth = (dayOfWeek: string, referenceDate: Date) => {
    const start = startOfMonth(referenceDate);
    const end = endOfMonth(referenceDate);
    return eachDayOfInterval({ start, end }).filter(
      (date) =>
        format(date, "EEEE").toUpperCase() === dayOfWeek &&
        !isBefore(date, referenceDate),
    );
  };

  const expandedSlots = slots.flatMap((slot: DoctorAvailabilitySlot) => {
    const referenceDate = parse(slot.lastModifiedDate, "dd-MM-yyyy HH:mm:ss", new Date());
    return getFutureWeekdaysOfMonth(slot.dayOfWeek, referenceDate).map((date) => ({
      ...slot,
      displayDate: date,
      appointmentDate: [date.getFullYear(), date.getMonth() + 1, date.getDate()],
    }));
  });

  return (
    <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
          <ClipboardList className="w-4 h-4 text-secondary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground leading-none">Confirmed Slots</h2>
          <p className="text-xs text-muted-foreground mt-1">All confirmed availability slots</p>
        </div>
      </div>

      <div className="p-6">
        {slotsLoading || locationsLoading ? (
          <TableSkeleton columnCount={6} />
        ) : (
          <DataTableWithExport columns={ConfirmSlotsColumns(locationMap)} data={expandedSlots} />
        )}
      </div>
    </div>
  );
};

export default ConfirmSlotsTable;
