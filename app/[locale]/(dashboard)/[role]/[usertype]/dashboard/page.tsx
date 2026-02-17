import { DataTableWithExport } from "@/components/data-table";
import { getCurrentUser } from "@/actions/user.actions";
import { getTodaysAppointments, getUpcomingAppointments } from "@/actions/doctor/appointment";
import { appointmentColumns } from "./columns";
import { getAccessToken } from "@/actions/auth";

export default async function Page() {
  const res = await getCurrentUser();
  
  const doctorId = res?.id;
  const token = getAccessToken();
  
  
  const todayAppoinment = getTodaysAppointments(doctorId);
  const upcomingAppoinment = getUpcomingAppointments(doctorId);
  console.log("todayRes",todayAppoinment);
  console.log("upcomingRes",upcomingAppoinment);

  const [todayRes, upcomingRes] = await Promise.all([
    getTodaysAppointments(doctorId),
    getUpcomingAppointments(doctorId),
  ]);
  
  return (
    <div className="mx-6 space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">Today's Appointments</h2>
        <DataTableWithExport 
          columns={appointmentColumns} 
          data={todayRes?.data || []} 
          filename="todays-appointments"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        <DataTableWithExport 
          columns={appointmentColumns} 
          data={upcomingRes?.data || []} 
          filename="upcoming-appointments"
        />
      </div>
    </div>
  );
}