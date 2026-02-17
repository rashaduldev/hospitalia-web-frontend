import { DataTable } from "@/components/data-table"

import data from "./data.json"

export default function Page() {
  return (
    <div>
      <DataTable data={data} />
      <DataTable data={data} />
    </div>
  )
}
