export interface DashboardSummary {
  totalPatients: number;
  totalDoctors: number;
  totalHospitals: number;
  totalSecretaries: number;
  totalAppointments: number;
  appointmentsToday: number;
  appointmentsThisMonth: number;
  newPatientsThisMonth: number;
  newDoctorsThisMonth: number;
}

export interface AppointmentStatusBreakdown {
  confirmed: number;
  cancelled: number;
  completed: number;
}

export interface BookingSourceBreakdown {
  patient: number;
  doctor: number;
  secretary: number;
}

export interface AppointmentsTrend {
  date: string;
  count: number;
}

export interface TopDoctor {
  doctorId: number;
  doctorName: string;
  appointmentCount: number;
}

export interface RecentAppointment {
  appointmentId: number;
  patientName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStatus: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | string;
  bookingSource: 'PATIENT' | 'DOCTOR' | 'SECRETARY' | null;
}

export interface DashboardData {
  summary: DashboardSummary;
  appointmentStatusBreakdown: AppointmentStatusBreakdown;
  bookingSourceBreakdown: BookingSourceBreakdown;
  appointmentsTrend: AppointmentsTrend[];
  topDoctors: TopDoctor[];
  recentAppointments: RecentAppointment[];
}

export interface DashboardResponse {
  status: string;
  message: string;
  payload: DashboardData;
  success: boolean;
}
