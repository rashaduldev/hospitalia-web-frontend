"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Appointment } from "@/types/appointment.type";
import { format } from "date-fns";
import { 
  MapPinIcon, 
  ClockIcon, 
  Pencil, 
  MoreHorizontal, 
  Eye, 
  Trash, 
  CheckCircle2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
      return <div className="font-medium text-nowrap">{format(date, "dd MMM yyyy")}</div>;
    },
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
    cell: ({ row }) => (
      <span className="font-semibold text-foreground">
        {row.original?.patientName || "Unknown Patient"}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="truncate max-w-37.5">
          {row.original?.locationName || "Clinic"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Time",
    cell: ({ row }) => (
      <span className="font-medium text-nowrap">
        {row.original.startTime} - {row.original.endTime}
      </span>
    ),
  },
  {
    accessorKey: "slotDuration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <ClockIcon className="h-3.5 w-3.5" />
        <span>{row.original?.slotDuration} mins</span>
      </div>
    ),
  },
  {
    id: "edit_inline",
    header: "",
    cell: ({ row }) => (
      <div 
        className="flex items-center gap-2 cursor-pointer text-primary hover:underline text-sm font-medium"
        onClick={() => console.log("Edit", row.original.id)}
      >
        <Pencil size={14} />
        Edit
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log("View", appointment.id)}>
              <Eye className="mr-2 h-4 w-4" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Status", appointment.id)}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Completed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => console.log("Delete", appointment.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" /> Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];