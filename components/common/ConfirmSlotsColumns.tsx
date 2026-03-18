"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SlotActionCell } from "../cells/SlotActionCell";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { DoctorAvailabilitySlot } from "@/types/doctor.slot";

type LocationMap = {
  [id: number]: string;
};

const ConfirmSlotsColumns = (
  locationMap: LocationMap,
): ColumnDef<DoctorAvailabilitySlot>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "displayDate",
    header: "Date",
    cell: ({ row }) => (
      <div>{format(row.getValue("displayDate"), "do MMMM")}</div>
    ),
  },
  {
    accessorKey: "doctorLocationId",
    header: "Location",
    cell: ({ row }) => {
      const locationId = Number(row.getValue("doctorLocationId"));
      const locationName = locationMap[locationId];
      return locationName && locationName;
    },
  },
  {
    header: "Time Duration",
    cell: ({ row }) => {
      const formatTo12Hour = (time: string) => {
        if (!time) return "";
        const [hour, minute] = time.replace("Z", "").split(":");
        const date = new Date();
        date.setHours(Number(hour));
        date.setMinutes(Number(minute));
        return format(date, "hh:mm a");
      };
      const start = formatTo12Hour(row.original.startTime);
      const end = formatTo12Hour(row.original.endTime);
      return (
        <div className="flex items-center gap-2">
          {start} - {end}
        </div>
      );
    },
  },
  {
    accessorKey: "timeSlot",
    header: "Time Slot",
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded text-sm">
        {row.getValue("timeSlot")} Mins
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <SlotActionCell slot={row.original} />,
  },
];

export default ConfirmSlotsColumns;
