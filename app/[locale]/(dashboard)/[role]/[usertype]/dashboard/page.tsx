import DataTableWithExportDemo from "@/components/data-table"

import data from "./data.json"

export default function Page() {
  return (
    <div className="mx-6">
      {/* todays appoinment table */}
      <DataTableWithExportDemo />
      
      {/* upcomming appoinment table */}
      <DataTableWithExportDemo />
    </div>
  )
}
