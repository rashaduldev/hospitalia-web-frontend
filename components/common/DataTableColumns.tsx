"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Appointment } from "@/types/appointment.type";
import { format } from "date-fns";
import { Pencil } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { useI18n } from "@/locales/client";
import { AppointmentActionCell } from "../cells/AppointmentActionCell";

const TranslatedHeader = ({ labelKey }: { labelKey: string }) => {
  const t = useI18n();
  return <>{t(`table.${labelKey}` as any, {})}</>;
};
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
    header: () => (
      <Typography size="sm" weight="medium" color="foreground">
        <TranslatedHeader labelKey="column.appointmentDate" />
      </Typography>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("appointmentDate"));
      return (
        <div className="font-medium text-nowrap">
          <Typography as="span" size="sm" color="foreground" weight="medium">
            {format(date, "dd MMM yyyy")}{" "}
          </Typography>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: () => (
      <Typography size="sm" weight="medium" color="foreground">
        <TranslatedHeader labelKey="column.location" />
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Typography as="span" size="xs" color="foreground">
          {row.original?.locationName || "Clinic"}
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: "patientName",
    header: () => (
      <Typography size="sm" weight="medium" color="foreground">
        <TranslatedHeader labelKey="column.patientName" />
      </Typography>
    ),
    cell: ({ row }) => (
      <Typography as="span" size="sm" color="foreground" weight="medium">
        {row.original?.patientName || "Unknown Patient"}
      </Typography>
    ),
  },
  {
    accessorKey: "duration",
    header: () => (
      <Typography size="sm" weight="medium" color="foreground">
        <TranslatedHeader labelKey="column.duration" />
      </Typography>
    ),
    cell: ({ row }) => {
      const formatTime = (time?: string) => {
        if (!time) return "--:--";
        const [h, m] = time.split(":");
        const d = new Date();
        d.setHours(Number(h), Number(m));
        return format(d, "hh:mm a");
      };

      return (
        <Typography as="span" size="sm" color="foreground" weight="medium">
          {formatTime(row.original.startTime)} -{" "}
          {formatTime(row.original.endTime)}
        </Typography>
      );
    },
  },
  {
    accessorKey: "slotDuration",
    header: () => (
      <Typography size="sm" weight="medium" color="foreground">
        <TranslatedHeader labelKey="column.timeslot" />
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Typography as="span" size="sm" color="foreground">
          {row.original?.slotDuration} min
        </Typography>
      </div>
    ),
  },
  {
    id: "edit_inline",
    header: "",
    cell: ({ row }) => (
      <div
        className="flex items-center gap-2 cursor-pointer text-sm font-medium"
        onClick={() => console.log("Edit", row.original.id)}
      >
        <Pencil size={14} />
        <Typography as="span" size="sm" color="foreground" weight="medium">
          Edit
        </Typography>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <AppointmentActionCell appointment={row.original} />,
  },
];
