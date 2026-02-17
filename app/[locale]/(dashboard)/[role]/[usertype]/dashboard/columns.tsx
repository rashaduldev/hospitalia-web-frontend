"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Appointment } from "@/types/appointment.type";
import { format } from "date-fns";
import { MapPinIcon, ClockIcon } from "lucide-react";

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
    accessorKey: "patient.name",
    header: "Patient Name",
    cell: ({ row }) => {
      const name = row.original.patient?.name || "Unknown Patient";
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">{row.original.patient?.id}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="truncate max-w-[150px]">{row.getValue("location") || "Clinic"}</span>
      </div>
    ),
  },
  {
    accessorKey: "timeSlot",
    header: "Time Slot",
    cell: ({ row }) => {
      // Assuming your API returns 'startTime' and 'endTime' or a 'timeSlot' string
      const start = row.original.startTime; // e.g., "09:00 AM"
      const end = row.original.endTime;     // e.g., "09:30 AM"
      
      return (
        <Badge variant="secondary" className="font-mono font-medium">
          {start} - {end}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <ClockIcon className="h-3.5 w-3.5" />
        <span>{row.original.duration} mins</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Badge className="cursor-pointer hover:bg-primary/90">
          Details
        </Badge>
      </div>
    ),
  },
];