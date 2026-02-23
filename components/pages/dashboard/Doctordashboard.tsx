import { DataTableWithExport } from "@/components/data-table";
import { getCurrentUser } from "@/actions/user.actions";
import {
  getTodaysAppointments,
  getUpcomingAppointments,
} from "@/actions/doctor/appointment";
import { DynamicHeading } from "@/components/common/DynamicHeading";
import { getCurrentLocale, getI18n } from "@/locales/server";
import { appointmentColumns } from "@/components/common/DataTableColumns";

export default async function DoctorDashboardPage() {
  const t = await getI18n();
  const lang = await getCurrentLocale();
  const CurrentUser = await getCurrentUser();

  const doctorId = CurrentUser?.id;

  const todayAppoinment = await getTodaysAppointments({
    doctorUserId: doctorId,
    pageNo: 0,
    pageSize: 100,
    sortBy: "creationDate",
    ascOrDesc: "desc",
    lang,
  });
  const upcomingAppoinment = await getUpcomingAppointments({
    doctorUserId: doctorId,
    pageNo: 0,
    pageSize: 100,
    sortBy: "creationDate",
    ascOrDesc: "desc",
    lang,
  });

  return (
    <div className="space-y-10 mt-5">
      <div>
        <DynamicHeading
          title={t("appoinment.today")}
          description={t("appoinment.todaydescription")}
          titleProps={{ size: "2xl", weight: "bold", color: "secondary" }}
          descriptionProps={{ size: "sm" }}
          className="mb-6"
        />
        <DataTableWithExport
          columns={appointmentColumns}
          data={todayAppoinment?.payload?.content || []}
          filename="todays-appointments"
          emptyMessage={t("appoinment.no_today")}
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
          excludeColumns={["patientName"]}
          data={upcomingAppoinment?.payload?.content || []}
          filename="upcoming-appointments"
          emptyMessage={t("appoinment.no_upcoming")}
        />
      </div>
    </div>
  );
}
