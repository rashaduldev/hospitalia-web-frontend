"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Appointment } from "@/types/appointment.type";
import { format, parseISO } from "date-fns";
import { Pencil } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { useI18n } from "@/locales/client";
import { AppointmentActionCell } from "../cells/AppointmentActionCell";

type TableLabelKey =
  | "table.column.appointmentDate"
  | "table.column.location"
  | "table.column.patientName"
  | "table.column.duration"
  | "table.column.timeslot";

const TranslatedHeader = ({ labelKey }: { labelKey: TableLabelKey }) => {
  const t = useI18n();
  return <>{t(labelKey)}</>;
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
        <TranslatedHeader labelKey="table.column.appointmentDate" />
      </Typography>
    ),
    cell: ({ row }) => {
      const raw = row.getValue("appointmentDate") as number[] | string;
      let formatted = "";
      try {
        if (Array.isArray(raw)) {
          const [year, month, day] = raw;
          formatted = format(new Date(year, month - 1, day), "dd MMM yyyy");
        } else {
          formatted = format(parseISO(raw), "dd MMM yyyy");
        }
      } catch {
        formatted = String(raw);
      }
      return (
        <div className="font-medium text-nowrap">
          <Typography as="span" size="sm" color="foreground" weight="medium">
            {formatted}{" "}
          </Typography>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: () => (
      <Typography size="sm" weight="medium" color="foreground">
        <TranslatedHeader labelKey="table.column.location" />
      </Typography>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Typography as="span" size="xs" color="foreground">
          {row.original?.locationName || "N/A"}
        </Typography>
      </div>
    ),
  },
  {
    accessorKey: "patientName",
    header: () => (
      <Typography size="sm" weight="medium" color="foreground">
        <TranslatedHeader labelKey="table.column.patientName" />
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
        <TranslatedHeader labelKey="table.column.duration" />
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
        <TranslatedHeader labelKey="table.column.timeslot" />
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
