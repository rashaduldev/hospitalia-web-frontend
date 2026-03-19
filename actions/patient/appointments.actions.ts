"use server";

import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth";

export const getPatientUpcomingAppointments = async ({
  lang,
  patientUserId,
  page = 0,
  size = 10,
}: {
  lang: string;
  patientUserId: number;
  page?: number;
  size?: number;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/appointments/all/upcoming/patientUserId/${patientUserId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang, pageNo: page, pageSize: size, sortBy: "appointmentDate", ascOrDesc: "asc" },
  });
};

export const getPatientPastAppointments = async ({
  lang,
  patientUserId,
  page = 0,
  size = 10,
}: {
  lang: string;
  patientUserId: number;
  page?: number;
  size?: number;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/appointments/all/past/patientUserId/${patientUserId}`,
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang, pageNo: page, pageSize: size, sortBy: "appointmentDate", ascOrDesc: "asc" },
  });
};

export const cancelPatientAppointment = async ({
  appointmentId,
  cancelledByUserId,
  cancellationReason,
  lang,
}: {
  appointmentId: string;
  cancelledByUserId: number;
  cancellationReason: string;
  lang: string;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/appointments/cancel-appointment/${appointmentId}`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    params: { lang },
    body: {
      appointmentId: Number(appointmentId),
      cancelledByUserId,
      cancellationReason,
    },
  });
};
