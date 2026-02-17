import { DataTableWithExport } from "@/components/data-table";
import { getCurrentUser } from "@/actions/user.actions";
import { getTodaysAppointments, getUpcomingAppointments } from "@/actions/doctor/appointment";
import { appointmentColumns } from "./columns";

export default async function DoctorDashboardPage() {
  const res = await getCurrentUser();
  
  const doctorId = res?.id;    
  
  const todayAppoinment =await getTodaysAppointments(doctorId);
  const upcomingAppoinment = await getUpcomingAppointments(doctorId);
  
  return (
    <div className="mx-6 space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">Today's Appointments</h2>
        <DataTableWithExport 
          columns={appointmentColumns} 
          data={todayAppoinment?.payload?.content || []} 
          filename="todays-appointments"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        <DataTableWithExport 
          columns={appointmentColumns} 
          data={upcomingAppoinment?.payload?.content || []} 
          filename="upcoming-appointments"
        />
      </div>
    </div>
  );
}