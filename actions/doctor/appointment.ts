"use server";

import { apiClient } from "@/lib/api";
import { Appointment } from "@/types/appointment.type";
import { Paginated } from "@/types/user.type";
import { getAccessToken } from "../auth";
import { revalidatePath } from "next/cache";

// Doctor upcoming appointments by doctorId
export const getUpcomingAppointments = async ({
  doctorId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
  lang,
}: {
  doctorId: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  ascOrDesc?: string;
  lang: string;
}) => {
  const token = await getAccessToken();
  const res = await apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/upcoming/doctorId/${doctorId}`,
    method: "GET",
    params: {
      pageNo,
      pageSize,
      sortBy,
      ascOrDesc,
      lang,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

// Doctor today's appointments by doctorId
export const getTodaysAppointments = async ({
  doctorId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
  lang,
}: {
  doctorId: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  ascOrDesc?: string;
  lang: string;
}) => {
  const token = await getAccessToken();
  const res = await apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/today/doctorId/${doctorId}`,
    method: "GET",
    params: {
      pageNo,
      pageSize,
      sortBy,
      ascOrDesc,
      ...(lang && { lang }),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

// Get appointments for a specific date by doctorId
export const getAppointmentsByDate = async ({
  doctorId,
  date,
  lang,
}: {
  doctorId: number;
  date: string;
  lang: string;
}) => {
  const token = await getAccessToken();
  const res = await apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/upcoming/doctorId/${doctorId}`,
    method: "GET",
    params: { pageNo: 0, pageSize: 100, sortBy: "appointmentDate", ascOrDesc: "asc", lang },
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res?.payload?.content) return [];

  return res.payload.content.filter((apt) => {
    const d = apt.appointmentDate;
    if (Array.isArray(d)) {
      const formatted = `${d[0]}-${String(d[1]).padStart(2, "0")}-${String(d[2]).padStart(2, "0")}`;
      return formatted === date;
    }
    return typeof d === "string" && d.startsWith(date);
  });
};

// Cancel appointment
export const cancelAppointment = async ({
  appointmentId,
  cancelledByUserId,
  cancellationReason,
  lang,
}: {
  appointmentId: number;
  cancelledByUserId: number;
  cancellationReason: string;
  lang: string;
}) => {
  const token = await getAccessToken();

  const res = await apiClient({
    endpoint: `/api/appointments/cancel-appointment/${appointmentId}`,
    method: "POST",
    params: { lang },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { appointmentId, cancelledByUserId, cancellationReason },
  });
  if (res?.success) {
    revalidatePath("/dashboard");
  }

  return res;
};
