export type Appointment = {
  appointmentId: number;
  doctorId?: number;
  doctorUserId?: number;
  patientUserId: number;
  doctorName: string;
  designation: string;
  patientName: string;
  appointmentDate: number[] | string;
  dayOfWeek?: string;
  locationName: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  fees: number;
  notes?: string;
  appointmentStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  cancellationReason?: string | null;
  cancelledAt?: string | number | null;
  cancelledByUserId?: number | null;
};

export type AppointmentUpdateRequest = {
  appointmentId: string;
  appointmentDate?: string;
  slotId?: string;
  status?: string;
};

export type AvailableSlot = {
  locationId: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  available: boolean;
};
