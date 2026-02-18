import { DataTableWithExport } from "@/components/data-table";
import { getCurrentUser } from "@/actions/user.actions";
import {
  getTodaysAppointments,
  getUpcomingAppointments,
} from "@/actions/doctor/appointment";
import { appointmentColumns } from "./columns";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { getI18n } from "@/locales/server";

export default async function DoctorDashboardPage() {
  const t = await getI18n()
  const res = await getCurrentUser();

  const doctorId = res?.id;

  const todayAppoinment = await getTodaysAppointments(doctorId);
  const upcomingAppoinment = await getUpcomingAppointments(doctorId);

  return (
    <div className="mx-6 space-y-10">
      <div>
        <DynamicHeading
          title={t("appoinment.today")}
          description={t("appoinment.todaydescription")}
          titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
          descriptionProps={{size:"sm"}}
          className="mb-6"
        />
        <DataTableWithExport
          columns={appointmentColumns}
          data={todayAppoinment?.payload?.content || []}
          filename="todays-appointments"
          emptyMessage="There are no today's appointments."
        />
      </div>

      <div>
        <DynamicHeading
          title={t("appoinment.upcoming")}
          description={t("appoinment.upcomingdescription")}
          titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
          className="mb-6"
        />
        <DataTableWithExport
          columns={appointmentColumns}
          data={upcomingAppoinment?.payload?.content || []}
          filename="upcoming-appointments"
          emptyMessage="There are no upcoming appointments."
        />
      </div>
    </div>
  );
}