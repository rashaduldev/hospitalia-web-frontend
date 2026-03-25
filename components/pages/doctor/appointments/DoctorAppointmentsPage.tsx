import {
  getTodaysAppointments,
  getUpcomingAppointments,
} from "@/actions/doctor/appointment";
import { getDoctorInfobyUserid } from "@/actions/doctor/doctordata";
import { getI18n } from "@/locales/server";
import { CalendarDays, CalendarClock } from "lucide-react";
import { DoctorAppointmentsTable } from "./DoctorAppointmentsTable";

export default async function DoctorAppointmentsPage({
  doctorUserId,
  lang,
}: {
  doctorUserId: number;
  lang: string;
}) {
  const t = await getI18n();

  const doctorInfoRes = await getDoctorInfobyUserid({ lang, SignleDoctorUserId: doctorUserId });
  const doctorId = doctorInfoRes?.payload?.id ?? doctorInfoRes?.payload?.doctorId;

  const [todayRes, upcomingRes] = await Promise.all([
    getTodaysAppointments({
      doctorId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "creationDate",
      ascOrDesc: "desc",
      lang,
    }),
    getUpcomingAppointments({
      doctorId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "creationDate",
      ascOrDesc: "asc",
      lang,
    }),
  ]);

  const todayAppointments = todayRes?.payload?.content ?? [];
  const upcomingAppointments = upcomingRes?.payload?.content ?? [];

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
        <DoctorAppointmentsTable
          appointments={todayAppointments}
          doctorUserId={doctorUserId}
          emptyMessage={t("appoinment.no_today")}
        />
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
        <DoctorAppointmentsTable
          appointments={upcomingAppointments}
          doctorUserId={doctorUserId}
          emptyMessage={t("appoinment.no_upcoming")}
        />
      </div>
    </div>
  );
}
