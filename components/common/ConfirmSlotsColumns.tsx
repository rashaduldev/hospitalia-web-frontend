"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Clock, MapPin } from "lucide-react";
import { SlotActionCell } from "../cells/SlotActionCell";
import { Checkbox } from "../ui/checkbox";
import { parse, format } from "date-fns";

 const ConfirmSlotsColumns: ColumnDef<any>[] = [
    {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    accessorKey: "lastModifiedDate",
    header: "Date",
    cell: ({ row }) => {
      const dateStr = row.getValue("lastModifiedDate") as string;
      try {
        const parsedDate = parse(dateStr, "dd-MM-yyyy HH:mm:ss", new Date());
        return <div className="text-foreground">{format(parsedDate, "do MMMM")}</div>;
      } catch {
        return <div className="text-foreground">{dateStr}</div>;
      }
    },
  },
  {
    accessorKey: "doctorLocationId",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="text-xs">Clinic {row.getValue("doctorLocationId")}</span>
      </div>
    ),
  },
  {
  header: "Time Duration",
  cell: ({ row }) => {
    const formatTo12Hour = (time: string) => {
      if (!time) return "";

      const cleaned = time.replace("Z", ""); 
      const [hour, minute] = cleaned.split(":");

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