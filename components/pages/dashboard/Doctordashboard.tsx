import { DataTableWithExport } from "@/components/data-table";
import { getCurrentUser } from "@/actions/user.actions";
import {
  getTodaysAppointments,
  getUpcomingAppointments,
} from "@/actions/doctor/appointment";
import { getCurrentLocale, getI18n } from "@/locales/server";
import { appointmentColumns } from "@/components/common/DataTableColumns";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/common/TableSkeleton";
import { CalendarDays, CalendarClock } from "lucide-react";

export default async function DoctorDashboardPage() {
  const t = await getI18n();
  const lang = await getCurrentLocale();
  const CurrentUser = await getCurrentUser({ lang });

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
    <div className="space-y-6 p-4 sm:p-6">
      {/* Today's appointments */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
            <CalendarDays className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">
              {t("appoinment.today")}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {t("appoinment.todaydescription")}
            </p>
          </div>
        </div>
        <div className="p-6">
          <Suspense fallback={<TableSkeleton columnCount={5} />}>
            <DataTableWithExport
              columns={appointmentColumns}
              data={todayAppoinment?.payload?.content || []}
              filename="todays-appointments"
              emptyMessage={t("appoinment.no_today")}
            />
          </Suspense>
        </div>
      </div>

      {/* Upcoming appointments */}
      <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <CalendarClock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground leading-none">
              {t("appoinment.upcoming")}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {t("appoinment.upcomingdescription")}
            </p>
          </div>
        </div>
        <div className="p-6">
          <Suspense fallback={<TableSkeleton columnCount={5} />}>
            <DataTableWithExport
              columns={appointmentColumns}
              excludeColumns={["patientName"]}
              data={upcomingAppoinment?.payload?.content || []}
              filename="upcoming-appointments"
              emptyMessage={t("appoinment.no_upcoming")}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
