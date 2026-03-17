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
    params: { lang, page, size },
  });
};

export const cancelPatientAppointment = async ({
  appointmentId,
  lang,
}: {
  appointmentId: string;
  lang: string;
}) => {
  const token = await getAccessToken();
  return await apiClient({
    endpoint: `/api/appointments/cancel/${appointmentId}`,
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    params: { lang },
  });
};
