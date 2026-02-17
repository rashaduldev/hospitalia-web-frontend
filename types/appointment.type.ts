export interface Appointment {
  id: string;
  doctorUserId: string;
  patientName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  doctorLocationId?: string;
  notes?: string;
  createdAt: string;
}

export interface AppointmentBookingRequest {
  doctorUserId: string;
  doctorLocationId: string;
  appointmentDate: string;
  slotId: string;
  patientNotes?: string;
}

export interface AppointmentUpdateRequest {
  appointmentId: string;
  appointmentDate?: string;
  slotId?: string;
  status?: string;
}

export interface AvailableSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}