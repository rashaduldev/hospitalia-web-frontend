"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Clock, MapPin } from "lucide-react";
import { SlotActionCell } from "../cells/SlotActionCell";
import { Checkbox } from "../ui/checkbox";

export const ConfirmSlotsColumns: ColumnDef<any>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "dayOfWeek",
    header: "Day",
    cell: ({ row }) => (
      <div className="font-bold uppercase text-slate-700">
        {row.getValue("dayOfWeek")}
      </div>
    ),
  },
  {
    accessorKey: "doctorLocationId",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Clinic {row.getValue("doctorLocationId")}</span>
      </div>
    ),
  },
  {
    header: "Time Duration",
    cell: ({ row }) => {
      const start = row.original.startTime?.replace(":00Z", "");
      const end = row.original.endTime?.replace(":00Z", "");
      return (
        <div className="flex items-center gap-2 font-medium">
          <Clock className="h-3.5 w-3.5 text-blue-500" />
          {start} - {end}
        </div>
      );
    },
  },
  {
    accessorKey: "timeSlot",
    header: "Time Slot",
    cell: ({ row }) => (
      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">
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
