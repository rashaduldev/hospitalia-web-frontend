import { DataTableWithExport } from "@/components/data-table";
import { getCurrentUser } from "@/actions/user.actions";
import { getTodaysAppointments, getUpcomingAppointments } from "@/actions/doctor/appointment";
import { appointmentColumns } from "./columns";

export default async function Page() {
  const userRes = await getCurrentUser();
  const doctorId = userRes?.user?.id;

  // Fetch data in parallel
  const [todayRes, upcomingRes] = await Promise.all([
    getTodaysAppointments(doctorId),
    getUpcomingAppointments(doctorId),
  ]);

  console.log("todayRes",todayRes);
  console.log("upcomingRes",upcomingRes);
  
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