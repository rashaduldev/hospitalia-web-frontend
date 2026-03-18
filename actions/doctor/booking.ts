"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

// Book Appointment
export const bookAppointment = async ({
  doctorUserId,
  patientUserId,
  appointmentDate,
  dayOfWeek,
  fees,
  appointmentTypeId,
  appointmentSlotDto: {
    locationId,
    startTime,
    endTime,
    slotDuration,
    available,
  },
  notes,
}: {
  doctorUserId: number;
  patientUserId: number;
  appointmentDate: string;
  dayOfWeek: string;
  fees: number;
  appointmentTypeId: number;
  appointmentSlotDto: {
    locationId: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
    available: boolean;
  };
  notes: string;
}) => {
  const token = await getAccessToken();

  const res = await apiClient<any>({
    endpoint: `/api/appointments/book-appointment`,
    method: "POST",
    body: {
      doctorUserId,
      patientUserId,
      appointmentDate,
      dayOfWeek,
      fees,
      appointmentTypeId,
      appointmentSlotDto: {
        locationId,
        startTime,
        endTime,
        slotDuration,
        available,
      },
      notes,
    },
    headers: { Authorization: `Bearer ${token}` },
  });

  return res;
};
