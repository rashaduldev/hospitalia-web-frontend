"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "../auth";

export const bookStaffAppointment = async ({
  lang,
  doctorId,
  appointmentDate,
  dayOfWeek,
  fees,
  appointmentTypeId,
  appointmentSlotDto,
  notes,
  patientName,
  patientGender,
  patientAge,
  patientPhone,
  patientEmail,
  patientUserId,
  bookedByUserId,
  bookingSource,
}: {
  lang: string;
  doctorId: number;
  appointmentDate: string;
  dayOfWeek: string;
  fees: number;
  appointmentTypeId: number;
  appointmentSlotDto: {
    locationId: number;
    startTime: string;
    endTime: string;
    slotDuration: number;
  };
  notes?: string;
  patientName: string;
  patientGender: string;
  patientAge?: number | null;
  patientPhone: string;
  patientEmail?: string | null;
  patientUserId?: number | null;
  bookedByUserId: number;
  bookingSource: "DOCTOR" | "SECRETARY";
}) => {
  const token = await getAccessToken();
  return await apiClient<any>({
    endpoint: "/api/appointments/staff/book-appointment",
    method: "POST",
    params: { lang },
    headers: { Authorization: `Bearer ${token}` },
    body: {
      doctorId,
      appointmentDate,
      dayOfWeek,
      fees,
      appointmentTypeId,
      appointmentSlotDto,
      ...(notes ? { notes } : {}),
      patientName,
      patientGender,
      ...(patientAge != null ? { patientAge } : {}),
      patientPhone,
      ...(patientEmail ? { patientEmail } : {}),
      patientUserId: patientUserId ?? null,
      bookedByUserId,
      bookingSource,
    },
  });
};

// Book Appointment
export const bookAppointment = async ({
  doctorId,
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
  doctorId: number;
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
      doctorId,
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
