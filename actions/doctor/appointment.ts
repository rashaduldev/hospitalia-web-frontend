"use server";

import { apiClient } from "@/lib/api";
import { Appointment } from "@/types/appointment.type";
import { Paginated } from "@/types/user.type";
import { getAccessToken } from "../auth";

// Doctor upcoming appointments by doctor user id
export const getUpcomingAppointments = async ({
  doctorUserId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
  lang,
}: {
  doctorUserId: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  ascOrDesc?: string;
  lang: string;
}) => {
  const token = await getAccessToken();
  const res = await apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/upcoming/doctorUserId/${doctorUserId}`,
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

// Doctor today's appointments by doctor user id
export const getTodaysAppointments = async ({
  doctorUserId,
  pageNo = 0,
  pageSize = 20,
  sortBy = "creationDate",
  ascOrDesc = "asc",
  lang,
}: {
  doctorUserId: number;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  ascOrDesc?: string;
  lang: string;
}) => {
  const token = await getAccessToken();
  const res = await apiClient<Paginated<Appointment>>({
    endpoint: `/api/appointments/all/today/doctorUserId/${doctorUserId}`,
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
    endpoint: `/api/appointments/cancel-appointment/appointmentId${appointmentId}`,
    method: "POST",
    params: { lang },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { appointmentId, cancelledByUserId, cancellationReason },
  });

  return res;
};
