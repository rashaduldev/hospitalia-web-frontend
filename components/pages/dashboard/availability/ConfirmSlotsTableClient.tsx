"use client";

import { DataTableWithExport } from "@/components/data-table";
import { getConfirmSlotsColumns } from "@/components/common/ConfirmSlotsColumns";
import { useMemo } from "react";

type Props = {
  slots: string[];
  locations: string[];
};

export default function ConfirmSlotsTableClient({ slots, locations }: Props) {
  const columns = useMemo(() => getConfirmSlotsColumns(locations), [locations]);

  return <DataTableWithExport columns={columns} data={slots} />;
}
