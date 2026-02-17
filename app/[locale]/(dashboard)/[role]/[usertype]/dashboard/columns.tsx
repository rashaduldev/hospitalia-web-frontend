"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Appointment } from "@/types/appointment.type";
import { format } from "date-fns";
import { MapPinIcon, ClockIcon, Edit, Pencil } from "lucide-react";

export const appointmentColumns: ColumnDef<Appointment>[] = [
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
    accessorKey: "appointmentDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("appointmentDate"));
      return <div className="font-medium">{format(date, "dd MMM yyyy")}</div>;
    },
  },
    {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="truncate max-w-37.5">{row.original?.locationName || "Clinic"}</span>
      </div>
    ),
  },
  {
    accessorKey: "patient.name",
    header: "Patient Name",
    cell: ({ row }) => {
      
      const name = row.original?.patientName || "Unknown Patient";
      return (
          <span className="font-semibold text-foreground">{name}</span>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const start = row.original.startTime;
      const end = row.original.endTime;
      
      return (
        <span className="font-medium">
          {start} - {end}
        </span>
      );
    },
  },
  {
    accessorKey: "timeSlot",
    header: "Time Slot",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <ClockIcon className="h-3.5 w-3.5" />
        <span>{row.original?.slotDuration} mins</span>
      </div>
    ),
  },
  {
    id: "edit",
    cell: ({ }) => (
        <div className="flex items-center gap-2 cursor-pointer">
          <Pencil className="" size={14} />Edit
        </div>
    ),
  },
  {
    id: "status",
    cell: ({ row }) => (
        <Edit/>
    ),
  },
];