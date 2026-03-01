"use client";

import { ColumnDef } from "@tanstack/react-table";
import { parse, format } from "date-fns";
import { Clock } from "lucide-react";
import { SlotActionCell } from "../cells/SlotActionCell";
import { Checkbox } from "../ui/checkbox";

export const getConfirmSlotsColumns = (locations: any[]): ColumnDef<any>[] => [
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
    accessorKey: "lastModifiedDate",
    header: "Date",
    cell: ({ row }) => {
      const dateStr = row.getValue("lastModifiedDate") as string;
      try {
        const parsedDate = parse(dateStr, "dd-MM-yyyy HH:mm:ss", new Date());
        return (
          <div className="text-foreground">{format(parsedDate, "do MMMM")}</div>
        );
      } catch {
        return <div className="text-foreground">{dateStr}</div>;
      }
    },
  },
  {
    accessorKey: "doctorLocationId",
    header: "Location",
    cell: ({ row }) => {
      const id = row.getValue("doctorLocationId");
      console.log("locations id", id);

      const foundLocation = locations.find((l) => l.locationId === id);
      console.log("foundLocation", foundLocation);

      const locationName = foundLocation?.locationName || `Clinic ${id}`;

      return (
        <div className="flex items-center gap-2">
          <span
            className="truncate max-w-37.5 font-medium"
            title={locationName}
          >
            {locationName}
          </span>
        </div>
      );
    },
  },
  {
    header: "Time Duration",
    cell: ({ row }) => {
      const start = row.original.startTime?.replace(":00Z", "");
      const end = row.original.endTime?.replace(":00Z", "");
      return (
        <div className="flex items-center gap-2 font-medium">
          <Clock className="h-3.5 w-3.5 text-primary" />
          {start} - {end}
        </div>
      );
    },
  },
  {
    accessorKey: "timeSlot",
    header: "Time Slot",
    cell: ({ row }) => (
      <span className="bg-muted px-2 py-1 rounded text-xs font-semibold">
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
