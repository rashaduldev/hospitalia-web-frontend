export type Appointment = {
  fees: string;
  designation: string;
  doctorName: string;
  id: string;
  appointmentId: number;
  doctorUserId: string;
  patientUserId: number;
  patientName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  locationName: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  doctorLocationId?: string;
  notes?: string;
  createdAt: string;
};

export type AppointmentBookingRequest = {
  doctorUserId: string;
  doctorLocationId: string;
  appointmentDate: string;
  slotId: string;
  patientNotes?: string;
};

export type AppointmentUpdateRequest = {
  appointmentId: string;
  appointmentDate?: string;
  slotId?: string;
  status?: string;
};

export type AvailableSlot = {
  slotId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};
